

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

import ConfirmationModal from "../../components/modals/ConfirmationModal";

import KycHeader from "../../components/admin/kyc/KycHeader";
import KycTable from "../../components/admin/kyc/KycTable";
import KycPagination from "../../components/admin/kyc/KycPagination";
import KycReviewModal from "../../components/admin/kyc/KycReviewModal";
import ImagePreviewModal from "../../components/admin/kyc/ImagePreviewModal";

import {
  getAdminKycList,
  approveKyc,
  rejectKyc,
} from "../../services/kycService";

const AdminKYCVerification = () => {
  const { searchQuery } = useOutletContext() || {};

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery || "");

  // Table Data
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter
  const [statusFilter, setStatusFilter] = useState("All");

  // Selected KYC
  const [selectedKyc, setSelectedKyc] = useState(null);

  // Review Modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Document Preview
  const [activeSide, setActiveSide] = useState("front");
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);

  // Reject Form
  const [rejectionCategory, setRejectionCategory] = useState(
    "Blurry or Unreadable Image"
  );

  const [rejectionDetails, setRejectionDetails] = useState("");

  // Confirmation Modal
  const [modalOpen, setModalOpen] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    actionType: "approve",
    title: "",
    message: "",
    confirmText: "",
    type: "info",
    reasonToSubmit: "",
  });

  const [actionLoading, setActionLoading] = useState(false);

  /* -----------------------------------------
        Search Debounce
  ------------------------------------------*/

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery || "");
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* -----------------------------------------
        Close Review Modal on Escape
  ------------------------------------------*/

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setReviewModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* -----------------------------------------
        Fetch KYC List
  ------------------------------------------*/

  const fetchKycRecords = async (
    page = 1,
    search = "",
    status = "All"
  ) => {
    setLoading(true);

    try {
      const data = await getAdminKycList({
        page,
        size: ITEMS_PER_PAGE,
        search,
        status,
      });

      const items = data.items || [];

      setKycList(items);
      setTotalItems(data.total || 0);
      setTotalPages(data.pages || 1);

      if (items.length > 0) {
        setSelectedKyc((prev) => {
          if (!prev) return items[0];

          const found = items.find(
            (i) => i.kyc_id === prev.kyc_id
          );

          return found || items[0];
        });
      } else {
        setSelectedKyc(null);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.detail ||
          "Failed to fetch KYC records"
      );
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------
        Effects
  ------------------------------------------*/

  useEffect(() => {
    fetchKycRecords(
      currentPage,
      debouncedSearch,
      statusFilter
    );
  }, [
    currentPage,
    debouncedSearch,
    statusFilter,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    setActiveSide("front");
    setRejectionDetails("");
  }, [selectedKyc?.kyc_id]);

  /* -----------------------------------------
        Approve
  ------------------------------------------*/

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

  /* -----------------------------------------
        Reject
  ------------------------------------------*/

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

  /* -----------------------------------------
        Confirm Action
  ------------------------------------------*/

  const handleConfirmAction = async () => {
    if (!selectedKyc) return;

    setActionLoading(true);

    try {
      if (modalConfig.actionType === "approve") {
        await approveKyc(selectedKyc.kyc_id);

        toast.success(
          `KYC for ${selectedKyc.user_name} approved successfully`
        );
      } else {
        await rejectKyc(
          selectedKyc.kyc_id,
          modalConfig.reasonToSubmit
        );

        toast.success(
          `KYC for ${selectedKyc.user_name} rejected successfully`
        );
      }

      setModalOpen(false);

      fetchKycRecords(
        currentPage,
        debouncedSearch,
        statusFilter
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.detail ||
          "Action failed. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

    return (
    <>
      <div className="space-y-6 p-10">

        {/* Header */}

        <KycHeader
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Table */}

        <KycTable
          loading={loading}
          kycList={kycList}
          selectedKyc={selectedKyc}
          setSelectedKyc={setSelectedKyc}
          setReviewModalOpen={setReviewModalOpen}
        />

        {/* Pagination */}

        <KycPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Review Modal */}

      <KycReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        selectedKyc={selectedKyc}
        activeSide={activeSide}
        setActiveSide={setActiveSide}
        setFullPreviewOpen={setFullPreviewOpen}
        rejectionCategory={rejectionCategory}
        setRejectionCategory={setRejectionCategory}
        rejectionDetails={rejectionDetails}
        setRejectionDetails={setRejectionDetails}
        onApprove={handleInitiateApprove}
        onReject={handleInitiateReject}
      />

      {/* Full Image Preview */}

      <ImagePreviewModal
        open={fullPreviewOpen}
        onClose={() => setFullPreviewOpen(false)}
        selectedKyc={selectedKyc}
        activeSide={activeSide}
      />

      {/* Confirmation Modal */}

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => {
          if (!actionLoading) {
            setModalOpen(false);
          }
        }}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText="Cancel"
        type={modalConfig.type}
        loading={actionLoading}
      />
    </>
  );
};

export default AdminKYCVerification;
