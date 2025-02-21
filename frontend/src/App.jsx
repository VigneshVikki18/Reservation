import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './Pages/Home/Home';
import NotFound from './Pages/NotFound/NotFound';
import Success from './Pages/Success/Success';
import './App.css'
import Login from './Pages/Login/Login';
import Signup from './Pages/Signup/Signup';
const App = () => {
  return (
    <>
      <Router>
        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/success' element={<Success/>}/>
        <Route path='*' element={<NotFound/>}/> 
       
        </Routes>
        <Toaster/>
      </Router>
    </>
  )
}

export default App