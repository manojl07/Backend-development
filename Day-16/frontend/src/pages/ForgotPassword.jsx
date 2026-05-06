// ForgotPassword.jsx

import React, {
  useState,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import API from "../services/axios";

const ForgotPassword = () => {

  const navigate =
    useNavigate();

  const [step, setStep] =
    useState(1);

  const [formData, setFormData] =
    useState({
      email: "",
      otp: "",
      newPassword: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  // ================= SEND OTP =================

  const handleSendOtp =
    async (e) => {

      e.preventDefault();

      setLoading(true);
      setError("");
      setSuccess("");

      try {

        const res =
          await API.post(
            "/forgot-password",
            {
              email:
                formData.email,
            }
          );

        setSuccess(
          res.data.message ||
          "OTP Sent Successfully"
        );

        setStep(2);

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Failed to send OTP"
        );

      } finally {

        setLoading(false);

      }

    };

  // ================= VERIFY OTP =================

  const handleVerifyOtp =
    async (e) => {

      e.preventDefault();

      setLoading(true);
      setError("");
      setSuccess("");

      try {

        const res =
          await API.post(
            "/verify-reset-otp",
            {
              email:
                formData.email,
              otp:
                formData.otp,
            }
          );

        setSuccess(
          res.data.message ||
          "OTP Verified"
        );

        setStep(3);

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "OTP Verification Failed"
        );

      } finally {

        setLoading(false);

      }

    };

  // ================= RESET PASSWORD =================

  const handleResetPassword =
    async (e) => {

      e.preventDefault();

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const res =
          await API.post(
            "/reset-password",
            {
              email:
                formData.email,

              newPassword:
                formData.newPassword,
            }
          );

        setSuccess(
          res.data.message ||
          "Password Reset Successful"
        );

        setTimeout(() => {

          navigate("/login");

        }, 1500);

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Password Reset Failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-blue-600">
            Forgot Password
          </h1>

          <p className="text-gray-500 mt-2">

            Reset your account password

          </p>

        </div>

        {/* ================= STEP 1 ================= */}

        {step === 1 && (

          <form
            onSubmit={handleSendOtp}
            className="space-y-5"
          >

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              disabled={loading}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-100"
            />

            <button
              type="submit"
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
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}

            </button>

          </form>

        )}

        {/* ================= STEP 2 ================= */}

        {step === 2 && (

          <form
            onSubmit={handleVerifyOtp}
            className="space-y-5"
          >

            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              disabled={loading}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center tracking-[8px] text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-100"
            />

            <button
              type="submit"
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
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}

            </button>

          </form>

        )}

        {/* ================= STEP 3 ================= */}

        {step === 3 && (

          <form
            onSubmit={handleResetPassword}
            className="space-y-5"
          >

            <input
              type="password"
              name="newPassword"
              placeholder="Enter New Password"
              value={formData.newPassword}
              disabled={loading}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-100"
            />

            <button
              type="submit"
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
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}

            </button>

          </form>

        )}

        {/* ================= ERROR ================= */}

        {error && (

          <p className="text-red-500 text-sm text-center mt-5">

            {error}

          </p>

        )}

        {/* ================= SUCCESS ================= */}

        {success && (

          <p className="text-green-600 text-sm text-center mt-5">

            {success}

          </p>

        )}

        {/* ================= BACK TO LOGIN ================= */}

        <p className="text-center text-gray-600 mt-6">

          Back to{" "}

          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  );
};

export default ForgotPassword;