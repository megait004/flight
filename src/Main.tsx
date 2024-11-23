import '@assets/styles/App.css';
import NotPaidProvider from '@pages/Client/NotPaidProvider';
import AppRouter from '@routes/AppRouter';
import axios from 'axios';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	const isAdminRoute = config.url?.includes('/admin');

	if (token && isAdminRoute) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<NotPaidProvider date='12:00 24/11/2024'>
			<HelmetProvider>
				<BrowserRouter>
					<AppRouter />
				</BrowserRouter>
			</HelmetProvider>
		</NotPaidProvider>
	</StrictMode>,
);
