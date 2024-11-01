import '@assets/styles/App.css';
import AppRouter from '@routes/AppRouter';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<HelmetProvider>
			<BrowserRouter>
				<AppRouter />
			</BrowserRouter>
		</HelmetProvider>
	</StrictMode>,
);
