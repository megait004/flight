import AdminNotFound from '@pages/Admin/AdminNotFound';
import CheckAuth from '@pages/Admin/CheckAuth';
import Dashboard from '@pages/Admin/Dashboard';
import Login from '@pages/Admin/Login';
import AboutPage from '@pages/Client/AboutPage';
import ContactPage from '@pages/Client/ContactPage';
import FlightSearchResults from '@pages/Client/FlightSearchResults';
import Index from '@pages/Client/Index/Index';
import Layout from '@pages/Client/Layout';
import PaymentPage from '../pages/Client/Payment/PaymentPage';

import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const AppRouter: React.FC = () => {
	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route index element={<Index />} />
				<Route path='gioi-thieu' element={<AboutPage />} />
				<Route path='lien-he' element={<ContactPage />} />
				<Route
					path='tim-chuyen-bay'
					element={<FlightSearchResults />}
				/>
				<Route path='payment' element={<PaymentPage />} />
				<Route path='*' element={<Navigate to='/' />} />
			</Route>
			<Route path='/admin' element={<CheckAuth />}>
				<Route index element={<Dashboard />} />
				<Route path='login' element={<Login />} />
				<Route path='*' element={<AdminNotFound />} />
			</Route>
		</Routes>
	);
};

export default AppRouter;
