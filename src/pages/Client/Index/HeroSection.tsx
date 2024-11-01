import Banner from '@assets/images/hero-image.jpg';
import {
	faArrowRightArrowLeft,
	faBaby,
	faCalendar,
	faChild,
	faLocationDot,
	faMagnifyingGlass,
	faMinus,
	faPlus,
	faTimes,
	faUser,
	faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addDays, format } from 'date-fns';
import { vi } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

type Region = {
	name: string;
	locations: Location[];
};

type Country = {
	name: string;
	regions: Region[];
};

type Location = {
	city: string;
	code: string;
};

const COUNTRIES: Country[] = [
	{
		name: 'Việt Nam',
		regions: [
			{
				name: 'MIỀN BẮC',
				locations: [
					{ city: 'Điện Biên Phủ', code: 'DBP' },
					{ city: 'Hà Nội', code: 'HAN' },
					{ city: 'Hải Phòng', code: 'HPH' },
					{ city: 'Vân Đồn', code: 'VDO' },
				],
			},
			{
				name: 'MIỀN NAM',
				locations: [
					{ city: 'Hồ Chí Minh', code: 'SGN' },
					{ city: 'Cà Mau', code: 'CAH' },
					{ city: 'Phú Quốc', code: 'PQC' },
					{ city: 'Cần Thơ', code: 'VCA' },
					{ city: 'Côn Đảo', code: 'VCS' },
					{ city: 'Kiên Giang', code: 'KGG' },
				],
			},
			{
				name: 'MIỀN TRUNG',
				locations: [
					{ city: 'Ban Mê Thuột', code: 'BMV' },
					{ city: 'Nha Trang', code: 'CXR' },
					{ city: 'Đà Nẵng', code: 'DAD' },
					{ city: 'Đà Lạt', code: 'DLI' },
					{ city: 'Huế', code: 'HUI' },
					{ city: 'Pleiku', code: 'PXU' },
					{ city: 'Tuy Hòa', code: 'TBB' },
					{ city: 'Thanh Hóa', code: 'THD' },
					{ city: 'Quy Nhơn', code: 'UIH' },
					{ city: 'Chu Lai', code: 'VCL' },
					{ city: 'Quảng Bình', code: 'VCS' },
					{ city: 'Vinh', code: 'VII' },
				],
			},
		],
	},
	{
		name: 'Châu Á',
		regions: [
			{
				name: 'ĐÔNG NAM Á',
				locations: [
					{ city: 'Bangkok', code: 'BKK' },
					{ city: 'Bali / Denpasar', code: 'DPS' },
					{ city: 'Buri Ram', code: 'BFV' },
					{ city: 'Chiang Mai', code: 'CNX' },
					{ city: 'Bandar Seri Begawan', code: 'BWN' },
					{ city: 'Luang Prabang', code: 'LPQ' },
					{ city: 'Phnom Penh', code: 'PNH' },
					{ city: 'Siem Reap', code: 'REP' },
					{ city: 'Vientiane', code: 'VTE' },
					{ city: 'Pattaya', code: 'UTP' },
					{ city: 'Phuket', code: 'HKT' },
					{ city: 'Jakarta', code: 'CGK' },
					{ city: 'Kuala Lumpur', code: 'KUL' },
					{ city: 'Cebu', code: 'CEB' },
					{ city: 'Manila', code: 'MNL' },
					{ city: 'Penang', code: 'PEN' },
					{ city: 'Singapore', code: 'SIN' },
					{ city: 'Yangon', code: 'RGN' },
					{ city: 'Xieng Khouang', code: 'XKH' },
				],
			},
			{
				name: 'ĐÔNG BẮC Á',
				locations: [
					{ city: 'Beijing', code: 'PEK' },
					{ city: 'Busan', code: 'PUS' },
					{ city: 'Chengdu', code: 'CTU' },
					{ city: 'Fukuoka', code: 'FUK' },
					{ city: 'Guangzhou', code: 'CAN' },
					{ city: 'Hong Kong', code: 'HKG' },
					{ city: 'Ma Cao', code: 'MFM' },
					{ city: 'Kaohsiung', code: 'KHH' },
					{ city: 'Đài Nam', code: 'TNN' },
					{ city: 'Đài Trung', code: 'RMQ' },
					{ city: 'Nagoya', code: 'NGO' },
					{ city: 'Osaka', code: 'KIX' },
					{ city: 'Seoul', code: 'ICN' },
					{ city: 'Jeju', code: 'CJU' },
					{ city: 'Shanghai', code: 'PVG' },
					{ city: 'Taipei', code: 'TPE' },
					{ city: 'Tokyo Haneda', code: 'HND' },
					{ city: 'Tokyo Narita', code: 'NRT' },
					{ city: 'Fukuoka', code: 'FUK' },
				],
			},
		],
	},
	{
		name: 'Châu Úc',
		regions: [
			{
				name: 'ÚC',
				locations: [
					{ city: 'Melbourne', code: 'MEL' },
					{ city: 'Sydney', code: 'SYD' },
					{ city: 'Adelaide', code: 'ADL' },
					{ city: 'Brisbane', code: 'BNE' },
					{ city: 'Cairns', code: 'CNS' },
					{ city: 'Canberra', code: 'CBR' },
					{ city: 'Darwin', code: 'DRW' },
					{ city: 'Gold Coast', code: 'OOL' },
					{ city: 'Hobart', code: 'HBA' },
					{ city: 'Perth', code: 'PER' },
				],
			},
			{
				name: 'NEW ZEALAND',
				locations: [
					{ city: 'Auckland', code: 'AKL' },
					{ city: 'Christchurch', code: 'CHC' },
					{ city: 'Dunedin', code: 'DUD' },
					{ city: 'Nelson', code: 'NSN' },
					{ city: 'Palmerston North', code: 'PMR' },
					{ city: 'Queenstown', code: 'ZQN' },
					{ city: 'Wellington', code: 'WLG' },
				],
			},
		],
	},
	{
		name: 'Châu Âu',
		regions: [
			{
				name: 'TÂY ÂU',
				locations: [
					{ city: 'Amsterdam', code: 'AMS' },
					{ city: 'Barcelona', code: 'BCN' },
					{ city: 'Berlin', code: 'BER' },
					{ city: 'Brussels', code: 'BRU' },
					{ city: 'Frankfurt', code: 'FRA' },
					{ city: 'London Heathrow', code: 'LHR' },
					{ city: 'Madrid', code: 'MAD' },
					{ city: 'Munich', code: 'MUC' },
					{ city: 'Paris', code: 'CDG' },
					{ city: 'Rome', code: 'FCO' },
				],
			},
			{
				name: 'ĐÔNG ÂU',
				locations: [
					{ city: 'Budapest', code: 'BUD' },
					{ city: 'Moscow', code: 'SVO' },
					{ city: 'Prague', code: 'PRG' },
					{ city: 'Warsaw', code: 'WAW' },
					{ city: 'Vienna', code: 'VIE' },
				],
			},
		],
	},
	{
		name: 'Châu Mỹ',
		regions: [
			{
				name: 'BẮC MỸ',
				locations: [
					{ city: 'Chicago', code: 'ORD' },
					{ city: 'Los Angeles', code: 'LAX' },
					{ city: 'New York', code: 'JFK' },
					{ city: 'San Francisco', code: 'SFO' },
					{ city: 'Seattle', code: 'SEA' },
					{ city: 'Vancouver', code: 'YVR' },
					{ city: 'Toronto', code: 'YYZ' },
					{ city: 'Montreal', code: 'YUL' },
				],
			},
			{
				name: 'NAM MỸ',
				locations: [
					{ city: 'Buenos Aires', code: 'EZE' },
					{ city: 'Rio de Janeiro', code: 'GIG' },
					{ city: 'São Paulo', code: 'GRU' },
					{ city: 'Lima', code: 'LIM' },
					{ city: 'Santiago', code: 'SCL' },
				],
			},
		],
	},
];

