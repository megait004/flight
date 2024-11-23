import {
	faChevronDown,
	faEnvelope,
	faEye,
	faEyeSlash,
	faGear,
	faHistory,
	faKey,
	faPiggyBank,
	faSave,
	faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface WebsiteConfig {
	minPrice: number | null;
	maxPrice: number | null;
	loadingTime: number | null;
}

interface BankInfo {
	bin: string;
	accountNumber: string;
	accountName: string;
}

interface SmtpConfig {
	email: string;
	password: string;
}

interface Bank {
	id: number;
	name: string;
	code: string;
	bin: string;
	shortName: string;
	logo: string;
}

interface BankResponse {
	code: string;
	desc: string;
	data: Bank[];
}

interface CredentialsChange {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
	newUsername: string;
}

const mockApi = {
	fetchWebsiteConfig: async (): Promise<WebsiteConfig> => {
		const response = await axios.get('/api/config');
		return response.data;
	},

	fetchBankInfo: async (): Promise<BankInfo> => {
		const response = await axios.get('/api/bank-info');
		return response.data;
	},

	fetchSmtpConfig: async (): Promise<SmtpConfig> => {
		const response = await axios.get('/api/admin/smtp-config');
		return response.data;
	},

	saveWebsiteConfig: async (config: WebsiteConfig): Promise<void> => {
		await axios.put('/api/admin/config', config);
	},

	saveBankInfo: async (info: BankInfo): Promise<void> => {
		await axios.put('/api/admin/bank-info', info);
	},

	saveSmtpConfig: async (config: SmtpConfig): Promise<void> => {
		await axios.put('/api/admin/smtp-config', config);
	},
};

const BANKS_CACHE_KEY = 'banksData';
const BANKS_CACHE_DURATION = 24 * 60 * 60 * 1000;

interface CachedBanks {
	data: Bank[];
	timestamp: number;
}

const getCachedBanks = (): Bank[] | null => {
	const cached = localStorage.getItem(BANKS_CACHE_KEY);
	if (!cached) return null;

	const { data, timestamp }: CachedBanks = JSON.parse(cached);
	const now = Date.now();

	if (now - timestamp > BANKS_CACHE_DURATION) {
		localStorage.removeItem(BANKS_CACHE_KEY);
		return null;
	}

	return data;
};

const Dashboard: React.FC = () => {
	const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>({
		minPrice: null,
		maxPrice: null,
		loadingTime: null,
	});
	const [bankInfo, setBankInfo] = useState<BankInfo>({
		bin: '',
		accountNumber: '',
		accountName: '',
	});
	const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>({
		email: '',
		password: '',
	});
	const [loading, setLoading] = useState(true);
	const [banks, setBanks] = useState<Bank[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [credentialsData, setCredentialsData] = useState<CredentialsChange>({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
		newUsername: '',
	});
	const [showPasswords, setShowPasswords] = useState({
		currentPassword: false,
		newPassword: false,
		confirmPassword: false,
		smtpPassword: false,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [websiteData, bankData, smtpData] = await Promise.all([
					mockApi.fetchWebsiteConfig(),
					mockApi.fetchBankInfo(),
					mockApi.fetchSmtpConfig(),
				]);

				const cachedBanks = getCachedBanks();
				if (cachedBanks) {
					setBanks(cachedBanks);
				} else {
					const banksResponse = await axios.get(
						'https://api.vietqr.io/v2/banks',
						{
							withCredentials: false,
						},
					);
					const banksData: BankResponse = banksResponse.data;
					setBanks(banksData.data);

					localStorage.setItem(
						BANKS_CACHE_KEY,
						JSON.stringify({
							data: banksData.data,
							timestamp: Date.now(),
						}),
					);
				}

				setWebsiteConfig(websiteData);
				setBankInfo(bankData);
				setSmtpConfig(smtpData);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};

		void fetchData();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest('.relative')) {
				setIsDropdownOpen(false);
			}
		};

		if (isDropdownOpen && searchInputRef.current) {
			searchInputRef.current.focus();
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isDropdownOpen]);

	const handleSaveWebsiteConfig = async () => {
		try {
			const configToSave = {
				minPrice: websiteConfig.minPrice ?? 0,
				maxPrice: websiteConfig.maxPrice ?? 0,
				loadingTime: websiteConfig.loadingTime ?? 0,
			};
			await mockApi.saveWebsiteConfig(configToSave);
			alert('Lưu cấu hình website thành công!');
		} catch (error) {
			console.error('Error saving website config:', error);
			alert('Lưu cấu hình website thất bại');
		}
	};

	const handleSaveBankInfo = async () => {
		try {
			await mockApi.saveBankInfo(bankInfo);
			alert('Lưu thông tin ngân hàng thành công!');
		} catch (error) {
			console.error('Error saving bank info:', error);
			alert('Lưu thông tin ngân hàng thất bại');
		}
	};

	const handleSaveSmtpConfig = async () => {
		try {
			await mockApi.saveSmtpConfig(smtpConfig);
			alert('Lưu cấu hình SMTP thành công!');
		} catch (error) {
			console.error('Error saving SMTP config:', error);
			alert('Lưu cấu hình SMTP thất bại');
		}
	};

	const filteredBanks = banks.filter(
		(bank) =>
			bank.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			bank.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && filteredBanks.length > 0) {
			const firstBank = filteredBanks[0];
			setBankInfo({
				...bankInfo,
				bin: firstBank.bin,
			});
			setIsDropdownOpen(false);
			setSearchTerm('');
		}
	};

	const handleChangeCredentials = async () => {
		if (credentialsData.newPassword !== credentialsData.confirmPassword) {
			alert('Mật khẩu mới không khớp!');
			return;
		}

		if (credentialsData.newPassword.length < 6) {
			alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
			return;
		}

		if (credentialsData.newUsername.length < 3) {
			alert('Tên đăng nhập phải có ít nhất 3 ký tự!');
			return;
		}

		try {
			const response = await axios.put('/api/admin/change-credentials', {
				currentPassword: credentialsData.currentPassword,
				newPassword: credentialsData.newPassword,
				newUsername: credentialsData.newUsername,
			});

			localStorage.setItem('token', response.data.token);

			alert('Cập nhật thông tin đăng nhập thành công!');
			setCredentialsData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
				newUsername: '',
			});
		} catch (error) {
			console.error('Error changing credentials:', error);
			alert('Cập nhật thất bại. Vui lòng kiểm tra lại thông tin.');
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		window.location.href = '/admin/login';
	};

	if (loading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<div className='h-12 w-12 animate-spin rounded-full border-2 border-gray-900 border-l-transparent border-r-transparent' />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-white'>
			<div className='fixed right-0 top-0 z-50 w-full bg-white px-6 py-3 shadow-md'>
				<div className='mx-auto flex max-w-4xl items-center justify-end space-x-4'>
					<Link
						to='/admin/history'
						className='inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
					>
						<FontAwesomeIcon icon={faHistory} className='mr-2' />
						Lịch Sử Đặt Vé
					</Link>
					<button
						onClick={handleLogout}
						className='inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
					>
						<FontAwesomeIcon icon={faSignOutAlt} className='mr-2' />
						Đăng Xuất
					</button>
				</div>
			</div>

			<div className='mx-auto max-w-4xl p-6 pt-20'>
				<div className='mb-6 rounded-lg bg-white p-6 shadow-md'>
					<div className='mb-4 flex items-center'>
						<FontAwesomeIcon
							icon={faGear}
							className='mr-2 text-gray-600'
						/>
						<h2 className='text-xl font-semibold'>
							Cấu Hình Website
						</h2>
					</div>
					<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Giá Tối Thiểu
							</label>
							<input
								type='number'
								value={websiteConfig.minPrice ?? ''}
								onChange={(e) => {
									const value =
										e.target.value === ''
											? null
											: Number(e.target.value);
									setWebsiteConfig({
										...websiteConfig,
										minPrice: value,
									});
								}}
								placeholder='Nhập giá tối thiểu'
								className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:ring-gray-500'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Giá Tối Đa
							</label>
							<input
								type='number'
								value={websiteConfig.maxPrice ?? ''}
								onChange={(e) => {
									const value =
										e.target.value === ''
											? null
											: Number(e.target.value);
									setWebsiteConfig({
										...websiteConfig,
										maxPrice: value,
									});
								}}
								placeholder='Nhập giá tối đa'
								className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:ring-gray-500'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Thời Gian Tải (mili giây)
							</label>
							<input
								type='number'
								value={websiteConfig.loadingTime ?? ''}
								onChange={(e) => {
									const value =
										e.target.value === ''
											? null
											: Number(e.target.value);
									setWebsiteConfig({
										...websiteConfig,
										loadingTime: value,
									});
								}}
								placeholder='Nhập thời gian tải (1000ms = 1 giây)'
								className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:ring-gray-500'
							/>
						</div>
					</div>
					<button
						onClick={handleSaveWebsiteConfig}
						className='mt-4 inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
					>
						<FontAwesomeIcon icon={faSave} className='mr-2' />
						Lưu Cấu Hình
					</button>
				</div>
				<div className='mb-6 rounded-lg bg-white p-6 shadow-md'>
					<div className='mb-4 flex items-center'>
						<FontAwesomeIcon
							icon={faPiggyBank}
							className='mr-2 text-gray-600'
						/>
						<h2 className='text-xl font-semibold'>
							Thông Tin Ngân Hàng
						</h2>
					</div>
					<div className='grid grid-cols-1 gap-4'>
						<div className='relative'>
							<label className='block text-sm font-medium text-gray-700'>
								Tên Ngân Hàng
							</label>
							<div className='relative mt-1'>
								<button
									type='button'
									className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500'
									onClick={() =>
										setIsDropdownOpen(!isDropdownOpen)
									}
								>
									{bankInfo.bin ? (
										<div className='flex items-center justify-between'>
											<span>
												{banks.find(
													(bank) =>
														bank.bin ===
														bankInfo.bin,
												)?.shortName ??
													'Chọn Ngân Hàng'}
											</span>
											<FontAwesomeIcon
												icon={faChevronDown}
												className='ml-2'
											/>
										</div>
									) : (
										'Chọn Ngân Hàng'
									)}
								</button>

								{isDropdownOpen && (
									<div className='absolute z-10 mt-1 max-h-60 w-full overflow-hidden rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
										<div className='sticky top-0 z-10 bg-white px-2 py-1.5'>
											<input
												ref={searchInputRef}
												type='text'
												className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500'
												placeholder='Tìm kiếm ngân hàng...'
												value={searchTerm}
												onChange={(e) =>
													setSearchTerm(
														e.target.value,
													)
												}
												onKeyDown={handleSearchKeyDown}
												onClick={(e) =>
													e.stopPropagation()
												}
											/>
										</div>
										<div className='max-h-48 overflow-auto'>
											{filteredBanks.map((bank) => (
												<div
													key={bank.bin}
													className='flex cursor-pointer items-center px-3 py-2 hover:bg-gray-100'
													onClick={() => {
														setBankInfo({
															...bankInfo,
															bin: bank.bin,
														});
														setIsDropdownOpen(
															false,
														);
														setSearchTerm('');
													}}
												>
													<div className='flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gray-300 bg-white shadow-sm'>
														<img
															src={bank.logo}
															alt={bank.shortName}
															className='object-contain'
														/>
													</div>
													<div className='ml-3'>
														<div className='text-sm font-medium'>
															{bank.shortName}
														</div>
														<div className='text-xs text-gray-500'>
															{bank.name}
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Số Tài Khoản
							</label>
							<input
								type='text'
								value={bankInfo.accountNumber}
								onChange={(e) =>
									setBankInfo({
										...bankInfo,
										accountNumber: e.target.value,
									})
								}
								placeholder='Nhập số tài khoản'
								className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:ring-gray-500'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Tên Chủ Tài Khoản
							</label>
							<input
								type='text'
								value={bankInfo.accountName}
								onChange={(e) =>
									setBankInfo({
										...bankInfo,
										accountName: e.target.value
											.replace(/[^a-zA-Z\s]/g, '')
											.toUpperCase(),
									})
								}
								placeholder='Nhập tên chủ tài khoản'
								className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:ring-gray-500'
							/>
						</div>
					</div>
					<button
						onClick={handleSaveBankInfo}
						className='mt-4 inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
					>
						<FontAwesomeIcon icon={faSave} className='mr-2' />
						Lưu Thông Tin Ngân Hàng
					</button>
				</div>
				<div className='rounded-lg bg-white p-6 shadow-md'>
					<div className='mb-4 flex items-center'>
						<FontAwesomeIcon
							icon={faEnvelope}
							className='mr-2 text-gray-600'
						/>
						<h2 className='text-xl font-semibold'>Cấu Hình SMTP</h2>
					</div>
					<div className='mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700'>
						<p className='font-medium'>
							Hướng dẫn lấy mật khẩu ứng dụng cho Gmail:
						</p>
						<ol className='ml-4 mt-2 list-decimal'>
							<li>
								Truy cập{' '}
								<a
									href='https://myaccount.google.com/apppasswords'
									target='_blank'
									title='Click vào đây để truy cập'
									rel='noopener noreferrer'
									className='font-medium text-gray-900 underline'
								>
									Google App Passwords
								</a>
							</li>
							<li>
								Chọn "Chọn ứng dụng" và chọn "Khác (Tên tùy
								chỉnh)"
							</li>
							<li>Đặt tên cho ứng dụng (ví dụ: "SMTP Mail")</li>
							<li>Nhấn "Tạo" và sao chép mật khẩu được tạo</li>
						</ol>
						<p className='mt-2 font-medium text-gray-900'>
							Lưu ý: Cần bật{' '}
							<a
								href='https://myaccount.google.com/signinoptions/twosv'
								target='_blank'
								title='Click vào đây để truy cập'
								rel='noopener noreferrer'
								className='font-medium text-gray-900 underline'
							>
								2FA
							</a>{' '}
							cho tài khoản Google trước.
						</p>
					</div>
					<div className='grid grid-cols-1 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Email
							</label>
							<input
								type='email'
								value={smtpConfig.email}
								onChange={(e) =>
									setSmtpConfig({
										...smtpConfig,
										email: e.target.value,
									})
								}
								placeholder='Nhập địa chỉ email'
								className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:ring-gray-500'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Mật Khẩu Ứng Dụng
							</label>
							<div className='relative mt-1'>
								<input
									type={
										showPasswords.smtpPassword
											? 'text'
											: 'password'
									}
									value={smtpConfig.password}
									onChange={(e) =>
										setSmtpConfig({
											...smtpConfig,
											password: e.target.value.replace(
												/\s/g,
												'',
											),
										})
									}
									placeholder='Nhập mật khẩu ứng dụng'
									className='block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-gray-500 focus:ring-gray-500'
								/>
								{smtpConfig.password && (
									<button
										type='button'
										onClick={() =>
											setShowPasswords((prev) => ({
												...prev,
												smtpPassword:
													!prev.smtpPassword,
											}))
										}
										className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700'
									>
										<FontAwesomeIcon
											icon={
												showPasswords.smtpPassword
													? faEyeSlash
													: faEye
											}
										/>
									</button>
								)}
							</div>
						</div>
					</div>
					<button
						onClick={handleSaveSmtpConfig}
						className='mt-4 inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
					>
						<FontAwesomeIcon icon={faSave} className='mr-2' />
						Lưu Cấu Hình SMTP
					</button>
				</div>
				<div className='mb-6 rounded-lg bg-white p-6 shadow-md'>
					<div className='mb-4 flex items-center'>
						<FontAwesomeIcon
							icon={faKey}
							className='mr-2 text-gray-600'
						/>
						<h2 className='text-xl font-semibold'>
							Đổi Thông Tin Đăng Nhập
						</h2>
					</div>
					<div className='grid grid-cols-1 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Tên Đăng Nhập Mới
							</label>
							<input
								type='text'
								value={credentialsData.newUsername}
								onChange={(e) =>
									setCredentialsData({
										...credentialsData,
										newUsername: e.target.value,
									})
								}
								placeholder='Nhập tên đăng nhập mới'
								className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:ring-gray-500'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Mật Khẩu Hiện Tại
							</label>
							<div className='relative mt-1'>
								<input
									type={
										showPasswords.currentPassword
											? 'text'
											: 'password'
									}
									value={credentialsData.currentPassword}
									onChange={(e) =>
										setCredentialsData({
											...credentialsData,
											currentPassword: e.target.value,
										})
									}
									placeholder='Nhập mật khẩu hiện tại'
									className='block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-gray-500 focus:ring-gray-500'
								/>
								{credentialsData.currentPassword && (
									<button
										type='button'
										onClick={() =>
											setShowPasswords((prev) => ({
												...prev,
												currentPassword:
													!prev.currentPassword,
											}))
										}
										className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700'
									>
										<FontAwesomeIcon
											icon={
												showPasswords.currentPassword
													? faEyeSlash
													: faEye
											}
										/>
									</button>
								)}
							</div>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Mật Khẩu Mới
							</label>
							<div className='relative mt-1'>
								<input
									type={
										showPasswords.newPassword
											? 'text'
											: 'password'
									}
									value={credentialsData.newPassword}
									onChange={(e) =>
										setCredentialsData({
											...credentialsData,
											newPassword: e.target.value,
										})
									}
									placeholder='Nhập mật khẩu mới'
									className='block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-gray-500 focus:ring-gray-500'
								/>
								{credentialsData.newPassword && (
									<button
										type='button'
										onClick={() =>
											setShowPasswords((prev) => ({
												...prev,
												newPassword: !prev.newPassword,
											}))
										}
										className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700'
									>
										<FontAwesomeIcon
											icon={
												showPasswords.newPassword
													? faEyeSlash
													: faEye
											}
										/>
									</button>
								)}
							</div>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Xác Nhận Mật Khẩu Mới
							</label>
							<div className='relative mt-1'>
								<input
									type={
										showPasswords.confirmPassword
											? 'text'
											: 'password'
									}
									value={credentialsData.confirmPassword}
									onChange={(e) =>
										setCredentialsData({
											...credentialsData,
											confirmPassword: e.target.value,
										})
									}
									placeholder='Nhập lại mật khẩu mới'
									className='block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-gray-500 focus:ring-gray-500'
								/>
								{credentialsData.confirmPassword && (
									<button
										type='button'
										onClick={() =>
											setShowPasswords((prev) => ({
												...prev,
												confirmPassword:
													!prev.confirmPassword,
											}))
										}
										className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700'
									>
										<FontAwesomeIcon
											icon={
												showPasswords.confirmPassword
													? faEyeSlash
													: faEye
											}
										/>
									</button>
								)}
							</div>
						</div>
					</div>
					<button
						onClick={handleChangeCredentials}
						className='mt-4 inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
					>
						<FontAwesomeIcon icon={faSave} className='mr-2' />
						Cập Nhật Thông Tin
					</button>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
