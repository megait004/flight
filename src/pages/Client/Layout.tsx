import favicon from '@assets/images/favicon.png';
import Footer from '@components/Footer';
import Header from '@components/Header';
import Partners from '@components/Partners';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
	return (
		<>
			<Helmet>
				<title>Trang chủ - Săn Vé Giá Rẻ 24h</title>
				<link rel='icon' href={favicon} type='image/png' />
			</Helmet>
			<Header />
			<Outlet />
			<Partners />
			<Footer />
		</>
	);
};

export default Layout;
