import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Eye,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  User as UserIcon,
  Calendar,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import {
  getAdminKycList,
  approveKyc,
  rejectKyc,
} from "../../services/kycService";

const AdminKYCVerification = () => {
  const { searchQuery } = useOutletContext() || {};
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery || "");

  // List and Pagination States
  const [kycList, setKycList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  // Review Side Panel States
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [activeSide, setActiveSide] = useState("front"); // "front" | "back"
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);

  // Rejection Reason Form State
  const [rejectionCategory, setRejectionCategory] = useState(
    "Blurry or Unreadable Image",
  );
  const [rejectionDetails, setRejectionDetails] = useState("");

  // Confirmation Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    actionType: "approve", // "approve" | "reject"
    title: "",
    message: "",
    confirmText: "",
    type: "info",
    reasonToSubmit: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  const ITEMS_PER_PAGE = 10;

  // Debounce Search Query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery || "");
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch KYC records from Backend API
  const fetchKycRecords = async (page = 1, search = "", status = "All") => {
    setLoading(true);
    try {
      const data = await getAdminKycList({
        search,
        status,
        page,
        size: ITEMS_PER_PAGE,
      });

      const items = data.items || [];
      setKycList(items);
      setTotalItems(data.total || 0);
      setTotalPages(data.pages || 1);

      // Auto select first record if none selected or current selection not in items
      if (items.length > 0) {
        setSelectedKyc((prev) => {
          if (!prev) return items[0];
          const found = items.find((i) => i.kyc_id === prev.kyc_id);
          return found || items[0];
        });
      } else {
        setSelectedKyc(null);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.detail || "Failed to fetch KYC records",
      );
    } finally {
      setLoading(false);
    }
  };

  // Trigger Fetch on page, search, or status change
  useEffect(() => {
    fetchKycRecords(currentPage, debouncedSearch, statusFilter);
  }, [currentPage, debouncedSearch, statusFilter]);

  // Reset to Page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  // Reset document side view when selected KYC changes
  useEffect(() => {
    setActiveSide("front");
    setRejectionDetails("");
  }, [selectedKyc?.kyc_id]);

  // Approve Trigger (Opens Confirmation Modal)
  const handleInitiateApprove = () => {
    if (!selectedKyc) return;
    setModalConfig({
      actionType: "approve",
      title: "Approve KYC Verification",
      message: `Are you sure you want to approve the KYC document for ${selectedKyc.user_name} (${selectedKyc.document_type} - ${selectedKyc.document_number})?`,
      confirmText: "Yes, Approve",
      type: "info",
      reasonToSubmit: "",
    });
    setModalOpen(true);
  };

  // Reject Trigger (Validates reason then opens Confirmation Modal)
  const handleInitiateReject = () => {
    if (!selectedKyc) return;

    let finalReason = rejectionCategory;
    if (rejectionDetails.trim()) {
      finalReason += `: ${rejectionDetails.trim()}`;
    }

    setModalConfig({
      actionType: "reject",
      title: "Reject KYC Verification",
      message: `Are you sure you want to reject the KYC document for ${selectedKyc.user_name}?\n\nReason: "${finalReason}"`,
      confirmText: "Yes, Reject",
      type: "danger",
      reasonToSubmit: finalReason,
    });
    setModalOpen(true);
  };

  // Modal Confirmation Handler (Calls Backend API)
  const handleConfirmAction = async () => {
    if (!selectedKyc) return;
    setActionLoading(true);

    try {
      if (modalConfig.actionType === "approve") {
        await approveKyc(selectedKyc.kyc_id);
        toast.success(`KYC for ${selectedKyc.user_name} approved successfully`);
      } else {
        await rejectKyc(selectedKyc.kyc_id, modalConfig.reasonToSubmit);
        toast.success(`KYC for ${selectedKyc.user_name} rejected successfully`);
      }

      setModalOpen(false);
      // Refresh current page list
      fetchKycRecords(currentPage, debouncedSearch, statusFilter);
    } catch (error) {
      toast.error(
        error?.response?.data?.detail || "Action failed. Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "verified" || s === "approved") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 uppercase tracking-tighter">
          Approved
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 uppercase tracking-tighter">
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-tighter">
        Pending
      </span>
    );
  };

  const activeDocUrl =
    activeSide === "front"
      ? selectedKyc?.front_document_url
      : selectedKyc?.back_document_url;

  return (
    <div className="flex flex-1 min-h-[calc(100vh-80px)] overflow-hidden bg-gray-50">
      {/* Left Panel: Verification Queue */}
      <section className="flex-1 overflow-y-auto p-6 lg:p-8 border-r border-gray-200">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                KYC Verification Queue
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Review and process user identity verification submissions.
              </p>
            </div>

            {/* Status Tabs */}
            <div className="flex bg-gray-200/80 p-1 rounded-xl w-fit">
              {["All", "Pending", "Verified", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    statusFilter === status
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {status === "Verified" ? "Approved" : status}
                </button>
              ))}
            </div>
          </header>

          {/* Data Table Container */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      User
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Document Type
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Submission Date
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-sm text-gray-500">
                            Loading KYC queue...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : kycList.length > 0 ? (
                    kycList.map((item) => {
                      const isSelected = selectedKyc?.kyc_id === item.kyc_id;
                      return (
                        <tr
                          key={item.kyc_id}
                          onClick={() => setSelectedKyc(item)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-gray-100/90 font-medium"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                {item.user_name
                                  ? item.user_name.slice(0, 2).toUpperCase()
                                  : "US"}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {item.user_name}
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  {item.user_code}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800">
                            {item.document_type}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.created_at}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              {getStatusBadge(item.status)}
                              {item.status === "rejected" && item.rejection_reason && (
                                <p className="text-[11px] text-red-600 font-medium line-clamp-1">
                                  Reason: {item.rejection_reason}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedKyc(item);
                              }}
                              className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-gray-900 text-white"
                                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-12 text-gray-500 text-sm"
                      >
                        No KYC submissions found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">
                Showing{" "}
                {totalItems > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}{" "}
                to {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of{" "}
                {totalItems} submissions
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          currentPage === p
                            ? "bg-gray-900 text-white"
                            : "border border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel: Document Review (Focused Side View) */}
      <aside className="w-[480px] bg-white border-l border-gray-200 flex flex-col overflow-y-auto shrink-0 shadow-lg">
        {selectedKyc ? (
          <div className="p-6 sm:p-8">
            {/* Case Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Reviewing Case
                </span>
                <h3 className="text-xl font-extrabold text-gray-900">
                  {selectedKyc.user_name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Submission ID: KYC-X{selectedKyc.kyc_id}-{selectedKyc.user_code}
                </p>
              </div>
              <div>{getStatusBadge(selectedKyc.status)}</div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 border border-gray-200 rounded-xl bg-gray-50">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">
                  User ID
                </p>
                <p className="text-xs font-semibold text-gray-900">
                  {selectedKyc.user_code}
                </p>
              </div>
              <div className="p-3.5 border border-gray-200 rounded-xl bg-gray-50">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">
                  Submission Date
                </p>
                <p className="text-xs font-semibold text-gray-900">
                  {selectedKyc.created_at}
                </p>
              </div>
            </div>

            {/* Document Preview & Front/Back Side Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-700" />
                  <span className="text-xs font-bold text-gray-900">
                    {selectedKyc.document_type} ({selectedKyc.document_number})
                  </span>
                </div>
                {activeDocUrl && (
                  <button
                    type="button"
                    onClick={() => setFullPreviewOpen(true)}
                    className="text-xs font-semibold text-gray-900 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    Full Preview
                  </button>
                )}
              </div>

              {/* Front / Back Toggle Buttons */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setActiveSide("front")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    activeSide === "front"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Front Side
                </button>
                <button
                  type="button"
                  disabled={!selectedKyc.back_document_url}
                  onClick={() => setActiveSide("back")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    !selectedKyc.back_document_url
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : activeSide === "back"
                        ? "bg-gray-900 text-white border-gray-900 cursor-pointer"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
                  }`}
                >
                  {selectedKyc.back_document_url
                    ? "Back Side"
                    : "No Back Side"}
                </button>
              </div>

              {/* Image Container */}
              <div className="aspect-[16/10] w-full bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden relative group flex items-center justify-center">
                {activeDocUrl ? (
                  <>
                    <img
                      src={activeDocUrl}
                      alt={`${selectedKyc.document_type} - ${activeSide}`}
                      className="w-full h-full object-contain bg-gray-900/5"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={() => setFullPreviewOpen(true)}
                        className="bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg hover:bg-gray-100 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <ZoomIn className="w-4 h-4" />
                        View Full Size
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 text-gray-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No image available for this side</p>
                  </div>
                )}
              </div>
            </div>

            {/* Verdict Action */}
            <div className="space-y-5 pt-4 border-t border-gray-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Verdict Action
              </h4>

              {/* Rejection Form Box */}
              <div className="p-4 bg-red-50/60 border border-red-200 rounded-2xl">
                <label className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
                  Rejection Reason
                </label>
                <select
                  value={rejectionCategory}
                  onChange={(e) => setRejectionCategory(e.target.value)}
                  className="w-full bg-white border border-red-200 rounded-xl p-2.5 text-xs text-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 mb-2 font-medium"
                >
                  <option value="Blurry or Unreadable Image">
                    Blurry or Unreadable Image
                  </option>
                  <option value="Expired Document">Expired Document</option>
                  <option value="Name Mismatch">Name Mismatch</option>
                  <option value="Incomplete Document">Incomplete Document</option>
                  <option value="Other / Fraud Suspected">
                    Other / Fraud Suspected
                  </option>
                </select>
                <textarea
                  value={rejectionDetails}
                  onChange={(e) => setRejectionDetails(e.target.value)}
                  placeholder="Additional details for the user (optional)..."
                  rows={2}
                  className="w-full bg-white border border-red-200 rounded-xl p-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* Approve / Reject Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleInitiateApprove}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={handleInitiateReject}
                  className="flex-1 py-3 border border-red-300 bg-white text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <FileText className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-sm font-semibold text-gray-600">
              Select a submission to review
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Click &quot;Review&quot; on any user in the queue table.
            </p>
          </div>
        )}
      </aside>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        type={modalConfig.type}
      />

      {/* Full Document Image Zoom Modal */}
      {fullPreviewOpen && activeDocUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setFullPreviewOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center text-white mb-2 text-sm font-semibold">
              {selectedKyc?.document_type} -{" "}
              {activeSide === "front" ? "Front Side" : "Back Side"} (
              {selectedKyc?.user_name})
            </div>
            <img
              src={activeDocUrl}
              alt="Full Document View"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKYCVerification;
