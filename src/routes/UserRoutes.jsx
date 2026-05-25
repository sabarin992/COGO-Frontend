import { Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home";


const UserRoutes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
];

export default UserRoutes;

// const UserRoutes = () => {
//   return (
//     <>
//       <Route
//         path="/"
//         element={
//           <ProtectedRoute>
//             <Home />
//           </ProtectedRoute>
//         }
//       />
//     </>
//   );
// };

// export default UserRoutes;