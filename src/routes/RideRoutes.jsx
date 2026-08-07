import PostRide from "../pages/ride/PostRide";
import RideSuccess from "../pages/ride/RideSuccess";
import RideFailure from "../pages/ride/RideFailure";
import ProtectedRoute from "../components/ProtectedRoute";
import UserLayout from "../layouts/UserLayout";
import MyRides from "../pages/ride/MyRides";

const RideRoutes = [
  {
    path: "/ride",
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "post-ride",
        element: <PostRide />,
      },
      {
        path: "my-rides",
        element: <MyRides />,
      },
      {
        path: "post-ride/success",
        element: <RideSuccess />,
      },
      {
        path: "post-ride/failure",
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
