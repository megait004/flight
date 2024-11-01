import React from 'react';

const PaymentMethods: React.FC = () => {
	const banks = [
		{ name: 'VPBank', logo: '/banks/vpbank.png' },
		{ name: 'Techcombank', logo: '/banks/techcombank.png' },
		{ name: 'DongA Bank', logo: '/banks/donga.png' },
		{ name: 'ACB', logo: '/banks/acb.png' },
		{ name: 'Maritime Bank', logo: '/banks/msb.png' },
		{ name: 'HDBank', logo: '/banks/hdbank.png' },
		{ name: 'Vietinbank', logo: '/banks/vietinbank.png' },
		{ name: 'Vietcombank', logo: '/banks/vietcombank.png' },
		{ name: 'Sacombank', logo: '/banks/sacombank.png' },
		{ name: 'BIDV', logo: '/banks/bidv.png' },
	];

	return (
		<div className='bg-gray-100 p-4'>
			<h2 className='mb-6 text-xl font-bold'>Các hình thức thanh toán</h2>
			<div className='space-y-4'>
				<div className='flex items-start gap-4 rounded-lg bg-white p-4'>
					<div className='mt-1'>
						<img
							src='/icons/money.png'
							alt='Office'
							className='h-8 w-8'
						/>
					</div>
					<div>
						<h3 className='font-bold text-gray-800'>
							THANH TOÁN BẰNG TIỀN MẶT TẠI VĂN PHÒNG CHÚNG TÔI
						</h3>
						<p className='mt-1 text-gray-600'>
							Sau khi đặt hàng thành công, Quý khách vui lòng qua
							văn phòng{' '}
							<span className='text-blue-600'>
								{window.location.host.split(':')[0]}
							</span>{' '}
							để thanh toán và nhận vé.
						</p>
					</div>
				</div>
				<div className='flex items-start gap-4 rounded-lg bg-white p-4'>
					<div className='mt-1'>
						<img
							src='/icons/home.png'
							alt='Home'
							className='h-8 w-8'
						/>
					</div>
					<div>
						<h3 className='font-bold text-gray-800'>
							THANH TOÁN TẠI NHÀ
						</h3>
						<p className='mt-1 text-gray-600'>
							Nhân viên{' '}
							<span className='text-blue-600'>
								{window.location.host.split(':')[0]}
							</span>{' '}
							sẽ giao vé & thu tiền tại nhà theo địa chỉ Quý khách
							cung cấp.
						</p>
					</div>
				</div>

				<div className='flex items-start gap-4 rounded-lg bg-white p-4'>
					<div className='mt-1'>
						<img
							src='/icons/bank.png'
							alt='Bank'
							className='h-8 w-8'
						/>
					</div>
					<div>
						<h3 className='font-bold text-gray-800'>
							THANH TOÁN QUA CHUYỂN KHOẢN
						</h3>
						<p className='mt-1 text-gray-600'>
							Quý khách có thể thanh toán cho chúng tôi bằng cách
							chuyển khoản tại ngân hàng, chuyển qua thẻ ATM, hoặc
							qua Internet banking.
						</p>
					</div>
				</div>
				<div className='rounded-lg bg-white p-4'>
					<div className='grid grid-cols-5 gap-4'>
						{banks.map((bank) => (
							<img
								key={bank.name}
								src={bank.logo}
								alt={bank.name}
								className='h-8 object-contain'
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentMethods;
