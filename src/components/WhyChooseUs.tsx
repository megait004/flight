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
			content:
				'Tuyệt vời. Đội ngũ chăm sóc khách hàng của Săn Vé Giá Rẻ 24h phục vụ tận tình chu đáo, dẫn dò khách hàng cẩn thận. Tôi tin tưởng tuyệt đối vào Săn Vé Giá Rẻ 24h.',
		},
		{
			id: 2,
			name: 'Phạm Hoàng Ái Lệ',
			location: 'Hà Nội',
			content:
				'Tôi thích trang web này cung cấp nhiều thông tin bổ ích trong việc lựa chọn đường bay.',
		},
		{
			id: 3,
			name: 'Phạm Thủy Quỳnh',
			location: 'Nghệ An',
			content:
				'Mình đã đặt vé trên Săn Vé Giá Rẻ 24h đi nước ngoài,rất hài lòng với cách làm việc của các bạn đó là chắc chắn.',
		},
	];

	const [currentIndex, setCurrentIndex] = useState(0);

	const handlePrevious = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1,
		);
	};

	const handleNext = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1,
		);
	};

	return (
		<div className='bg-white py-12'>
			<div className='mx-auto max-w-7xl px-4'>
				<div className='text-center'>
					<span className='mb-4 inline-block rounded-full bg-[#FF6805] px-4 py-1 text-sm text-white'>
						Tại sao chọn chúng tôi?
					</span>
					<h2 className='mb-4 text-center text-2xl font-bold text-[#003C71]'>
						Khách hàng nói về chúng tôi
					</h2>
				</div>

				<div className='relative mt-8'>
					<div className='overflow-hidden'>
						<div className='relative h-[200px] w-full'>
							{testimonials.map((testimonial, index) => (
								<div
									key={testimonial.id}
									className={`absolute w-full transition-all duration-500 ease-in-out ${
										index === currentIndex
											? 'translate-x-0 opacity-100'
											: index < currentIndex
												? '-translate-x-full opacity-0'
												: 'translate-x-full opacity-0'
									}`}
								>
									<div className='mx-auto max-w-3xl text-center'>
										<p className='mb-6 text-lg text-gray-600'>
											{testimonial.content}
										</p>
										<h3 className='text-lg font-bold'>
											{testimonial.name}
										</h3>
										<p className='text-gray-500'>
											{testimonial.location}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					<button
						onClick={handlePrevious}
						className='absolute left-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50 active:bg-gray-100'
					>
						<IoChevronBack className='text-xl text-gray-600' />
					</button>
					<button
						onClick={handleNext}
						className='absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50 active:bg-gray-100'
					>
						<IoChevronForward className='text-xl text-gray-600' />
					</button>

					<div className='mt-8 flex justify-center gap-2'>
						{testimonials.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentIndex(index)}
								className={`h-2 w-2 rounded-full transition-colors ${
									index === currentIndex
										? 'bg-[#FF6805]'
										: 'bg-gray-300'
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
