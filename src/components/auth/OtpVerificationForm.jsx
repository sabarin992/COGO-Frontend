import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";

const OtpVerificationForm = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const purpose = location.state?.purpose;

  // Handle OTP Input
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");

    if (!finalOtp) {
      toast.error("Enter OTP");
      return;
    }

    if (finalOtp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/otp/verify-otp", {
        email,
        otp: finalOtp,
      });

      toast.success(response?.data?.message);

      if (purpose === "forgot-password") {
        navigate("/reset-password", {
          state: { email },
        });
      } else {
        navigate("/login");
      }

    } catch (error) {
      toast.error(
        error?.response?.data?.detail || "Invalid OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      await api.post("/otp/resend-otp", { email });

      toast.success("OTP resent successfully");

    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-white">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        
        {/* Top Icon */}
        <div className="text-center mb-8">
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <span className="text-3xl">🔐</span>
          </div>

          <h1 className="text-3xl font-bold text-black mb-2">
            Verify Identity
          </h1>

          <p className="text-sm text-gray-500 leading-6">
            We've sent a 6-digit code to your registered email.
            Enter it below to continue.
          </p>
        </div>

        {/* OTP Form */}
        <div className="flex flex-col gap-6">
          
          {/* OTP Inputs */}
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                className="w-12 h-14 text-center text-2xl font-bold border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
                placeholder="•"
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading
                ? "Verifying..."
                : "Verify Identity"}
            </button>

            <button
              onClick={handleResendOtp}
              className="w-full bg-gray-100 text-black py-3 rounded-full font-medium hover:bg-gray-200 transition"
            >
              Resend OTP Code
            </button>
          </div>
        </div>

        {/* Help */}
        <div className="mt-8 text-center">
          <button className="text-sm text-gray-500 hover:text-black transition inline-flex items-center gap-2">
            ❓ Need help with verification?
          </button>
        </div>
      </div>
    </main>
  );
};

export default OtpVerificationForm;