import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import Advantages from '@/components/sections/Advantages';
import WindowTypes from '@/components/sections/WindowTypes';
import Services from '@/components/sections/Services';
import WindowConstructor from '@/components/sections/WindowConstructor';
import Process from '@/components/sections/Process';
import Reviews from '@/components/sections/Reviews';
import Appointment from '@/components/sections/Appointment';
import Contacts from '@/components/sections/Contacts';
import Footer from '@/components/sections/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Advantages />
        <WindowTypes />
        <Services />
        <WindowConstructor />
        <Process />
        <Reviews />
        <Appointment />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}