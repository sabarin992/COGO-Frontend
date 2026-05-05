import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";


const AdminProtectedRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await api.get("/user/admin-users", {
          skipAuthRefresh: true,
        });
        setIsAdmin(true);
        console.log('admin route');
        
      } catch (error){
        setIsAdmin(false);
        console.log(error.response);
        
      }
    };

    checkAdmin();
  }, []);

  if (isAdmin === null) return null;

  return isAdmin ? children : <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;