const HeroSection: React.FC = () => {
	const navigate = useNavigate();
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);
	const [flightType, setFlightType] = useState<'one-way' | 'round-trip'>(
		'one-way',
	);
	const [showPassengers, setShowPassengers] = useState(false);
	const [passengerCounts, setPassengerCounts] = useState({
		adults: 1,
		children: 0,
		infants: 0,
	});
	const [showLocations, setShowLocations] = useState<'from' | 'to' | null>(
		null,
	);
	const fromLocationDropdownRef = useRef<HTMLDivElement>(null);
	const toLocationDropdownRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [fromLocation, setFromLocation] = useState<Location>({
		city: 'Hồ Chí Minh',
		code: 'SGN',
	});
	const [toLocation, setToLocation] = useState<Location>({
		city: 'Hà Nội',
		code: 'HAN',
	});
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCountry, setSelectedCountry] = useState('Việt Nam');
	const searchInputRef = useRef<HTMLInputElement>(null);

	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

	const [departureDate, setDepartureDate] = useState<Date | null>(
		addDays(new Date(), 1),
	);
	const [returnDate, setReturnDate] = useState<Date | null>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchTerm]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowPassengers(false);
			}
			if (
				fromLocationDropdownRef.current &&
				!fromLocationDropdownRef.current.contains(
					event.target as Node,
				) &&
				toLocationDropdownRef.current &&
				!toLocationDropdownRef.current.contains(event.target as Node)
			) {
				if (window.innerWidth >= 640) {
					if (
						fromLocationDropdownRef.current &&
						!fromLocationDropdownRef.current.contains(
							event.target as Node,
						) &&
						toLocationDropdownRef.current &&
						!toLocationDropdownRef.current.contains(
							event.target as Node,
						)
					) {
						setShowLocations(null);
					}
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const updatePassengerCount = (
		type: 'adults' | 'children' | 'infants',
		increment: boolean,
	) => {
		setPassengerCounts((prev) => {
			const newCount = increment ? prev[type] + 1 : prev[type] - 1;
			if (type === 'adults' && newCount < 1) return prev; // Minimum 1 adult
			if (newCount < 0) return prev;
			if (type === 'infants' && newCount > passengerCounts.adults)
				return prev;

			return {
				...prev,
				[type]: newCount,
			};
		});
	};
	const formatPassengerString = () => {
		return `${passengerCounts.adults} Người lớn, ${passengerCounts.children} Trẻ em, ${passengerCounts.infants} Em bé`;
	};

	const handleLocationSelect = (city: string, code: string) => {
		if (showLocations === 'from') {
			setFromLocation({ city, code });
		} else if (showLocations === 'to') {
			setToLocation({ city, code });
		}
		setShowLocations(null);
	};

	const getFilteredLocations = () => {
		if (!debouncedSearchTerm) return [];

		const search = debouncedSearchTerm.toLowerCase();
		const filteredLocations: Location[] = [];

		COUNTRIES.forEach((country) => {
			if (selectedCountry === country.name) {
				country.regions.forEach((region) => {
					region.locations.forEach((location) => {
						const cityMatch = location.city
							.toLowerCase()
							.includes(search);
						const codeMatch = location.code
							.toLowerCase()
							.includes(search);
						const normalizedCity = location.city
							.toLowerCase()
							.normalize('NFD')
							.replace(/[\u0300-\u036f]/g, '');
						const normalizedSearch = search
							.normalize('NFD')
							.replace(/[\u0300-\u036f]/g, '');
						const normalizedMatch =
							normalizedCity.includes(normalizedSearch);

						if (cityMatch || codeMatch || normalizedMatch) {
							filteredLocations.push(location);
						}
					});
				});
			}
		});

		return filteredLocations;
	};

	const LocationDropdown = () => {
		const filteredLocations = getFilteredLocations();
		const showSearchResults = searchTerm.length > 0;

		return (
			<div
				className='absolute left-0 right-0 top-full z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:left-1/2 sm:min-w-[600px] sm:-translate-x-1/2'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='mb-4 flex items-center justify-between sm:hidden'>
					<h2 className='text-lg font-medium'>
						{showLocations === 'from'
							? 'Chọn điểm đi'
							: 'Chọn điểm đến'}
					</h2>
					<button
						className='rounded-lg p-2 hover:bg-gray-100'
						onClick={() => setShowLocations(null)}
					>
						<FontAwesomeIcon icon={faTimes} className='h-5 w-5' />
					</button>
				</div>

				<div className='sticky top-0 bg-white'>
					<div className='relative mb-4'>
						<input
							ref={searchInputRef}
							type='text'
							placeholder='Tìm kiếm thành phố hoặc mã sân bay...'
							className='w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 transition-all hover:border-[#ff6805] focus:border-[#ff6805] focus:outline-none'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							autoFocus
						/>
						<FontAwesomeIcon
							icon={faMagnifyingGlass}
							className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
						/>
					</div>

					<div className='mb-4 flex flex-wrap gap-2'>
						{COUNTRIES.map((country) => (
							<button
								key={country.name}
								className={`rounded-lg px-4 py-2 transition-all active:scale-95 ${
									selectedCountry === country.name
										? 'bg-[#ff6805] text-white hover:bg-[#ff8534]'
										: 'bg-gray-100 hover:bg-gray-200'
								}`}
								onClick={(e) => {
									e.stopPropagation();
									setSelectedCountry(country.name);
									if (searchInputRef.current) {
										searchInputRef.current.focus();
									}
								}}
							>
								{country.name}
							</button>
						))}
					</div>
				</div>

				<div className='max-h-[400px] overflow-y-auto'>
					{showSearchResults ? (
						<div>
							{filteredLocations.length > 0 ? (
								<div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
									{filteredLocations.map((location) => (
										<div
											key={location.code}
											className='cursor-pointer rounded-lg px-3 py-2 transition-all hover:bg-orange-50 hover:text-[#ff6805] active:scale-95 active:bg-orange-100'
											onClick={() =>
												handleLocationSelect(
													location.city,
													location.code,
												)
											}
										>
											{location.city} ({location.code})
										</div>
									))}
								</div>
							) : (
								<div className='text-center text-gray-500'>
									Không tìm thấy kết quả phù hợp
								</div>
							)}
						</div>
					) : (
						<div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
							{COUNTRIES.find(
								(c) => c.name === selectedCountry,
							)?.regions.map((region) => (
								<div key={region.name}>
									<h3 className='mb-3 font-semibold text-gray-900'>
										{region.name}
									</h3>
									<div className='space-y-2'>
										{region.locations.map((location) => (
											<div
												key={location.code}
												className='cursor-pointer rounded-lg px-3 py-2 transition-all hover:bg-orange-50 hover:text-[#ff6805] active:scale-95 active:bg-orange-100'
												onClick={() =>
													handleLocationSelect(
														location.city,
														location.code,
													)
												}
											>
												{location.city} ({location.code}
												)
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		);
	};

	const handleSwitchLocations = () => {
		setFromLocation(toLocation);
		setToLocation(fromLocation);
	};

	const handleSearch = () => {
		const searchParams = new URLSearchParams({
			from: `${fromLocation.city} (${fromLocation.code})`,
			to: `${toLocation.city} (${toLocation.code})`,
			departureDate: departureDate
				? format(departureDate, 'dd/MM/yyyy')
				: '',
			returnDate: returnDate ? format(returnDate, 'dd/MM/yyyy') : '',
			passengers: JSON.stringify(passengerCounts),
			flightType,
		});
		if (
			flightType === 'round-trip' &&
			returnDate &&
			returnDate.toString() !== ''
		) {
			navigate(`/tim-chuyen-bay?${searchParams.toString()}`);
		} else {
			searchParams.delete('returnDate');
			searchParams.set('flightType', 'one-way');
			navigate(`/tim-chuyen-bay?${searchParams.toString()}`);
		}
	};

	const searchButton = (
		<button
			onClick={handleSearch}
			className='w-full rounded-lg bg-[#ff6805] px-6 py-3 font-medium text-white transition-all hover:bg-[#ff8534] active:scale-[0.98] active:bg-[#ff6805]'
		>
			Tìm chuyến bay
		</button>
	);

	return (
		<div className='sm:relative md:flex md:flex-col'>
			<img
				src={Banner}
				alt='banner'
				className='w-full sm:h-[400px] sm:object-cover md:h-[500px] md:w-full'
			/>
			<div className='bottom-0 left-0 right-0 flex w-full flex-col items-center justify-center p-4 sm:absolute sm:bottom-8 md:bg-transparent'>
				<div className='relative w-full max-w-7xl rounded-lg bg-white p-4 sm:w-11/12 sm:p-6 md:mx-auto md:shadow-xl lg:px-10 lg:py-6'>
					<div className='flex flex-col gap-4 sm:flex-row sm:justify-between'>
						<div className='flex items-center gap-2'>
							<input
								type='radio'
								name='flight-type'
								id='one-way'
								className='h-3 w-3 cursor-pointer rounded-full ring-1 ring-[#ff6805] ring-offset-2 checked:bg-[#ff6805]'
								value='one-way'
								checked={flightType === 'one-way'}
								onChange={(e) =>
									setFlightType(
										e.target.value as
											| 'one-way'
											| 'round-trip',
									)
								}
							/>
							<label htmlFor='one-way' className='cursor-pointer'>
								Một chiều
							</label>
							<input
								type='radio'
								name='flight-type'
								id='round-trip'
								className='h-3 w-3 cursor-pointer rounded-full ring-1 ring-black ring-offset-2 checked:bg-[#ff6805] checked:ring-[#ff6805]'
								value='round-trip'
								checked={flightType === 'round-trip'}
								onChange={(e) =>
									setFlightType(
										e.target.value as
											| 'one-way'
											| 'round-trip',
									)
								}
							/>
							<label
								htmlFor='round-trip'
								className='cursor-pointer'
							>
								Khứ hồi
							</label>
						</div>
						<div
							ref={dropdownRef}
							className='relative flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-1 text-sm hover:border-[#ff6805] hover:bg-orange-50 active:bg-orange-100 sm:text-base'
							onClick={() => setShowPassengers(!showPassengers)}
						>
							<div>{formatPassengerString()}</div>
							<FontAwesomeIcon
								icon={faUser}
								className='text-gray-600'
							/>

							{showPassengers && (
								<div
									className='absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg'
									onClick={(e) => e.stopPropagation()}
								>
									<div className='space-y-4'>
										<div className='flex items-center justify-between'>
											<div className='flex items-center gap-3'>
												<FontAwesomeIcon
													icon={faUserGroup}
													className='text-gray-600'
												/>
												<div>
													<div className='font-medium'>
														Người lớn
													</div>
													<div className='text-sm text-gray-500'>
														{'>'}= 12 Tuổi
													</div>
												</div>
											</div>
											<div className='flex items-center gap-3'>
												<button
													className='flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 transition-all hover:border-[#ff6805] hover:bg-orange-50 active:scale-95 active:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-transparent'
													onClick={(e) => {
														e.stopPropagation();
														updatePassengerCount(
															'adults',
															false,
														);
													}}
													disabled={
														passengerCounts.adults <=
														1
													}
												>
													<FontAwesomeIcon
														icon={faMinus}
														className='text-sm text-gray-600'
													/>
												</button>
												<span className='w-4 text-center'>
													{passengerCounts.adults}
												</span>
												<button
													className='flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 transition-all hover:border-[#ff6805] hover:bg-orange-50 active:scale-95 active:bg-orange-100'
													onClick={(e) => {
														e.stopPropagation();
														updatePassengerCount(
															'adults',
															true,
														);
													}}
												>
													<FontAwesomeIcon
														icon={faPlus}
														className='text-sm text-gray-600'
													/>
												</button>
											</div>
										</div>

										<div className='flex items-center justify-between'>
											<div className='flex items-center gap-3'>
												<FontAwesomeIcon
													icon={faChild}
													className='text-gray-600'
												/>
												<div>
													<div className='font-medium'>
														Trẻ em
													</div>
													<div className='text-sm text-gray-500'>
														2 {'<'} 12 Tuổi
													</div>
												</div>
											</div>
											<div className='flex items-center gap-3'>
												<button
													className='flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 transition-all hover:border-[#ff6805] hover:bg-orange-50 active:scale-95 active:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-transparent'
													onClick={(e) => {
														e.stopPropagation();
														updatePassengerCount(
															'children',
															false,
														);
													}}
													disabled={
														passengerCounts.children <=
														0
													}
												>
													<FontAwesomeIcon
														icon={faMinus}
														className='text-sm text-gray-600'
													/>
												</button>
												<span className='w-4 text-center'>
													{passengerCounts.children}
												</span>
												<button
													className='flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 transition-all hover:border-[#ff6805] hover:bg-orange-50 active:scale-95 active:bg-orange-100'
													onClick={(e) => {
														e.stopPropagation();
														updatePassengerCount(
															'children',
															true,
														);
													}}
												>
													<FontAwesomeIcon
														icon={faPlus}
														className='text-sm text-gray-600'
													/>
												</button>
											</div>
										</div>

										<div className='flex items-center justify-between'>
											<div className='flex items-center gap-3'>
												<FontAwesomeIcon
													icon={faBaby}
													className='text-gray-600'
												/>
												<div>
													<div className='font-medium'>
														Em bé
													</div>
													<div className='text-sm text-gray-500'>
														{'<'} 2 Tuổi
													</div>
												</div>
											</div>
											<div className='flex items-center gap-3'>
												<button
													className='flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 transition-all hover:border-[#ff6805] hover:bg-orange-50 active:scale-95 active:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-transparent'
													onClick={(e) => {
														e.stopPropagation();
														updatePassengerCount(
															'infants',
															false,
														);
													}}
													disabled={
														passengerCounts.infants <=
														0
													}
												>
													<FontAwesomeIcon
														icon={faMinus}
														className='text-sm text-gray-600'
													/>
												</button>
												<span className='w-4 text-center'>
													{passengerCounts.infants}
												</span>
												<button
													className='flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 transition-all hover:border-[#ff6805] hover:bg-orange-50 active:scale-95 active:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-transparent'
													onClick={(e) => {
														e.stopPropagation();
														updatePassengerCount(
															'infants',
															true,
														);
													}}
													disabled={
														passengerCounts.infants >=
														passengerCounts.adults
													}
												>
													<FontAwesomeIcon
														icon={faPlus}
														className='text-sm text-gray-600'
													/>
												</button>
											</div>
										</div>

										<button
											className='w-full rounded-lg bg-[#ff6805] px-4 py-2 text-white transition-all hover:bg-[#ff8534] active:scale-[0.98] active:bg-[#ff6805]'
											onClick={(e) => {
												e.stopPropagation();
												setShowPassengers(false);
											}}
										>
											Đồng ý
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
					<div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-12'>
						<div
							ref={fromLocationDropdownRef}
							className='relative col-span-full flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 transition-all hover:border-[#ff6805] hover:bg-orange-50 active:bg-orange-100 sm:col-span-4'
							onClick={() => setShowLocations('from')}
						>
							<FontAwesomeIcon
								icon={faLocationDot}
								className='text-gray-600 transition-all group-hover:text-[#ff6805]'
							/>
							<div className='flex flex-col'>
								<span className='text-sm text-gray-500'>
									Điểm đi
								</span>
								<span className='font-medium'>
									{fromLocation.city} ({fromLocation.code})
								</span>
							</div>
							{showLocations === 'from' && <LocationDropdown />}
						</div>
						{!isMobile && (
							<div className='col-span-full flex items-center justify-center sm:col-span-1'>
								<div
									className='cursor-pointer rounded-full border border-gray-300 p-2 transition-all hover:border-[#ff6805] hover:bg-orange-50 active:scale-95 active:bg-orange-100'
									onClick={handleSwitchLocations}
								>
									<FontAwesomeIcon
										icon={faArrowRightArrowLeft}
										className='text-gray-600 transition-all hover:text-[#ff6805]'
									/>
								</div>
							</div>
						)}

						<div
							ref={toLocationDropdownRef}
							className='relative col-span-full flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 transition-all hover:border-[#ff6805] hover:bg-orange-50 active:bg-orange-100 sm:col-span-4'
							onClick={() => setShowLocations('to')}
						>
							<FontAwesomeIcon
								icon={faLocationDot}
								className='text-gray-600 transition-all group-hover:text-[#ff6805]'
							/>
							<div className='flex flex-col'>
								<span className='text-sm text-gray-500'>
									Điểm đến
								</span>
								<span className='font-medium'>
									{toLocation.city} ({toLocation.code})
								</span>
							</div>
							{showLocations === 'to' && <LocationDropdown />}
						</div>

						<div className='col-span-full sm:col-span-3'>
							{!isMobile && searchButton}
						</div>
					</div>
					<div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-12'>
						<div className='col-span-full sm:col-span-4'>
							<DatePicker
								selected={departureDate}
								onChange={(date) => setDepartureDate(date)}
								minDate={new Date()}
								dateFormat='dd/MM/yyyy'
								locale={vi}
								placeholderText='Chọn ngày đi'
								className='w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 hover:border-[#ff6805] hover:bg-orange-50'
								customInput={
									<div className='flex items-center gap-3'>
										<FontAwesomeIcon
											icon={faCalendar}
											className='text-gray-600'
										/>
										<div className='flex flex-col'>
											<span className='text-sm text-gray-500'>
												Ngày đi
											</span>
											<span className='font-medium'>
												{departureDate
													? format(
															departureDate,
															'dd/MM/yyyy',
														)
													: 'Chọn ngày'}
											</span>
										</div>
									</div>
								}
							/>
						</div>

						<div className='hidden sm:col-span-1 sm:block'></div>

						<div className='col-span-full sm:col-span-4'>
							<DatePicker
								selected={returnDate}
								onChange={(date) => setReturnDate(date)}
								minDate={departureDate || new Date()}
								dateFormat='dd/MM/yyyy'
								locale={vi}
								placeholderText='Chọn ngày về'
								disabled={flightType === 'one-way'}
								className={`w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 hover:border-[#ff6805] hover:bg-orange-50 ${
									flightType === 'one-way'
										? 'cursor-not-allowed opacity-50'
										: ''
								}`}
								customInput={
									<div className='flex items-center gap-3'>
										<FontAwesomeIcon
											icon={faCalendar}
											className='text-gray-600'
										/>
										<div className='flex flex-col'>
											<span className='text-sm text-gray-500'>
												Ngày về
											</span>
											<span className='font-medium'>
												{returnDate
													? format(
															returnDate,
															'dd/MM/yyyy',
														)
													: 'Chọn ngày'}
											</span>
										</div>
									</div>
								}
							/>
						</div>
					</div>
					{isMobile && (
						<div className='mt-4 sm:hidden'>{searchButton}</div>
					)}
				</div>
			</div>

			{(showLocations === 'from' || showLocations === 'to') && (
				<div
					className='fixed inset-0 z-[100] bg-black/50 sm:hidden'
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setShowLocations(null);
						}
					}}
				>
					<div
						className='relative h-full w-full overflow-hidden rounded-t-2xl p-4 sm:bg-white'
						onClick={(e) => e.stopPropagation()}
					>
						<LocationDropdown />
					</div>
				</div>
			)}
		</div>
	);
};

export default HeroSection;
