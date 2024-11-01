import {
	faCalendar,
	faLocationDot,
	faMoneyBill,
	faPlane,
	faUser,
	faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const apiBankInfo = {
	bankId: '963388',
	accountNo: '0362961990',
	accountName: 'TA TUAN ANH',
	template: 'qr_only',
};

const generateVietQRUrl = (
	bankId: string,
	accountNo: string,
	amount: number,
	description: string,
	accountName: string,
	template: 'compact2' | 'compact' | 'qr_only' | 'print' = 'compact2',
) => {
	const baseUrl = 'https://img.vietqr.io/image';
	const encodedDesc = encodeURIComponent(description);
	const encodedName = encodeURIComponent(accountName);

	return `${baseUrl}/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodedDesc}&accountName=${encodedName}`;
};

const CountdownTimer: React.FC<{ onTimeUp: () => void }> = ({ onTimeUp }) => {
	const [timeLeft, setTimeLeft] = useState(5 * 60);

	useEffect(() => {
		if (timeLeft <= 0) {
			onTimeUp();
			return;
		}

		const timer = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft, onTimeUp]);

	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;

	return (
		<div className='text-2xl font-bold text-[#ff6805]'>
			{String(minutes).padStart(2, '0')}:
			{String(seconds).padStart(2, '0')}
		</div>
	);
};

const PaymentPage: React.FC = () => {
	const location = useLocation();
	const [totalPrice, setTotalPrice] = useState(0);
	const searchParams = useMemo(
		() => new URLSearchParams(location.search),
		[location.search],
	);

	const passengers = useMemo(() => {
		return searchParams.get('passengers')
			? JSON.parse(searchParams.get('passengers') ?? '{}')
			: { adults: 0, children: 0, infants: 0 };
	}, [searchParams]);

	const flightDetails = {
		flightId: searchParams.get('flightId'),
		airline: searchParams.get('airline'),
		departureTime: searchParams.get('departureTime'),
		arrivalTime: searchParams.get('arrivalTime'),
		price: searchParams.get('price'),
		email: searchParams.get('email'),
		passengerName: searchParams.get('passengerName'),
		from: searchParams.get('from'),
		to: searchParams.get('to'),
		date: searchParams.get('date'),
		returnDate: searchParams.get('returnDate'),
		flightType: searchParams.get('flightType'),
		passengers,
	};

	const getTotalPassengers = () => {
		return passengers.adults + passengers.children + passengers.infants;
	};

	const calculateTotalPrice = useCallback(() => {
		const basePrice = Number(flightDetails.price);
		const adultPrice = basePrice * passengers.adults;
		const childPrice = basePrice * 0.75 * passengers.children;
		const infantPrice = basePrice * 0.1 * passengers.infants;
		return adultPrice + childPrice + infantPrice;
	}, [flightDetails.price, passengers]);

	const handlePayment = () => {
		setShowModal(true);
	};

	useEffect(() => {
		setTotalPrice(calculateTotalPrice());
	}, [calculateTotalPrice]);

	const [qrCodeUrl, setQrCodeUrl] = useState('');

	useEffect(() => {
		const description = `${flightDetails.flightId}`;
		const url = generateVietQRUrl(
			apiBankInfo.bankId,
			apiBankInfo.accountNo,
			totalPrice,
			description,
			apiBankInfo.accountName,
			apiBankInfo.template as
				| 'compact2'
				| 'compact'
				| 'qr_only'
				| 'print',
		);
		setQrCodeUrl(url);
	}, [totalPrice, flightDetails.flightId]);

	const renderQRCodeSection = () => (
		<div className='mt-6 border-t pt-6'>
			<h3 className='mb-4 text-lg font-semibold'>
				Quét mã QR để thanh toán
			</h3>
			<div className='flex flex-col items-center'>
				{qrCodeUrl && (
					<img
						src={qrCodeUrl}
						alt='QR Code thanh toán'
						className='max-w-[300px] rounded-lg shadow-lg'
					/>
				)}
			</div>
		</div>
	);

	const [showModal, setShowModal] = useState(false);
	const [paymentStatus, setPaymentStatus] = useState<
		'pending' | 'timeout' | 'completed'
	>('pending');

	const handleTimeUp = () => {
		setPaymentStatus('timeout');
	};

	const renderModal = () => (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='w-96 rounded-lg bg-white p-6 shadow-xl'>
				<div className='mb-4 text-center'>
					<h3 className='mb-2 text-xl font-bold'>
						{paymentStatus === 'pending'
							? 'Đang chờ thanh toán'
							: 'Hết thời gian thanh toán'}
					</h3>
					{paymentStatus === 'pending' ? (
						<>
							<p className='mb-4 text-gray-600'>
								Vui lòng hoàn tất thanh toán trong
							</p>
							<CountdownTimer onTimeUp={handleTimeUp} />
							{renderQRCodeSection()}
						</>
					) : (
						<p className='text-red-500'>
							Đã hết thời gian thanh toán. Vui lòng thực hiện lại
							giao dịch.
						</p>
					)}
				</div>
				<button
					className='mt-4 w-full rounded-lg bg-[#ff6805] py-2 font-medium text-white hover:bg-[#ff8534]'
					onClick={() => setShowModal(false)}
				>
					Đóng
				</button>
			</div>
		</div>
	);

	return (
		<div className='container mx-auto p-4'>
			<h1 className='mb-6 flex items-center gap-2 text-2xl font-bold'>
				<FontAwesomeIcon
					icon={faMoneyBill}
					className='text-[#ff6805]'
				/>
				Thanh toán
			</h1>

			<div className='grid gap-6 md:grid-cols-2'>
				<div className='rounded-lg border border-gray-200 bg-white px-6 shadow-lg sm:p-6'>
					<div className='sm:mb-6'>
						<h2 className='flex items-center gap-2 text-xl font-semibold sm:mb-4'>
							<FontAwesomeIcon
								icon={faUsers}
								className='text-[#ff6805]'
							/>
							Thông tin hành khách
						</h2>
						<div className='sm:space-y-3'>
							<p className='flex items-center gap-2'>
								<FontAwesomeIcon
									icon={faUser}
									className='text-[#ff6805]'
								/>
								<span className='text-gray-600'>
									Tên hành khách:
								</span>
								<span className='font-medium'>
									{flightDetails.passengerName}
								</span>
							</p>
							<div className='rounded-lg bg-gray-50 p-4'>
								<h3 className='mb-2 font-medium'>
									Số lượng hành khách:
								</h3>
								<div className='space-y-2'>
									{passengers.adults > 0 && (
										<p>Người lớn: {passengers.adults}</p>
									)}
									{passengers.children > 0 && (
										<p>Trẻ em: {passengers.children}</p>
									)}
									{passengers.infants > 0 && (
										<p>Em bé: {passengers.infants}</p>
									)}
									<p className='font-medium'>
										Tổng số:{' '}
										<span className='font-semibold'>
											{getTotalPassengers()} hành khách
										</span>{' '}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className='mb-6'>
						<h2 className='mb-4 flex items-center gap-2 text-xl font-semibold'>
							<FontAwesomeIcon
								icon={faPlane}
								className='text-[#ff6805]'
							/>
							Loại vé
						</h2>
						<p className='rounded-lg bg-gray-50 p-3 font-medium'>
							{flightDetails.flightType === 'one-way' &&
							!flightDetails.returnDate
								? 'Một chiều'
								: 'Khứ hồi'}
						</p>
					</div>
				</div>

				<div className='rounded-lg border border-gray-200 bg-white px-6 shadow-lg sm:p-6'>
					<div className='sm:mb-6'>
						<h2 className='mb-4 flex items-center gap-2 text-xl font-semibold'>
							<FontAwesomeIcon
								icon={faPlane}
								className='text-[#ff6805]'
							/>
							Chi tiết chuyến bay
						</h2>
						<div
							className={`flex flex-col justify-between ${
								flightDetails.flightType === 'one-way' &&
								!flightDetails.returnDate
									? 'sm:flex-col'
									: 'sm:flex-row'
							} gap-2`}
						>
							<div className='flex flex-col gap-2'>
								<div className='flex items-center gap-2'>
									<FontAwesomeIcon
										icon={faLocationDot}
										className='text-[#ff6805]'
									/>
									<span className='text-gray-600'>
										Điểm đi:
									</span>
									<span className='font-medium'>
										{flightDetails.from}
									</span>
								</div>
								<div className='flex items-center gap-2'>
									<FontAwesomeIcon
										icon={faLocationDot}
										className='text-[#ff6805]'
									/>
									<span className='text-gray-600'>
										Điểm đến:
									</span>
									<span className='font-medium'>
										{flightDetails.to}
									</span>
								</div>
							</div>
							<div className='flex flex-col gap-2'>
								<div className='flex items-center gap-2'>
									<FontAwesomeIcon
										icon={faCalendar}
										className='text-[#ff6805]'
									/>
									<span className='text-gray-600'>
										Ngày bay:
									</span>
									<span className='font-medium'>
										{flightDetails.date}
									</span>
								</div>
								{flightDetails.flightType === 'round-trip' &&
									flightDetails.returnDate && (
										<div className='flex items-center gap-2'>
											<FontAwesomeIcon
												icon={faCalendar}
												className='text-[#ff6805]'
											/>
											<span className='text-gray-600'>
												Ngày về:
											</span>
											<span className='font-medium'>
												{flightDetails.returnDate}
											</span>
										</div>
									)}
							</div>
						</div>
					</div>

					<div className='border-t pt-4'>
						<div className='space-y-3'>
							<div className='flex items-center justify-between text-gray-600'>
								<span>Giá vé cơ bản:</span>
								<span>
									{Number(flightDetails.price).toLocaleString(
										'vi-VN',
									)}{' '}
									NĐ
								</span>
							</div>
							{passengers.adults > 0 && (
								<div className='flex items-center justify-between text-gray-600'>
									<span>
										Người lớn (x{passengers.adults}):
									</span>
									<span>
										{(
											Number(flightDetails.price) *
											passengers.adults
										).toLocaleString('vi-VN')}{' '}
										NĐ
									</span>
								</div>
							)}
							{passengers.children > 0 && (
								<div className='flex items-center justify-between text-gray-600'>
									<span>
										Trẻ em (x{passengers.children}):
									</span>
									<span>
										{(
											Number(flightDetails.price) *
											0.75 *
											passengers.children
										).toLocaleString('vi-VN')}{' '}
										NĐ
									</span>
								</div>
							)}
							{passengers.infants > 0 && (
								<div className='flex items-center justify-between text-gray-600'>
									<span>Em bé (x{passengers.infants}):</span>
									<span>
										{(
											Number(flightDetails.price) *
											0.1 *
											passengers.infants
										).toLocaleString('vi-VN')}{' '}
										NĐ
									</span>
								</div>
							)}
							<div className='border-t pt-3'>
								<div className='flex items-center justify-between'>
									<span className='text-xl font-semibold'>
										Tổng tiền:
									</span>
									<span className='text-xl font-bold text-[#ff6805]'>
										{calculateTotalPrice().toLocaleString(
											'vi-VN',
										)}{' '}
										NĐ
									</span>
								</div>
							</div>
						</div>
						<button
							className='mt-6 w-full rounded-lg bg-[#ff6805] py-3 font-medium text-white transition-all duration-200 hover:bg-[#ff8534] active:scale-95'
							onClick={handlePayment}
						>
							Xác nhận thanh toán
						</button>
					</div>
				</div>
			</div>
			{showModal && renderModal()}
		</div>
	);
};

export default PaymentPage;
