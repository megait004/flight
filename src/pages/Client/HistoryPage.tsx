import {
	faMagnifyingGlass,
	faPlane,
	faSearch,
	faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
interface Data {
	address: string;
	email: string;
	hotline: string;
	name: string;
}
interface ContactInfo {
	email: string;
	idNumber: string;
	phoneNumber: string;
}

interface Passenger {
	name: string;
	type: string;
}

interface History {
	id: number;
	airline: string;
	amount: number;
	arrivalTime: string;
	contactInfo: ContactInfo;
	created_at: string;
	date: string;
	departureTime: string;
	flightId: string;
	flightType: string;
	from: string;
	to: string;
	ip: string;
	passengers: Passenger[];
	status: 'pending' | 'success';
}

const HistoryPage: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [idNumber, setIdNumber] = useState(
		searchParams.get('tim_kiem') ?? '',
	);
	const [histories, setHistories] = useState<History[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchHistories = async () => {
			setLoading(true);
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/history-booking?idNumber=${idNumber}`,
				);
				setHistories(response.data.data);
			} catch (error) {
				console.error('Error fetching histories:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchHistories();
	}, [idNumber]);

	const getStatusColor = (status: History['status']) => {
		switch (status) {
			case 'success':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: History['status']) => {
		switch (status) {
			case 'success':
				return 'Đã thanh toán';
			case 'pending':
				return 'Chờ thanh toán';
			default:
				return status;
		}
	};

	const handleIdNumberChange = (value: string) => {
		setIdNumber(value);
		if (value) {
			setSearchParams({ tim_kiem: value });
		} else {
			setSearchParams({});
		}
	};
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
	return (
		<div className='min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8'>
			<Helmet>
				<title>Lịch sử đặt vé - {data.name}</title>
			</Helmet>
			<div className='mx-auto max-w-7xl'>
				<div className='mb-8'>
					<h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
						Lịch sử đặt vé
					</h1>
					<p className='mt-2 text-gray-600'>
						Xem lại các đơn đặt vé và trạng thái thanh toán
					</p>
				</div>

				<div className='mb-6 rounded-lg bg-white p-4 shadow-md sm:p-6'>
					<div className='relative'>
						<input
							type='text'
							placeholder='Nhập số căn cước công dân...'
							className='w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 transition-all hover:border-[#ff6805] focus:border-[#ff6805] focus:outline-none'
							value={idNumber}
							onChange={(e) =>
								handleIdNumberChange(e.target.value)
							}
							maxLength={12}
							pattern='\d*'
						/>
						<FontAwesomeIcon
							icon={faSearch}
							className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
						/>
					</div>
				</div>

				{loading ? (
					<div className='flex items-center justify-center py-8'>
						<div className='h-8 w-8 animate-spin rounded-full border-4 border-[#ff6805] border-t-transparent'></div>
					</div>
				) : (
					<>
						{!idNumber ? (
							<div className='mt-8 flex flex-col items-center justify-center text-center'>
								<div className='mb-6 rounded-full bg-orange-100 p-6'>
									<FontAwesomeIcon
										icon={faPlane}
										className='h-12 w-12 text-[#ff6805]'
									/>
								</div>
								<h3 className='text-xl font-medium text-gray-800'>
									Chào mừng bạn đến với lịch sử đặt vé!
								</h3>
								<p className='mt-3 max-w-md text-gray-600'>
									Vui lòng nhập số căn cước công dân của bạn
									để xem lịch sử đặt vé
								</p>
								<div className='mt-6 rounded-full bg-gray-100 p-4'>
									<FontAwesomeIcon
										icon={faMagnifyingGlass}
										className='h-8 w-8 text-gray-400'
									/>
								</div>
							</div>
						) : (
							<>
								<div className='space-y-4'>
									{histories.map((history) => (
										<div
											key={history.id}
											className='cursor-pointer rounded-lg bg-white p-4 shadow-md transition-all hover:shadow-lg sm:p-6'
											onClick={() => {
												window.open(
													`https://mail.google.com/mail/u/0/#search/${history.flightId}`,
												);
											}}
										>
											<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
												<div className='flex items-center gap-4'>
													<div className='rounded-full bg-orange-100 p-3 text-[#ff6805]'>
														<FontAwesomeIcon
															icon={faPlane}
															className='h-5 w-5'
														/>
													</div>
													<div>
														<div className='flex items-center gap-2 text-lg font-medium'>
															<span>
																{history.from}
															</span>
															<FontAwesomeIcon
																icon={faPlane}
																className='h-4 w-4 text-gray-400'
															/>
															<span>
																{history.to}
															</span>
														</div>
														<div className='mt-1 text-sm text-gray-600'>
															Mã chuyến bay:{' '}
															{history.flightId}
														</div>
														<div className='mt-1 text-sm text-gray-600'>
															Ngày đặt:{' '}
															{format(
																new Date(
																	history.created_at,
																),
																'dd/MM/yyyy HH:mm',
															)}
														</div>
														<div className='mt-1 text-sm text-gray-600'>
															Hãng bay:{' '}
															{history.airline}
														</div>
													</div>
												</div>

												<div className='flex flex-wrap items-center gap-4'>
													<span
														className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
															history.status,
														)}`}
													>
														{getStatusText(
															history.status,
														)}
													</span>
													<div className='text-right'>
														<div className='text-lg font-medium text-[#ff6805]'>
															{history.amount.toLocaleString(
																'vi-VN',
															)}{' '}
															NĐ
														</div>
														<div className='text-sm text-gray-600'>
															Giờ bay:{' '}
															{
																history.departureTime
															}{' '}
															-{' '}
															{
																history.arrivalTime
															}
														</div>
														<div className='text-sm text-gray-600'>
															Ngày bay:{' '}
															{history.date}
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>

								{histories.length === 0 && (
									<div className='mt-8 text-center'>
										<div className='rounded-full bg-gray-100 p-4 text-gray-400'>
											<FontAwesomeIcon
												icon={faTimes}
												className='h-8 w-8'
											/>
										</div>
										<h3 className='mt-4 text-lg font-medium'>
											Không tìm thấy lịch sử đặt vé
										</h3>
										<p className='mt-2 text-gray-600'>
											Thử thay đổi bộ lọc tìm kiếm của bạn
										</p>
									</div>
								)}
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
};
export default HistoryPage;
