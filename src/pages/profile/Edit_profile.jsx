import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import defaultAvatar from "../../assets/avatar-placeholder.png";

const Edit_profile = () => {
  const [user, setUser] = useState({
    full_name: "",
    phone: "",
    email: "",
    avatar: "",
  });
  const [originalEmail, setOriginalEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation Rules
  const validateFullName = (value) => {
    let error = "";
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!value) error = "Full Name is required";
    else if (value.length < 3) error = "Minimum 3 characters required";
    else if (value.length > 50) error = "Maximum 50 characters allowed";
    else if (!nameRegex.test(value))
      error = "Only alphabets and spaces allowed";
    return error;
  };

  const validateEmail = (value) => {
    let error = "";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value) error = "Email is required";
    else if (!emailRegex.test(value)) error = "Invalid email format";
    return error;
  };

  const validatePhone = (value) => {
    let error = "";
    const phoneRegex = /^\+\d{1,3}\d{10}$/;
    if (!value) error = "Phone number is required";
    else if (!phoneRegex.test(value))
      error =
        "Must include country code (+) and exactly 10 digits (e.g. +919876543210)";
    return error;
  };

  // Handlers
  const handleFullNameChange = (e) => {
    const val = e.target.value;
    setUser((prev) => ({ ...prev, full_name: val }));
    setErrors((prev) => ({ ...prev, full_name: validateFullName(val) }));
  };

  const handleEmailChange = (e) => {
    const val = e.target.value.replace(/\s/g, "").toLowerCase();
    setUser((prev) => ({ ...prev, email: val }));
    setErrors((prev) => ({ ...prev, email: validateEmail(val) }));
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/[^\d+]/g, "");
    if (val.indexOf("+") > 0) val = val.replace(/\+/g, "");
    if (val.startsWith("+")) val = "+" + val.substring(1).replace(/\+/g, "");
    val = val.slice(0, 14);
    setUser((prev) => ({ ...prev, phone: val }));
    setErrors((prev) => ({ ...prev, phone: validatePhone(val) }));
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        setUser(response?.data);
        setOriginalEmail(response?.data?.email || "");
      } catch (error) {
        console.log(error.response);
      }
    };
    getProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image file size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileEdit = async (e) => {
    e.preventDefault();

    // Validation Check on Submit
    const nameErr = validateFullName(user.full_name);
    const phoneErr = validatePhone(user.phone);
    const emailErr = validateEmail(user.email);

    if (nameErr || phoneErr || emailErr) {
      setErrors({
        full_name: nameErr,
        phone: phoneErr,
        email: emailErr,
      });
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const emailChanged = user.email !== originalEmail;
      const payload = {
        full_name: user.full_name,
        phone: user.phone,
      };
      
      // Only attach base64 avatar if it was newly uploaded/modified
      if (user.avatar && user.avatar.startsWith("data:")) {
        payload.avatar = user.avatar;
      }
      
      if (emailChanged) {
        // Request OTP for new email first
        await api.post("/user/request-email-update", { new_email: user.email });
        
        // Save other profile changes
        await api.put("/user/edit-profile", payload);
        
        toast.info("OTP sent to your new email. Please verify to update your email.");
        navigate("/otp-verification", {
          state: { email: user.email, purpose: "email-update" },
        });
      } else {
        const response = await api.put("/user/edit-profile", payload);
        toast.success(response?.data?.message || "Profile updated successfully");
        navigate("/profile");
      }
    } catch (error) {
      console.error(error.response);
      // Fallback if avatar payload was too large for backend JSON payload
      if (error?.response?.status === 413) {
        try {
          toast.warn("Image file is too large. Saving profile details without new photo.");
          const emailChanged = user.email !== originalEmail;
          
          if (emailChanged) {
            await api.post("/user/request-email-update", { new_email: user.email });
            await api.put("/user/edit-profile", {
              full_name: user.full_name,
              phone: user.phone,
            });
            toast.info("OTP sent to your new email. Please verify to update your email.");
            navigate("/otp-verification", {
              state: { email: user.email, purpose: "email-update" },
            });
          } else {
            const response = await api.put("/user/edit-profile", {
              full_name: user.full_name,
              phone: user.phone,
            });
            toast.success(response?.data?.message || "Profile updated successfully");
            navigate("/profile");
          }
        } catch (fallbackError) {
          toast.error("Failed to update profile details");
        }
      } else {
        toast.error(
          error?.response?.data?.detail?.[0]?.msg?.split(",")?.[1] ||
            error?.response?.data?.detail ||
            "Something went wrong"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100/80 flex flex-col items-center">
      
      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-100 shadow-inner mb-4">
          <img
            src={user.avatar || defaultAvatar}
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Upload Button */}
        <label
          htmlFor="avatar-upload"
          className="flex items-center gap-2 border border-gray-300 hover:border-black text-gray-700 hover:text-black font-semibold text-xs py-2 px-4 rounded-full transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <Camera className="w-4 h-4" />
          Upload New Photo
        </label>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Form Fields */}
      <form onSubmit={handleProfileEdit} className="w-full max-w-md flex flex-col gap-5">
        
        {/* Full Name field */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-400 font-bold mb-1.5 self-start">
            Full Name
          </label>
          <input
            type="text"
            value={user.full_name || ""}
            onChange={handleFullNameChange}
            className={`w-full py-4 px-5 bg-[#F8F9FA] hover:bg-[#F1F3F5]/80 focus:bg-white border ${
              errors.full_name ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-black"
            } rounded-2xl text-sm font-semibold text-black transition-all outline-none`}
            placeholder="Alex Johnson"
            required
          />
          {errors.full_name && (
            <p className="text-red-500 text-xs mt-1 self-start">{errors.full_name}</p>
          )}
        </div>

        {/* Phone Number field */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-400 font-bold mb-1.5 self-start">
            Phone Number
          </label>
          <input
            type="text"
            value={user.phone || ""}
            onChange={handlePhoneChange}
            className={`w-full py-4 px-5 bg-[#F8F9FA] hover:bg-[#F1F3F5]/80 focus:bg-white border ${
              errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-black"
            } rounded-2xl text-sm font-semibold text-black transition-all outline-none`}
            placeholder="+919876543210"
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1 self-start">{errors.phone}</p>
          )}
        </div>

        {/* Email Address field */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-400 font-bold mb-1.5 self-start">
            Email Address
          </label>
          <input
            type="email"
            value={user.email || ""}
            onChange={handleEmailChange}
            className={`w-full py-4 px-5 bg-[#F8F9FA] hover:bg-[#F1F3F5]/80 focus:bg-white border ${
              errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-black"
            } rounded-2xl text-sm font-semibold text-black transition-all outline-none`}
            placeholder="alex.j@cogodrive.com"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 self-start">{errors.email}</p>
          )}
        </div>

        {/* Action buttons (Save Changes & Cancel) */}
        <div className="flex items-center gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3.5 px-6 bg-black hover:bg-gray-900 text-white rounded-2xl font-bold text-sm transition-all shadow-md shadow-black/10 hover:shadow-black/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="flex-1 py-3.5 px-6 border border-gray-300 hover:border-black text-gray-700 hover:text-black rounded-2xl font-bold text-sm transition-all cursor-pointer hover:bg-gray-50 active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit_profile;
