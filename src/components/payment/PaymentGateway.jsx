import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  CreditCard,
  User,
  Mail,
  Phone,
  XCircle,
  ArrowLeft,
  Lock,
  Sparkles,
  Receipt,
  CheckCheck,
  RotateCcw,
  Home,
  Zap,
} from "lucide-react";

// Static user & payment data (will come from params in future)
const STATIC_DATA = {
  user: {
    name: "Vedant Bahadure",
    email: "vedant@example.com",
    phone: "9876543210",
  },
  payment: {
    description: "3D Bharat Premium Subscription",
    subtotal: 4999,
    gst: 899.82,
    get total() {
      return this.subtotal + this.gst;
    },
    currency: "INR",
  },
};

const formatCurrency = (amount) =>
  `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const PaymentGateway = () => {
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handlePayment = useCallback(() => {
    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKeyId || !window.Razorpay) {
      console.error("Razorpay not configured properly.");
      setPaymentStatus("failure");
      return;
    }

    setPaymentStatus("processing");

    const options = {
      key: razorpayKeyId,
      amount: Math.round(STATIC_DATA.payment.total * 100),
      currency: STATIC_DATA.payment.currency,
      name: "3D Bharat",
      description: STATIC_DATA.payment.description,
      image: "/favicon.ico",
      prefill: {
        name: STATIC_DATA.user.name,
        email: STATIC_DATA.user.email,
        contact: STATIC_DATA.user.phone,
      },
      theme: { color: "#1a1a2e", backdrop_color: "rgba(0,0,0,0.6)" },
      handler: (response) => {
        setPaymentDetails({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id || "N/A",
          signature: response.razorpay_signature || "N/A",
        });
        setPaymentStatus("success");
      },
      modal: {
        ondismiss: () => setPaymentStatus("idle"),
        escape: true,
        animation: true,
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setPaymentDetails({
          errorCode: response.error.code,
          errorDescription: response.error.description,
        });
        setPaymentStatus("failure");
      });
      rzp.open();
    } catch {
      setPaymentStatus("failure");
    }
  }, []);

  const resetPayment = () => {
    setPaymentStatus("idle");
    setPaymentDetails(null);
  };

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

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')]" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-24 md:py-28">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {/* ==================== IDLE STATE ==================== */}
            {paymentStatus === "idle" && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Back */}
                <motion.a
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8 group"
                  whileHover={{ x: -4 }}
                >
                  <ArrowLeft
                    size={16}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  Back to Home
                </motion.a>

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
                    Complete Payment
                  </h1>
                  <p className="text-white/40 text-sm">
                    Review your order and proceed to pay
                  </p>
                </motion.div>

                {/* Card */}
                <motion.div
                  className="rounded-3xl bg-white/[0.05] dark:bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/20 p-6 md:p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Amount */}
                  <div className="text-center mb-6">
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium mb-1">
                      Amount to Pay
                    </p>
                    <p className="text-4xl md:text-5xl font-bold font-heading bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent leading-tight">
                      {formatCurrency(STATIC_DATA.payment.total)}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                  {/* Customer Details */}
                  <div className="mb-6">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-3">
                      Customer Details
                    </h3>
                    <div className="space-y-0.5">
                      {[
                        {
                          icon: User,
                          label: "Name",
                          value: STATIC_DATA.user.name,
                        },
                        {
                          icon: Mail,
                          label: "Email",
                          value: STATIC_DATA.user.email,
                        },
                        {
                          icon: Phone,
                          label: "Phone",
                          value: `+91 ${STATIC_DATA.user.phone}`,
                        },
                      ].map(({ icon: Icon, label, value }) => (
                        <div
                          key={label}
                          className="flex items-center justify-between py-2.5"
                        >
                          <span className="flex items-center gap-2.5 text-sm text-white/40 font-medium">
                            <Icon size={14} className="text-white/20" />
                            {label}
                          </span>
                          <span className="text-sm font-semibold text-white/80">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                  {/* Order Summary */}
                  <div className="mb-6">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-3">
                      Order Summary
                    </h3>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between py-2.5">
                        <span className="flex items-center gap-2.5 text-sm text-white/40 font-medium">
                          <Receipt size={14} className="text-white/20" />
                          {STATIC_DATA.payment.description}
                        </span>
                        <span className="text-sm font-semibold text-white/80">
                          {formatCurrency(STATIC_DATA.payment.subtotal)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2.5">
                        <span className="text-sm text-white/40 font-medium pl-[26px]">
                          GST (18%)
                        </span>
                        <span className="text-sm font-semibold text-white/80">
                          {formatCurrency(STATIC_DATA.payment.gst)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                  {/* Total */}
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-base font-semibold text-white/60">
                      Total Payable
                    </span>
                    <span className="text-xl font-bold text-white font-heading">
                      {formatCurrency(STATIC_DATA.payment.total)}
                    </span>
                  </div>

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
                      Pay {formatCurrency(STATIC_DATA.payment.total)}
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
                  Please complete the payment in the Razorpay window...
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
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <CheckCheck size={36} className="text-white" />
                </motion.div>

                <motion.h2
                  className="text-2xl font-bold text-white mb-2 font-heading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Payment Successful!
                </motion.h2>
                <motion.p
                  className="text-white/40 mb-6 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Your transaction has been completed successfully.
                </motion.p>

                {paymentDetails && (
                  <motion.div
                    className="bg-white/[0.04] rounded-xl p-4 mb-6 text-left border border-white/[0.06]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-white/40">Payment ID</span>
                      <span className="text-xs font-mono text-white/70 font-semibold">
                        {paymentDetails.paymentId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-white/40">
                        Amount Paid
                      </span>
                      <span className="text-sm text-white/80 font-semibold">
                        {formatCurrency(STATIC_DATA.payment.total)}
                      </span>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  className="flex flex-col sm:flex-row gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <a
                    href="/"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-white/90 transition-colors"
                  >
                    <Home size={16} />
                    Back to Home
                  </a>
                  <button
                    onClick={resetPayment}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-white/70 font-semibold rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <RotateCcw size={16} />
                    New Payment
                  </button>
                </motion.div>
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
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <XCircle size={36} className="text-white" />
                </motion.div>

                <motion.h2
                  className="text-2xl font-bold text-white mb-2 font-heading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Payment Failed
                </motion.h2>
                <motion.p
                  className="text-white/40 mb-6 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Something went wrong. Please try again.
                </motion.p>

                {paymentDetails?.errorDescription && (
                  <motion.div
                    className="bg-red-500/[0.08] border border-red-500/15 rounded-xl p-4 mb-6 text-left"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-sm text-red-400">
                      {paymentDetails.errorDescription}
                    </p>
                  </motion.div>
                )}

                <motion.div
                  className="flex flex-col sm:flex-row gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    onClick={resetPayment}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-white/90 transition-colors"
                  >
                    <RotateCcw size={16} />
                    Try Again
                  </button>
                  <a
                    href="/"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-white/70 font-semibold rounded-xl hover:bg-white/5 transition-colors text-center"
                  >
                    <Home size={16} />
                    Go Home
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
    </div>
  );
};

export default PaymentGateway;
