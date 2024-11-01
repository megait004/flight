import Logo from '@assets/images/logo.png';
import {
	faBars,
	faHeadphones,
	faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	const navigationLinks = [
		{ name: 'Vé máy bay', href: '/' },
		{ name: 'Giới thiệu', href: '/gioi-thieu' },
		{ name: 'Liên hệ', href: '/lien-he' },
	];

	return (
		<>
			<div className='sticky top-0 z-40 flex items-center justify-between bg-white p-2 px-6 shadow-sm'>
				<div className='container mx-auto flex items-center justify-between'>
					<Link to='/'>
						<img
							src={Logo}
							alt='logo'
							className='max-h-10 sm:max-h-20'
						/>
					</Link>
					<div className='hidden gap-7 text-lg font-bold text-[#303642] md:flex'>
						{navigationLinks.map((link) => (
							<Link
								key={link.name}
								to={link.href}
								className='transition-colors hover:text-[#ff6805]'
							>
								{link.name}
							</Link>
						))}
					</div>

					<div className='hidden items-center gap-2 md:flex'>
						<FontAwesomeIcon
							icon={faHeadphones}
							className='text-3xl text-[#e03e2d]'
						/>
						<div className='flex flex-col text-xl'>
							<p className='text-sm font-normal leading-none text-gray-500'>
								Hỗ trợ 24/7
							</p>
							<a
								href='tel:02471098963'
								className='font-bold leading-none text-[#e03e2d]'
							>
								024 7109 8963
							</a>
						</div>
					</div>
				</div>
				<button
					className='text-2xl text-[#303642] md:hidden'
					onClick={() => setIsOpen(true)}
				>
					<FontAwesomeIcon icon={faBars} />
				</button>
			</div>
			<div
				className={`fixed inset-0 z-50 transform transition-all duration-300 ease-in-out md:hidden ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div
					className={`fixed inset-0 bg-black transition-opacity ${
						isOpen ? 'opacity-20' : 'pointer-events-none opacity-0'
					}`}
					onClick={() => setIsOpen(false)}
				/>
				<div className='fixed right-0 top-0 h-full w-64 bg-white p-6 shadow-xl'>
					<div className='flex justify-end'>
						<button
							className='text-2xl text-[#303642]'
							onClick={() => setIsOpen(false)}
						>
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</div>

					<div className='mt-8 flex flex-col gap-6'>
						{navigationLinks.map((link) => (
							<Link
								key={link.name}
								to={link.href}
								className='text-lg font-bold text-[#303642] transition-colors hover:text-[#ff6805]'
								onClick={() => setIsOpen(false)}
							>
								{link.name}
							</Link>
						))}
						<div className='mt-4 flex items-center gap-2'>
							<FontAwesomeIcon
								icon={faHeadphones}
								className='text-2xl text-[#e03e2d]'
							/>
							<div className='flex flex-col'>
								<p className='text-sm font-normal leading-none text-gray-500'>
									Hỗ trợ 24/7
								</p>
								<a
									href='tel:02471098963'
									className='font-bold leading-none text-[#e03e2d]'
								>
									024 7109 8963
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Header;
