import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");

  const location = useLocation();
  const email = location.state?.email;
  console.log(email);

  const handleVerifyOtp = async()=>{

    console.log({ email, otp });
    try {

        const response = await api.post("/otp/verify-otp",{email,otp})
        toast.success(response?.data?.message)
        
    } catch (error) {
        console.log(error.response);
        
    }
  }
  
  return (
    <>
      <div>
        <div className="flex items-center justify-center h-screen flex-col gap-5">
          <input
          className="border p-2"
            type="text"
            placeholder="Enter your otp here"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
            }}
          />
          <button onClick={handleVerifyOtp} className="border p-2">Submit</button>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
