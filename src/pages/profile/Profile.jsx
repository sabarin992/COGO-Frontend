import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { Star, Pencil } from "lucide-react";
import defaultAvatar from "../../assets/avatar-placeholder.png";
import { getUserProfile } from "../../services/userService";

const Profile = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getUserProfile();
        console.log(data);
        
        setUser(data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getData();
  }, []);

  const getUsers = async () => {
    try {
      const response = await api.get("/user/admin/users");
      console.log(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100/80 relative flex flex-col items-center">
      
      {/* Edit Profile Button */}
      <button
        onClick={() => navigate("/profile/edit-profile")}
        className="absolute top-6 right-6 flex items-center gap-2 border border-gray-200 hover:border-black hover:bg-gray-50 text-gray-600 hover:text-black font-semibold text-xs py-2.5 px-4 rounded-full transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98]"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit Profile
      </button>

      {/* Avatar Container */}
      <div className="relative group mt-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-100 shadow-inner">
          <img
            src={user.avatar || defaultAvatar}
            alt="Profile Avatar"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Profile Details */}
      <h2 className="text-3xl font-extrabold text-black mt-6 tracking-tight">
        {user.full_name || "Alex Johnson"}
      </h2>

      {/* Star Ratings */}
      <div className="flex items-center mt-3 gap-1">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
        </div>
        <span className="text-xs text-gray-800 font-extrabold ml-1.5">5.0</span>
        <span className="text-xs text-gray-400 font-medium">(2,450 Ratings)</span>
      </div>

      {/* Field Containers */}
      <div className="w-full max-w-md mt-8 flex flex-col gap-4">
        {/* Phone Box */}
        <div className="bg-[#F8F9FA] border border-gray-50 rounded-2xl py-4 px-6 text-center transition-all duration-300 hover:bg-[#F1F3F5]/80 hover:shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
            Phone
          </span>
          <span className="text-base font-extrabold text-black mt-1 block">
            {user.phone || "+91 98765 43210"}
          </span>
        </div>

        {/* Email Box */}
        <div className="bg-[#F8F9FA] border border-gray-50 rounded-2xl py-4 px-6 text-center transition-all duration-300 hover:bg-[#F1F3F5]/80 hover:shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
            Email
          </span>
          <span className="text-base font-extrabold text-black mt-1 block">
            {user.email || "alex.j@cogodrive.com"}
          </span>
        </div>
      </div>

    </div>
  );
};

export default Profile;
