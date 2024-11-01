import BookingMethods from '@components/BookingMethods';
import PaymentMethods from '@components/PaymentMethods';
import PopularFlights from '@components/PopularFlights';
import React from 'react';
import HeroSection from './Index/HeroSection';

const FlightPage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <PopularFlights />
      <BookingMethods />
      <PaymentMethods />
    </div>
  );
};

export default FlightPage;