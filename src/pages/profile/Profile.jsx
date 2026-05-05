import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/user/profile");
        setUser(response.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getData();
  }, []);

  const getUsers = async()=>{
    try {
        const response = await api.get("/user/admin/users");
        console.log(response.data);
        
    } catch (error) {
        console.log(error.response);
        
    }
  }

  return (
    <>
      <div className="flex justify-between p-10">
        <div className="flex flex-col">
          <h3>Name = {user.full_name}</h3>
          <h3>email = {user.email}</h3>
          <h3>Phone Number = {user.phone}</h3>
          <h3>Verify Your Govt ID</h3>
          <h3>Edit email</h3>
        </div>
        <div onClick={()=>{navigate("/edit-profile")}}>edit profile</div>
      </div>
      <button onClick={getUsers}>Users</button>
    </>
  );
};

export default Profile;
