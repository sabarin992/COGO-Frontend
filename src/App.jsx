import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import OtpVerification from './pages/OtpVerification';



function App() {
  return (
    <>
    {/*toast container*/}
    <ToastContainer /> 
    
      <Routes>
        <Route path='/home' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/otp-verification' element={<OtpVerification/>}/>
      </Routes>
    </>
  )
}

export default App
