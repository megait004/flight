# MayBay

-   NodeJS: v18.x hoặc v20.x
-   Python: v3.9 - v3.10.11

## 1. FE

### 1.1. Dev

Sửa URL API ở đây

-   `.env.development`
-   `.env.production`

```bash
pnpm install
pnpm dev
```

### 1.2. Build

```bash
pnpm build
```

## 2. BE

### 2.1. Dev

có 2 phần này cần ném vào vps

```
backend/
├── templates/
└── main.py
```

```bash
python -m venv venv
venv\Scripts\activate.bat
# linux: source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### 2.2. deploy

Tạo file `app.py`:

```python
from waitress import serve
from main import app

serve(app, host='127.0.0.1', port=8080)
```

```bash
python app.py
```

#### 2.2.3. Reverse Proxy

##### Nginx

```nginx
server {
    listen 80;
    server_name url_api;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

##### Apache

```apache
<VirtualHost *:80>
    ServerName url_api
    ProxyPass / http://127.0.0.1:8080/
    ProxyPassReverse / http://127.0.0.1:8080/
    <Proxy *>
        Require all granted
    </Proxy>
    ProxyPreserveHost On
    ProxyRequests Off
</VirtualHost>
```
