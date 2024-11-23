import favicon from '@assets/images/favicon.png';
import Footer from '@components/Footer';
import Header from '@components/Header';
import Partners from '@components/Partners';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
interface Data {
	address: string;
	email: string;
	hotline: string;
	name: string;
}
const Layout: React.FC = () => {
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
	return (
		<>
			<Helmet>
				<title>Trang chủ - {data.name}</title>
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
