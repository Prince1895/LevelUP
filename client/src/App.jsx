import React from 'react'
import { Button } from "@/components/ui/button"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
const App = () => {
  return (
   
      <Routes>
      <Route path="/" element={<Home/>} />
     </Routes>
     
   
  )
}

export default App