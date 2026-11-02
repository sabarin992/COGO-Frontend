import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

import RideHeader from "../../components/admin/ride/RideHeader";
import RideStatsCards from "../../components/admin/ride/RideStatsCards";
import RideTable from "../../components/admin/ride/RideTable";
import RideDetailsModal from "../../components/admin/ride/RideDetailsModal";
import RideCancelModal from "../../components/admin/ride/RideCancelModal";
import Pagination from "../../components/common/Pagination";

import {
  getAdminRides,
  getAdminRideStats,
  getAdminRideDetails,
  cancelAdminRide,
} from "../../services/adminRideService";

const ITEMS_PER_PAGE = 8;

const AdminRideManagement = () => {
  const { searchQuery } = useOutletContext() || {};
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery || "");

  // Stats State
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Table Data State
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter & Pagination State
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Details Modal State
  const [selectedRide, setSelectedRide] = useState(null);
  const [rideDetails, setRideDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Cancel Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rideToCancel, setRideToCancel] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  /* -----------------------------------------
        Debounce Search
  ------------------------------------------*/
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery || "");
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* -----------------------------------------
        Fetch Stats
  ------------------------------------------*/
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await getAdminRideStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch ride stats:", error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /* -----------------------------------------
        Fetch Rides
  ------------------------------------------*/
  const fetchRides = useCallback(
    async (page = 1, search = "", status = "All") => {
      setLoading(true);
      try {
        const data = await getAdminRides({
          page,
          size: ITEMS_PER_PAGE,
          search,
          status,
        });

        const items = data.items || [];
        setRides(items);
        setTotalItems(data.total || 0);

        if (items.length > 0) {
          setSelectedRide((prev) => {
            if (!prev) return items[0];
            const found = items.find((i) => i.ride_id === prev.ride_id);
            return found || items[0];
          });
        } else {
          setSelectedRide(null);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.detail || "Failed to fetch ride list"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* -----------------------------------------
        Effects
  ------------------------------------------*/
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchRides(currentPage, debouncedSearch, statusFilter);
  }, [currentPage, debouncedSearch, statusFilter, fetchRides]);

  // Reset to page 1 on filter or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  /* -----------------------------------------
        View Ride Details
  ------------------------------------------*/
  const handleViewRide = async (ride) => {
    setSelectedRide(ride);
    setDetailsModalOpen(true);
    setDetailsLoading(true);
    try {
      const details = await getAdminRideDetails(ride.ride_id);
      setRideDetails(details);
    } catch (error) {
      toast.error(
        error?.response?.data?.detail || "Failed to load complete ride details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  /* -----------------------------------------
        Cancel Ride Actions
  ------------------------------------------*/
  const handleInitiateCancel = (ride) => {
    setRideToCancel(ride);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async (rideId, reason) => {
    setActionLoading(true);
    try {
      await cancelAdminRide(rideId, reason);
      toast.success(`Ride #RD-${String(rideId).padStart(4, "0")} cancelled successfully.`);

      setCancelModalOpen(false);
      setDetailsModalOpen(false);
      setRideToCancel(null);

      // Refresh rides and statistics
      fetchRides(currentPage, debouncedSearch, statusFilter);
      fetchStats();
    } catch (error) {
      toast.error(
        error?.response?.data?.detail || "Failed to cancel ride. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-10">
      {/* Header with status filters */}
      <RideHeader
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Summary Statistics Cards */}
      <RideStatsCards
        stats={stats}
        loading={statsLoading}
        activeStatus={statusFilter}
        onSelectStatus={setStatusFilter}
      />

      {/* Rides Table */}
      <RideTable
        loading={loading}
        rides={rides}
        selectedRide={selectedRide}
        onViewRide={handleViewRide}
        onCancelRide={handleInitiateCancel}
      />

      {/* Reusable Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        itemLabel="rides"
      />

      {/* Ride Details Modal */}
      <RideDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        ride={rideDetails}
        loading={detailsLoading}
        onInitiateCancel={handleInitiateCancel}
      />

      {/* Ride Cancellation Modal */}
      <RideCancelModal
        isOpen={cancelModalOpen}
        onClose={() => {
          if (!actionLoading) setCancelModalOpen(false);
        }}
        ride={rideToCancel}
        onConfirmCancel={handleConfirmCancel}
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminRideManagement;

