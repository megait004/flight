import Bamboo from '@assets/airlines/bamboo.png';
import Cathay from '@assets/airlines/cathay-pacific.png';
import Etihad from '@assets/airlines/etihad.png';
import PacificAirlines from '@assets/airlines/pacific-airlines.png';
import SingaporeAirlines from '@assets/airlines/singapore-airlines.png';
import ThaiAirways from '@assets/airlines/thai-airways.png';
import ThaiLionAir from '@assets/airlines/thai-lion.png';
import VietJet from '@assets/airlines/vietjet.png';
import VietnamAirlines from '@assets/airlines/vietnam-airlines.png';
import Vietravel from '@assets/airlines/vietravel.png';
import React from 'react';

const Partners: React.FC = () => {
	const airlines = [
		{ name: 'Thai Lion Air', logo: ThaiLionAir },
		{
			name: 'Singapore Airlines',
			logo: SingaporeAirlines,
		},
		{ name: 'Thai Airways', logo: ThaiAirways },
		{ name: 'Etihad Airways', logo: Etihad },
		{ name: 'Vietnam Airlines', logo: VietnamAirlines },
		{ name: 'Pacific Airlines', logo: PacificAirlines },
		{ name: 'VietJet Air', logo: VietJet },
		{ name: 'Bamboo Airways', logo: Bamboo },
		{ name: 'Vietravel Airlines', logo: Vietravel },
		{ name: 'Cathay Pacific', logo: Cathay },
	];

	return (
		<div className='bg-white py-12'>
			<div className='mx-auto max-w-7xl px-4'>
				<h2 className='mb-4 text-center text-2xl font-bold text-[#003C71]'>
					Đối tác và thương hiệu chiến lược
				</h2>
				<p className='mb-8 text-center text-gray-600'>
					Những đối tác hàng không toàn cầu sẽ chắp cánh đưa bạn đến
					mọi địa điểm trên thế giới.
				</p>

				<div className='flex flex-wrap items-center justify-center gap-12'>
					{airlines.map((airline) => (
						<div
							key={airline.name}
							className='flex items-center justify-center'
						>
							<img
								src={airline.logo}
								alt={airline.name}
								className='h-12 object-contain transition-transform duration-300 hover:scale-110'
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Partners;
