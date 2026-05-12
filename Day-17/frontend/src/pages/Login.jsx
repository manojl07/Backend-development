import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../services/axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.post('/auth/login', formData);
      localStorage.setItem("token", response.data.accessToken);
      setToken(response.data.accessToken)
      navigate('/notes');
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className='min-h-screen flex items-center justify-center bg-[f0f2f5] px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-blue-600'>Welcome Back</h1>
          <p className='text-gray-500 mt-2'>Login to continue</p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <input
            type="email"
            name='email'
            placeholder='Enter your Email'
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-100"
          />

          <input
            type="password"
            name='password'
            placeholder='Enter your password'
            disabled={loading}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-100"
          />

          <div className='flex justify-end'>
            <Link to="/forgot-password" className='text-red-500 underline font-semibold'>Forgot Password</Link>
          </div>

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
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className='text-center text-gray-600 mt-6'>Dont have an account?{" "} <Link to='/register' className='text-blue-600 font-semibold hover:underline'>Register</Link></p>
      </div>

    </div>
  )
}

export default Login