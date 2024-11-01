import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminNotFound: React.FC = () => {
	const navigate = useNavigate();
	useEffect(() => {
		navigate('/admin');
	}, [navigate]);
	return <>AdminNotFound</>;
};

export default AdminNotFound;
