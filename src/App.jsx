import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ProfileRoutes from "./routes/ProfileRoutes";
import NotFound from "./pages/NotFound";

import "react-toastify/dist/ReactToastify.css";
import VehicleRoutes from "./routes/VehicleRoutes";
import RideRoutes from "./routes/RideRoutes";
import ChatRoutes from "./routes/ChatRoutes";

function App() {
  const routes = useRoutes([
    ...UserRoutes,
    ...AuthRoutes,
    ...AdminRoutes,
    ...ProfileRoutes,
    ...VehicleRoutes,
    ...RideRoutes,
    ...ChatRoutes,
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <>
      <ToastContainer />
      {routes}
    </>
  );
}

export default App;