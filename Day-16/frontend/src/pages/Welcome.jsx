import {
  useContext
} from "react";

import {
  AuthContext
} from "../context/AuthContext";

import {
  useNavigate
} from "react-router-dom";

function Welcome() {

  const { setToken } =
    useContext(AuthContext);

  const navigate =
    useNavigate();

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    setToken(null);

    navigate("/login");

  };

  return (

    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10">

        <div className="flex flex-col items-center text-center">

          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">

            U

          </div>

          <h1 className="text-5xl font-bold text-gray-800 mt-6">

            Welcome User 👋

          </h1>

          <p className="text-gray-500 mt-4 text-lg">

            You have successfully logged into your account.

          </p>

        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">

            <h2 className="text-xl font-semibold text-blue-700">

              Profile

            </h2>

            <p className="text-gray-500 mt-2 text-sm">

              Manage your personal account information.

            </p>

          </div>

          <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">

            <h2 className="text-xl font-semibold text-purple-700">

              Security

            </h2>

            <p className="text-gray-500 mt-2 text-sm">

              Keep your account secure and protected.

            </p>

          </div>

          <div className="bg-green-50 rounded-2xl p-5 border border-green-100">

            <h2 className="text-xl font-semibold text-green-700">

              Activity

            </h2>

            <p className="text-gray-500 mt-2 text-sm">

              Track your recent account activity here.

            </p>

          </div>

        </div>

        <div className="mt-10 flex justify-center">

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-xl transition duration-300 shadow-md"
          >
            Logout
          </button>

        </div>

      </div>

    </div>

  );
}

export default Welcome;