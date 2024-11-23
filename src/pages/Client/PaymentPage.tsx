import {
	faCalendar,
	faCopy,
	faCreditCard,
	faFileInvoice,
	faIdCard,
	faLocationDot,
	faMoneyBill,
	faMoneyBillTransfer,
	faPhone,
	faPlane,
	faUser,
	faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
interface Data {
	address: string;
	email: string;
	hotline: string;
	name: string;
}
interface ApiBankInfo {
	bin: string;
	accountNumber: string;
	accountName: string;
}

interface Bank {
	id: number;
	name: string;
	code: string;
	bin: string;
	shortName: string;
	logo: string;
	transferSupported: number;
	lookupSupported: number;
}

interface BankResponse {
	code: string;
	desc: string;
	data: Bank[];
}

interface ContactInfo {
	email: string;
	phoneNumber: string;
	idNumber: string;
}

const generateVietQRUrl = (
	bankId: string,
	accountNo: string,
	amount: number,
	description: string,
	accountName: string,
	template: 'qr_only' = 'qr_only',
) => {
	const baseUrl = 'https://img.vietqr.io/image';
	const encodedDesc = encodeURIComponent(description);
	const encodedName = encodeURIComponent(accountName);

	return `${baseUrl}/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodedDesc}&accountName=${encodedName}`;
};

const CountdownTimer: React.FC<{ onTimeUp: () => void }> = ({ onTimeUp }) => {
	const [timeLeft, setTimeLeft] = useState(1 * 60);
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

const copyToClipboard = (text: string) => {
	navigator.clipboard.writeText(text);
};

const PaymentPage: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [totalPrice, setTotalPrice] = useState(0);
	const [qrCodeUrl, setQrCodeUrl] = useState('');
	const [ip, setIp] = useState('');
	const [data, setData] = useState<Data>({
		address: '',
		email: '',
		hotline: '',
		name: '',
	});
	useEffect(() => {
		fetch('/data.json')
			.then((res) => res.json())
			.then((data) => setData(data));
	}, []);
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

	const [contactInfo, setContactInfo] = useState<ContactInfo>({
		email: flightDetails.email ?? '',
		phoneNumber: '',
		idNumber: '',
	});
	const [errors, setErrors] = useState({
		phoneNumber: '',
		idNumber: '',
	});

	const validateForm = () => {
		const newErrors = {
			phoneNumber: '',
			idNumber: '',
		};
		let isValid = true;

		if (!contactInfo.phoneNumber) {
			newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
			isValid = false;
		} else if (!/^\d{8,12}$/.test(contactInfo.phoneNumber)) {
			newErrors.phoneNumber = 'Số điện thoại phải từ 8-12 số';
			isValid = false;
		}

		if (!contactInfo.idNumber) {
			newErrors.idNumber = 'Vui lòng nhập số căn cước công dân';
			isValid = false;
		} else if (!/^\d{8,14}$/.test(contactInfo.idNumber)) {
			newErrors.idNumber = 'Số căn cước công dân phải từ 8-14 số';
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const [modalType, setModalType] = useState<'info' | 'payment' | null>(null);

	const handlePayment = () => {
		setModalType('info');
		setShowModal(true);
	};

	const handleInfoSubmit = () => {
		if (validateForm()) {
			processPayment();
			setModalType('payment');
			setPaymentStatus('pending');
		}
	};

	const processPayment = async () => {
		if (!validateForm()) {
			return;
		}

		try {
			const formattedPassengers = [];
			for (let i = 0; i < passengers.adults; i++) {
				formattedPassengers.push({
					type: 'adult',
					name: flightDetails.passengerName,
				});
			}

			for (let i = 0; i < passengers.children; i++) {
				formattedPassengers.push({
					type: 'child',
					name: flightDetails.passengerName,
				});
			}

			for (let i = 0; i < passengers.infants; i++) {
				formattedPassengers.push({
					type: 'infant',
					name: flightDetails.passengerName,
				});
			}

			const bookingData = {
				ip,
				flightId: flightDetails.flightId,
				amount: totalPrice,
				passengers: formattedPassengers,
				contactInfo: {
					email: flightDetails.email,
					phoneNumber: contactInfo.phoneNumber,
					idNumber: contactInfo.idNumber,
				},
				airline: flightDetails.airline,
				departureTime: flightDetails.departureTime,
				arrivalTime: flightDetails.arrivalTime,
				from: flightDetails.from,
				to: flightDetails.to,
				date: flightDetails.date,
				flightType: flightDetails.flightType,
				...(flightDetails.returnDate && {
					returnDate: flightDetails.returnDate,
				}),
				qrCodeUrl,
			};

			await axios.post('/api/bookings', bookingData);
		} catch (error) {
			console.error('Booking failed:', error);
			alert('Có lỗi xảy ra khi đặt vé. Vui lòng thử lại.');
		}
	};

	useEffect(() => {
		setTotalPrice(calculateTotalPrice());
	}, [calculateTotalPrice]);

	const [bankInfo, setBankInfo] = useState<Bank | null>(null);
	const [accountInfo, setAccountInfo] = useState<ApiBankInfo | null>(null);

	useEffect(() => {
		const fetchIp = async () => {
			const response = await axios.get('https://get.geojs.io/v1/ip', {
				withCredentials: false,
			});
			setIp(response.data);
		};
		fetchIp();
		const fetchBankInfo = async () => {
			try {
				const apiBankInfoResponse = await axios.get('/api/bank-info');
				const apiBankInfo: ApiBankInfo = apiBankInfoResponse.data;
				setAccountInfo(apiBankInfo);

				const description = `${flightDetails.flightId}`;
				const url = generateVietQRUrl(
					apiBankInfo.bin,
					apiBankInfo.accountNumber,
					totalPrice,
					description,
					apiBankInfo.accountName,
				);
				setQrCodeUrl(url);

				const banksResponse = await axios.get<BankResponse>(
					'https://api.vietqr.io/v2/banks',
					{ withCredentials: false },
				);

				const matchingBank = banksResponse.data.data.find(
					(bank) => bank.bin === apiBankInfo.bin,
				);

				if (matchingBank) {
					setBankInfo(matchingBank);
				}
			} catch (error) {
				console.error('Failed to fetch bank info:', error);
			}
		};
		fetchBankInfo();
	}, [totalPrice, flightDetails.flightId]);

	const renderBankSection = () => (
		<div className='mt-6 border-t pt-6'>
			<Helmet>
				<title>Thanh toán | {data.name}</title>
			</Helmet>
			<h3 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
				<FontAwesomeIcon
					icon={faCreditCard}
					className='text-[#ff6805]'
				/>
				Thông tin chuyển khoản
			</h3>
			{bankInfo && accountInfo && (
				<div className='rounded-lg bg-gray-50 p-4'>
					<div className='mb-4 flex flex-col items-center justify-around gap-4 rounded-lg bg-gray-200 p-4 sm:flex-row'>
						<img
							src={bankInfo.logo}
							alt={bankInfo.name}
							className='h-12 w-auto object-contain'
						/>
						<div className='text-start'>
							<p className='font-medium'>{bankInfo.name}</p>
							<p className='hidden text-center text-gray-600 sm:block'>
								{bankInfo.shortName}
							</p>
						</div>
					</div>
					<div className='space-y-2 text-start'>
						<div className='flex items-center justify-between gap-2'>
							<div className='flex items-center gap-2'>
								<FontAwesomeIcon
									icon={faMoneyBillTransfer}
									className='text-[#ff6805]'
								/>
								<p>
									Số tài khoản:{' '}
									<span className='font-medium'>
										{accountInfo.accountNumber}
									</span>
								</p>
							</div>
							<button
								onClick={() =>
									copyToClipboard(accountInfo.accountNumber)
								}
								className='flex items-center gap-2 rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300'
							>
								<FontAwesomeIcon icon={faCopy} />
								Copy
							</button>
						</div>
						<div className='flex items-center gap-2'>
							<FontAwesomeIcon
								icon={faUser}
								className='text-[#ff6805]'
							/>
							<p>
								Tên tài khoản:{' '}
								<span className='font-medium'>
									{accountInfo.accountName}
								</span>
							</p>
						</div>
						<div className='flex items-center gap-2'>
							<FontAwesomeIcon
								icon={faMoneyBill}
								className='text-[#ff6805]'
							/>
							<p>
								Số tiền:{' '}
								<span className='font-medium'>
									{totalPrice.toLocaleString('vi-VN')} VND
								</span>
							</p>
						</div>
						<div className='flex items-center justify-between gap-2'>
							<div className='flex items-center gap-2'>
								<FontAwesomeIcon
									icon={faFileInvoice}
									className='text-[#ff6805]'
								/>
								<p>
									Nội dung chuyển khoản:{' '}
									<span className='font-medium'>
										{flightDetails.flightId ?? ''}
									</span>
								</p>
							</div>
							<button
								onClick={() =>
									copyToClipboard(
										flightDetails.flightId ?? '',
									)
								}
								className='flex items-center gap-2 rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300'
							>
								<FontAwesomeIcon icon={faCopy} />
								Copy
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);

	const [showModal, setShowModal] = useState(false);
	const [paymentStatus, setPaymentStatus] = useState<
		'pending' | 'timeout' | 'completed'
	>('pending');

	const handleTimeUp = () => {
		const random = Math.random();
		if (random < 0.5) {
			setPaymentStatus('completed');
		} else {
			setPaymentStatus('timeout');
		}
	};

	const renderModal = () => (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='w-[90%] max-w-3xl rounded-lg bg-white p-6 shadow-xl'>
				{modalType === 'info' ? (
					<div className='mb-4 text-center'>
						<h3 className='mb-6 text-xl font-bold'>
							Thông tin người đặt vé
						</h3>
						<div className='mb-6 space-y-4'>
							<div>
								<label className='mb-1 block text-start text-sm font-medium text-gray-700'>
									<FontAwesomeIcon
										icon={faPhone}
										className='mr-2 text-[#ff6805]'
									/>
									Số điện thoại
								</label>
								<input
									type='tel'
									value={contactInfo.phoneNumber}
									onChange={(e) =>
										setContactInfo((prev) => ({
											...prev,
											phoneNumber: e.target.value,
										}))
									}
									className='w-full rounded-lg border border-gray-300 p-2'
									placeholder='Nhập số điện thoại'
								/>
								{errors.phoneNumber && (
									<p className='mt-1 text-start text-sm text-red-500'>
										{errors.phoneNumber}
									</p>
								)}
							</div>
							<div>
								<label className='mb-1 block text-start text-sm font-medium text-gray-700'>
									<FontAwesomeIcon
										icon={faIdCard}
										className='mr-2 text-[#ff6805]'
									/>
									Số căn cước công dân
								</label>
								<input
									type='text'
									value={contactInfo.idNumber}
									onChange={(e) =>
										setContactInfo((prev) => ({
											...prev,
											idNumber: e.target.value,
										}))
									}
									className='w-full rounded-lg border border-gray-300 p-2'
									placeholder='Nhập số căn cước công dân'
								/>
								{errors.idNumber && (
									<p className='mt-1 text-start text-sm text-red-500'>
										{errors.idNumber}
									</p>
								)}
							</div>
						</div>
						<div className='flex gap-2'>
							<button
								className='w-full rounded-lg bg-gray-300 py-2 font-medium text-gray-700 hover:bg-gray-400'
								onClick={() => {
									setShowModal(false);
									setModalType(null);
								}}
							>
								Hủy
							</button>
							<button
								className='w-full rounded-lg bg-[#ff6805] py-2 font-medium text-white hover:bg-[#ff8534]'
								onClick={handleInfoSubmit}
							>
								Tiếp tục
							</button>
						</div>
					</div>
				) : (
					<div className='mb-4 text-center'>
						<h3 className='mb-2 text-xl font-bold'>
							{paymentStatus === 'pending' &&
								'Xác nhận thông tin thanh toán'}
							{paymentStatus === 'timeout' &&
								'Hết thời gian thanh toán'}
							{paymentStatus === 'completed' &&
								'Đặt vé thành công'}
						</h3>
						{paymentStatus === 'pending' && (
							<>
								<p className='mb-4 text-gray-600'>
									Vui lòng hoàn tất thanh toán trong
								</p>
								<CountdownTimer onTimeUp={handleTimeUp} />
								{renderBankSection()}
							</>
						)}
						{paymentStatus === 'timeout' && (
							<p className='text-red-500'>
								Đã hết thời gian thanh toán. Vui lòng kiểm tra
								lịch sử đặt vé tại{' '}
								<Link
									to={`/tra-cuu-lich-su-dat-ve?tim_kiem=${contactInfo.idNumber}`}
									className='text-blue-500 underline'
								>
									đây
								</Link>
							</p>
						)}
						{paymentStatus === 'completed' && (
							<p className='text-green-500'>
								Đặt vé thành công. Vui lòng kiểm tra email để
								xem chi tiết.
							</p>
						)}
						<button
							className='mt-4 w-full rounded-lg bg-[#ff6805] py-2 font-medium text-white hover:bg-[#ff8534]'
							onClick={() => {
								setShowModal(false);
								setModalType(null);
								navigate(
									`/tra-cuu-lich-su-dat-ve?tim_kiem=${contactInfo.idNumber}`,
								);
							}}
						>
							Đóng
						</button>
					</div>
				)}
			</div>
		</div>
	);

	return (
		<div className='container mx-auto p-4'>
			<Helmet>
				<title>Thanh toán | {data.name}</title>
			</Helmet>
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
							Thông tin vé
						</h2>
						<div className='rounded-lg bg-gray-50 p-3 font-medium'>
							<p>Mã chuyến bay: {flightDetails.flightId}</p>
						</div>
						<p className='rounded-lg bg-gray-50 p-3 font-medium'>
							Loại vé:{' '}
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
									VNĐ
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
										VNĐ
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
