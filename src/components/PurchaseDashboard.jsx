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
  AlertTriangle,
  Check,
  Star,
  Layers,
  Crown,
  RefreshCw,
  User,
  ArrowLeft,
  Smartphone,
  X,
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
const mapCategory = (name) => {
  if (!name) return "road";
  const n = name.toLowerCase();
  if (n.includes("road")) return "road";
  if (n.includes("bridge")) return "bridge";
  if (n.includes("railway") || n.includes("metro") || n.includes("train") || n.includes("station")) return "railway";
  return "road"; // default fallback to road
};

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
const CategoryPurchaseSection = ({ category, files = [], apps = [] }) => {
  const meta = CATEGORY_META[category] || CATEGORY_META.road;

  // Only show successfully completed or active purchases
  const successfulFiles = files.filter((f) => f.status === "received" || f.status === 1 || f.status === "1");
  const successfulApps = apps.filter((a) => a.status === "received" || a.status === 1 || a.status === "1");

  const totalItems = successfulFiles.length + successfulApps.length;

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
      {successfulFiles.length > 0 && (
        <div className="space-y-2">
          {successfulFiles.map((file, idx) => (
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
                <div className="flex items-center gap-2">
                  {file.purchase_type === "Free" ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                      Free
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30">
                      <Check className="w-2.5 h-2.5" />
                      Purchased
                    </span>
                  )}
                </div>
                {/* Download Button */}
                {file.folder_location && (
                  <a
                    href={file.folder_location}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold text-white bg-green-500 hover:bg-green-600 shadow-md shadow-green-500/20 transition-all flex items-center gap-1.5"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                )}
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
      {successfulApps.length > 0 && (
        <div className="space-y-2">
          {successfulApps.map((app, idx) => (
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

/* ─── Wrong-App Warning Modal ─── */
const WrongAppModal = ({ appName, onClose }) => (
  <AnimatePresence>
    {appName && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-orange-200 dark:border-orange-500/30 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400" />
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Different Application Required
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  You are currently logged in via a different application. To access{" "}
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {appName}
                  </span>{" "}files, please download the{" "}
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {appName} desktop application
                  </span>{" "}and log in from there.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                  How to access these files:
                </p>
              </div>
              <ol className="text-xs text-orange-700 dark:text-orange-300 space-y-1 pl-6 list-decimal">
                <li>Download the correct desktop application</li>
                <li>Login with your credentials in that application</li>
                <li>Access & purchase the files from within the application</li>
              </ol>
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-md shadow-orange-500/20"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── Available File Card ─── */
const FileCard = ({ file, onWrongApp, showAction = true }) => {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    // If file belongs to a different category than the user's app, warn them
    // (this is a client-side hint; the API also validates server-side)
    if (onWrongApp && file.category_name) {
      // onWrongApp will be called with the app name if mismatch detected by parent
      onWrongApp(file);
      return;
    }
    navigate("/payment", { state: { tch_id: file.tch_id, files: [file.id] } });
  };

  const isPurchased = file.purchased === true || file.purchased === 1 || file.purchased === "1";
  const isFree = file.purchase_type === "Free";
  const showDownload = isPurchased || (isFree && file.folder_location);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`relative rounded-xl overflow-hidden border transition-all duration-300
        ${isPurchased
          ? "border-green-200 dark:border-green-500/20 bg-white dark:bg-white/5"
          : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-amber-300 dark:hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/10"
        }`}
    >
      {/* Purchased Badge */}
      {isPurchased && (
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
          {showDownload ? (
            file.folder_location ? (
              <a
                href={file.folder_location}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-500 hover:bg-green-600 shadow-md shadow-green-500/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                {isPurchased ? "Download" : "Free Download"}
              </a>
            ) : (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                <Check className="w-3.5 h-3.5" />
                {isPurchased ? "Purchased" : "Available Free"}
              </span>
            )
          ) : showAction && (
            <motion.button
              onClick={handleBuyNow}
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

  // Wrong-app warning modal state
  const [wrongAppModal, setWrongAppModal] = useState(null); // null | string (app name to download)

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
        let rawPurchaseData = purchaseRes?.data || purchaseRes;

        // Ensure purchaseData has the correct object structure
        let purchaseData = {
          file_purchases: (rawPurchaseData && typeof rawPurchaseData === 'object' && rawPurchaseData.file_purchases) || {},
          app_purchases: (rawPurchaseData && typeof rawPurchaseData === 'object' && rawPurchaseData.app_purchases) || {},
          ...rawPurchaseData
        };

        // Extract available files
        const filesData = filesRes?.data?.data || filesRes?.data || [];
        const allFiles = Array.isArray(filesData) ? filesData : [];
        setAvailableFiles(allFiles);

        // SYNC: Force-include every single file that says 'purchased: true' into the Purchases Tab
        console.log("[Dashboard] Aggressive Sync Start...");
        if (allFiles.length > 0) {
          allFiles.forEach(f => {
            const isOwned =
              f.purchased === true ||
              f.purchased === 1 ||
              f.purchased === "1" ||
              f.purchased === "true" ||
              (f.purchase_type === "Free" && f.folder_location);

            if (isOwned) {
              const cat = mapCategory(f.category_name);
              if (!purchaseData.file_purchases[cat]) purchaseData.file_purchases[cat] = [];

              // Find if this specific file ID is already in the list
              const existingIdx = purchaseData.file_purchases[cat].findIndex(p => (p.file_id || p.id) === f.id);

              const syncRecord = {
                ...f,
                file_id: f.id,
                status: "received", // Guarantee visibility
                purchased_on: f.updated_on || new Date().toISOString()
              };

              if (existingIdx !== -1) {
                // UPDATE: If it exists, overwrite it with the rich data from the availableFiles API
                purchaseData.file_purchases[cat][existingIdx] = {
                  ...purchaseData.file_purchases[cat][existingIdx],
                  ...syncRecord
                };
              } else {
                // INSERT: If it's missing, add it
                purchaseData.file_purchases[cat].push(syncRecord);
              }
            }
          });
        }
        console.log("[Dashboard] Sync Complete.");
        setPurchases(purchaseData);

        // Filter linked files if edu_file_ids exist
        if (linkedFileIds.length > 0) {
          const matched = allFiles.filter(
            (f) => linkedFileIds.includes(f.id) || linkedFileIds.includes(f.tfd_id)
          );
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
          let rawPurchaseData = purchaseRes?.data || purchaseRes;
          let purchaseData = {
            file_purchases: (rawPurchaseData && typeof rawPurchaseData === 'object' && rawPurchaseData.file_purchases) || {},
            app_purchases: (rawPurchaseData && typeof rawPurchaseData === 'object' && rawPurchaseData.app_purchases) || {},
            ...rawPurchaseData
          };

          const filesData = filesRes?.data?.data || filesRes?.data || [];
          const allFiles = Array.isArray(filesData) ? filesData : [];
          setAvailableFiles(allFiles);

          // SYNC: Force-include every single file that says 'purchased: true' into the Purchases Tab
          if (allFiles.length > 0) {
            allFiles.forEach(f => {
              const isOwned =
                f.purchased === true || f.purchased === 1 || f.purchased === "1" || f.purchased === "true" ||
                (f.purchase_type === "Free" && f.folder_location);

              if (isOwned) {
                const cat = mapCategory(f.category_name);
                if (!purchaseData.file_purchases[cat]) purchaseData.file_purchases[cat] = [];
                const existingIdx = purchaseData.file_purchases[cat].findIndex(p => (p.file_id || p.id) === f.id);
                const syncRecord = {
                  ...f,
                  file_id: f.id,
                  status: "received",
                  purchased_on: f.updated_on || new Date().toISOString()
                };
                if (existingIdx !== -1) {
                  purchaseData.file_purchases[cat][existingIdx] = {
                    ...purchaseData.file_purchases[cat][existingIdx],
                    ...syncRecord
                  };
                } else {
                  purchaseData.file_purchases[cat].push(syncRecord);
                }
              }
            });
          }
          setPurchases(purchaseData);

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

  // Detect user's login_type app name from user object
  const LOGIN_TYPE_MAP = { 1: "road", 2: "bridge", 3: "railway", 4: "metro" };
  const userAppName = LOGIN_TYPE_MAP[user?.user_login_type] || null;

  // Handler for FileCard wrong-app detection
  const handleFileCardClick = (file) => {
    if (userAppName && file.category_name) {
      const fileCat = file.category_name.toLowerCase();
      if (fileCat !== userAppName) {
        // Show the wrong-app warning modal
        setWrongAppModal(file.category_name);
        return;
      }
    }
    // Proceed to payment normally
    navigate("/payment", { state: { tch_id: file.tch_id, files: [file.id] } });
  };

  // Compute linked files split: purchased vs unpurchased
  const linkedPurchased = linkedFiles.filter((f) => f.purchased === true || f.purchased === 1 || f.purchased === "1");
  const linkedUnpurchased = linkedFiles.filter((f) => f.purchased !== true && f.purchased !== 1 && f.purchased !== "1");

  // Calculate total price for unpurchased linked files
  const linkedTotalPrice = linkedUnpurchased.reduce(
    (sum, f) => sum + (parseFloat(f.price) || 0),
    0
  );

  // tch_id for the Buy All button — use the first file's tch_id (all files should share same category)
  const linkedTchId = linkedUnpurchased[0]?.tch_id || null;

  // Handler for "Buy Now" (all linked unpurchased files)
  const handleBuyAllLinked = () => {
    if (linkedUnpurchased.length === 0 || !linkedTchId) return;

    // Check if any linked file is from a different app
    if (userAppName) {
      const wrongFile = linkedUnpurchased.find(
        (f) => f.category_name?.toLowerCase() !== userAppName
      );
      if (wrongFile) {
        setWrongAppModal(wrongFile.category_name);
        return;
      }
    }

    navigate("/payment", {
      state: {
        tch_id: linkedTchId,
        files: linkedUnpurchased.map((f) => f.id),
      },
    });
  };

  // Count total purchases (only successfully 'received' items)
  const categoriesList = ["road", "bridge", "railway", "metro"];

  const getSuccessfulCount = (dataMap) => {
    if (!dataMap) return 0;
    return categoriesList.reduce((total, cat) => {
      const items = dataMap[cat] || [];
      return total + items.filter((item) => item.status === "received" || item.status === 1 || item.status === "1").length;
    }, 0);
  };

  const totalFilePurchases = getSuccessfulCount(purchases?.file_purchases);
  const totalAppPurchases = getSuccessfulCount(purchases?.app_purchases);

  const totalPurchases = totalFilePurchases + totalAppPurchases;

  const unpurchasedFiles = availableFiles.filter((f) => f.purchased !== true && f.purchased !== 1 && f.purchased !== "1");
  const purchasedFiles = availableFiles.filter((f) => f.purchased === true || f.purchased === 1 || f.purchased === "1");

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Wrong-App Warning Modal */}
      <WrongAppModal
        appName={wrongAppModal}
        onClose={() => setWrongAppModal(null)}
      />
      <div className="min-h-screen pb-12 ">
        {/* Hero Header */}
        <div className="relative overflow-hidden pt-20">
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

                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-lg font-black text-amber-900 dark:text-amber-300">
                      Files Shared With You
                    </h2>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5 font-medium">
                      {linkedFiles.length} file{linkedFiles.length !== 1 ? "s" : ""} shared by the desktop application
                      {linkedPurchased.length > 0 && (
                        <span className="ml-2 text-green-600 dark:text-green-400">
                          · {linkedPurchased.length} already owned
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={clearLinkedFiles}
                    className="self-start sm:self-auto text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                  >
                    Clear Filter
                  </button>
                </div>

                {/* File Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                  {linkedFiles.map((file) => (
                    <FileCard
                      key={file.id || file.tfd_id}
                      file={file}
                      showAction={false}
                      onWrongApp={userAppName ? (f) => {
                        if (f.category_name?.toLowerCase() !== userAppName) {
                          setWrongAppModal(f.category_name);
                        } else {
                          navigate("/payment", { state: { tch_id: f.tch_id, files: [f.id] } });
                        }
                      } : null}
                    />
                  ))}
                </div>

                {/* ── Price Summary + Buy Now CTA ── */}
                {linkedUnpurchased.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="border-t border-amber-200 dark:border-amber-500/20 pt-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Price breakdown */}
                      <div>
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                          Order Summary
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-amber-900 dark:text-white">
                            {formatPrice(linkedTotalPrice)}
                          </span>
                          <span className="text-sm text-amber-600 dark:text-amber-400">
                            for {linkedUnpurchased.length} file{linkedUnpurchased.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        {linkedPurchased.length > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {linkedPurchased.length} file{linkedPurchased.length !== 1 ? "s" : ""} already owned — excluded from total
                          </p>
                        )}
                      </div>

                      {/* Buy All CTA */}
                      <motion.button
                        onClick={handleBuyAllLinked}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm text-white
                      bg-gradient-to-r from-amber-500 via-orange-500 to-red-500
                      hover:from-amber-600 hover:via-orange-600 hover:to-red-600
                      shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50
                      transition-all duration-300 whitespace-nowrap"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Buy Now · {formatPrice(linkedTotalPrice)}
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* All already purchased */}
                {linkedUnpurchased.length === 0 && linkedPurchased.length > 0 && (
                  <div className="border-t border-amber-200 dark:border-amber-500/20 pt-4 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                      You already own all the shared files!
                    </p>
                  </div>
                )}
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
                            <FileCard
                              key={file.id}
                              file={file}
                              onWrongApp={userAppName ? handleFileCardClick : null}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Already Purchased - REMOVED: Owned files are now only in the My Purchases tab */}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  );
};

export default PurchaseDashboard;
