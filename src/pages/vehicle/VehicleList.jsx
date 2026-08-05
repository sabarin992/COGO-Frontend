import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import VehicleGrid from "../../components/vehicle/VehicleGrid";
import VehicleSkeleton from "../../components/vehicle/VehicleSkeleton";
import EmptyVehicleState from "../../components/vehicle/EmptyVehicleState";
import DeleteVehicleModal from "../../components/vehicle/DeleteVehicleModal";

import { getVehicles, deleteVehicle } from "../../services/vehicleService";

const VehicleList = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchVehiclesList = async () => {
    try {
      setLoading(true);
      const response = await getVehicles();
      // Handle both array responses or object wrapped data
      const data = response;
      if (Array.isArray(data)) {
        setVehicles(data);
      } else if (Array.isArray(data?.vehicles)) {
        setVehicles(data.vehicles);
      } else {
        setVehicles([]);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to load vehicles list."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiclesList();
  }, []);

  const handleEdit = (vehicle) => {
    navigate(`/profile/vehicles/edit/${vehicle.id}`);
  };

  const handleDeleteClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVehicle) return;

    try {
      setDeleting(true);
      await deleteVehicle(selectedVehicle.id);
      
      // Remove deleted vehicle from local state without reloading
      setVehicles((prevVehicles) =>
        prevVehicles.filter((item) => item.id !== selectedVehicle.id)
      );

      toast.success("Vehicle deleted successfully.");
      setIsDeleteModalOpen(false);
      setSelectedVehicle(null);
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to delete vehicle."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Section matching reference UI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Vehicle Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and update your active transport fleet.
          </p>
        </div>

        <Link
          to="/profile/vehicles/add"
          className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-medium px-5 py-3 rounded-2xl transition-all duration-200 shadow-sm hover:shadow active:scale-95 text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Vehicle
        </Link>
      </div>

      {/* Content Section */}
      {loading ? (
        <VehicleSkeleton count={2} />
      ) : vehicles.length === 0 ? (
        <EmptyVehicleState />
      ) : (
        <VehicleGrid
          vehicles={vehicles}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteVehicleModal
        isOpen={isDeleteModalOpen}
        vehicle={selectedVehicle}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedVehicle(null);
        }}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />
    </div>
  );
};

export default VehicleList;
