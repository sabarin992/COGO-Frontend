import PostRide from "../pages/ride/PostRide";
import RideSuccess from "../pages/ride/RideSuccess";
import RideFailure from "../pages/ride/RideFailure";
import ProtectedRoute from "../components/ProtectedRoute";
import UserLayout from "../layouts/UserLayout";

const RideRoutes = [
  {
    path: "/post-ride",
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <PostRide />,
      },
      {
        path: "success",
        element: <RideSuccess />,
      },
      {
        path: "failure",
        element: <RideFailure />,
      },
    ],
  },
];

export default RideRoutes;

// [
//   {
//     path: "/post-ride",
//     element: <PostRide />,
//   },
//   {
//     path: "/ride/success",
//     element: <RideSuccess />,
//   },
//   {
//     path: "/ride/failure",
//     element: <RideFailure />,
//   },
// ];

