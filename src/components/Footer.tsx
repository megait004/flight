import {
	faEnvelope,
	faHeadphones,
	faLocationDot,
	faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
interface Data {
	address: string;
	email: string;
	hotline: string;
	name: string;
}
const Footer: React.FC = () => {
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
	const footerLinks = {
		about: [
			{ name: 'Giới thiệu', href: '/gioi-thieu' },
			{ name: 'Tin tức', href: '/tin-tuc' },
			{ name: 'Tin khuyến mãi', href: '/khuyen-mai' },
			{ name: 'Câu hỏi thường gặp', href: '/faq' },
		],
		help: [
			{ name: 'Hướng dẫn thanh toán', href: '/huong-dan-thanh-toan' },
			{ name: 'Hướng dẫn đặt vé', href: '/huong-dan-dat-ve' },
			{ name: 'Chính sách hoàn tiền', href: '/chinh-sach-hoan-tien' },
			{ name: 'Điều khoản & điều kiện', href: '/dieu-khoan' },
		],
	};

	return (
		<footer className='bg-gradient-to-b from-[#2B3990] to-[#1a2255] py-8 text-white'>
			<div className='mx-auto max-w-7xl px-4'>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
					<div>
						<h3 className='mb-4 text-lg font-bold'>Liên hệ</h3>
						<div className='space-y-2'>
							<div className='flex items-center gap-2'>
								<FontAwesomeIcon
									icon={faHeadphones}
									className='text-[#ff6805]'
								/>
								<a
									href='tel:02471098963'
									className='hover:text-[#ff6805]'
								>
									{data.hotline}
								</a>
							</div>
							<div className='flex items-center gap-2'>
								<FontAwesomeIcon
									icon={faEnvelope}
									className='text-[#ff6805]'
								/>
								<a
									href={`mailto:${data.email}`}
									className='hover:text-[#ff6805]'
								>
									{data.email}
								</a>
							</div>
						</div>
					</div>

					<div>
						<h3 className='mb-4 text-lg font-bold'>Về chúng tôi</h3>
						<ul className='space-y-2'>
							{footerLinks.about.map((link) => (
								<li key={link.name}>
									<Link
										to={link.href}
										className='hover:text-[#ff6805]'
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className='mb-4 text-lg font-bold'>Trợ giúp</h3>
						<ul className='space-y-2'>
							{footerLinks.help.map((link) => (
								<li key={link.name}>
									<Link
										to={link.href}
										className='hover:text-[#ff6805]'
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className='mb-4 text-lg font-bold'>
							Thông tin công ty
						</h3>
						<div className='space-y-2 text-sm'>
							<p>{data.name}</p>
							<div className='flex items-center gap-2'>
								<FontAwesomeIcon
									icon={faLocationDot}
									className='text-[#ff6805]'
								/>
								<p>{data.address}</p>
							</div>
							<div className='flex items-center gap-2'>
								<FontAwesomeIcon
									icon={faPhone}
									className='text-[#ff6805]'
								/>
								<p>{data.hotline}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
