import React, { useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  // Login data state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Remember me
  //   const [rememberMe, setRememberMe] = useState(false);

  // useNavigate hook
  const navigate = useNavigate();

  // Loading state
  const [loading, setLoading] = useState(false);

  // Login function
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);

    const payload = {
      email: email.trim(),
      password,
    };

    try {
      const res = await api.post("/auth/login", payload);

      toast.success("Login successful!");

      window.location.replace("/");
    } catch (error) {
      const details = error?.response?.data?.detail;

      const message = Array.isArray(details)
        ? details[0]?.msg
        : details || "Login failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      const res = await api.post("/auth/google", {
        token: token,
      });

      toast.success("Google login successful");

      window.location.replace("/");

      if (res.data?.user?.name) {
        toast.success(`Welcome ${res.data.user.name}`);
      }
    } catch (error) {
      console.log(error);

      let message = "Google login failed";

      if (error.response) {
        message = error.response.data?.detail || message;
      } else if (error.request) {
        message = "Server not responding";
      } else {
        message = error.message;
      }

      toast.error(message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-10">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Sign In</h1>

          <p className="text-gray-500 text-sm">Welcome back to COGO.</p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-6"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                ✉
              </span>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            {/* Label + Forgot */}
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-gray-500 hover:text-black transition"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                🔒
              </span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-black"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          {/* <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-4 h-4"
            />

            <label className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div> */}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Logging..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Login Failed")}
            />
          </div>
        </div>

        {/* Signup */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-black font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginForm;
