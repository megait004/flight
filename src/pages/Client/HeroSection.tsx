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
import {
	calculateDistance,
	calculateFlightTime,
	formatFlightTime,
} from '@utils/flight-calculations';
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
	coordinates?: {
		lat: number;
		lng: number;
	};
};

const COUNTRIES: Country[] = [
	{
		name: 'Việt Nam',
		regions: [
			{
				name: 'MIỀN BẮC',
				locations: [
					{
						city: 'Điện Biên Phủ',
						code: 'DBP',
						coordinates: { lat: 21.0245, lng: 105.8412 },
					},
					{
						city: 'Hà Nội',
						code: 'HAN',
						coordinates: { lat: 21.0245, lng: 105.8412 },
					},
					{
						city: 'Hải Phòng',
						code: 'HPH',
						coordinates: { lat: 20.8683, lng: 106.6627 },
					},
					{
						city: 'Vân Đồn',
						code: 'VDO',
						coordinates: { lat: 21.0245, lng: 105.8412 },
					},
				],
			},
			{
				name: 'MIỀN NAM',
				locations: [
					{
						city: 'Hồ Chí Minh',
						code: 'SGN',
						coordinates: { lat: 10.8231, lng: 106.6297 },
					},
					{
						city: 'Cà Mau',
						code: 'CAH',
						coordinates: { lat: 9.1832, lng: 105.1542 },
					},
					{
						city: 'Phú Quốc',
						code: 'PQC',
						coordinates: { lat: 10.2234, lng: 103.9422 },
					},
					{
						city: 'Cần Thơ',
						code: 'VCA',
						coordinates: { lat: 10.0, lng: 105.7667 },
					},
					{
						city: 'Côn Đảo',
						code: 'VCS',
						coordinates: { lat: 10.9222, lng: 106.6222 },
					},
					{
						city: 'Kiên Giang',
						code: 'KGG',
						coordinates: { lat: 10.0, lng: 105.7667 },
					},
				],
			},
			{
				name: 'MIỀN TRUNG',
				locations: [
					{
						city: 'Ban Mê Thuột',
						code: 'BMV',
						coordinates: { lat: 14.8621, lng: 107.5957 },
					},
					{
						city: 'Nha Trang',
						code: 'CXR',
						coordinates: { lat: 12.2381, lng: 109.1914 },
					},
					{
						city: 'Đà Nẵng',
						code: 'DAD',
						coordinates: { lat: 16.0678, lng: 108.22 },
					},
					{
						city: 'Đà Lạt',
						code: 'DLI',
						coordinates: { lat: 11.97, lng: 108.4167 },
					},
					{
						city: 'Huế',
						code: 'HUI',
						coordinates: { lat: 16.4637, lng: 107.5957 },
					},
					{
						city: 'Pleiku',
						code: 'PXU',
						coordinates: { lat: 13.9833, lng: 108.0 },
					},
					{
						city: 'Tuy Hòa',
						code: 'TBB',
						coordinates: { lat: 13.0833, lng: 109.3167 },
					},
					{
						city: 'Thanh Hóa',
						code: 'THD',
						coordinates: { lat: 19.8, lng: 105.7667 },
					},
					{
						city: 'Quy Nhơn',
						code: 'UIH',
						coordinates: { lat: 13.7667, lng: 109.2167 },
					},
					{
						city: 'Chu Lai',
						code: 'VCL',
						coordinates: { lat: 15.5, lng: 108.1167 },
					},
					{
						city: 'Quảng Bình',
						code: 'VCS',
						coordinates: { lat: 15.5, lng: 108.1167 },
					},
					{
						city: 'Vinh',
						code: 'VII',
						coordinates: { lat: 18.6667, lng: 105.6667 },
					},
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
					{
						city: 'Bangkok',
						code: 'BKK',
						coordinates: { lat: 13.7563, lng: 100.5018 },
					},
					{
						city: 'Bali / Denpasar',
						code: 'DPS',
						coordinates: { lat: -8.4095, lng: 115.1889 },
					},
					{
						city: 'Buri Ram',
						code: 'BFV',
						coordinates: { lat: 15.1855, lng: 103.2587 },
					},
					{
						city: 'Chiang Mai',
						code: 'CNX',
						coordinates: { lat: 18.7857, lng: 98.9857 },
					},
					{
						city: 'Bandar Seri Begawan',
						code: 'BWN',
						coordinates: { lat: 4.8857, lng: 114.9315 },
					},
					{
						city: 'Luang Prabang',
						code: 'LPQ',
						coordinates: { lat: 19.8833, lng: 102.1333 },
					},
					{
						city: 'Phnom Penh',
						code: 'PNH',
						coordinates: { lat: 11.55, lng: 104.9167 },
					},
					{
						city: 'Siem Reap',
						code: 'REP',
						coordinates: { lat: 13.3667, lng: 103.85 },
					},
					{
						city: 'Vientiane',
						code: 'VTE',
						coordinates: { lat: 17.9667, lng: 102.6 },
					},
					{
						city: 'Pattaya',
						code: 'UTP',
						coordinates: { lat: 12.9167, lng: 101.8167 },
					},
					{
						city: 'Phuket',
						code: 'HKT',
						coordinates: { lat: 7.8917, lng: 98.3917 },
					},
					{
						city: 'Jakarta',
						code: 'CGK',
						coordinates: { lat: -6.2146, lng: 106.8451 },
					},
					{
						city: 'Kuala Lumpur',
						code: 'KUL',
						coordinates: { lat: 3.139, lng: 101.6869 },
					},
					{
						city: 'Cebu',
						code: 'CEB',
						coordinates: { lat: 10.3167, lng: 123.8833 },
					},
					{
						city: 'Manila',
						code: 'MNL',
						coordinates: { lat: 14.5995, lng: 120.984 },
					},
					{
						city: 'Penang',
						code: 'PEN',
						coordinates: { lat: 5.4167, lng: 100.3167 },
					},
					{
						city: 'Singapore',
						code: 'SIN',
						coordinates: { lat: 1.3521, lng: 103.8198 },
					},
					{
						city: 'Yangon',
						code: 'RGN',
						coordinates: { lat: 16.7778, lng: 96.1667 },
					},
					{
						city: 'Xieng Khouang',
						code: 'XKH',
						coordinates: { lat: 19.5667, lng: 102.6 },
					},
				],
			},
			{
				name: 'ĐÔNG BẮC Á',
				locations: [
					{
						city: 'Beijing',
						code: 'PEK',
						coordinates: { lat: 39.9042, lng: 116.4074 },
					},
					{
						city: 'Busan',
						code: 'PUS',
						coordinates: { lat: 35.1796, lng: 129.0756 },
					},
					{
						city: 'Chengdu',
						code: 'CTU',
						coordinates: { lat: 30.5728, lng: 104.0665 },
					},
					{
						city: 'Fukuoka',
						code: 'FUK',
						coordinates: { lat: 33.5886, lng: 130.4141 },
					},
					{
						city: 'Guangzhou',
						code: 'CAN',
						coordinates: { lat: 23.1167, lng: 113.25 },
					},
					{
						city: 'Hong Kong',
						code: 'HKG',
						coordinates: { lat: 22.3964, lng: 114.1095 },
					},
					{
						city: 'Ma Cao',
						code: 'MFM',
						coordinates: { lat: 22.3964, lng: 114.1095 },
					},
					{
						city: 'Kaohsiung',
						code: 'KHH',
						coordinates: { lat: 22.6167, lng: 120.3167 },
					},
					{
						city: 'Đài Nam',
						code: 'TNN',
						coordinates: { lat: 22.3964, lng: 114.1095 },
					},
					{
						city: 'Đài Trung',
						code: 'RMQ',
						coordinates: { lat: 22.3964, lng: 114.1095 },
					},
					{
						city: 'Nagoya',
						code: 'NGO',
						coordinates: { lat: 34.6939, lng: 136.5653 },
					},
					{
						city: 'Osaka',
						code: 'KIX',
						coordinates: { lat: 34.6939, lng: 136.5653 },
					},
					{
						city: 'Seoul',
						code: 'ICN',
						coordinates: { lat: 37.5663, lng: 126.978 },
					},
					{
						city: 'Jeju',
						code: 'CJU',
						coordinates: { lat: 33.5098, lng: 126.5219 },
					},
					{
						city: 'Shanghai',
						code: 'PVG',
						coordinates: { lat: 31.2304, lng: 121.4737 },
					},
					{
						city: 'Taipei',
						code: 'TPE',
						coordinates: { lat: 25.0375, lng: 121.5637 },
					},
					{
						city: 'Tokyo Haneda',
						code: 'HND',
						coordinates: { lat: 35.5494, lng: 139.7811 },
					},
					{
						city: 'Tokyo Narita',
						code: 'NRT',
						coordinates: { lat: 35.7647, lng: 140.3865 },
					},
					{
						city: 'Fukuoka',
						code: 'FUK',
						coordinates: { lat: 33.5886, lng: 130.4141 },
					},
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
					{
						city: 'Melbourne',
						code: 'MEL',
						coordinates: { lat: -37.8136, lng: 144.9631 },
					},
					{
						city: 'Sydney',
						code: 'SYD',
						coordinates: { lat: -33.8568, lng: 151.2153 },
					},
					{
						city: 'Adelaide',
						code: 'ADL',
						coordinates: { lat: -34.9285, lng: 138.6007 },
					},
					{
						city: 'Brisbane',
						code: 'BNE',
						coordinates: { lat: -27.4678, lng: 153.0281 },
					},
					{
						city: 'Cairns',
						code: 'CNS',
						coordinates: { lat: -16.9167, lng: 145.7667 },
					},
					{
						city: 'Canberra',
						code: 'CBR',
						coordinates: { lat: -35.3075, lng: 149.1246 },
					},
					{
						city: 'Darwin',
						code: 'DRW',
						coordinates: { lat: -12.4611, lng: 130.8418 },
					},
					{
						city: 'Gold Coast',
						code: 'OOL',
						coordinates: { lat: -28.0167, lng: 153.4 },
					},
					{
						city: 'Hobart',
						code: 'HBA',
						coordinates: { lat: -42.8793, lng: 147.3294 },
					},
					{
						city: 'Perth',
						code: 'PER',
						coordinates: { lat: -31.9505, lng: 115.8605 },
					},
				],
			},
			{
				name: 'NEW ZEALAND',
				locations: [
					{
						city: 'Auckland',
						code: 'AKL',
						coordinates: { lat: -36.8485, lng: 174.7633 },
					},
					{
						city: 'Christchurch',
						code: 'CHC',
						coordinates: { lat: -43.5333, lng: 172.6333 },
					},
					{
						city: 'Dunedin',
						code: 'DUD',
						coordinates: { lat: -45.8787, lng: 170.5033 },
					},
					{
						city: 'Nelson',
						code: 'NSN',
						coordinates: { lat: -41.2865, lng: 173.2837 },
					},
					{
						city: 'Palmerston North',
						code: 'PMR',
						coordinates: { lat: -40.35, lng: 175.6167 },
					},
					{
						city: 'Queenstown',
						code: 'ZQN',
						coordinates: { lat: -45.0311, lng: 168.6627 },
					},
					{
						city: 'Wellington',
						code: 'WLG',
						coordinates: { lat: -41.2865, lng: 174.7633 },
					},
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
					{
						city: 'Amsterdam',
						code: 'AMS',
						coordinates: { lat: 52.3702, lng: 4.8952 },
					},
					{
						city: 'Barcelona',
						code: 'BCN',
						coordinates: { lat: 41.3888, lng: 2.1589 },
					},
					{
						city: 'Berlin',
						code: 'BER',
						coordinates: { lat: 52.52, lng: 13.405 },
					},
					{
						city: 'Brussels',
						code: 'BRU',
						coordinates: { lat: 50.8476, lng: 4.3572 },
					},
					{
						city: 'Frankfurt',
						code: 'FRA',
						coordinates: { lat: 50.1109, lng: 8.6821 },
					},
					{
						city: 'London Heathrow',
						code: 'LHR',
						coordinates: { lat: 51.47, lng: -0.4543 },
					},
					{
						city: 'Madrid',
						code: 'MAD',
						coordinates: { lat: 40.4168, lng: -3.7038 },
					},
					{
						city: 'Munich',
						code: 'MUC',
						coordinates: { lat: 48.1351, lng: 11.582 },
					},
					{
						city: 'Paris',
						code: 'CDG',
						coordinates: { lat: 49.0097, lng: 2.5479 },
					},
					{
						city: 'Rome',
						code: 'FCO',
						coordinates: { lat: 41.9028, lng: 12.4964 },
					},
				],
			},
			{
				name: 'ĐÔNG ÂU',
				locations: [
					{
						city: 'Budapest',
						code: 'BUD',
						coordinates: { lat: 47.4979, lng: 19.0402 },
					},
					{
						city: 'Moscow',
						code: 'SVO',
						coordinates: { lat: 55.7558, lng: 37.6176 },
					},
					{
						city: 'Prague',
						code: 'PRG',
						coordinates: { lat: 50.0755, lng: 14.4378 },
					},
					{
						city: 'Warsaw',
						code: 'WAW',
						coordinates: { lat: 52.2297, lng: 21.0122 },
					},
					{
						city: 'Vienna',
						code: 'VIE',
						coordinates: { lat: 48.2082, lng: 16.3738 },
					},
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
					{
						city: 'Chicago',
						code: 'ORD',
						coordinates: { lat: 41.8781, lng: -87.6298 },
					},
					{
						city: 'Los Angeles',
						code: 'LAX',
						coordinates: { lat: 34.0522, lng: -118.2437 },
					},
					{
						city: 'New York',
						code: 'JFK',
						coordinates: { lat: 40.6413, lng: -73.7781 },
					},
					{
						city: 'San Francisco',
						code: 'SFO',
						coordinates: { lat: 37.7749, lng: -122.4194 },
					},
					{
						city: 'Seattle',
						code: 'SEA',
						coordinates: { lat: 47.6062, lng: -122.3321 },
					},
					{
						city: 'Vancouver',
						code: 'YVR',
						coordinates: { lat: 49.2827, lng: -123.1207 },
					},
					{
						city: 'Toronto',
						code: 'YYZ',
						coordinates: { lat: 43.6532, lng: -79.3832 },
					},
					{
						city: 'Montreal',
						code: 'YUL',
						coordinates: { lat: 45.5017, lng: -73.5673 },
					},
				],
			},
			{
				name: 'NAM MỸ',
				locations: [
					{
						city: 'Buenos Aires',
						code: 'EZE',
						coordinates: { lat: -34.6037, lng: -58.3816 },
					},
					{
						city: 'Rio de Janeiro',
						code: 'GIG',
						coordinates: { lat: -22.9068, lng: -43.1729 },
					},
					{
						city: 'São Paulo',
						code: 'GRU',
						coordinates: { lat: -23.5505, lng: -46.6333 },
					},
					{
						city: 'Lima',
						code: 'LIM',
						coordinates: { lat: -12.0464, lng: -77.0428 },
					},
					{
						city: 'Santiago',
						code: 'SCL',
						coordinates: { lat: -33.4569, lng: -70.6483 },
					},
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
		coordinates: { lat: 10.8231, lng: 106.6297 },
	});
	const [toLocation, setToLocation] = useState<Location>({
		city: 'Hà Nội',
		code: 'HAN',
		coordinates: { lat: 21.0245, lng: 105.8412 },
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

	const handleLocationSelect = (location: Location) => {
		if (showLocations === 'from') {
			setFromLocation(location);
		} else if (showLocations === 'to') {
			setToLocation(location);
		}
		setShowLocations(null);
		setSearchTerm('');
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
												handleLocationSelect(location)
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
														location,
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
			distance: getFlightInfo()?.distance.toString() ?? '',
			duration: getFlightInfo()?.duration ?? '',
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

	const getFlightInfo = () => {
		if (fromLocation.coordinates && toLocation.coordinates) {
			const distance = calculateDistance(
				fromLocation.coordinates,
				toLocation.coordinates,
			);
			const time = calculateFlightTime(distance);
			return {
				distance,
				duration: formatFlightTime(time),
			};
		}
		return null;
	};

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
