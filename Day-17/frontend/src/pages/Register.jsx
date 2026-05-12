import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/axios';

const Register = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" })
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }



  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/auth/register", formData)

      navigate('/verify-otp',
        {
          state: {
            email: formData.email
          }
        }
      )
    } catch (error) {
      setError(
        error.response?.data?.message || "Registeration failed!"
      )
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4'>

      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-blue-600'>Create Account</h1>

          <p className='text-gray-500 mt-2 '>Join us and start your journey</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name='username'
            placeholder='Enter a new Username'
            disabled={loading}
            onChange={handleChange}
            autoComplete="off"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-100"
          />
          <input
            type="email"
            name='email'
            placeholder='Enter your email'
            disabled={loading}
            onChange={handleChange}
            autoComplete="off"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-100"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            disabled={loading}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-100"
          />

          {error && (
            <p className='text-red-500 text-sm font-semibold'>{error}</p>
          )}

          <button
            type='submit'
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition duration-300 flex items-center justify-center gap-2
            ${loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register