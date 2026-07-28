import { CheckCircle2, AlertCircle, Clock, Plus, Pencil, Eye, Upload, IdCard, Car, Globe, FileUp, Loader2, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import licenseImg from "@/assets/kyc-license.jpg";
// import passportImg from "@/assets/kyc-passport.jpg";

function StatusBadge({ status }) {
  const map = {
    verified: {
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      label: "Verified",
      cls: "bg-gray-100 text-gray-700",
    },
    rejected: {
      icon: <AlertCircle className="h-3.5 w-3.5" />,
      label: "Rejected",
      cls: "bg-red-100 text-red-600",
    },
    pending: {
      icon: <Clock className="h-3.5 w-3.5" />,
      label: "Pending",
      cls: "bg-gray-100 text-gray-700",
    },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${s.cls}`}>
      {s.icon}
      {s.label}
    </span>
  );
}

function DocCard({ icon: Icon, title, id, status, image, submittedOn, action, verifying }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gray-100">
            <Icon className="h-5 w-5 text-gray-700" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
            <p className="text-xs text-gray-500 truncate">ID: {id}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-4">
        {status === "rejected" ? (
          <div className="rounded-xl bg-gray-100 py-10 px-6 text-center">
            <div className="mx-auto mb-3 grid h-9 w-9 place-items-center rounded-full border border-gray-300 text-gray-500">
              <Info className="h-4 w-4" />
            </div>
            <p className="font-semibold text-gray-900">Document Rejected</p>
            <p className="mt-1 text-sm text-gray-500">
              The photo was too blurry to verify details.<br />Please re-upload a clearer image.
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[16/10]">
            <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
            {verifying && (
              <div className="absolute inset-0 grid place-items-center">
                <div className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-gray-700 shadow">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">Submitted on</p>
          <p className="text-sm font-semibold text-gray-900">{submittedOn}</p>
        </div>
        {action === "reupload" && (
          <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
            Re-upload
          </button>
        )}
        {action === "edit" && (
          <button className="text-gray-700 hover:text-gray-900" aria-label="Edit">
            <Pencil className="h-5 w-5" />
          </button>
        )}
        {action === "view" && (
          <button className="text-gray-700 hover:text-gray-900" aria-label="View">
            <Eye className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function UploadCard() {
  return (
    <button className="flex min-h-[360px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-8 text-center transition hover:border-gray-400 hover:bg-gray-50">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gray-100">
        <FileUp className="h-5 w-5 text-gray-700" />
      </div>
      <p className="font-semibold text-gray-900">Submit more proof</p>
      <p className="mt-1 text-sm text-gray-500">Secondary ID, Utility Bills, etc.</p>
    </button>
  );
}

export default function KycDocuments() {

    const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">KYC Documents</h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Manage your identity verification documents to ensure a secure and seamless experience on the COGO platform.
            </p>
          </div>
          <button 
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow hover:bg-gray-800"
          onClick={()=>{navigate("/profile/add-kyc")}}
          >
            <Plus className="h-4 w-4" />
            Add New Document
          </button>
        </header>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <DocCard
            icon={Car}
            title="Driver's License"
            id="DL-8842-XXXX"
            status="verified"
            image={""}
            submittedOn="Oct 12, 2023"
            action="edit"
          />
          <DocCard
            icon={IdCard}
            title="Aadhaar Card / ID"
            id="4492-XXXX-1102"
            status="rejected"
            submittedOn="Jan 05, 2024"
            action="reupload"
          />
          <DocCard
            icon={Globe}
            title="Passport"
            id="ZP-229103"
            status="pending"
            image={""}
            submittedOn="Feb 14, 2024"
            action="view"
            verifying
          />
          <UploadCard />
        </div>
      </div>
    </div>
  );
}
