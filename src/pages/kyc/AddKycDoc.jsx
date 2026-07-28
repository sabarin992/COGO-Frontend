import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  IdCard,
  Car,
  Globe,
  ShieldCheck,
  FileUp,
  Image as ImageIcon,
} from "lucide-react";
import api from "../../api";
import { toast } from "react-toastify";

const AddKycDoc = () => {
  const [docType, setDocType] = useState("");
  const [docNum, setDocNum] = useState("");
  const [frontDoc, setFrontDoc] = useState(null);
  const [backDoc, setBackDoc] = useState(null);
  const [errors, setErrors] = useState({
    document_type: "",
    document_number: "",
    front_document: "",
    back_document: "",
  });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!docType.trim()) {
      newErrors.document_type = "Please select a document type.";
    }

    if (!docNum.trim()) {
      newErrors.document_number = "Document number is required.";
    }

    if (!frontDoc) {
      newErrors.front_document = "Front document is required.";
    }

  
    if (!backDoc) {
        newErrors.back_document = "Back document is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();

    formData.append("document_type", docType);
    formData.append("document_number", docNum);
    formData.append("front_document", frontDoc);

    if (backDoc) {
      formData.append("back_document", backDoc);
    }

    try {
      const { data } = await api.post("/kyc/upload-kyc", formData);

      toast.success(data.message);

      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.detail ?? "Something went wrong.");
    }
  };

  const docTypes = [
    { id: "Driver's License", label: "Driver's License", icon: Car },
    { id: "Aadhaar Card / ID", label: "Aadhaar Card / ID", icon: IdCard },
    { id: "Passport", label: "Passport", icon: Globe },
    { id: "Secondary ID", label: "Secondary ID / Utility Bill", icon: FileUp },
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-3xl">
        {/* Top Header Navigation */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Add New Document
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Upload your official government document for identity verification
            and account approval.
          </p>
        </header>

        {/* Main Form Card */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm"
        >
          {/* Document Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Document Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-3">
              {docTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = docType === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setDocType(item.id)}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      isSelected
                        ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gray-100">
                      <Icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <input
              type="text"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              placeholder="Or enter custom document type..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
            />
            {errors.document_type && (
              <p className="mt-1 text-sm text-red-500">
                {errors.document_type}
              </p>
            )}
          </div>

          {/* Document Number */}
          <div>
            <label
              htmlFor="docNum"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Document ID / Number <span className="text-red-500">*</span>
            </label>
            <input
              id="docNum"
              type="text"
              value={docNum}
              onChange={(e) => setDocNum(e.target.value)}
              placeholder="e.g. DL-8842-XXXX or 4492-XXXX-1102"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
            />
            {errors.document_number && (
              <p className="mt-1 text-sm text-red-500">
                {errors.document_number}
              </p>
            )}
          </div>

          {/* Document Upload Area: Front Side & Back Side */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Upload Document Images <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Front Side Upload */}
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-700 mb-2">
                  Front Side
                </span>
                {frontDoc ? (
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 aspect-[16/10] group">
                    <img
                      src={
                        typeof frontDoc === "string"
                          ? frontDoc
                          : URL.createObjectURL(frontDoc)
                      }
                      alt="Front Side Preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <label className="cursor-pointer rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-900 shadow hover:bg-gray-100 transition">
                        Change
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            if (e.target.files[0])
                              setFrontDoc(e.target.files[0]);
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFrontDoc(null)}
                        className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-red-700 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 text-center transition hover:border-gray-400 hover:bg-gray-50 cursor-pointer aspect-[16/10]">
                    <div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-gray-100">
                      <Upload className="h-5 w-5 text-gray-700" />
                    </div>
                    <p className="text-xs font-semibold text-gray-900">
                      Upload Front Side
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">
                      PNG, JPG, JPEG or PDF
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files[0]) setFrontDoc(e.target.files[0]);
                      }}
                      className="hidden"
                    />
                  </label>
                )}
                {errors.front_document && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.front_document}
                  </p>
                )}

                
              </div>

              {/* Back Side Upload */}
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-700 mb-2">
                  Back Side (Optional)
                </span>
                {backDoc ? (
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 aspect-[16/10] group">
                    <img
                      src={
                        typeof backDoc === "string"
                          ? backDoc
                          : URL.createObjectURL(backDoc)
                      }
                      alt="Back Side Preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <label className="cursor-pointer rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-900 shadow hover:bg-gray-100 transition">
                        Change
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            if (e.target.files[0])
                              setBackDoc(e.target.files[0]);
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setBackDoc(null)}
                        className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-red-700 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 text-center transition hover:border-gray-400 hover:bg-gray-50 cursor-pointer aspect-[16/10]">
                    <div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-gray-100">
                      <ImageIcon className="h-5 w-5 text-gray-700" />
                    </div>
                    <p className="text-xs font-semibold text-gray-900">
                      Upload Back Side
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">
                      PNG, JPG, JPEG or PDF
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files[0]) setBackDoc(e.target.files[0]);
                      }}
                      className="hidden"
                    />
                  </label>
                )}
                { (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.back_document}
                  </p>
                )}
                
              </div>
              
              
            </div>
          </div>

          {/* Security & Verification Note */}
          <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 border border-gray-200/80">
            <ShieldCheck className="h-5 w-5 text-gray-700 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-gray-600">
              Your document details are encrypted and stored securely. Ensure
              all information matches your official document to prevent delays
              in verification.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow hover:bg-gray-800 transition-colors"
            >
              Submit Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddKycDoc;
