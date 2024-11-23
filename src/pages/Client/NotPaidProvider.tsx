import { FC, ReactNode } from 'react';

interface NotPaidProviderProps {
	children: ReactNode;
	date?: string;
}

const NotPaidProvider: FC<NotPaidProviderProps> = ({ children, date = '' }) => {
	const currentDate = new Date();

	const parseVietnameseDate = (dateStr: string): Date => {
		if (!dateStr) return new Date(0);
		const [timePart = '00:00', datePart] = dateStr.split(' ');
		const [hours, minutes] = timePart.split(':').map(Number);
		const [day, month, year] = datePart.split('/').map(Number);

		return new Date(year, month - 1, day, hours, minutes);
	};

	const expiredDate = parseVietnameseDate(date);

	if (expiredDate < currentDate) {
		return (
			<div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-95'>
				<div className='max-w-md p-6 text-center text-white'>
					<h2 className='mb-4 text-xl font-semibold'>
						Trang web đã hết hạn
					</h2>
					<p className='mb-4'>
						Để tiếp tục vui lòng liên hệ tele:{' '}
						<a
							href='https://t.me/ovftank'
							target='_blank'
							rel='noopener noreferrer'
							className='text-blue-400 underline hover:text-blue-300'
						>
							@ovftank
						</a>
					</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
};

export default NotPaidProvider;
