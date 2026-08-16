import PostRide from "../pages/ride/PostRide";
import RideSuccess from "../pages/ride/RideSuccess";
import RideFailure from "../pages/ride/RideFailure";
import ProtectedRoute from "../components/ProtectedRoute";
import UserLayout from "../layouts/UserLayout";
import MyRides from "../pages/ride/MyRides";
import RideDetails from "../pages/ride/RideDetails";
import EditRide from "../pages/ride/EditRide";
import SearchRides from "../pages/ride/SearchRides";
import RideReview from "../pages/ride/RideReview";
import RideRequestSuccess from "../pages/ride/RideRequestSuccess";

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
        path: "my-rides/:rideId",
        element: <RideDetails />,
      },
      {
        path: "my-rides/edit/:rideId",
        element: <EditRide />,
      },
      {
        path: "post-ride/success",
        element: <RideSuccess />,
      },
      {
        path: "post-ride/failure",
        element: <RideFailure />,
      },
      {
        path: "search",
        element: <SearchRides />,
      },
      {
        path: "/ride/:rideId/details",
        element: <RideDetails />,
      },
      {
        path: "/ride/:rideId/review",
        element: <RideReview />,
      },
      {
        path: "/ride/request-success",
        element: <RideRequestSuccess />,
      },
    ],
  },
];

export default RideRoutes;
