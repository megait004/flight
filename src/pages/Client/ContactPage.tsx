import {
	faEnvelope,
	faLocationDot,
	faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const ContactPage: React.FC = () => {
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		content: '',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log(formData);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<>
			<Helmet>
				<title>Liên hệ - Săn Vé Giá Rẻ 24h</title>
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
						<span className='text-gray-600'>Liên hệ</span>
					</div>
				</div>
			</div>

			<div className='mx-auto max-w-7xl px-4 py-8'>
				<h1 className='mb-8 text-3xl font-bold text-[#003C71]'>
					LIÊN HỆ
				</h1>

				<div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
					<div className='space-y-6'>
						<div className='space-y-4 rounded-lg bg-white p-6 shadow-sm'>
							<h2 className='text-xl font-semibold text-[#003C71]'>
								Thông tin liên hệ
							</h2>

							<div className='flex items-center gap-3'>
								<FontAwesomeIcon
									icon={faLocationDot}
									className='text-[#ff6805]'
								/>
								<div>
									<span className='font-semibold'>
										Trụ sở chính:
									</span>
									<p className='text-gray-600'>
										Tầng 3 toà B, số 2 phố Long Biên 2,
										phường Ngọc Lâm, quận Long Biên, Tp. Hà
										Nội
									</p>
								</div>
							</div>

							<div className='flex items-center gap-3'>
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
										className='ml-2 text-gray-600 hover:text-[#ff6805]'
									>
										024 7109 8963
									</a>
								</div>
							</div>

							<div className='flex items-center gap-3'>
								<FontAwesomeIcon
									icon={faEnvelope}
									className='text-[#ff6805]'
								/>
								<div>
									<span className='font-semibold'>
										Email:
									</span>
									<a
										href='mailto:sanvegiare24h7@gmail.com'
										className='ml-2 text-gray-600 hover:text-[#ff6805]'
									>
										sanvegiare24h7@gmail.com
									</a>
								</div>
							</div>
						</div>

						<div className='rounded-lg bg-white p-6 shadow-sm'>
							<h2 className='mb-4 text-xl font-semibold text-[#003C71]'>
								Bản đồ
							</h2>
							<iframe
								title='map'
								src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8977453149246!2d105.86998937499999!3d21.042935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abd9a3a0b227%3A0x2c7ae8d5f1b6d88c!2zMiBQLiBMb25nIEJpw6puIDIsIE5n4buNYyBMw6JtLCBMb25nIEJpw6puLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1710425547604!5m2!1svi!2s'
								width='100%'
								height='300'
								style={{ border: 0 }}
								allowFullScreen
								loading='lazy'
								referrerPolicy='no-referrer-when-downgrade'
								className='rounded-lg'
							/>
						</div>
					</div>

					<div className='rounded-lg bg-white p-6 shadow-sm'>
						<h2 className='mb-6 text-xl font-semibold text-[#003C71]'>
							ĐIỀN & GỬI LIÊN HỆ
						</h2>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<label
									htmlFor='name'
									className='mb-1 block text-sm font-medium text-gray-700'
								>
									Họ và tên{' '}
									<span className='text-red-500'>*</span>
								</label>
								<input
									type='text'
									id='name'
									name='name'
									value={formData.name}
									onChange={handleChange}
									className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#ff6805] focus:outline-none'
									placeholder='Nhập họ và tên'
									required
								/>
							</div>

							<div>
								<label
									htmlFor='phone'
									className='mb-1 block text-sm font-medium text-gray-700'
								>
									Số điện thoại{' '}
									<span className='text-red-500'>*</span>
								</label>
								<input
									type='tel'
									id='phone'
									name='phone'
									value={formData.phone}
									onChange={handleChange}
									className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#ff6805] focus:outline-none'
									placeholder='Nhập số điện thoại'
									required
								/>
							</div>

							<div>
								<label
									htmlFor='email'
									className='mb-1 block text-sm font-medium text-gray-700'
								>
									Email{' '}
									<span className='text-red-500'>*</span>
								</label>
								<input
									type='email'
									id='email'
									name='email'
									value={formData.email}
									onChange={handleChange}
									className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#ff6805] focus:outline-none'
									placeholder='Nhập địa chỉ email'
									required
								/>
							</div>

							<div>
								<label
									htmlFor='content'
									className='mb-1 block text-sm font-medium text-gray-700'
								>
									Nội dung{' '}
									<span className='text-red-500'>*</span>
								</label>
								<textarea
									id='content'
									name='content'
									value={formData.content}
									onChange={handleChange}
									rows={4}
									className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#ff6805] focus:outline-none'
									placeholder='Nhập nội dung tin nhắn'
									required
								></textarea>
							</div>

							<button
								type='submit'
								className='w-full rounded-lg bg-[#ff6805] px-6 py-3 font-medium text-white transition-all hover:bg-[#ff8534] active:scale-[0.98] active:bg-[#ff6805]'
							>
								Gửi liên hệ
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default ContactPage;
