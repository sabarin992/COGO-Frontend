
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserProfile } from "../services/userService";

const usePostRide = () => {
  const navigate = useNavigate();

  const handlePostRideClick = async () => {
    try {
      const data = await getUserProfile();

      if (data && data.role === "rider") {
        navigate("/ride/post-ride");
      } else {
        toast.error("Only users with the Rider role can post a ride.");
      }
    } catch (err) {
      toast.error("Only users with the Rider role can post a ride.");
    }
  };

  return { handlePostRideClick };
};

export default usePostRide;
