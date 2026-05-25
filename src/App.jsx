import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import AdminRoutes from "./routes/AdminRoutes";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const routes = useRoutes([
    ...UserRoutes,
    ...AuthRoutes,
    ...AdminRoutes,
  ]);

  return (
    <>
      <ToastContainer />
      {routes}
    </>
  );
}

export default App;