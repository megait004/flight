import React from 'react';

const Partners: React.FC = () => {
  const airlines = [
    { name: 'Thai Lion Air', logo: '/airlines/thai-lion.png' },
    { name: 'Singapore Airlines', logo: '/airlines/singapore-airlines.png' },
    { name: 'Thai Airways', logo: '/airlines/thai-airways.png' },
    { name: 'Etihad Airways', logo: '/airlines/etihad.png' },
    { name: 'Vietnam Airlines', logo: '/airlines/vietnam-airlines.png' },
    { name: 'Pacific Airlines', logo: '/airlines/pacific-airlines.png' },
    { name: 'VietJet Air', logo: '/airlines/vietjet.png' },
    { name: 'Bamboo Airways', logo: '/airlines/bamboo.png' },
    { name: 'Vietravel Airlines', logo: '/airlines/vietravel.png' },
    { name: 'Cathay Pacific', logo: '/airlines/cathay-pacific.png' }
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#003C71]">
          Đối tác và thương hiệu chiến lược
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Những đối tác hàng không toàn cầu sẽ chắp cánh đưa bạn đến mọi địa điểm trên thế giới.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-12">
          {airlines.map((airline, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={airline.logo}
                alt={airline.name}
                className="h-12 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;