import React, { useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "../../components/GoogleAuthButton";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  // Login data state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // useNavigate hook returns a function to navigate between routes
  const navigate = useNavigate();

  // state to track loading status
  const [loading, setLoading] = useState(false);

  // authenticate user via login API and handle response
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

      navigate("/home", { replace: true });
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

  //  Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      const res = await api.post("/auth/google", {
        token: token,
      });

      // Success toast
      toast.success("Google login successful");
      navigate("/home");

      // Optional: show user name
      if (res.data?.user?.name) {
        toast.success(`Welcome ${res.data.user.name}`);
      }
    } catch (error) {
      console.log(error);

      // Extract backend error
      let message = "Google login failed";

      if (error.response) {
        message = error.response.data?.detail || message;
      } else if (error.request) {
        message = "Server not responding";
      } else {
        message = error.message;
      }

      // Error toast
      toast.error(message);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="flex flex-col gap-3 w-100">
            <h1 className="text-2xl">Login</h1>

            {/* email */}
            <input
              className="border p-2"
              type="text"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            {/* password */}
            <input
              className="border p-2"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button
              className="border p-2 cursor-pointer"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging..." : "Login"}
            </button>

            <Link to="/signup">Sign Up</Link>
          </div>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Login Failed")}
          />
        </form>
      </div>
    </>
  );
};

export default Login;
