import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  CreditCard,
  User,
  Mail,
  XCircle,
  ArrowLeft,
  Lock,
  Sparkles,
  Receipt,
  CheckCheck,
  RotateCcw,
  Home,
  Tag
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getPurchaseStatus, createPurchase } from "../../services/paymentService";

const formatCurrency = (amount) =>
  `₹${(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const PaymentGateway = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [paymentStatus, setPaymentStatus] = useState("idle"); // 'idle' | 'loading_order' | 'processing' | 'success' | 'failure'
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [errorDetails, setErrorDetails] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Extract from router state
  const { tch_id, files } = location.state || {};
  const trial_user_id = user?.id;

  // Form state for typeable inputs
  const [formData, setFormData] = useState({
    name: user?.first_name ? `${user.first_name} ${user.last_name || ""}` : "",
    email: user?.user_email_id || "",
    phone: user?.user_mob_no || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.first_name ? `${user.first_name} ${user.last_name || ""}` : "",
        email: user.user_email_id || "",
        phone: user.user_mob_no || "",
      });
    }
  }, [user]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    try {
      const response = await createPurchase({
        trial_user_id,
        tch_id,
        files,
        coupon_code: couponCode
      });
      const order = response?.data || response;
      if (order && (order.total_amt !== undefined || order.purchase_id)) {
        setOrderData(order);
      } else {
        console.warn("[Payment] Coupon applied but response structure was unexpected:", response);
      }
    } catch (err) {
      console.error("Coupon error:", err);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handlePayment = useCallback(async () => {
    if (!window.Razorpay) {
      setErrorDetails("Razorpay SDK not loaded");
      setPaymentStatus("failure");
      return;
    }

    setPaymentStatus("processing");

    try {
      // Call createPurchase to get the final order with current coupon
      const response = await createPurchase({
        trial_user_id,
        tch_id,
        files,
        coupon_code: couponCode
      });

      // Support both { data: order } and direct order object responses
      const currentOrder = response?.data || response;

      // Basic validation to ensure we got a valid order object
      if (!currentOrder || (!currentOrder.razorpay_order_id && currentOrder.total_paid_amt > 0)) {
        console.error("[Payment] Unexpected API response:", response);
        throw new Error("Failed to create purchase record: Invalid server response");
      }

      setOrderData(currentOrder);

      // If amount is 0, handle success immediately
      if (currentOrder.status === "received" || currentOrder.total_paid_amt === 0) {
        setPaymentDetails(currentOrder);
        setPaymentStatus("success");
        return;
      }

      const options = {
        // Use key from backend if provided, otherwise fallback to local env
        key: currentOrder.razorpay_key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(currentOrder.total_paid_amt * 100),
        currency: currentOrder.currency || "INR",
        name: "3D Bharat",
        description: "3D Files Purchase",
        order_id: currentOrder.razorpay_order_id,
        image: "/favicon.ico",
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#1a1a2e", backdrop_color: "rgba(0,0,0,0.6)" },
        handler: async (razorpayResponse) => {
          // razorpayResponse contains razorpay_payment_id, razorpay_order_id, razorpay_signature
          setPaymentStatus("processing");
          verifyStatus(
            currentOrder.purchase_id,
            razorpayResponse.razorpay_payment_id
          );
        },
        modal: {
          ondismiss: () => setPaymentStatus("idle"),
          escape: true,
          animation: true,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setErrorDetails(response.error.description);
        setPaymentStatus("failure");
      });
      rzp.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      setErrorDetails(err?.message || "Could not initiate payment");
      setPaymentStatus("failure");
    }
  }, [trial_user_id, tch_id, files, formData, couponCode]);

  const verifyStatus = (purchaseId, razorpayPaymentId) => {
    let attempts = 0;
    const MAX_ATTEMPTS = 20; // poll every 3s for max 60 seconds

    const interval = setInterval(async () => {
      attempts++;

      try {
        const res = await getPurchaseStatus(purchaseId);

        // Handle both { data: { status } } and direct { status } structures
        const data = res?.data || res;
        const status = data?.status;

        if (status === "received") {
          clearInterval(interval);
          setPaymentDetails(data);
          setPaymentStatus("success");
          return;
        }

        if (status === "failed") {
          clearInterval(interval);
          setErrorDetails("Payment failed on verification.");
          setPaymentStatus("failure");
          return;
        }

        // After 60s of polling, status is still "pending" which means
        // the webhook has NOT updated the DB yet (webhook misconfigured or delayed).
        // Do NOT mark as success — show a clear error with the Purchase ID.
        if (attempts >= MAX_ATTEMPTS) {
          clearInterval(interval);
          setErrorDetails(
            `Your payment was received by Razorpay but our server hasn't confirmed it yet. ` +
            `Please note your Purchase ID: ${purchaseId} and contact support. ` +
            `Your payment will be verified and access granted shortly.`
          );
          setPaymentStatus("failure");
        }
      } catch (err) {
        console.error("Status verification error", err);
        if (attempts >= MAX_ATTEMPTS) {
          clearInterval(interval);
          setErrorDetails(
            `Could not verify payment status. Purchase ID: ${purchaseId}. ` +
            `Please contact support — your payment is safe.`
          );
          setPaymentStatus("failure");
        }
      }
    }, 3000);
  };

  const resetPayment = () => {
    setPaymentStatus("idle");
    setPaymentDetails(null);
    setErrorDetails("");
    if (!orderData) {
      window.location.reload();
    }
  };

  if (!trial_user_id || !files || files.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Invalid Order Parameters</h2>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-indigo-600 rounded-lg">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-stone-200 dark:from-black dark:via-gray-950 dark:to-gray-900">
      {/* Animated orbs */}
      <div className="absolute top-20 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/10 dark:bg-indigo-500/[0.07] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] rounded-full bg-amber-500/10 dark:bg-amber-500/[0.05] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-600/[0.06] dark:bg-violet-500/[0.04] blur-[90px] pointer-events-none" />

      {/* Subtle grid pattern via inline bg */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-24 md:py-28">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">

            {/* ==================== LOADING ORDER STATE ==================== */}
            {paymentStatus === "loading_order" && (
              <motion.div
                key="loading-order"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/[0.08] shadow-2xl p-8 md:p-12 text-center"
              >
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Preparing Order</h2>
                <p className="text-white/40 text-sm">Please wait while we secure your checkout...</p>
              </motion.div>
            )}

            {/* ==================== IDLE STATE (CHECKOUT) ==================== */}
            {paymentStatus === "idle" && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Back */}
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8 group bg-transparent border-none appearance-none cursor-pointer"
                >
                  <ArrowLeft
                    size={16}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  Back
                </button>

                {/* Header */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-sm mb-5">
                    <Sparkles size={13} className="text-amber-400" />
                    <span className="text-[11px] font-semibold text-white/60 tracking-[0.15em] uppercase">
                      Secure Checkout
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2 tracking-tight">
                    Complete Purchase
                  </h1>
                </motion.div>

                {/* Card */}
                <motion.div
                  className="rounded-3xl bg-white/[0.05] dark:bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/20 p-6 md:p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Amount (only if orderData exists) */}
                  <div className="text-center mb-6">
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium mb-1">
                      {orderData ? "Amount to Pay" : "Review Selections"}
                    </p>
                    <p className="text-4xl md:text-5xl font-bold font-heading bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent leading-tight">
                      {orderData ? formatCurrency(orderData.total_paid_amt) : `${files.length} Item${files.length !== 1 ? 's' : ''}`}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                  {/* Customer Details Editable */}
                  <div className="mb-6">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-3">
                      Customer Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-2.5 text-xs text-white/40 font-medium"><User size={14} className="text-white/20" /> Name</span>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-2.5 text-xs text-white/40 font-medium"><Mail size={14} className="text-white/20" /> Email</span>
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {orderData && (
                    <>
                      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                      {/* Order Summary */}
                      <div className="mb-6">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-3">
                          Order Summary
                        </h3>
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between py-2.5">
                            <span className="flex items-center gap-2.5 text-sm text-white/40 font-medium">
                              <Tag size={14} className="text-white/20" />
                              Files Selected
                            </span>
                            <span className="text-sm font-semibold text-white/80">
                              {files.length} Files
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2.5">
                            <span className="flex items-center gap-2.5 text-sm text-white/40 font-medium">
                              <Receipt size={14} className="text-white/20" />
                              Subtotal
                            </span>
                            <span className="text-sm font-semibold text-white/80">
                              {formatCurrency(orderData.total_amt)}
                            </span>
                          </div>
                          {orderData.discount_applied > 0 && (
                            <div className="flex items-center justify-between py-2.5">
                              <span className="text-sm text-amber-500/80 font-medium pl-[26px]">
                                Discount
                              </span>
                              <span className="text-sm font-semibold text-amber-400">
                                -{formatCurrency(orderData.discount_applied)}
                              </span>
                            </div>
                          )}

                          {/* Coupon Input */}
                          <div className="pt-4 mt-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Coupon Code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white/80 focus:outline-none focus:border-amber-500 transition-colors uppercase"
                              />
                              <button
                                onClick={handleApplyCoupon}
                                disabled={isApplyingCoupon || !couponCode}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                              >
                                {isApplyingCoupon ? "..." : "Apply"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                  {/* Total Only if orderData exists */}
                  {orderData && (
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-base font-semibold text-white/60">
                        Total Payable
                      </span>
                      <span className="text-xl font-bold text-white font-heading">
                        {formatCurrency(orderData.total_paid_amt)}
                      </span>
                    </div>
                  )}

                  {/* Pay Button */}
                  <motion.button
                    onClick={handlePayment}
                    className="relative w-full overflow-hidden flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-bold text-lg tracking-wide shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-300 group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Lock size={18} className="relative z-10" />
                    <span className="relative z-10">
                      {orderData ? `Pay ${formatCurrency(orderData.total_paid_amt)}` : "Confirm & Pay Now"}
                    </span>
                  </motion.button>

                  {/* Security badges */}
                  <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
                    {[
                      { icon: Shield, label: "SSL Secured" },
                      { icon: Lock, label: "PCI DSS" },
                      { icon: CreditCard, label: "Razorpay" },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-emerald-500/[0.07] text-emerald-400/80 border border-emerald-500/10"
                      >
                        <Icon size={11} />
                        {label}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Footer */}
                <motion.p
                  className="text-center text-[11px] text-white/20 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Payments powered by{" "}
                  <span className="font-semibold text-white/30">Razorpay</span>
                </motion.p>
              </motion.div>
            )}

            {/* ==================== PROCESSING STATE ==================== */}
            {paymentStatus === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/[0.08] shadow-2xl p-8 md:p-12 text-center"
              >
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 font-heading">
                  Processing Payment
                </h2>
                <p className="text-white/40 text-sm">
                  Please do not close this window.
                </p>
              </motion.div>
            )}

            {/* ==================== SUCCESS STATE ==================== */}
            {paymentStatus === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/[0.08] shadow-2xl p-8 md:p-12 text-center"
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <CheckCheck size={36} className="text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-2 font-heading">
                  Payment Successful!
                </h2>
                <p className="text-white/40 mb-6 text-sm">
                  Your transaction has been completed successfully.
                </p>

                {paymentDetails && (
                  <motion.div
                    className="bg-white/[0.04] rounded-xl p-4 mb-6 text-left border border-white/[0.06]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-white/40">Payment ID</span>
                      <span className="text-xs font-mono text-white/70 font-semibold truncate ml-4">
                        {paymentDetails.transaction_id || paymentDetails.purchase_id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-white/40">
                        Amount Paid
                      </span>
                      <span className="text-sm text-white/80 font-semibold">
                        {formatCurrency(paymentDetails.total_paid_amt)}
                      </span>
                    </div>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-white/90 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </motion.div>
            )}

            {/* ==================== FAILURE STATE ==================== */}
            {paymentStatus === "failure" && (
              <motion.div
                key="failure"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/[0.08] shadow-2xl p-8 md:p-12 text-center"
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <XCircle size={36} className="text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-2 font-heading">
                  Payment Failed
                </h2>
                <p className="text-white/40 mb-6 text-sm">
                  Something went wrong. Please try again.
                </p>

                {errorDetails && (
                  <motion.div
                    className="bg-red-500/[0.08] border border-red-500/15 rounded-xl p-4 mb-6 text-left"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-sm text-red-400">
                      {errorDetails}
                    </p>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={resetPayment}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-white/90 transition-colors"
                  >
                    <RotateCcw size={16} />
                    Try Again
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-white/70 font-semibold rounded-xl hover:bg-white/5 transition-colors text-center"
                  >
                    <Home size={16} />
                    Go Home
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
    </div>
  );
};

export default PaymentGateway;
