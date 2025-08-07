import React from 'react'
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import InstructorSection from '@/components/InstructorSection';
import CourseSection from '@/components/CourseSection';
import MarketplaceSection from '@/components/MarketplaceSection';
import SuccessStoriesSection from '@/components/SuccessStoriesSection';
import UpcomingEventsSection from '@/components/UpcomingEventsSection';
import BookSessionSection from '@/components/BookSessionSection';
import Navbar from '@/components/Navbar';

const Home= () => {
  return (
    <>
    <Navbar/>
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

export default Home;