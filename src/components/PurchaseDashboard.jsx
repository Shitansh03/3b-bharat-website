import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Tag,
  Package,
  Clock,
  Shield,
  ChevronRight,
  Loader2,
  AlertCircle,
  Check,
  Star,
  Layers,
  Crown,
  RefreshCw,
  User,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getUserPurchasesAll,
  getAvailableFiles,
} from "../services/purchaseService";

/* ─── Category config ─── */
const CATEGORY_META = {
  road: { label: "Road", color: "amber", gradient: "from-amber-500 to-orange-500" },
  bridge: { label: "Bridge", color: "blue", gradient: "from-blue-500 to-cyan-500" },
  railway: { label: "Railway", color: "green", gradient: "from-green-500 to-emerald-500" },
  metro: { label: "Metro", color: "purple", gradient: "from-purple-500 to-violet-500" },
};

const TABS = [
  { id: "purchases", label: "My Purchases", icon: ShoppingBag },
  { id: "available", label: "Available Files", icon: Package },
];

/* ─── Helpers ─── */
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (amount) => {
  if (!amount && amount !== 0) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/* ─── Category Section (for purchases) ─── */
const CategoryPurchaseSection = ({ category, files, apps }) => {
  const meta = CATEGORY_META[category] || CATEGORY_META.road;
  const totalItems = (files?.length || 0) + (apps?.length || 0);

  if (totalItems === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Category Header */}
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}
        >
          <Layers className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {meta.label}
        </h3>
        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
          {totalItems} item{totalItems !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Purchased Files */}
      {files?.length > 0 && (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <motion.div
              key={`file-${file.file_id || idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl
                bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
                hover:border-amber-300 dark:hover:border-amber-500/30
                hover:shadow-lg hover:shadow-amber-500/5
                transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {/* File Image */}
                {file.file_image ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/10 flex-shrink-0">
                    <img
                      src={file.file_image}
                      alt={file.file_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/10 dark:to-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                    {file.file_name || "Unnamed File"}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Tag className="w-3 h-3" />
                      {file.file_type_name || "File"}
                    </span>
                    {file.purchased_on && (
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(file.purchased_on)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Status Badge */}
                <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                  <Check className="w-3 h-3" />
                  Purchased
                </span>
                {/* Invoice */}
                {file.invoice_pdf_url && (
                  <a
                    href={file.invoice_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-gray-400 hover:text-amber-600 dark:hover:text-amber-400
                      hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                    title="View Invoice"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Purchased Apps */}
      {apps?.length > 0 && (
        <div className="space-y-2">
          {apps.map((app, idx) => (
            <motion.div
              key={`app-${app.id || idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl
                bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
                hover:border-purple-300 dark:hover:border-purple-500/30
                transition-all duration-300"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-500/10 dark:to-violet-500/10 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                    {app.app_type_name || "Application"} Subscription
                  </h4>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      {app.validity} month{app.validity > 1 ? "s" : ""} validity
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(app.purchased_on)}
                    </span>
                    {app.total_paid_amt !== undefined && (
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                        {formatPrice(app.total_paid_amt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
                  <Star className="w-3 h-3" />
                  Active
                </span>
                {app.invoice_url && (
                  <a
                    href={app.invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-gray-400 hover:text-purple-600 dark:hover:text-purple-400
                      hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors"
                    title="View Invoice"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

/* ─── Available File Card ─── */
const FileCard = ({ file }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`relative rounded-xl overflow-hidden border transition-all duration-300
        ${file.purchased
          ? "border-green-200 dark:border-green-500/20 bg-white dark:bg-white/5"
          : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-amber-300 dark:hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/10"
        }`}
    >
      {/* Purchased Badge */}
      {file.purchased && (
        <div className="absolute top-3 right-3 z-10">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg shadow-green-500/30">
            <Check className="w-3 h-3" />
            Owned
          </span>
        </div>
      )}

      {/* File Image */}
      <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 flex items-center justify-center overflow-hidden">
        {file.file_image ? (
          <img
            src={file.file_image}
            alt={file.file_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.parentElement.innerHTML =
                '<div class="flex items-center justify-center h-full"><svg class="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>';
            }}
          />
        ) : (
          <FileText className="w-10 h-10 text-gray-300 dark:text-gray-600" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-2 leading-snug">
            {file.file_name || "Unnamed File"}
          </h4>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
              {file.category_name || "General"}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
              {file.file_type_name || "File"}
            </span>
          </div>
        </div>

        {file.file_description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {file.file_description}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          {/* Price */}
          <div>
            {file.purchase_type === "Free" ? (
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                Free
              </span>
            ) : (
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                {formatPrice(file.price)}
              </span>
            )}
            {file.file_validity && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 block">
                {file.file_validity} days validity
              </span>
            )}
          </div>

          {/* Action */}
          {file.purchased ? (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
              <Download className="w-3.5 h-3.5" />
              Available
            </span>
          ) : (
            <motion.button
              onClick={() => navigate("/payment", { state: { tch_id: file.tch_id, files: [file.id] } })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white
                bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600
                shadow-md shadow-amber-500/20 hover:shadow-amber-500/40
                transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Buy Now
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Empty State ─── */
const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 space-y-4"
  >
    <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
      <Icon className="w-9 h-9 text-gray-300 dark:text-gray-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
      {title}
    </h3>
    <p className="text-sm text-gray-400 dark:text-gray-500 text-center max-w-sm">
      {description}
    </p>
    {actionLabel && onAction && (
      <motion.button
        onClick={onAction}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white
          bg-gradient-to-r from-amber-500 to-orange-500
          shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40
          transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {actionLabel}
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    )}
  </motion.div>
);

/* ─── Main Dashboard Component ─── */
const PurchaseDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("purchases");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Data
  const [purchases, setPurchases] = useState(null);
  const [availableFiles, setAvailableFiles] = useState([]);

  // Edu login linked files (from sessionStorage)
  const [linkedFileIds, setLinkedFileIds] = useState([]);
  const [linkedFiles, setLinkedFiles] = useState([]);

  // Read edu_file_ids from sessionStorage on mount
  useEffect(() => {
    const storedFileIds = sessionStorage.getItem("edu_file_ids");
    if (storedFileIds) {
      const parsed = storedFileIds
        .split(",")
        .map((id) => parseInt(id.trim(), 10))
        .filter((id) => !isNaN(id));
      setLinkedFileIds(parsed);
    }
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Fetch data
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [purchaseRes, filesRes] = await Promise.all([
          getUserPurchasesAll(user.id),
          getAvailableFiles(user.id),
        ]);

        // Extract purchase data
        const purchaseData = purchaseRes?.data || purchaseRes;
        setPurchases(purchaseData);

        // Extract available files
        const filesData = filesRes?.data?.data || filesRes?.data || [];
        const allFiles = Array.isArray(filesData) ? filesData : [];
        setAvailableFiles(allFiles);

        // Filter linked files if edu_file_ids exist
        // Match against both f.id AND f.tfd_id since desktop app may send tfd_id
        if (linkedFileIds.length > 0) {
          const matched = allFiles.filter(
            (f) => linkedFileIds.includes(f.id) || linkedFileIds.includes(f.tfd_id)
          );
          console.log("[EduLogin] linkedFileIds:", linkedFileIds);
          console.log("[EduLogin] matched files:", matched);
          setLinkedFiles(matched);
        }
      } catch (err) {
        console.error("[Dashboard] Error fetching data:", err);
        setError(err?.message || "Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id, linkedFileIds]);

  const handleRefresh = () => {
    if (user?.id) {
      setIsLoading(true);
      setError("");
      Promise.all([
        getUserPurchasesAll(user.id),
        getAvailableFiles(user.id),
      ])
        .then(([purchaseRes, filesRes]) => {
          const purchaseData = purchaseRes?.data || purchaseRes;
          setPurchases(purchaseData);
          const filesData = filesRes?.data?.data || filesRes?.data || [];
          const allFiles = Array.isArray(filesData) ? filesData : [];
          setAvailableFiles(allFiles);
          if (linkedFileIds.length > 0) {
            setLinkedFiles(
              allFiles.filter(
                (f) => linkedFileIds.includes(f.id) || linkedFileIds.includes(f.tfd_id)
              )
            );
          }
        })
        .catch((err) => setError(err?.message || "Failed to refresh."))
        .finally(() => setIsLoading(false));
    }
  };

  const clearLinkedFiles = () => {
    sessionStorage.removeItem("edu_file_ids");
    sessionStorage.removeItem("edu_user_id");
    setLinkedFileIds([]);
    setLinkedFiles([]);
  };

  // Count total purchases
  const totalFilePurchases =
    (purchases?.file_purchases?.count || 0);
  const totalAppPurchases =
    (purchases?.app_purchases?.count || 0);
  const totalPurchases = totalFilePurchases + totalAppPurchases;

  const unpurchasedFiles = availableFiles.filter((f) => !f.purchased);
  const purchasedFiles = availableFiles.filter((f) => f.purchased);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 dark:from-amber-500/5 dark:via-orange-500/3 dark:to-red-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-400/10 dark:bg-amber-400/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-orange-400/10 dark:bg-orange-400/5 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white"
              >
                Welcome,{" "}
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  {user?.first_name || "User"}
                </span>
              </motion.h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                View your purchase history and explore available files
              </p>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-3">
              <div className="px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
                  Purchases
                </p>
                <p className="text-xl font-bold text-gray-800 dark:text-white mt-0.5">
                  {isLoading ? "—" : totalPurchases}
                </p>
              </div>
              {user?.remaining_days !== undefined && user?.remaining_days !== null && (
                <div className="px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
                    Days Left
                  </p>
                  <p className={`text-xl font-bold mt-0.5 ${user.remaining_days > 30 ? "text-green-600 dark:text-green-400" : user.remaining_days > 7 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                    {user.remaining_days}
                  </p>
                </div>
              )}
              <motion.button
                onClick={handleRefresh}
                disabled={isLoading}
                className="self-center p-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm
                  text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-500/30
                  transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 w-fit">
          {TABS.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                  ? "bg-white dark:bg-white/10 text-amber-600 dark:text-amber-400 shadow-sm border border-gray-200 dark:border-white/15"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              whileTap={{ scale: 0.97 }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "purchases" && !isLoading && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
                  {totalPurchases}
                </span>
              )}
              {tab.id === "available" && !isLoading && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400">
                  {unpurchasedFiles.length}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      {/* ── SHARED FILES BANNER (only when arrived via edu-login URL) ── */}
      {linkedFiles.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-900/20 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-6 shadow-md relative overflow-hidden"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />

            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-black text-amber-900 dark:text-amber-300">
                  Files Shared With You
                </h2>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5 font-medium">
                  {linkedFiles.length} file{linkedFiles.length !== 1 ? "s" : ""} shared by the desktop application
                </p>
              </div>
              <button
                onClick={clearLinkedFiles}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
              >
                Clear Filter
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {linkedFiles.map((file) => (
                <FileCard key={file.id || file.tfd_id} file={file} />
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ── DEBUG: No match warning ── */}
      {linkedFileIds.length > 0 && linkedFiles.length === 0 && !isLoading && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-800 dark:text-red-400">Linked files not found</p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
                File IDs from URL: [{linkedFileIds.join(", ")}] — could not match any files. Please check the IDs sent by the desktop app.
              </p>
            </div>
          </div>
        </div>
      )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading your dashboard...</p>
            </div>
          </div>
        )}

        {/* Purchases Tab */}
        {!isLoading && activeTab === "purchases" && (
          <AnimatePresence mode="wait">
            <motion.div
              key="purchases-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {totalPurchases === 0 ? (
                <EmptyState
                  icon={ShoppingBag}
                  title="No Purchases Yet"
                  description="You haven't purchased any files or subscriptions yet. Browse available files to get started."
                  actionLabel="Browse Files"
                  onAction={() => setActiveTab("available")}
                />
              ) : (
                <>
                  {/* File Purchases */}
                  {totalFilePurchases > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-sm uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">
                        File Purchases
                      </h2>
                      {["road", "bridge", "railway", "metro"].map((cat) => (
                        <CategoryPurchaseSection
                          key={cat}
                          category={cat}
                          files={purchases?.file_purchases?.[cat] || []}
                          apps={[]}
                        />
                      ))}
                    </div>
                  )}

                  {/* App Purchases */}
                  {totalAppPurchases > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-sm uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">
                        Application Subscriptions
                      </h2>
                      {["road", "bridge", "railway", "metro"].map((cat) => (
                        <CategoryPurchaseSection
                          key={`app-${cat}`}
                          category={cat}
                          files={[]}
                          apps={purchases?.app_purchases?.[cat] || []}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Available Files Tab */}
        {!isLoading && activeTab === "available" && (
          <AnimatePresence mode="wait">
            <motion.div
              key="available-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {availableFiles.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No Files Available"
                  description="There are no files available for purchase at this time. Please check back later."
                />
              ) : (
                <div className="space-y-6">
                  {/* Unpurchased Files */}
                  {unpurchasedFiles.length > 0 && (
                    <div>
                      <h2 className="text-sm uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-4">
                        Available for Purchase ({unpurchasedFiles.length})
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {unpurchasedFiles.map((file) => (
                          <FileCard key={file.id} file={file} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Already Purchased */}
                  {purchasedFiles.length > 0 && (
                    <div>
                      <h2 className="text-sm uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-4">
                        Already Owned ({purchasedFiles.length})
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {purchasedFiles.map((file) => (
                          <FileCard key={file.id} file={file} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default PurchaseDashboard;
