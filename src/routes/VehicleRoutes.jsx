import ProtectedRoute from "../components/ProtectedRoute";
import ProfileLayout from "../layouts/ProfileLayout";
import VehicleList from "../pages/vehicle/VehicleList";
import AddVehicle from "../pages/vehicle/AddVehicle";
import EditVehicle from "../pages/vehicle/EditVehicle";

const VehicleRoutes = [
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfileLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "vehicles",
        element: <VehicleList />,
      },
      {
        path: "vehicles/add",
        element: <AddVehicle />,
      },
      {
        path: "vehicles/edit/:vehicleId",
        element: <EditVehicle />,
      },
    ],
  },
];

export default VehicleRoutes;