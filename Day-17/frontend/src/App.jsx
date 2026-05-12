import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOtp from './pages/verifyOtp';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT ROUTE */}
        <Route path='/' element={<Navigate to='/register' />} />

        {/* AUTH ROUTES */}
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App