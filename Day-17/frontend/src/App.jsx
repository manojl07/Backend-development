import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOtp from './pages/verifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import Notes from './pages/Notes';
import ProtectedRoute from './routes/ProtectedRoute';

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
        <Route path='/forgot-password' element={<ForgotPassword />} />

        {/* PROTECTED NOTES PAGE */}

        <Route path='/notes' element={<ProtectedRoute><Notes /></ProtectedRoute>} />


      </Routes>
    </BrowserRouter>
  )
}

export default App