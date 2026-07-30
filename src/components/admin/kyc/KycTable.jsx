import React from "react";
import KycTableRow from "./KycTableRow";

const KycTable = ({
  loading,
  kycList,
  selectedKyc,
  setSelectedKyc,
  setReviewModalOpen,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-s">
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
                <td colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>

                    <p className="text-sm text-gray-500">
                      Loading KYC queue...
                    </p>
                  </div>
                </td>
              </tr>
            ) : kycList.length > 0 ? (
              kycList.map((item) => (
                <KycTableRow
                  key={item.kyc_id}
                  item={item}
                  isSelected={selectedKyc?.kyc_id === item.kyc_id}
                  setSelectedKyc={setSelectedKyc}
                  setReviewModalOpen={setReviewModalOpen}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-12 text-gray-500 text-sm"
                >
                  No KYC submissions found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KycTable;