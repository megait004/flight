import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Lazy load all components
const Layout = React.lazy(() => import('@pages/Client/Layout'));
const Index = React.lazy(() => import('@pages/Client/Index'));
const AboutPage = React.lazy(() => import('@pages/Client/AboutPage'));
const ContactPage = React.lazy(() => import('@pages/Client/ContactPage'));
const FlightSearchResults = React.lazy(
	() => import('@pages/Client/FlightSearchResults'),
);
const PaymentPage = React.lazy(() => import('@pages/Client/PaymentPage'));
const HistoryPage = React.lazy(() => import('@pages/Client/HistoryPage'));

// Admin components
const CheckAuth = React.lazy(() => import('@pages/Admin/CheckAuth'));
const Dashboard = React.lazy(() => import('@pages/Admin/Dashboard'));
const GetAllHistory = React.lazy(() => import('@pages/Admin/GetAllHistory'));
const Login = React.lazy(() => import('@pages/Admin/Login'));
const AdminNotFound = React.lazy(() => import('@pages/Admin/AdminNotFound'));

// Loading component
const LoadingSpinner: React.FC = () => (
	<div className='flex min-h-screen items-center justify-center'>
		<div className='h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500'></div>
	</div>
);

const AppRouter: React.FC = () => {
	return (
		<Suspense fallback={<LoadingSpinner />}>
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
					<Route
						path='tra-cuu-lich-su-dat-ve'
						element={<HistoryPage />}
					/>
					<Route path='*' element={<Navigate to='/' />} />
				</Route>
				<Route path='/admin' element={<CheckAuth />}>
					<Route index element={<Dashboard />} />
					<Route path='history' element={<GetAllHistory />} />
					<Route path='login' element={<Login />} />
					<Route path='*' element={<AdminNotFound />} />
				</Route>
			</Routes>
		</Suspense>
	);
};

export default AppRouter;
