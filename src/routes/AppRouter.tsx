import AdminNotFound from '@pages/Admin/AdminNotFound';
import CheckAuth from '@pages/Admin/CheckAuth';
import Dashboard from '@pages/Admin/Dashboard';
import Login from '@pages/Admin/Login';
import Index from '@pages/Client/Index/Index';
import Layout from '@pages/Client/Layout';
import NotFound from '@pages/NotFound';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const AppRouter: React.FC = () => {
	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route index element={<Index />} />
				<Route path='*' element={<NotFound />} />
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
