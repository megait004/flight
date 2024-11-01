import React from 'react';
import { IoArrowForward } from 'react-icons/io5';

interface Flight {
  id: number;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  date: string;
  price: number;
  currency: string;
  lastViewed: string;
}

const PopularFlights: React.FC = () => {
  const flights: Flight[] = [
    {
      id: 1,
      from: 'Quy Nhơn',
      fromCode: 'UIH',
      to: 'TP Hồ Chí Minh',
      toCode: 'SGN',
      date: '15/11/2024',
      price: 593640,
      currency: 'VND',
      lastViewed: '5 giờ 8 phút 48 giây trước'
    },
    {
      id: 2,
      from: 'TP Hồ Chí Minh',
      fromCode: 'SGN',
      to: 'Quy Nhơn',
      toCode: 'UIH',
      date: '17/11/2024',
      price: 593640,
      currency: 'VND',
      lastViewed: '7 giờ 55 phút trước'
    },
    {
      id: 3,
      from: 'TP Hồ Chí Minh',
      fromCode: 'SGN',
      to: 'Nha Trang',
      toCode: 'CXR',
      date: '17/11/2024',
      price: 594200,
      currency: 'VND',
      lastViewed: '14 giờ 26 phút 24 giây trước'
    },
    {
      id: 4,
      from: 'TP Hồ Chí Minh',
      fromCode: 'SGN',
      to: 'Nha Trang',
      toCode: 'CXR',
      date: '13/11/2024',
      price: 594200,
      currency: 'VND',
      lastViewed: '3 giờ 10 phút 20 giây trước'
    }
  ];

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Chuyến bay phổ biến</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {flights.map((flight) => (
          <div key={flight.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-gray-500 text-sm mb-3">
              Đã xem: {flight.lastViewed}
            </div>

            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold">{flight.from}</div>
                <div className="text-gray-500">({flight.fromCode})</div>
              </div>

              <IoArrowForward className="text-blue-500" />

              <div>
                <div className="font-semibold">{flight.to}</div>
                <div className="text-gray-500">({flight.toCode})</div>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              Ngày đi: {flight.date}
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-500">chỉ từ ({flight.currency})</div>
                <div className="text-red-500 font-bold">{formatPrice(flight.price)}*</div>
              </div>
              <div className="text-gray-500">Một chiều</div>
              <button className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                <IoArrowForward />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-4 text-center">
        *Giá vé hiển thị được thu thập trong vòng 48 giờ và có thể không còn hiệu lực tại thời điểm đặt chỗ. Chúng tôi có thể thu thêm phí và lệ phí cho một số sản phẩm và dịch vụ.
      </div>
    </div>
  );
};

export default PopularFlights;
