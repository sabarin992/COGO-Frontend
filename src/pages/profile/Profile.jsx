import React, { useEffect, useState } from "react";
import api from "../../api";

const Profile = () => {
  const [user, setUser] = useState({});

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
        <div>edit profile</div>
      </div>
    </>
  );
};

export default Profile;
