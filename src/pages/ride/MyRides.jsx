import React, { useEffect, useState } from "react";
import {
  getMyRides,
  deleteRide,
  getRecurringRides,
  getRecurringRideById,
  updateRecurringRide,
  pauseRecurringRide,
  resumeRecurringRide,
  deleteRecurringRide,
} from "../../services/rideService";
import RideGrid from "../../components/ride/RideGrid";
import EmptyRideState from "../../components/ride/EmptyRideState";
import RideSkeleton from "../../components/ride/RideSkeleton";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import RecurringScheduleCard from "../../components/ride/RecurringScheduleCard";
import ViewScheduleModal from "../../components/ride/ViewScheduleModal";
import EditScheduleModal from "../../components/ride/EditScheduleModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Car, Repeat, Calendar, Layers } from "lucide-react";
import { getUserProfile } from "../../services/userService";

const MyRides = () => {
  const [activeTab, setActiveTab] = useState("rides"); // "rides" | "recurring"
  const [rides, setRides] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Single ride deletion
  const [selectedRide, setSelectedRide] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Recurring schedule view/edit/cancel
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [scheduleDetails, setScheduleDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [showCancelScheduleModal, setShowCancelScheduleModal] = useState(false);
  const [scheduleToCancel, setScheduleToCancel] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  const navigate = useNavigate();

  const handlePostRideClick = async () => {
    try {
      const data = await getUserProfile();
      if (data && data.role === "rider") {
        navigate("/ride/post-ride");
      } else {
        toast.error("Only users with the Rider role can post a ride.");
      }
    } catch (err) {
      toast.error("Only users with the Rider role can post a ride.");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ridesRes, schedulesRes] = await Promise.allSettled([
        getMyRides(),
        getRecurringRides(),
      ]);

      if (ridesRes.status === "fulfilled") {
        setRides(ridesRes.value || []);
      } else {
        console.error("Failed to load rides:", ridesRes.reason);
      }

      if (schedulesRes.status === "fulfilled") {
        setSchedules(schedulesRes.value || []);
      } else {
        console.error("Failed to load schedules:", schedulesRes.reason);
      }
    } catch (error) {
      console.error("Failed to fetch rides:", error);
      toast.error("Unable to load your rides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Single Ride Deletion
  const handleDeleteClick = (ride) => {
    setSelectedRide(ride);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRide) return;
    try {
      await deleteRide(selectedRide.ride_id);
      setRides((current) => current.filter((r) => r.ride_id !== selectedRide.ride_id));
      setShowDeleteModal(false);
      setSelectedRide(null);
      toast.success("Ride deleted successfully.");
    } catch (error) {
      console.error("Failed to delete ride:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to delete ride. Please try again."
      );
    }
  };

  // Recurring Schedule View
  const handleViewSchedule = async (schedule) => {
    setSelectedSchedule(schedule);
    setShowViewModal(true);
    try {
      setLoadingDetails(true);
      const details = await getRecurringRideById(schedule.id);
      setScheduleDetails(details);
    } catch (error) {
      console.error("Failed to fetch schedule details:", error);
      toast.error("Failed to load schedule details.");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Recurring Schedule Edit
  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setShowEditModal(true);
  };

  const handleSaveScheduleEdit = async (scheduleId, updatePayload) => {
    try {
      setSavingEdit(true);
      const updated = await updateRecurringRide(scheduleId, updatePayload);
      setSchedules((current) =>
        current.map((s) => (s.id === scheduleId ? { ...s, ...updated } : s))
      );
      setShowEditModal(false);
      setSelectedSchedule(null);
      toast.success("Schedule updated. Future unbooked rides have been adjusted.");
      // Refresh both to reflect modified rides
      fetchData();
    } catch (error) {
      console.error("Failed to update schedule:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to update schedule."
      );
    } finally {
      setSavingEdit(false);
    }
  };

  // Recurring Schedule Pause / Resume
  const handlePauseToggle = async (schedule) => {
    const isPaused = schedule.schedule_status === "Paused" || !schedule.is_active;
    try {
      setLoadingAction(schedule.id);
      if (isPaused) {
        const res = await resumeRecurringRide(schedule.id);
        setSchedules((current) =>
          current.map((s) =>
            s.id === schedule.id ? { ...s, is_active: true, schedule_status: "Active" } : s
          )
        );
        toast.success("Schedule resumed successfully. Upcoming rides generated.");
      } else {
        const res = await pauseRecurringRide(schedule.id);
        setSchedules((current) =>
          current.map((s) =>
            s.id === schedule.id ? { ...s, is_active: false, schedule_status: "Paused" } : s
          )
        );
        toast.info("Schedule paused. No new rides will be published.");
      }
      fetchData();
    } catch (error) {
      console.error("Failed to toggle schedule pause:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to update schedule status."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  // Recurring Schedule Cancel
  const handleCancelScheduleClick = (schedule) => {
    setScheduleToCancel(schedule);
    setShowCancelScheduleModal(true);
  };

  const handleConfirmCancelSchedule = async () => {
    if (!scheduleToCancel) return;
    try {
      await deleteRecurringRide(scheduleToCancel.id);
      setSchedules((current) => current.filter((s) => s.id !== scheduleToCancel.id));
      setShowCancelScheduleModal(false);
      setScheduleToCancel(null);
      toast.success("Schedule cancelled. Booked rides have been safely preserved.");
      fetchData();
    } catch (error) {
      console.error("Failed to cancel schedule:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to cancel schedule."
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded-xl w-64 animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <RideSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Ride Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your individual journeys, recurring schedules, and incoming passenger requests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handlePostRideClick}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition shrink-0"
          >
            <Plus size={16} />
            <span>Post a Ride</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-3 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("rides")}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold transition border-b-2 ${
            activeTab === "rides"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Car size={16} />
          <span>Individual Rides</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 font-bold">
            {rides.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("recurring")}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold transition border-b-2 ${
            activeTab === "recurring"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Repeat size={16} />
          <span>Recurring Schedules</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 font-bold">
            {schedules.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Individual Rides */}
      {activeTab === "rides" && (
        <div>
          {rides.length === 0 ? (
            <EmptyRideState />
          ) : (
            <RideGrid
              rides={rides}
              onView={(ride) => {
                navigate(`/ride/my-rides/${ride.ride_id}`);
              }}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      )}

      {/* TAB 2: Recurring Schedules */}
      {activeTab === "recurring" && (
        <div>
          {schedules.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/90 p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center mx-auto">
                <Repeat size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Recurring Schedules</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Save time by setting up recurring schedules for your daily or shift commutes.
                Rides are generated automatically for your selected days.
              </p>
              <button
                type="button"
                onClick={handlePostRideClick}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition"
              >
                <Plus size={15} />
                <span>Create Recurring Ride</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schedules.map((schedule) => (
                <RecurringScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onView={handleViewSchedule}
                  onEdit={handleEditSchedule}
                  onPauseToggle={handlePauseToggle}
                  onCancel={handleCancelScheduleClick}
                  loadingAction={loadingAction}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {/* 1. Single Ride Deletion Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedRide(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Ride?"
        message="Are you sure you want to delete this ride? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* 2. Recurring Schedule View Details Modal */}
      <ViewScheduleModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedSchedule(null);
          setScheduleDetails(null);
        }}
        scheduleDetails={scheduleDetails || selectedSchedule}
        loading={loadingDetails}
      />

      {/* 3. Recurring Schedule Edit Modal */}
      <EditScheduleModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedSchedule(null);
        }}
        schedule={selectedSchedule}
        onSave={handleSaveScheduleEdit}
        saving={savingEdit}
      />

      {/* 4. Recurring Schedule Cancellation Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelScheduleModal}
        onClose={() => {
          setShowCancelScheduleModal(false);
          setScheduleToCancel(null);
        }}
        onConfirm={handleConfirmCancelSchedule}
        title="Cancel Recurring Schedule?"
        message="Are you sure you want to cancel this recurring schedule? All future unbooked rides will be deleted. Any rides that already have accepted passenger bookings will be safely preserved as independent rides."
        confirmText="Yes, Cancel Schedule"
        cancelText="Keep Schedule"
        type="danger"
      />
    </div>
  );
};

export default MyRides;
