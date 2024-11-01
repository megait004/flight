import React from 'react';

const PaymentMethods: React.FC = () => {
  const banks = [
    { name: 'VPBank', logo: '/banks/vpbank.png' },
    { name: 'Techcombank', logo: '/banks/techcombank.png' },
    { name: 'DongA Bank', logo: '/banks/donga.png' },
    { name: 'ACB', logo: '/banks/acb.png' },
    { name: 'Maritime Bank', logo: '/banks/msb.png' },
    { name: 'HDBank', logo: '/banks/hdbank.png' },
    { name: 'Vietinbank', logo: '/banks/vietinbank.png' },
    { name: 'Vietcombank', logo: '/banks/vietcombank.png' },
    { name: 'Sacombank', logo: '/banks/sacombank.png' },
    { name: 'BIDV', logo: '/banks/bidv.png' }
  ];

  return (
    <div className="bg-gray-100 p-6">
      <h2 className="text-xl font-bold mb-6">Các hình thức thanh toán</h2>
      <div className="space-y-4">
        {/* Thanh toán tại văn phòng */}
        <div className="bg-white p-4 rounded-lg flex items-start gap-4">
          <div className="mt-1">
            <img src="/icons/money.png" alt="Office" className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">THANH TOÁN BẰNG TIỀN MẶT TẠI VĂN PHÒNG CHÚNG TÔI</h3>
            <p className="text-gray-600 mt-1">
              Sau khi đặt hàng thành công, Quý khách vui lòng qua văn phòng <span className="text-blue-600">sanvegiare24h.com</span> để thanh toán và nhận vé.
            </p>
          </div>
        </div>

        {/* Thanh toán tại nhà */}
        <div className="bg-white p-4 rounded-lg flex items-start gap-4">
          <div className="mt-1">
            <img src="/icons/home.png" alt="Home" className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">THANH TOÁN TẠI NHÀ</h3>
            <p className="text-gray-600 mt-1">
              Nhân viên <span className="text-blue-600">sanvegiare24h.com</span> sẽ giao vé & thu tiền tại nhà theo địa chỉ Quý khách cung cấp.
            </p>
          </div>
        </div>

        {/* Thanh toán chuyển khoản */}
        <div className="bg-white p-4 rounded-lg flex items-start gap-4">
          <div className="mt-1">
            <img src="/icons/bank.png" alt="Bank" className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">THANH TOÁN QUA CHUYỂN KHOẢN</h3>
            <p className="text-gray-600 mt-1">
              Quý khách có thể thanh toán cho chúng tôi bằng cách chuyển khoản tại ngân hàng, chuyển qua thẻ ATM, hoặc qua Internet banking.
            </p>
          </div>
        </div>

        {/* Bank logos */}
        <div className="bg-white p-4 rounded-lg">
          <div className="grid grid-cols-5 gap-4">
            {banks.map((bank, index) => (
              <img
                key={index}
                src={bank.logo}
                alt={bank.name}
                className="h-8 object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
