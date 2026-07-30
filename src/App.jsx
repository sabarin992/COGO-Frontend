import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ProfileRoutes from "./routes/ProfileRoutes";
import NotFound from "./pages/NotFound";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const routes = useRoutes([
    ...UserRoutes,
    ...AuthRoutes,
    ...AdminRoutes,
    ...ProfileRoutes,
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