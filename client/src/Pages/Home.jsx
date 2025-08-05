import Navbar from '@/components/Navbar'
import React from 'react'
import Loginpage from '@/components/Loginpage'
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import InstructorSection from '@/components/instructorsection';
import CourseSection from '@/components/CourseSection';
import MarketplaceSection from '@/components/MarketPlaceSection';
import SuccessStoriesSection from '@/components/SuccessStoriesSection';
import UpcomingEventsSection from '@/components/UpcomingEventsSection';
import BookSessionSection from '@/components/BookSessionSection';

const Home= () => {
  return (
    <>
   
    <Hero/>
    <CourseSection/>
    <MarketplaceSection/>
    <InstructorSection/>
    <SuccessStoriesSection/>
    <UpcomingEventsSection/>
    <BookSessionSection/>
    <Footer/>
   
    </>
 
  )
}

export default Home