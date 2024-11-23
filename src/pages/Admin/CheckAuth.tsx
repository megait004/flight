import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
interface Data {
	address: string;
	email: string;
	hotline: string;
	name: string;
}
const CheckAuth: React.FC = () => {
	const [isMobile, setIsMobile] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
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
	useEffect(() => {
		const token = localStorage.getItem('token');
		const checkAuth = async () => {
			if (!token) {
				navigate('/admin/login');
				return;
			}
			try {
				const response = await axios.get('/api/admin/check-auth', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (!response.data.token) {
					navigate('/admin/login');
				} else if (location.pathname === '/admin/login') {
					navigate('/admin');
				}
			} catch (error) {
				if (axios.isAxiosError(error)) {
					if (error.response?.status === 401) {
						navigate('/admin/login');
					}
				}
			}
		};
		if (window.innerWidth > 768) {
			checkAuth();
		}
		window.addEventListener('resize', () => {
			setIsMobile(window.innerWidth < 768);
		});
		return () => {
			window.removeEventListener('resize', () => {});
		};
	}, [navigate, location.pathname]);

	return (
		<>
			<Helmet>
				<title>Admin | {data.name}</title>
				<link
					rel='shortcut icon'
					href='https://github.com/ovftank.png'
					type='image/png'
				/>
			</Helmet>
			{isMobile ? (
				<div className='flex h-screen items-center justify-center text-center text-3xl'>
					Vui lòng sử dụng máy tính để truy cập
				</div>
			) : (
				<Outlet />
			)}
		</>
	);
};

export default CheckAuth;
