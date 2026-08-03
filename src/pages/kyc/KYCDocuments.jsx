import { CheckCircle2, AlertCircle, Clock, Plus, Pencil, Eye, Car, Info, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import EmptyKycState from "../../components/kyc/EmptyKycState";

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
  const s = map[status] || map["pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${s.cls}`}>
      {s.icon}
      {s.label}
    </span>
  );
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const dateFormatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const timeFormatted = date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  return `${dateFormatted}  ${timeFormatted}`;
}

function DocCard({ icon: Icon, title, id, status, image, backImage, submittedOn, action, verifying }) {
  const [activeSide, setActiveSide] = useState("front");
  const [zoomOrigin, setZoomOrigin] = useState("center center");

  const currentImage = activeSide === "back" && backImage ? backImage : image;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  const handleMouseLeave = () => {
    setZoomOrigin("center center");
  };

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
          <div
            className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-[16/10] cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {currentImage ? (
              <img
                src={currentImage}
                alt={`${title} - ${activeSide}`}
                className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.8]"
                style={{ transformOrigin: zoomOrigin }}
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                No {activeSide} image available
              </div>
            )}

            {backImage && (
              <div
                className="absolute top-3 right-3 flex rounded-lg bg-black/60 p-1 backdrop-blur-md z-10"
                onMouseMove={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setActiveSide("front")}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    activeSide === "front"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Front
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSide("back")}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    activeSide === "back"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Back
                </button>
              </div>
            )}

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
          <p className="text-sm font-semibold text-gray-900">{formatDate(submittedOn)}</p>
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

export default function KycDocuments() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/kyc/kyc-docs");
        if (res.data && res.data.document_type) {
          setData(res.data);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching KYC docs:", error?.response || error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const hasDocuments = data && data.document_type;

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between mb-8">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              KYC Documents
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Manage your identity verification documents to ensure a secure and seamless experience on the COGO platform.
            </p>
          </div>
          {hasDocuments && (
            <button
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow hover:bg-gray-800 transition-all cursor-pointer active:scale-95"
              onClick={() => navigate("/profile/add-kyc")}
            >
              <Plus className="h-4 w-4" />
              Add New Document
            </button>
          )}
        </header>

        {/* Content Section */}
        {loading ? (
          <div className="w-full bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center gap-3 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin text-gray-800" />
            <p className="text-sm font-medium text-gray-500">Loading KYC documents...</p>
          </div>
        ) : !hasDocuments ? (
          <EmptyKycState />
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <DocCard
              icon={Car}
              title={data.document_type}
              id={data.document_number}
              status={data.status || "pending"}
              image={data.front_document_url}
              backImage={data.back_document_url}
              submittedOn={data.created_at}
              action="edit"
            />
          </div>
        )}
      </div>
    </div>
  );
}
