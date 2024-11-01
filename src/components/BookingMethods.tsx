import React from 'react';
import { FaPhone } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { IoEarth } from 'react-icons/io5';

const BookingMethods: React.FC = () => {
	return (
		<div className='bg-gray-100 p-4'>
			<h2 className='mb-6 text-xl font-bold'>
				Mua vé máy bay bằng các hình thức
			</h2>
			<div className='space-y-4 rounded-lg bg-white p-4'>
				<div className='flex items-center gap-2'>
					<span className='font-bold'>1.</span>
					<IoEarth className='text-blue-600' />
					<span>Trực tiếp lên website, nhanh nhất - tiện nhất</span>
				</div>

				<div className='flex items-center gap-2'>
					<span className='font-bold'>2.</span>
					<FaPhone className='text-blue-600' />
					<span>Gọi điện thoại cho SĂN VÉ GIÁ RẺ 24h</span>
				</div>
				<div className='ml-6 flex items-center gap-2'>
					<span>Hotline:</span>
					<a
						href='tel:024 7109 8963'
						className='font-bold text-red-500'
					>
						024 7109 8963
					</a>
				</div>

				<div className='flex items-center gap-2'>
					<span className='font-bold'>3.</span>
					<FaLocationDot className='text-blue-600' />
					<span>Đến trực tiếp văn phòng SĂN VÉ GIÁ RẺ 24h</span>
				</div>
				<div className='ml-6'>
					<div className='inline-block rounded-lg bg-[#E8F4FB] p-4'>
						<p>2 P. Long Biên 2</p>
						<p className='cursor-pointer text-sm text-blue-600 hover:underline'>
							Xem bản đồ lớn hơn
						</p>
					</div>
				</div>
			</div>
			<div className='mt-4 flex items-center justify-center p-4'>
				<iframe
					title='map'
					src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8977453149246!2d105.85999831476287!3d21.042235785992897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abb158a2305d%3A0x5c357d21c785ea3d!2zMiBQLiBMb25nIEJpw6puIDIsIE5n4buNYyBMw6JtLCBMb25nIEJpw6puLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1647916732247!5m2!1svi!2s'
					allowFullScreen
					loading='lazy'
					referrerPolicy='no-referrer-when-downgrade'
					className='w-full rounded-lg'
				></iframe>
			</div>
		</div>
	);
};

export default BookingMethods;
