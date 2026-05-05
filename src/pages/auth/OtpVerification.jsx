import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const purpose = location.state?.purpose;

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/otp/verify-otp", { email, otp });

      toast.success(response?.data?.message);

      if (purpose === "forgot-password") {
        navigate("/reset-password", { state: { email } });
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-3 w-100">
        <h1 className="text-2xl">OTP Verification</h1>

        <input
          className="border p-2"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={handleVerifyOtp}
          className="border p-2 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;

// import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
// import api from "../api";
// import { toast } from "react-toastify";

// const OtpVerification = () => {
//   const [otp, setOtp] = useState("");

//   const location = useLocation();
//   const email = location.state?.email;
//   console.log(email);

//   const handleVerifyOtp = async()=>{

//     console.log({ email, otp });
//     try {

//         const response = await api.post("/otp/verify-otp",{email,otp})
//         toast.success(response?.data?.message)

//     } catch (error) {
//         console.log(error.response);

//     }
//   }

//   return (
//     <>
//       <div>
//         <div className="flex items-center justify-center h-screen flex-col gap-5">
//           <input
//           className="border p-2"
//             type="text"
//             placeholder="Enter your otp here"
//             value={otp}
//             onChange={(e) => {
//               setOtp(e.target.value);
//             }}
//           />
//           <button onClick={handleVerifyOtp} className="border p-2">Submit</button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OtpVerification;
