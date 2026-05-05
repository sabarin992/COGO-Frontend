import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const Edit_profile = () => {
  const [user, setUser] = useState({
    full_name: "",
    phone: "",
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        setUser(response?.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProfile();
  }, []);

  const handleProfileEdit = async () => {
    try {
      const response = await api.put("/user/edit-profile", {
        full_name: user.full_name,
        phone: user.phone,
      });
      toast.success(response?.data?.message)
      console.log(response.data);
    } catch (error) {
      console.log(error.response);

      toast.error(error?.response?.data?.detail || "Something went wrong");
      toast.error(
        error?.response?.data?.detail?.[0]?.msg.split(",")[0] === "Value error"
          ? error?.response?.data?.detail?.[0]?.msg.split(",")[1]
          : error?.response?.data?.detail?.[0]?.msg || "Something went wrong",
      );
    }
  };

  return (
    <div>
      <input
        type="text"
        value={user.full_name}
        onChange={(e) => setUser({ ...user, full_name: e.target.value })}
      />
      <input
        type="text"
        value={user.phone}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
      />
      <button onClick={handleProfileEdit}>Edit</button>
    </div>
  );
};

export default Edit_profile;
