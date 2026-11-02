import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

import BookingHeader from "../../components/admin/booking/BookingHeader";
import BookingStatsCards from "../../components/admin/booking/BookingStatsCards";
import BookingTable from "../../components/admin/booking/BookingTable";
import BookingDetailsModal from "../../components/admin/booking/BookingDetailsModal";
import BookingCancelModal from "../../components/admin/booking/BookingCancelModal";
import Pagination from "../../components/common/Pagination";

import {
  getAdminBookings,
  getAdminBookingStatistics,
  getAdminBookingDetails,
  cancelAdminBooking,
} from "../../services/adminBookingService";

const ITEMS_PER_PAGE = 8;

const AdminBookingManagement = () => {
  const { searchQuery } = useOutletContext() || {};
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery || "");

  // Stats State
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Table Data State
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter & Pagination State
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Details Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Cancel Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
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
      const data = await getAdminBookingStatistics();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch booking stats:", error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /* -----------------------------------------
        Fetch Bookings
  ------------------------------------------*/
  const fetchBookings = useCallback(
    async (page = 1, search = "", status = "All") => {
      setLoading(true);
      try {
        const data = await getAdminBookings({
          page,
          size: ITEMS_PER_PAGE,
          search,
          status,
        });

        const items = data.items || [];
        setBookings(items);
        setTotalItems(data.total || 0);

        if (items.length > 0) {
          setSelectedBooking((prev) => {
            if (!prev) return items[0];
            const found = items.find((i) => i.booking_id === prev.booking_id);
            return found || items[0];
          });
        } else {
          setSelectedBooking(null);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.detail || "Failed to fetch bookings list"
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
    fetchBookings(currentPage, debouncedSearch, statusFilter);
  }, [currentPage, debouncedSearch, statusFilter, fetchBookings]);

  // Reset to page 1 on filter or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  /* -----------------------------------------
        View Booking Details
  ------------------------------------------*/
  const handleViewBooking = async (booking) => {
    setSelectedBooking(booking);
    setDetailsModalOpen(true);
    setDetailsLoading(true);
    try {
      const details = await getAdminBookingDetails(booking.booking_id);
      setBookingDetails(details);
    } catch (error) {
      toast.error(
        error?.response?.data?.detail || "Failed to load complete booking details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  /* -----------------------------------------
        Cancel Booking Actions
  ------------------------------------------*/
  const handleInitiateCancel = (booking) => {
    setBookingToCancel(booking);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async (bookingId, reason) => {
    setActionLoading(true);
    try {
      await cancelAdminBooking(bookingId, reason);
      toast.success(
        `Booking #BK-${String(bookingId).padStart(4, "0")} cancelled successfully.`
      );

      setCancelModalOpen(false);
      setDetailsModalOpen(false);
      setBookingToCancel(null);

      // Refresh list and statistics
      fetchBookings(currentPage, debouncedSearch, statusFilter);
      fetchStats();
    } catch (error) {
      toast.error(
        error?.response?.data?.detail || "Failed to cancel booking. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-10">
      {/* Header with status filters */}
      <BookingHeader
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Summary Statistics Cards */}
      <BookingStatsCards
        stats={stats}
        loading={statsLoading}
        activeStatus={statusFilter}
        onSelectStatus={setStatusFilter}
      />

      {/* Bookings Table */}
      <BookingTable
        loading={loading}
        bookings={bookings}
        selectedBooking={selectedBooking}
        onViewBooking={handleViewBooking}
        onCancelBooking={handleInitiateCancel}
      />

      {/* Reusable Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        itemLabel="bookings"
      />

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        booking={bookingDetails}
        loading={detailsLoading}
        onInitiateCancel={handleInitiateCancel}
      />

      {/* Booking Cancellation Modal */}
      <BookingCancelModal
        isOpen={cancelModalOpen}
        onClose={() => {
          if (!actionLoading) setCancelModalOpen(false);
        }}
        booking={bookingToCancel}
        onConfirmCancel={handleConfirmCancel}
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminBookingManagement;

