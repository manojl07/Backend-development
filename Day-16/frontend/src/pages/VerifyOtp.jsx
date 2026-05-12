import React, { useState, useEffect,} from "react";
import { useLocation, useNavigate, Link} from "react-router-dom";
import API from "../services/axios";

const VerifyOtp = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  // Countdown Timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) =>
          prev - 1
        );
      }, 1000);
    }
    return () =>
      clearInterval(interval);
  }, [timer]);

  // VERIFY OTP
  const handleVerifyOtp = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        await API.post("/verify-otp",{ email, otp,});
        navigate("/login");
      } catch (error) {
        setError(error.response?.data?.message || "OTP Verification Failed");
      } finally {
        setLoading(false);
      }
    };

  // RESEND OTP
  const handleResendOtp = async () => {
      setResendLoading(true);
      setError("");

      try {
        const res = await API.post("/resend-otp",{ email });
        alert(res.data.message || "OTP Resent Successfully");
        setTimer(30);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to resend OTP");
      } finally {
        setResendLoading(false);
      }

    };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-blue-600">
            Verify OTP
          </h1>

          <p className="text-gray-500 mt-2">
            Enter the OTP sent to your email
          </p>

          <p className="text-sm text-gray-400 mt-2 break-all">
            {email}
          </p>

        </div>

        <form
          onSubmit={handleVerifyOtp}
          className="space-y-5"
        >

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            disabled={loading}
            onChange={(e) =>
              setOtp(
                e.target.value
              )
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center tracking-[10px] text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-100"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition duration-300 flex items-center justify-center gap-2
            ${
              loading
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

        {/* RESEND OTP */}
        <div className="mt-5 text-center">

          {timer > 0 ? (

            <p className="text-gray-500 text-sm">

              Resend OTP in{" "}
              <span className="font-semibold text-blue-600">
                {timer}s
              </span>

            </p>

          ) : (

            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-blue-600 font-semibold hover:underline"
            >

              {resendLoading
                ? "Sending..."
                : "Resend OTP"}

            </button>

          )}

        </div>

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

export default VerifyOtp;