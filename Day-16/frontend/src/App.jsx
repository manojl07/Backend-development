import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import Welcome from "./pages/Welcome";
import ForgotPassword from "./pages/ForgotPassword";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />}
        />
        <Route path="/register" element={<Register />}
        />
        <Route path="/login" element={<Login />}
        />
        <Route path="/verify-otp" element={<VerifyOtp />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />}
        />
        <Route path="/welcome" element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;