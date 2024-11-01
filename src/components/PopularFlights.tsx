import React, { useEffect, useState } from 'react';
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

const apiConfig = {
	priceRange: {
		min: 1000000,
		max: 5000000,
	},
};

const PopularFlights: React.FC = () => {
	const [flights, setFlights] = useState<Flight[]>([]);

	const generateRandomFlights = (): Flight[] => {
		const mockFlights: Flight[] = [
			{
				id: 1,
				from: 'Quy Nhơn',
				fromCode: 'UIH',
				to: 'TP Hồ Chí Minh',
				toCode: 'SGN',
				date: '15/11/2024',
				price: Math.floor(
					Math.random() *
						(apiConfig.priceRange.max - apiConfig.priceRange.min) +
						apiConfig.priceRange.min,
				),
				currency: 'VND',
				lastViewed: '5 giờ trước',
			},
			{
				id: 2,
				from: 'TP Hồ Chí Minh',
				fromCode: 'SGN',
				to: 'Quy Nhơn',
				toCode: 'UIH',
				date: '17/11/2024',
				price: Math.floor(
					Math.random() *
						(apiConfig.priceRange.max - apiConfig.priceRange.min) +
						apiConfig.priceRange.min,
				),
				currency: 'VND',
				lastViewed: '7 giờ trước',
			},
			{
				id: 3,
				from: 'TP Hồ Chí Minh',
				fromCode: 'SGN',
				to: 'Nha Trang',
				toCode: 'CXR',
				date: '17/11/2024',
				price: Math.floor(
					Math.random() *
						(apiConfig.priceRange.max - apiConfig.priceRange.min) +
						apiConfig.priceRange.min,
				),
				currency: 'VND',
				lastViewed: '14 giờ trước',
			},
			{
				id: 4,
				from: 'TP Hồ Chí Minh',
				fromCode: 'SGN',
				to: 'Nha Trang',
				toCode: 'CXR',
				date: '13/11/2024',
				price: Math.floor(
					Math.random() *
						(apiConfig.priceRange.max - apiConfig.priceRange.min) +
						apiConfig.priceRange.min,
				),
				currency: 'VND',
				lastViewed: '3 giờ trước',
			},
		];

		return mockFlights;
	};

	useEffect(() => {
		setFlights(generateRandomFlights());
	}, []);

	const formatPrice = (price: number) => {
		return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	return (
		<div className='mx-auto max-w-7xl px-4 py-8'>
			<h2 className='mb-8 text-center text-2xl font-bold'>
				Chuyến bay phổ biến
			</h2>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
				{flights.map((flight) => (
					<div
						key={flight.id}
						className='rounded-lg bg-white p-4 shadow-sm'
					>
						<div className='mb-3 text-sm text-gray-500'>
							Đã xem: {flight.lastViewed}
						</div>
						<div className='mb-2 flex items-center justify-between'>
							<div>
								<div className='font-semibold'>
									{flight.from}
								</div>
								<div className='text-gray-500'>
									({flight.fromCode})
								</div>
							</div>
							<IoArrowForward className='text-blue-500' />
							<div>
								<div className='font-semibold'>{flight.to}</div>
								<div className='text-gray-500'>
									({flight.toCode})
								</div>
							</div>
						</div>
						<div className='mb-2 text-sm text-gray-600'>
							Ngày đi: {flight.date}
						</div>
						<div className='flex items-center justify-between'>
							<div>
								<div className='text-xs text-gray-500'>
									chỉ từ ({flight.currency})
								</div>
								<div className='font-bold text-red-500'>
									{formatPrice(flight.price)}*
								</div>
							</div>
							<div className='text-gray-500'>Một chiều</div>
							<button className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white'>
								<IoArrowForward />
							</button>
						</div>
					</div>
				))}
			</div>
			<div className='mt-4 text-center text-xs text-gray-500'>
				*Giá vé hiển thị được thu thập trong vòng 48 giờ và có thể không
				còn hiệu lực tại thời điểm đặt chỗ. Chúng tôi có thể thu thêm
				phí và lệ phí cho một số sản phẩm và dịch vụ.
			</div>
		</div>
	);
};

export default PopularFlights;
