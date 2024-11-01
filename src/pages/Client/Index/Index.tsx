import BookingMethods from '@components/BookingMethods';
import PaymentMethods from '@components/PaymentMethods';
import PopularFlights from '@components/PopularFlights';
import WhyChooseUs from '@components/WhyChooseUs';
import HeroSection from '@pages/Client/Index/HeroSection';
import React from 'react';

const Index: React.FC = () => {
	return (
		<>
			<HeroSection />
			<PopularFlights />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4">
				<BookingMethods />
				<PaymentMethods />
			</div>
			<WhyChooseUs />
		</>
	);
};

export default Index;
