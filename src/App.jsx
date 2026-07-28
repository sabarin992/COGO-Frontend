import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import AdminRoutes from "./routes/AdminRoutes";

import "react-toastify/dist/ReactToastify.css";
import ProfileRoutes from "./routes/ProfileRoutes";


function App() {
  const routes = useRoutes([
    ...UserRoutes,
    ...AuthRoutes,
    ...AdminRoutes,
    ...ProfileRoutes,

  ]);

  return (
    <>
      <ToastContainer />
      {routes}
    </>
  );
}

export default App;