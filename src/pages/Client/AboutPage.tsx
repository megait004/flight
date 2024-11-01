import {
	faEnvelope,
	faLocationDot,
	faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
	const sidebarLinks = [
		'Giới thiệu',
		'Hướng dẫn thanh toán',
		'Hướng dẫn đặt vé',
		'Chính sách hoàn tiền',
		'Chính sách đại lý',
		'Chính sách bảo mật',
		'Điều khoản & điều kiện',
		'Câu hỏi thường gặp',
		'Liên hệ',
	];

	return (
		<>
			<Helmet>
				<title>Giới thiệu - Săn Vé Giá Rẻ 24h</title>
			</Helmet>

			<div className='bg-gray-100 py-4'>
				<div className='mx-auto max-w-7xl px-4'>
					<div className='flex items-center gap-2 text-sm'>
						<Link
							to='/'
							className='text-blue-600 hover:text-blue-800'
						>
							Trang chủ
						</Link>
						<span>/</span>
						<span className='text-gray-600'>Giới thiệu</span>
					</div>
				</div>
			</div>

			<div className='mx-auto max-w-7xl px-4 py-8'>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
					<div className='md:col-span-1'>
						<div className='rounded-lg bg-white shadow-sm'>
							{sidebarLinks.map((link) => (
								<p
									key={link}
									className={`block cursor-pointer px-4 py-3 font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-50 hover:text-[#ff6805] hover:underline`}
								>
									{link}
								</p>
							))}
						</div>
					</div>

					<div className='md:col-span-3'>
						<h1 className='mb-6 text-3xl font-bold text-[#003C71]'>
							GIỚI THIỆU
						</h1>

						<div className='space-y-6 rounded-lg bg-white p-6 text-gray-600 shadow-sm'>
							<p className='leading-relaxed'>
								Được thành lập năm 2016, với đội ngũ sáng lập
								trẻ và tài năng, những thành viên có bề dày kinh
								nghiệm trong thị trường dịch vụ du lịch.
							</p>
							<div className='leading-relaxed'>
								<p>
									Hiện nay,{' '}
									<span className='font-semibold text-[#003C71]'>
										Săn Vé Giá Rẻ 24h
									</span>{' '}
									là doanh nghiệp hoạt động theo mô hình đại
									lý du lịch trực tuyến - chuyên cung cấp các
									dịch vụ du lịch như vé máy bay, khách sạn,
									visa, ...
								</p>
							</div>

							<div className='leading-relaxed'>
								<p>
									Riêng lĩnh vực vé máy bay,{' '}
									<span className='font-semibold text-[#003C71]'>
										Săn Vé Giá Rẻ 24h
									</span>{' '}
									hiện là đại lý cấp 1 của các hãng nội địa và
									một số hãng hàng không quốc tế, đảm bảo giúp
									bạn tìm được chuyến bay phù hợp nhất với giá
									vé tốt nhất.
								</p>
							</div>

							<div className='leading-relaxed'>
								<p>
									Đặc biệt,{' '}
									<span className='font-semibold text-[#003C71]'>
										Săn Vé Giá Rẻ 24h
									</span>{' '}
									còn chuyên thiết kế các chương trình du lịch
									Free & Easy, là loại hình du lịch kết hợp
									giữa các dịch vụ hàng không và các dịch vụ
									lưu trú nhằm đem đến cho bạn những sản phẩm
									trọn gói và thuận tiện nhất. Hình thức du
									lịch này sẽ giúp bạn giảm chi phí thấp hơn
									rất nhiều so với mức giá khi bạn mua dịch vụ
									lẻ. Đây là loại hình du lịch thích hợp cho
									những du khách thích đi du lịch tự do, ưa
									thích khám phá.
								</p>
							</div>

							<div className='leading-relaxed'>
								<p>
									Ngoài ra,{' '}
									<span className='font-semibold text-[#003C71]'>
										Săn Vé Giá Rẻ 24h
									</span>{' '}
									còn là cổng thông tin về du lịch, chia sẻ
									mọi mặt mà cộng đồng mê dịch chuyển quan
									tâm.
								</p>
							</div>
						</div>

						<div className='mt-8 space-y-4 rounded-lg bg-gray-50 p-6 shadow-sm'>
							<div className='flex items-center gap-2'>
								<FontAwesomeIcon
									icon={faLocationDot}
									className='text-[#ff6805]'
								/>
								<div>
									<span className='font-semibold'>
										Trụ sở chính:
									</span>
									<span className='ml-2'>
										Tầng 3 toà B, số 2 phố Long Biên 2,
										phường Ngọc Lâm, quận Long Biên, Tp. Hà
										Nội
									</span>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								<FontAwesomeIcon
									icon={faPhone}
									className='text-[#ff6805]'
								/>
								<div>
									<span className='font-semibold'>
										Hotline:
									</span>
									<a
										href='tel:024 7109 8963'
										className='ml-2 hover:text-[#ff6805]'
									>
										024 7109 8963
									</a>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								<FontAwesomeIcon
									icon={faEnvelope}
									className='text-[#ff6805]'
								/>
								<div>
									<span className='font-semibold'>
										E-mail:
									</span>
									<a
										href='mailto:noreply@sanvegiare24h7.com'
										className='ml-2 hover:text-[#ff6805]'
									>
										noreply@sanvegiare24h7.com
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AboutPage;
