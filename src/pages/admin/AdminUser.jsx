import React, { useState, useEffect } from "react";
import api from "../../api";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminHeader from "../../components/admin/AdminHeader";
import {
  Plus,
  SlidersHorizontal,
  Download,
  Star,
  Ban,
  Unlock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

const AdminUser = () => {
  // Users and Loading State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Users from Backend
  const fetchUsers = async (search = "") => {
    setLoading(true);
    try {
      const response = await api.get("/user/admin-users", {
        params: { search }
      });
      // Map API fields (is_blocked, full_name) to matches required by layout
      const mappedUsers = response.data.map((user) => ({
        id: user.id,
        name: user.full_name,
        email: user.email,
        phone: user.phone || "N/A",
        status: user.is_blocked ? "Blocked" : "Active",
        rides: user.rides || Math.floor((user.id * 17) % 150) + 5, // deterministic mock rides
        rating: user.rating || (4.0 + ((user.id * 7) % 10) / 10).toFixed(1), // deterministic mock rating
        avatar: `https://i.pravatar.cc/40?img=${(user.id % 70) + 1}`,
      }));
      setUsers(mappedUsers);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search trigger
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Filter Logic
  const filteredUsers = users.filter((user) => {
    if (statusFilter === "All") return true;
    return user.status === statusFilter;
  });

  // Pagination Logic
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page when search or status filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Block/Unblock Action Handler
  const handleToggleBlock = async (userId, currentStatus) => {
    const isCurrentlyBlocked = currentStatus === "Blocked";
    const endpoint = isCurrentlyBlocked 
      ? `/user/admin/unblock/${userId}` 
      : `/user/admin/block/${userId}`;
    
    try {
      await api.patch(endpoint);
      toast.success(
        `User successfully ${isCurrentlyBlocked ? "unblocked" : "blocked"}`
      );
      // Refresh the user directory
      fetchUsers(searchQuery);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to update status");
    }
  };

  return (
    <>
      <AdminSideBar />
      <AdminHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="ml-72 pt-20 min-h-screen bg-gray-50">
        <div className="p-6 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-black">User Directory</h2>
              <p className="text-gray-500 mt-1">
                Manage and monitor your customer base.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Filter Status:
              </span>

              <div className="flex bg-gray-100 p-1 rounded-xl">
                {["All", "Active", "Blocked", "Pending"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      statusFilter === status
                        ? "bg-white text-black shadow-sm border border-gray-200"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 text-gray-500 text-sm cursor-pointer hover:text-black transition-colors">
                <SlidersHorizontal className="w-[18px] h-[18px]" />
                Advanced Filters
              </div>

              <button className="text-gray-500 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                {/* Table Head */}
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                      Total Rides
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                      Rating
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-sm text-gray-500">Loading user directory...</p>
                        </div>
                      </td>
                    </tr>
                  ) : currentItems.length > 0 ? (
                    currentItems.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-11 h-11 rounded-full object-cover border border-gray-100"
                            />

                            <div>
                              <p className="font-semibold text-black">
                                {user.name}
                              </p>

                              <p className="text-sm text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-gray-600">
                          {user.phone}
                        </td>

                        <td className="px-6 py-5 text-center text-gray-600">
                          {user.rides}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-1 text-black">
                            <span className="font-medium">{user.rating}</span>
                            <Star className="w-[18px] h-[18px] text-yellow-500 fill-yellow-500" />
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : user.status === "Blocked"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          {user.status === "Blocked" ? (
                            <button
                              onClick={() => handleToggleBlock(user.id, user.status)}
                              className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-all rounded-xl text-sm font-medium flex items-center gap-2 ml-auto cursor-pointer"
                            >
                              <Unlock className="w-[18px] h-[18px]" />
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleBlock(user.id, user.status)}
                              className="px-4 py-2 border border-red-200 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl text-sm font-medium flex items-center gap-2 ml-auto cursor-pointer"
                            >
                              <Ban className="w-[18px] h-[18px]" />
                              Block
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-10 text-gray-500"
                      >
                        No users found matching the filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-5 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {filteredUsers.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
                {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
              </p>

              {totalPages > 1 && (
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-[18px] h-[18px] text-gray-600" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        currentPage === page
                          ? "bg-black text-white"
                          : "border border-gray-200 hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-[18px] h-[18px] text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminUser;
