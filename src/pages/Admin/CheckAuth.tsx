import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const CheckAuth: React.FC = () => {
	useEffect(() => {
		console.log('CheckAuth');
	}, []);
	return (
		<>
			<h1>CheckAuth</h1>
			<Outlet />
		</>
	);
};

export default CheckAuth;
