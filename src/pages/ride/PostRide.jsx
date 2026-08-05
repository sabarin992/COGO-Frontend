import { RideProvider } from "../../context/RideContext";
import RideWizard from "../../components/ride/RideWizard";

const PostRide = () => {
  return (
    <RideProvider>
      <RideWizard />
    </RideProvider>
  );
};

export default PostRide;