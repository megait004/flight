import {
	faEye,
	faEyeSlash,
	faLock,
	faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { FormEvent, useState } from 'react';

interface LoginFormData {
	username: string;
	password: string;
}

const Login = () => {
	const [formData, setFormData] = useState<LoginFormData>({
		username: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<Partial<LoginFormData>>({});
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const newErrors: Partial<LoginFormData> = {};

		if (!formData.username.trim()) {
			newErrors.username = 'Vui lòng nhập tên đăng nhập';
		}
		if (!formData.password) {
			newErrors.password = 'Vui lòng nhập mật khẩu';
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			const response = await axios.post('/api/admin/login', formData);
			if (response.data.token) {
				localStorage.setItem('token', response.data.token);
				window.location.reload();
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 401) {
					setErrors({
						username: 'Sai tên đăng nhập hoặc mật khẩu',
						password: 'Sai tên đăng nhập hoặc mật khẩu',
					});
				}
			}
		}
	};

	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8'>
			<div className='w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg'>
				<div className='text-center'>
					<img
						src='https://github.com/ovftank.png'
						alt='Logo Công ty'
						className='mx-auto h-12 w-auto'
					/>
					<h2 className='mt-6 text-3xl font-bold text-gray-900'>
						Chào mừng trở lại
					</h2>
				</div>
				<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
					<div className='space-y-4'>
						<div>
							<div className='relative'>
								<span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
									<FontAwesomeIcon icon={faUser} />
								</span>
								<input
									type='text'
									id='username'
									value={formData.username}
									onChange={(e) => {
										setFormData({
											...formData,
											username: e.target.value,
										});
										if (errors.username) {
											setErrors({
												...errors,
												username: undefined,
											});
										}
									}}
									className={`w-full border py-2 pl-10 pr-3 ${
										errors.username
											? 'border-red-500'
											: 'border-gray-300'
									} rounded-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-500`}
									placeholder='Tên đăng nhập'
									autoFocus
								/>
							</div>
							{errors.username && (
								<p className='mt-1 text-sm text-red-500'>
									{errors.username}
								</p>
							)}
						</div>

						<div>
							<div className='relative'>
								<span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
									<FontAwesomeIcon icon={faLock} />
								</span>
								<input
									type={showPassword ? 'text' : 'password'}
									id='password'
									value={formData.password}
									onChange={(e) => {
										setFormData({
											...formData,
											password: e.target.value,
										});
										if (errors.password) {
											setErrors({
												...errors,
												password: undefined,
											});
										}
									}}
									className={`w-full border py-2 pl-10 pr-10 ${
										errors.password
											? 'border-red-500'
											: 'border-gray-300'
									} rounded-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-500`}
									placeholder='Mật khẩu'
								/>
								<button
									type='button'
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
								>
									<FontAwesomeIcon
										icon={showPassword ? faEyeSlash : faEye}
									/>
								</button>
							</div>
							{errors.password && (
								<p className='mt-1 text-sm text-red-500'>
									{errors.password}
								</p>
							)}
						</div>
					</div>
					<div>
						<button
							type='submit'
							className='flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
						>
							Đăng nhập
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
