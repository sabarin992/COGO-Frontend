import { CheckCircle2, AlertCircle, Clock, Plus, Eye, Car, Info, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import EmptyKycState from "../../components/kyc/EmptyKycState";

function StatusBadge({ status }) {
  const map = {
    verified: {
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />,
      label: "Verified",
      cls: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    rejected: {
      icon: <AlertCircle className="h-3.5 w-3.5 text-red-600" />,
      label: "Rejected",
      cls: "bg-red-50 text-red-700 border-red-200",
    },
    pending: {
      icon: <Clock className="h-3.5 w-3.5 text-amber-700" />,
      label: "Pending Verification",
      cls: "bg-amber-50 text-amber-800 border-amber-200",
    },
  };
  const s = map[status?.toLowerCase()] || map["pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold border ${s.cls}`}>
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

  return `${dateFormatted} · ${timeFormatted}`;
}

function DocCard({ icon: Icon, title, id, status, image, backImage, submittedOn, rejectionReason }) {
  const navigate = useNavigate();
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

  const isRejected = status?.toLowerCase() === "rejected";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gray-100">
              <Icon className="h-5 w-5 text-gray-800" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-base truncate">{title}</h3>
              <p className="text-xs text-gray-500 truncate font-mono">ID: {id}</p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Rejection Alert Box or Image Preview */}
        <div className="mt-4">
          {isRejected ? (
            <div className="rounded-2xl border border-red-200 bg-red-50/70 p-6 text-center">
              <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-red-100 text-red-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <p className="font-bold text-red-950 text-base">Document Rejected</p>
              <p className="mt-1 text-xs sm:text-sm text-red-800 font-medium max-w-md mx-auto leading-relaxed">
                {rejectionReason || "The document photo was unclear or details could not be verified by the administrator. Please re-upload a clear document."}
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => navigate("/profile/add-kyc")}
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                  Resubmit Document
                </button>
              </div>
            </div>
          ) : (
            <div
              className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-[16/10] cursor-zoom-in border border-gray-100"
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
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Submitted On</p>
          <p className="text-xs font-semibold text-gray-800">{formatDate(submittedOn)}</p>
        </div>

        {isRejected && (
          <button
            type="button"
            onClick={() => navigate("/profile/add-kyc")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Resubmit
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

  const hasDocuments = Boolean(data && data.document_type);

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

          {/* Do NOT show Add New Document button if a document has already been submitted */}
          {!hasDocuments && (
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
              rejectionReason={data.rejection_reason}
            />
          </div>
        )}
      </div>
    </div>
  );
}
