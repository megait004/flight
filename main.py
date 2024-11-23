import os
import sqlite3
from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import Flask, json, jsonify, redirect, request, render_template, send_from_directory
from flask_cors import CORS
from flask_mail import Mail, Message

app = Flask(__name__,static_folder="dist",template_folder="dist")
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:4173",
            "http://127.0.0.1:5173",
            "https://giapzech.tech",
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "expose_headers": ["Content-Type", "Authorization"],
        "max_age": 600
    }
})

SECRET_KEY = "ovftank"

mail = Mail(app)


def configure_smtp():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM smtp_config LIMIT 1')
    smtp_config = dict(c.fetchone())
    conn.close()

    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = smtp_config['email']
    app.config['MAIL_PASSWORD'] = smtp_config['password']
    global mail
    mail = Mail(app)


def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS config (
            id INTEGER PRIMARY KEY,
            min_price INTEGER NOT NULL,
            max_price INTEGER NOT NULL,
            loading_time INTEGER NOT NULL
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS bank_info (
            id INTEGER PRIMARY KEY,
            bin TEXT NOT NULL,
            account_number TEXT NOT NULL,
            account_name TEXT NOT NULL
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS smtp_config (
            id INTEGER PRIMARY KEY,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS admin_credentials (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS history_booking (
            id INTEGER PRIMARY KEY,
            ip TEXT NOT NULL,
            flightId TEXT NOT NULL,
            amount INTEGER NOT NULL,
            passengers TEXT NOT NULL,
            contactInfo TEXT NOT NULL,
            airline TEXT NOT NULL,
            departureTime TEXT NOT NULL,
            arrivalTime TEXT NOT NULL,
            "from" TEXT NOT NULL,
            "to" TEXT NOT NULL,
            date TEXT NOT NULL,
            flightType TEXT NOT NULL,
            created_at TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending'
        )
    ''')

    c.execute('SELECT COUNT(*) FROM config')
    if c.fetchone()[0] == 0:
        c.execute('INSERT INTO config (min_price, max_price, loading_time) VALUES (?, ?, ?)',
                  (0, 10000, 2000))

    c.execute('SELECT COUNT(*) FROM bank_info')
    if c.fetchone()[0] == 0:
        c.execute('INSERT INTO bank_info (bin, account_number, account_name) VALUES (?, ?, ?)',
                  ('', '', ''))

    c.execute('SELECT COUNT(*) FROM smtp_config')
    if c.fetchone()[0] == 0:
        c.execute('INSERT INTO smtp_config (email, password) VALUES (?, ?)',
                  ('', ''))

    c.execute('SELECT COUNT(*) FROM admin_credentials')
    if c.fetchone()[0] == 0:
        c.execute('INSERT INTO admin_credentials (username, password) VALUES (?, ?)',
                  ('admin', 'admin123'))

    conn.commit()
    conn.close()


init_db()


def get_db():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token thiếu'}), 401

        try:
            token = token.split()[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            exp_datetime = datetime.fromtimestamp(data['exp'], tz=timezone.utc)
            if exp_datetime < datetime.now(timezone.utc):
                return jsonify({'message': 'Token đã hết hạn'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token không hợp lệ'}), 401

        return f(*args, **kwargs)
    return decorated


@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    required_fields = [
        'ip', 'flightId', 'amount', 'passengers', 'contactInfo',
        'airline', 'departureTime', 'arrivalTime', 'from', 'to',
        'date', 'flightType',
    ]
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Thiếu thông tin'}), 400

    if data['flightType'] not in ['one-way', 'round-trip']:
        return jsonify({'error': 'Loại chuyến bay không hợp lệ'}), 400

    if data['flightType'] == 'round-trip' and 'returnDate' not in data:
        return jsonify({'error': 'Thiếu ngày về cho chuyến bay khứ hồi'}), 400

    passenger_counts = {
        'adult': 0,
        'child': 0,
        'infant': 0
    }

    for passenger in data['passengers']:
        if 'type' not in passenger or 'name' not in passenger:
            return jsonify({'error': 'Thiếu thông tin hành khách'}), 400

        if passenger['type'] not in passenger_counts:
            return jsonify({'error': 'Loại hành khách không hợp lệ'}), 400
        passenger_counts[passenger['type']] += 1

    if passenger_counts['adult'] == 0:
        return jsonify({'error': 'Phải có ít nhất một người lớn'}), 400

    if passenger_counts['infant'] > passenger_counts['adult']:
        return jsonify({'error': 'Số trẻ sơ sinh không được nhiều hơn số người lớn'}), 400

    contact_fields = ['email']
    if not all(field in data['contactInfo'] for field in contact_fields):
        return jsonify({'error': 'Thông tin liên hệ không hợp lệ'}), 400

    email = data['contactInfo']['email']
    if '@' not in email or '.' not in email:
        return jsonify({'error': 'Email không hợp lệ'}), 400

    booking_reference = data['flightId'] + '-' + \
        datetime.now().strftime('%Y%m%d%H%M%S')

    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT email FROM smtp_config LIMIT 1')
    smtp_email = c.fetchone()['email']

    vietnam_tz = timezone(timedelta(hours=7))
    created_at = datetime.now(vietnam_tz).strftime('%Y-%m-%d %H:%M:%S')

    formatted_amount = "{:,.0f}".format(data['amount']).replace(",", ".")
    c.execute('''
        INSERT INTO history_booking (ip, flightId, amount, passengers, contactInfo, airline, departureTime, arrivalTime, "from", "to", date, flightType, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (data['ip'], data['flightId'], data['amount'], json.dumps(data['passengers']), json.dumps(data['contactInfo']), data['airline'], data['departureTime'], data['arrivalTime'], data['from'], data['to'], data['date'], data['flightType'], 'pending', created_at))

    conn.commit()
    conn.close()
    msg = Message(
        'Xác nhận đặt vé',
        sender="Săn Vé Giá Rẻ <" + smtp_email + ">",
        recipients=[data['contactInfo']['email']]
    )
    msg.html = render_template('email.html',
                               booking_reference=booking_reference,
                               airline=data['airline'],
                               flight_type=data['flightType'],
                               from_location=data['from'],
                               to_location=data['to'],
                               date=data['date'],
                               departure_time=data['departureTime'],
                               arrival_time=data['arrivalTime'],
                               return_date=data.get('returnDate'),
                               passengers=data['passengers'],
                               amount=formatted_amount,
                               qr_code_url=data['qrCodeUrl']
                               )
    configure_smtp()
    try:
        mail.send(msg)
    except Exception as e:
        print(e)
    return jsonify({
        'message': 'Đặt chỗ thành công'
    }), 201


@app.route('/api/history-booking', methods=['GET'])
def get_history_booking():
    id_number = request.args.get('idNumber')

    if not id_number:
        return jsonify({'error': 'Thiếu số căn cước công dân'}), 400

    try:
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT * FROM history_booking WHERE contactInfo LIKE ?',
                  ('%' + id_number + '%',))
        history_booking = c.fetchall()

        bookings = []
        for booking in history_booking:
            booking_dict = dict(booking)
            if 'passengers' in booking_dict:
                booking_dict['passengers'] = json.loads(
                    booking_dict['passengers'])
            if 'contactInfo' in booking_dict:
                booking_dict['contactInfo'] = json.loads(
                    booking_dict['contactInfo'])
            bookings.append(booking_dict)

        conn.close()
        return jsonify({
            'message': 'Lấy lịch sử thành công',
            'data': bookings
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()

    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Thiếu thông tin'}), 400

    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM admin_credentials WHERE username = ? AND password = ?',
              (data['username'], data['password']))
    admin = c.fetchone()
    conn.close()

    if admin:
        exp_time = datetime.now(timezone.utc) + timedelta(hours=24)
        token = jwt.encode({
            'username': data['username'],
            'exp': int(exp_time.timestamp())
        }, SECRET_KEY)
        return jsonify({'message': 'Đăng nhập thành công', 'token': token})

    return jsonify({'error': 'Sai tên đăng nhập hoặc mật khẩu'}), 401


@app.route('/api/admin/check-auth', methods=['GET'])
@token_required
def check_auth():
    return jsonify({'message': 'Đã đăng nhập', 'token': True})


@app.route('/api/config', methods=['GET'])
def get_config():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM config LIMIT 1')
    config = dict(c.fetchone())
    conn.close()
    return jsonify({
        'minPrice': config['min_price'],
        'maxPrice': config['max_price'],
        'loadingTime': config['loading_time']
    })


@app.route('/api/admin/config', methods=['PUT'])
@token_required
def update_config():
    data = request.get_json()

    required_fields = ['minPrice', 'maxPrice', 'loadingTime']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Thiếu thông tin'}), 400

    conn = get_db()
    c = conn.cursor()
    c.execute('''
        UPDATE config
        SET min_price = ?, max_price = ?, loading_time = ?
        WHERE id = 1
    ''', (data['minPrice'], data['maxPrice'], data['loadingTime']))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Cập nhật cấu hình thành công', 'data': data})


@app.route('/api/bank-info', methods=['GET'])
def get_bank_info():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM bank_info LIMIT 1')
    bank_info = dict(c.fetchone())
    conn.close()
    return jsonify({
        'bin': bank_info['bin'],
        'accountNumber': bank_info['account_number'],
        'accountName': bank_info['account_name']
    })


@app.route('/api/admin/bank-info', methods=['PUT'])
@token_required
def update_bank_info():
    data = request.get_json()

    required_fields = ['bin', 'accountNumber', 'accountName']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Thiếu thông tin'}), 400

    conn = get_db()
    c = conn.cursor()
    c.execute('''
        UPDATE bank_info
        SET bin = ?, account_number = ?, account_name = ?
        WHERE id = 1
    ''', (data['bin'], data['accountNumber'], data['accountName']))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Cập nhật thông tin ngân hàng thành công', 'data': data})


@app.route('/api/admin/smtp-config', methods=['GET'])
@token_required
def get_smtp_config():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM smtp_config LIMIT 1')
    smtp_config = dict(c.fetchone())
    conn.close()
    return jsonify({
        'email': smtp_config['email'],
        'password': smtp_config['password']
    })


@app.route('/api/admin/smtp-config', methods=['PUT'])
@token_required
def update_smtp_config():
    data = request.get_json()

    required_fields = ['email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Thiếu thông tin'}), 400

    conn = get_db()
    c = conn.cursor()
    c.execute('''
        UPDATE smtp_config
        SET email = ?, password = ?
        WHERE id = 1
    ''', (data['email'], data['password']))
    conn.commit()
    conn.close()
    configure_smtp()

    return jsonify({'message': 'Cập nhật cấu hình SMTP thành công', 'data': data})


@app.route('/api/admin/change-credentials', methods=['PUT'])
@token_required
def change_credentials():
    data = request.get_json()

    if not data or 'currentPassword' not in data or 'newPassword' not in data or 'newUsername' not in data:
        return jsonify({'error': 'Thiếu thông tin'}), 400

    conn = get_db()
    c = conn.cursor()
    token = request.headers.get('Authorization').split()[1]
    user_data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    current_username = user_data['username']
    c.execute('SELECT * FROM admin_credentials WHERE username = ? AND password = ?',
              (current_username, data['currentPassword']))
    admin = c.fetchone()

    if not admin:
        conn.close()
        return jsonify({'error': 'Mật khẩu hiện tại không đúng'}), 401
    if data['newUsername'] != current_username:
        c.execute('SELECT * FROM admin_credentials WHERE username = ? AND username != ?',
                  (data['newUsername'], current_username))
        existing_user = c.fetchone()
        if existing_user:
            conn.close()
            return jsonify({'error': 'Tên đăng nhập đã tồn tại'}), 400
    c.execute('''
        UPDATE admin_credentials
        SET username = ?, password = ?
        WHERE username = ?
    ''', (data['newUsername'], data['newPassword'], current_username))

    conn.commit()
    conn.close()
    exp_time = datetime.now(timezone.utc) + timedelta(hours=24)
    new_token = jwt.encode({
        'username': data['newUsername'],
        'exp': int(exp_time.timestamp())
    }, SECRET_KEY)

    return jsonify({
        'message': 'Cập nhật thông tin đăng nhập thành công',
        'token': new_token
    })


@app.route('/api/admin/history-booking', methods=['GET'])
@token_required
def get_admin_history_booking():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM history_booking')
    history_booking = c.fetchall()
    conn.close()
    bookings = []
    for booking in history_booking:
        booking_dict = dict(booking)
        if 'passengers' in booking_dict:
            booking_dict['passengers'] = json.loads(booking_dict['passengers'])
        if 'contactInfo' in booking_dict:
            booking_dict['contactInfo'] = json.loads(
                booking_dict['contactInfo'])
        bookings.append(booking_dict)

    return jsonify({
        'message': 'Lấy lịch sử thành công',
        'data': bookings
    })
@app.route( "/admin/login")
def admin():
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    print(host)
    if host != "admin.giapzech.tech":
        return redirect("/") ,302
    return render_template("index.html")


@app.route("/")
def index():
    return render_template("index.html")


def serve_static_or_index(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return render_template("index.html")
@app.route("/<path:path>")
def catch_all(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return serve_static_or_index(path)
@app.route('/api/admin/history-booking/<int:booking_id>', methods=['DELETE'])
@token_required
def delete_booking(booking_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('DELETE FROM history_booking WHERE id = ?', (booking_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Xóa thành công'})


def get_smtp_email():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT email FROM smtp_config LIMIT 1')
    smtp_config = c.fetchone()
    conn.close()
    return smtp_config['email']


@app.route('/api/admin/history-booking/<int:booking_id>', methods=['PUT'])
@token_required
def update_booking_status(booking_id):
    data = request.get_json()
    if 'status' not in data:
        return jsonify({'error': 'Thiếu trạng thái'}), 400

    conn = get_db()
    c = conn.cursor()
    c.execute('UPDATE history_booking SET status = ? WHERE id = ?',
              (data['status'], booking_id))

    if data['status'] == 'success':
        c.execute('SELECT * FROM history_booking WHERE id = ?', (booking_id,))
        booking_dict = dict(c.fetchone())
        contact_info = json.loads(booking_dict['contactInfo'])

        smtp_email = get_smtp_email()
        search_url = f"{request.origin}/tra-cuu-lich-su-dat-ve?tim_kiem={contact_info['idNumber']}"

        msg = Message(
            'Đặt vé thành công',
            sender=f"Săn Vé Giá Rẻ <{smtp_email}>",
            recipients=[contact_info['email']]
        )
        msg.html = render_template('success.html',
                                   booking_reference=booking_dict['flightId'],
                                   search_url=search_url)
        configure_smtp()
        try:
            mail.send(msg)
        except Exception as e:
            print(f"Error sending email: {e}")

    conn.commit()
    conn.close()
    return jsonify({'message': 'Cập nhật trạng thái thành công'})


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    return response
if __name__ == '__main__':
    app.run(debug=True)
