import React, { useState } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  content: string;
}

const WhyChooseUs: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Nguyễn Linh Đan',
      location: 'Ho Chi Minh',
      content: 'Tuyệt vời. Đội ngũ chăm sóc khách hàng của Săn Vé Giá Rẻ 24h phục vụ tận tình chu đáo, dẫn dò khách hàng cẩn thận. Tôi tin tưởng tuyệt đối vào Săn Vé Giá Rẻ 24h.'
    },
    {
      id: 2,
      name: 'Phạm Hoàng Ái Lệ',
      location: 'Hà Nội',
      content: 'Tôi thích trang web này cung cấp nhiều thông tin bổ ích trong việc lựa chọn đường bay.'
    },
    {
      id: 3,
      name: 'Phạm Thủy Quỳnh',
      location: 'Nghệ An',
      content: 'Mình đã đặt vé trên Săn Vé Giá Rẻ 24h đi nước ngoài,rất hài lòng với cách làm việc của các bạn đó là chắc chắn.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <span className="inline-block bg-[#FF6805] text-white px-4 py-1 rounded-full text-sm mb-4">
            Tại sao chọn chúng tôi?
          </span>
          <h2 className="text-2xl font-bold text-center mb-4 text-[#003C71]">
            Khách hàng nói về chúng tôi
          </h2>
        </div>

        <div className="relative mt-8">
          <div className="overflow-hidden">
            <div className="relative w-full h-[200px]">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`absolute w-full transition-all duration-500 ease-in-out ${
                    index === currentIndex
                      ? 'opacity-100 translate-x-0'
                      : index < currentIndex
                        ? 'opacity-0 -translate-x-full'
                        : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="text-center max-w-3xl mx-auto">
                    <p className="text-gray-600 mb-6 text-lg">
                      {testimonial.content}
                    </p>
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <IoChevronBack className="text-gray-600 text-xl" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <IoChevronForward className="text-gray-600 text-xl" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-[#FF6805]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;