import BookingMethods from '@components/BookingMethods';
import PaymentMethods from '@components/PaymentMethods';
import PopularFlights from '@components/PopularFlights';
import WhyChooseUs from '@components/WhyChooseUs';
import HeroSection from '@pages/Client/HeroSection';
import React from 'react';

const Index: React.FC = () => {
	return (
		<>
			<HeroSection />
			<PopularFlights />
			<div className='mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-2'>
				<BookingMethods />
				<PaymentMethods />
			</div>
			<WhyChooseUs />
		</>
	);
};

export default Index;
