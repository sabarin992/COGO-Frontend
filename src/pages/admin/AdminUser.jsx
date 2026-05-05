import React, { useEffect, useState } from "react";
import api from "../../api";

const AdminUser = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await api.get("/user/admin-users");
        setUsers(response.data)
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);


  const blockUser = async(user_id)=>{
    try {
        const response = await api.patch(`/user/admin/block/${user_id}`)
        console.log(response.data);
        
    } catch (error) {
        console.log(error.response);
        
    }
  }
  const unBlockUser = async(user_id)=>{
    try {
        const response = await api.patch(`/user/admin/unblock/${user_id}`)
        console.log(response.data);
        
    } catch (error) {
        console.log(error.response);
        
    }
  }
  return (
    <>
    <div>
        <h1>Admin Users</h1>
        <table border="1">
            <thead>
                <tr>
                <th>Name</th>
                <th>Emaiil</th>
                <th>Phone</th>
                <th>action</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user,index)=>{

                    return <tr key={user.id}>
                        <td>
                            {user?.full_name}
                        </td>
                        <td>
                            {user?.email}
                        </td>
                        <td>
                            {user?.phone}
                        </td>
                        <td>
                           <button onClick={()=>{blockUser(user.id)}}>block</button>
                           <button onClick={()=>{unBlockUser(user.id)}}>unblock</button>
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
    </div>
    </>
  )
};

export default AdminUser;
