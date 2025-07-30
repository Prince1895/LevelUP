import React from 'react'
import { Button } from "@/components/ui/button"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
const App = () => {
  return (
   
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Signup/>} />
     </Routes>
     
   
  )
}

export default App