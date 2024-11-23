import {
	faCheck,
	faHistory,
	faSearch,
	faSignOutAlt,
	faTimes,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Booking {
	id: number;
	ip: string;
	flightId: string;
	amount: number;
	contactInfo: {
		email: string;
		phoneNumber: string;
		idNumber: string;
	};
	airline: string;
	departureTime: string;
	arrivalTime: string;
	from: string;
	to: string;
	date: string;
	flightType: string;
	returnDate?: string;
	created_at: string;
	status: string;
	isStatusLoading?: boolean;
}

const formatDateTime = (dateTimeStr: string) => {
	const date = new Date(dateTimeStr);
	return `${date.toLocaleTimeString('vi-VN')} ${date.toLocaleDateString('vi-VN')}`;
};

const GetAllHistory = () => {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<
		'all' | 'pending' | 'success'
	>('all');
	const [loading, setLoading] = useState(true);

	const fetchBookings = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/api/admin/history-booking`,
			);
			setBookings(response.data.data);
		} catch (error) {
			console.error('Error fetching bookings:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBookings();
	}, []);

	const handleDelete = async (id: number) => {
		if (!window.confirm('Xác nhận xóa?')) return;

		try {
			await axios.delete(
				`${import.meta.env.VITE_API_URL}/api/admin/history-booking/${id}`,
			);
			setBookings(bookings.filter((booking) => booking.id !== id));
		} catch (error) {
			console.error('Error deleting booking:', error);
		}
	};

	const handleStatusChange = async (id: number, status: string) => {
		try {
			setBookings(
				bookings.map((booking) =>
					booking.id === id
						? { ...booking, isStatusLoading: true }
						: booking,
				),
			);

			await axios.put(
				`${import.meta.env.VITE_API_URL}/api/admin/history-booking/${id}`,
				{ status },
			);

			setBookings(
				bookings.map((booking) =>
					booking.id === id
						? { ...booking, status, isStatusLoading: false }
						: booking,
				),
			);
		} catch (error) {
			console.error('Error updating status:', error);
			setBookings(
				bookings.map((booking) =>
					booking.id === id
						? { ...booking, isStatusLoading: false }
						: booking,
				),
			);
		}
	};

	const filteredBookings = bookings.filter((booking) => {
		const searchString = searchTerm.toLowerCase();
		const matchesSearch = `
			${booking.ip}
			${booking.flightId}
			${booking.amount}
			${booking.contactInfo.email}
			${booking.contactInfo.phoneNumber}
			${booking.contactInfo.idNumber}
			${booking.airline}
			${booking.departureTime}
			${booking.arrivalTime}
			${booking.from}
			${booking.to}
			${booking.date}
			${booking.flightType}
			${booking.returnDate ?? ''}
			${booking.created_at}
			${booking.status}
		`
			.toLowerCase()
			.includes(searchString);

		const matchesStatus =
			statusFilter === 'all' || booking.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const handleLogout = () => {
		localStorage.removeItem('token');
		window.location.href = '/admin/login';
	};

	if (loading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<div className='h-12 w-12 animate-spin rounded-full border-2 border-gray-900 border-l-transparent border-r-transparent' />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-white'>
			<div className='fixed right-0 top-0 z-50 w-full bg-white px-6 py-3 shadow-md'>
				<div className='mx-auto flex max-w-4xl items-center justify-between'>
					<Link
						to='/admin/dashboard'
						className='inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
					>
						<FontAwesomeIcon icon={faHistory} className='mr-2' />
						Quay lại Trang chủ
					</Link>
					<button
						onClick={handleLogout}
						className='inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
					>
						<FontAwesomeIcon icon={faSignOutAlt} className='mr-2' />
						Đăng Xuất
					</button>
				</div>
			</div>

			<div className='mx-auto max-w-4xl p-6 pt-20'>
				<div className='mb-6 space-y-4'>
					<div className='relative'>
						<input
							type='text'
							placeholder='Tìm kiếm theo: Email, SĐT, CCCD, IP ....'
							className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-500 focus:outline-none'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							autoFocus
						/>
						<FontAwesomeIcon
							icon={faSearch}
							className='absolute right-3 top-3 text-gray-400'
						/>
					</div>

					<div className='flex space-x-4'>
						<label
							className={`inline-flex cursor-pointer items-center rounded-full px-4 py-2 transition-colors ${
								statusFilter === 'all'
									? 'bg-gray-600 text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							<input
								type='radio'
								className='hidden'
								name='status'
								checked={statusFilter === 'all'}
								onChange={() => setStatusFilter('all')}
							/>
							<span>Tất cả ({bookings.length})</span>
						</label>
						<label
							className={`inline-flex cursor-pointer items-center rounded-full px-4 py-2 transition-colors ${
								statusFilter === 'pending'
									? 'bg-gray-600 text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							<input
								type='radio'
								className='hidden'
								name='status'
								checked={statusFilter === 'pending'}
								onChange={() => setStatusFilter('pending')}
							/>
							<span>
								Chưa nhận (
								{
									bookings.filter(
										(b) => b.status === 'pending',
									).length
								}
								)
							</span>
						</label>
						<label
							className={`inline-flex cursor-pointer items-center rounded-full px-4 py-2 transition-colors ${
								statusFilter === 'success'
									? 'bg-gray-600 text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							<input
								type='radio'
								className='hidden'
								name='status'
								checked={statusFilter === 'success'}
								onChange={() => setStatusFilter('success')}
							/>
							<span>
								Đã nhận (
								{
									bookings.filter(
										(b) => b.status === 'success',
									).length
								}
								)
							</span>
						</label>
					</div>
				</div>

				{filteredBookings.length === 0 ? (
					<div className='py-4 text-center text-gray-600'>
						Không tìm thấy
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full border-collapse'>
							<thead>
								<tr className='bg-gray-100'>
									<th className='border p-3 text-left'>IP</th>
									<th className='border p-3 text-left'>
										Thông Tin
									</th>
									<th className='border p-3 text-left'>
										Số Tiền
									</th>
									<th className='border p-3 text-left'>
										Trạng Thái
									</th>
									<th className='border p-3 text-left'>
										Thao Tác
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredBookings.map((booking) => (
									<tr
										key={booking.id}
										className='border-b hover:bg-gray-50'
									>
										<td className='border p-3'>
											{booking.ip}
										</td>
										<td className='border p-3'>
											<div className='space-y-1'>
												<p>
													<span className='font-semibold'>
														Email:
													</span>{' '}
													{booking.contactInfo.email}
												</p>
												<p>
													<span className='font-semibold'>
														SĐT:
													</span>{' '}
													{
														booking.contactInfo
															.phoneNumber
													}
												</p>
												<p>
													<span className='font-semibold'>
														CCCD:
													</span>{' '}
													{
														booking.contactInfo
															.idNumber
													}
												</p>
												<p>
													<span className='font-semibold'>
														Thời gian tạo:
													</span>{' '}
													{formatDateTime(
														booking.created_at,
													)}
												</p>
											</div>
										</td>
										<td className='border p-3'>
											{new Intl.NumberFormat('vi-VN', {
												style: 'currency',
												currency: 'VND',
											}).format(booking.amount)}
										</td>
										<td className='border p-3'>
											{booking.isStatusLoading ? (
												<button className='inline-flex items-center rounded bg-gray-400 px-2 py-1 text-sm text-white'>
													<svg
														className='mr-1 h-4 w-4 animate-spin'
														viewBox='0 0 24 24'
													>
														<circle
															className='opacity-25'
															cx='12'
															cy='12'
															r='10'
															stroke='currentColor'
															strokeWidth='4'
															fill='none'
														/>
														<path
															className='opacity-75'
															fill='currentColor'
															d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
														/>
													</svg>
													Đang gửi Mail...
												</button>
											) : booking.status === 'pending' ? (
												<button
													onClick={() =>
														handleStatusChange(
															booking.id,
															'success',
														)
													}
													className='inline-flex items-center rounded bg-gray-400 px-2 py-1 text-sm text-white hover:bg-gray-500'
													disabled={
														booking.isStatusLoading
													}
												>
													<FontAwesomeIcon
														icon={faTimes}
														className='mr-1'
													/>
													Chưa nhận
												</button>
											) : (
												<button
													onClick={() =>
														handleStatusChange(
															booking.id,
															'pending',
														)
													}
													className='inline-flex items-center rounded bg-gray-600 px-2 py-1 text-sm text-white hover:bg-gray-700'
													disabled={
														booking.isStatusLoading
													}
												>
													<FontAwesomeIcon
														icon={faCheck}
														className='mr-1'
													/>
													Đã nhận
												</button>
											)}
										</td>
										<td className='border p-3'>
											<button
												onClick={() =>
													handleDelete(booking.id)
												}
												className='rounded bg-gray-600 px-2 py-1 text-sm text-white hover:bg-gray-700'
												title='Xóa'
											>
												<FontAwesomeIcon
													icon={faTrash}
													className='mr-1'
												/>
												Xóa
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default GetAllHistory;
