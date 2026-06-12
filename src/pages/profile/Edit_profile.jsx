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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
            navigate("/verify-otp", {
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
            onChange={(e) => setUser({ ...user, full_name: e.target.value })}
            className="w-full py-4 px-5 bg-[#F8F9FA] hover:bg-[#F1F3F5]/80 focus:bg-white border border-gray-200 focus:border-black rounded-2xl text-sm font-semibold text-black transition-all outline-none"
            placeholder="Alex Johnson"
            required
          />
        </div>

        {/* Phone Number field */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-400 font-bold mb-1.5 self-start">
            Phone Number
          </label>
          <input
            type="text"
            value={user.phone || ""}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className="w-full py-4 px-5 bg-[#F8F9FA] hover:bg-[#F1F3F5]/80 focus:bg-white border border-gray-200 focus:border-black rounded-2xl text-sm font-semibold text-black transition-all outline-none"
            placeholder="+91 98765 43210"
            required
          />
        </div>

        {/* Email Address field */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-400 font-bold mb-1.5 self-start">
            Email Address
          </label>
          <input
            type="email"
            value={user.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full py-4 px-5 bg-[#F8F9FA] hover:bg-[#F1F3F5]/80 focus:bg-white border border-gray-200 focus:border-black rounded-2xl text-sm font-semibold text-black transition-all outline-none"
            placeholder="alex.j@cogodrive.com"
            required
          />
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
