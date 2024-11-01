import {
	faArrowRight,
	faCalendarDays,
	faCheck,
	faClock,
	faLocationDot,
	faPlane,
	faPlaneCircleCheck,
	faSpinner,
	faTicket,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Flight {
	id: string;
	airline: {
		name: string;
		logo: string;
	};
	departureTime: string;
	arrivalTime: string;
	price: number;
	duration: string;
}

const apiConfig = {
	priceRange: {
		min: 1000000,
		max: 5000000,
	},
	loadingTime: 1000,
};

const airlines = [
	{ name: 'Vietnam Airlines', logo: '/airlines/vn.png' },
	{ name: 'Bamboo Airways', logo: '/airlines/bamboo.png' },
	{ name: 'VietJet Air', logo: '/airlines/vj.png' },
	{ name: 'Pacific Airlines', logo: '/airlines/pacific-airlines.png' },
];

const VIETNAMESE_NAME_REGEX =
	/^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/;

const FlightSearchResults: React.FC = () => {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const [flights, setFlights] = useState<Flight[]>([]);
	const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [email, setEmail] = useState('');
	const [passengerName, setPassengerName] = useState('');
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);

	const generateRandomFlights = () => {
		const randomFlights: Flight[] = [];
		for (let i = 0; i < 10; i++) {
			const departureHour = Math.floor(Math.random() * 24);
			const durationHours = Math.floor(Math.random() * 5) + 1;
			const arrivalHour = (departureHour + durationHours) % 24;

			const flight: Flight = {
				id: `FL${Math.floor(Math.random() * 10000)}`,
				airline: airlines[Math.floor(Math.random() * airlines.length)],
				departureTime: `${departureHour.toString().padStart(2, '0')}:00`,
				arrivalTime: `${arrivalHour.toString().padStart(2, '0')}:00`,
				price: Math.floor(
					Math.random() *
						(apiConfig.priceRange.max - apiConfig.priceRange.min) +
						apiConfig.priceRange.min,
				),
				duration: `${durationHours}h 00m`,
			};
			randomFlights.push(flight);
		}
		return randomFlights;
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setFlights(generateRandomFlights());
			setIsLoading(false);
		}, apiConfig.loadingTime);

		return () => clearTimeout(timer);
	}, []);

	const handleFlightSelect = (flight: Flight) => {
		setSelectedFlight(flight);
		setShowModal(true);
	};

	const handlePayment = () => {
		if (!passengerName.trim()) {
			alert('Vui lòng nhập tên hành khách');
			return;
		}

		if (!VIETNAMESE_NAME_REGEX.test(passengerName.trim())) {
			alert(
				'Tên không hợp lệ. Vui lòng nhập đúng định dạng họ tên (VD: Nguyễn Văn A)',
			);
			return;
		}
		if (!email.trim()) {
			alert('Vui lòng nhập email');
			return;
		}
		if (!email.includes('@') || !email.includes('.')) {
			alert('Email không hợp lệ');
			return;
		}

		const paymentParams = new URLSearchParams({
			flightId: selectedFlight!.id,
			airline: selectedFlight!.airline.name,
			departureTime: selectedFlight!.departureTime,
			arrivalTime: selectedFlight!.arrivalTime,
			price: selectedFlight!.price.toString(),
			passengerName: passengerName,
			email: email,
			from: searchParams.get('from') ?? '',
			to: searchParams.get('to') ?? '',
			date: searchParams.get('departureDate') ?? '',
			returnDate: searchParams.get('returnDate') ?? '',
			flightType: searchParams.get('flightType') ?? '',
			passengers: searchParams.get('passengers') ?? '',
		});

		navigate(`/payment?${paymentParams.toString()}`);
	};

	if (isLoading) {
		return (
			<div className='container mx-auto flex min-h-screen items-center justify-center px-4 py-6 sm:p-4'>
				<FontAwesomeIcon
					icon={faSpinner}
					className='animate-spin text-5xl text-[#ff6805]'
				/>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-6 sm:p-4'>
			<h1 className='mb-6 flex items-center gap-2 text-xl font-bold sm:text-2xl'>
				<FontAwesomeIcon
					icon={faPlaneCircleCheck}
					className='text-[#ff6805]'
				/>
				Kết quả tìm kiếm chuyến bay
			</h1>

			<div className='rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:p-6'>
				<div
					className={`mb-6 grid grid-cols-1 gap-4 sm:gap-6 ${
						searchParams.get('returnDate')
							? 'md:grid-cols-2'
							: 'sm:grid-cols-2 lg:grid-cols-4'
					}`}
				>
					<div className='flex items-start space-x-3'>
						<FontAwesomeIcon
							icon={faLocationDot}
							className='mt-1 text-[#ff6805]'
						/>
						<div>
							<h2 className='font-medium text-gray-600'>
								Điểm đi:
							</h2>
							<p className='mt-1 font-semibold'>
								{searchParams.get('from') ?? 'N/A'}
							</p>
						</div>
					</div>

					<div className='flex items-start space-x-3'>
						<FontAwesomeIcon
							icon={faLocationDot}
							className='mt-1 text-[#ff6805]'
						/>
						<div>
							<h2 className='font-medium text-gray-600'>
								Điểm đến:
							</h2>
							<p className='mt-1 font-semibold'>
								{searchParams.get('to') ?? 'N/A'}
							</p>
						</div>
					</div>

					<div className='flex items-start space-x-3'>
						<FontAwesomeIcon
							icon={faCalendarDays}
							className='mt-1 text-[#ff6805]'
						/>
						<div>
							<h2 className='font-medium text-gray-600'>
								Ngày đi:
							</h2>
							<p className='mt-1 font-semibold'>
								{searchParams.get('departureDate') ?? 'N/A'}
							</p>
						</div>
					</div>

					{searchParams.get('returnDate') && (
						<div className='flex items-start space-x-3'>
							<FontAwesomeIcon
								icon={faCalendarDays}
								className='mt-1 text-[#ff6805]'
							/>
							<div>
								<h2 className='font-medium text-gray-600'>
									Ngày về:
								</h2>
								<p className='mt-1 font-semibold'>
									{searchParams.get('returnDate') ?? 'N/A'}
								</p>
							</div>
						</div>
					)}
				</div>

				<div className='mt-8'>
					<h2 className='mb-6 flex items-center gap-2 text-lg font-semibold sm:text-xl'>
						<FontAwesomeIcon
							icon={faTicket}
							className='text-[#ff6805]'
						/>
						Các chuyến bay có sẵn
					</h2>

					<div className='space-y-4'>
						{flights.map((flight) => (
							<div
								key={flight.id}
								className='group relative flex flex-col items-center gap-4 rounded-lg border p-4 transition-all duration-200 hover:border-[#ff6805] hover:bg-gray-50 hover:shadow-md sm:flex-row sm:justify-between sm:gap-0 sm:p-6'
							>
								<div className='w-full flex-1 text-center sm:w-auto sm:text-left'>
									<div className='flex flex-col items-center gap-3 sm:flex-row'>
										<img
											src={flight.airline.logo}
											alt={flight.airline.name}
											className='h-10 w-10 object-contain'
										/>
										<div>
											<h3 className='font-medium'>
												{flight.airline.name}
											</h3>
											<p className='text-sm text-gray-600'>
												Mã chuyến bay: {flight.id}
											</p>
										</div>
									</div>
								</div>

								<div className='w-full flex-1 sm:w-auto'>
									<div className='flex items-center justify-center space-x-2 sm:space-x-4'>
										<div className='text-center'>
											<div className='flex items-center gap-2'>
												<FontAwesomeIcon
													icon={faClock}
													className='text-gray-400'
												/>
												<p className='font-medium'>
													{flight.departureTime}
												</p>
											</div>
											<p className='mt-1 text-sm text-gray-500'>
												Giờ đi
											</p>
										</div>

										<div className='flex flex-col items-center px-2 sm:px-4'>
											<div className='h-[2px] w-8 bg-[#ff6805] sm:w-16'></div>
											<FontAwesomeIcon
												icon={faArrowRight}
												className='-mt-[9px] text-[#ff6805]'
											/>
										</div>

										<div className='text-center'>
											<div className='flex items-center gap-2'>
												<FontAwesomeIcon
													icon={faClock}
													className='text-gray-400'
												/>
												<p className='font-medium'>
													{flight.arrivalTime}
												</p>
											</div>
											<p className='mt-1 text-sm text-gray-500'>
												Giờ đến
											</p>
										</div>
									</div>
									<p className='mt-2 text-center text-sm text-gray-600'>
										Thời gian bay: {flight.duration}
									</p>
								</div>

								<div className='w-full flex-1 text-center sm:w-auto sm:text-right'>
									<p className='text-lg font-semibold text-[#ff6805]'>
										{flight.price.toLocaleString('vi-VN')}{' '}
										NĐ
									</p>
									<button
										className='mt-3 w-full rounded-md bg-[#ff6805] px-6 py-2 text-sm text-white transition-all duration-200 hover:bg-[#ff8534] hover:shadow-md active:scale-95 active:transform sm:w-auto'
										onClick={() =>
											handleFlightSelect(flight)
										}
									>
										<FontAwesomeIcon
											icon={faPlane}
											className='mr-2'
										/>
										Chọn
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{showModal && selectedFlight && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
					<div className='relative w-full max-w-md rounded-lg bg-white p-4 shadow-xl sm:p-6'>
						<button
							onClick={() => setShowModal(false)}
							className='absolute right-4 top-4 text-gray-400 hover:text-gray-600'
						>
							<FontAwesomeIcon
								icon={faXmark}
								className='h-5 w-5'
							/>
						</button>

						<div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
							<FontAwesomeIcon
								icon={faCheck}
								className='h-8 w-8 text-green-500'
							/>
						</div>

						<div className='text-center'>
							<h3 className='mb-4 text-xl font-semibold text-gray-900'>
								Thông tin đặt vé
							</h3>

							<div className='mb-6 rounded-lg bg-gray-50'>
								<div className='mb-4'>
									<label className='mb-2 block text-left text-sm font-medium text-gray-600'>
										Tên hành khách:
									</label>
									<input
										type='text'
										value={passengerName}
										onChange={(e) =>
											setPassengerName(e.target.value)
										}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												handlePayment();
											}
										}}
										autoFocus
										className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#ff6805] focus:outline-none'
										placeholder='Nhập tên hành khách'
									/>
								</div>
								<div>
									<label className='mb-2 block text-left text-sm font-medium text-gray-600'>
										Email:
									</label>
									<input
										type='email'
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												handlePayment();
											}
										}}
										className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#ff6805] focus:outline-none'
										placeholder='Nhập email'
									/>
								</div>
							</div>

							<div className='mb-3 flex items-center justify-between'>
								<span className='text-gray-600'>
									Chuyến bay:
								</span>
								<span className='font-medium'>
									{selectedFlight.id}
								</span>
							</div>
							<div className='mb-3 flex items-center justify-between'>
								<span className='text-gray-600'>Hãng bay:</span>
								<span className='font-medium'>
									{selectedFlight.airline.name}
								</span>
							</div>
							<div className='mb-3 flex items-center justify-between'>
								<span className='text-gray-600'>
									Thời gian:
								</span>
								<span className='font-medium'>
									{selectedFlight.departureTime} -{' '}
									{selectedFlight.arrivalTime}
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-gray-600'>Giá vé:</span>
								<span className='font-medium text-[#ff6805]'>
									{selectedFlight.price.toLocaleString(
										'vi-VN',
									)}{' '}
									NĐ
								</span>
							</div>
						</div>

						<div className='mt-4 flex gap-4'>
							<button
								onClick={() => setShowModal(false)}
								className='flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95'
							>
								Đóng
							</button>
							<button
								onClick={handlePayment}
								className='flex-1 rounded-lg bg-[#ff6805] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#ff8534] active:scale-95'
							>
								Thanh toán
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default FlightSearchResults;
