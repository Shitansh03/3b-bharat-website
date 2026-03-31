import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { eduLoginUser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useLoginModal } from "../context/LoginModalContext";

/* ─── Floating Input (matching RegistrationModal style) ─── */
const FloatingInput = ({
  icon: Icon,
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  rightElement,
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const isFloating = focused || hasValue;

  return (
    <div className="relative group pt-2">
      <div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300
        ${
          error
            ? "border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-500/5"
            : focused
              ? "border-amber-500 dark:border-amber-400 bg-amber-50/30 dark:bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
              : "border-gray-300 dark:border-white/15 bg-white/50 dark:bg-white/5 hover:border-gray-400 dark:hover:border-white/25"
        }`}
      >
        <Icon
          className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
            focused
              ? "text-amber-500 dark:text-amber-400"
              : "text-gray-400 dark:text-gray-500"
          }`}
        />
        <div className="relative flex-1 min-h-[24px] flex items-center">
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full bg-transparent text-gray-800 dark:text-white text-sm outline-none
              ${!hasValue && !focused ? "text-transparent" : ""}`}
            placeholder=""
            autoComplete={type === "password" ? "current-password" : "off"}
          />
          <label
            className={`absolute left-0 pointer-events-none transition-all duration-200 ease-out whitespace-nowrap
            ${
              isFloating
                ? "-top-[22px] text-xs font-semibold px-1 rounded bg-white dark:bg-gray-950 " +
                  (error
                    ? "text-red-500"
                    : "text-amber-600 dark:text-amber-400")
                : "top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500"
            }`}
          >
            {label}
          </label>
        </div>
        {rightElement && <div className="flex-shrink-0">{rightElement}</div>}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1 ml-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

/* ─── Main Login Modal ─── */
const LoginModal = () => {
  const { isOpen, closeModal } = useLoginModal();
  const { login, getSavedAppToken } = useAuth();

  // Login form state
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Flow state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginData, setLoginData] = useState(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setMobileNo("");
        setPassword("");
        setShowPassword(false);
        setIsSubmitting(false);
        setError("");
        setErrors({});
        setLoginSuccess(false);
        setLoginData(null);
      }, 300);
    }
  }, [isOpen]);

  const validateCredentials = () => {
    const newErrors = {};
    if (!mobileNo.trim()) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!/^\d{7,15}$/.test(mobileNo.trim())) {
      newErrors.mobileNo = "Enter a valid mobile number";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateCredentials()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const savedToken = getSavedAppToken();
      const response = await eduLoginUser(mobileNo.trim(), password, savedToken);

      // Extract data from response
      const data = response?.data || response;
      setLoginData(data);

      // Save auth state
      login(data.user, data.token);
      setLoginSuccess(true);

      // Auto-close after brief success animation
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      const errMsg =
        err?.data?.message || err?.message || "Login failed. Please try again.";

      if (err?.status === 403) {
        setError(
          "This account is active on another device. Please uninstall and reinstall the application to continue."
        );
      } else {
        setError(errMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isSubmitting && !loginSuccess) {
      handleLogin();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Decorative floating orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, #f59e0b, transparent 70%)",
              }}
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 15, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full opacity-15"
              style={{
                background: "radial-gradient(circle, #ef4444, transparent 70%)",
              }}
              animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
              transition={{ duration: 12, repeat: Infinity }}
            />
          </div>

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md max-h-[92vh] flex flex-col rounded-2xl
              bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl
              border border-gray-200/80 dark:border-white/10
              shadow-2xl shadow-black/20 dark:shadow-black/50"
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 py-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-2xl" />

            {/* Close button */}
            <motion.button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full
                bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400
                hover:bg-gray-200 dark:hover:bg-white/20 hover:text-gray-700 dark:hover:text-white
                transition-all duration-200"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Header */}
            <div className="px-6 sm:px-8 pt-7 pb-3">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-lg shadow-amber-500/20">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Welcome Back
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sign in to your 3D Bharat Education account
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Form Content */}
            <div className="px-6 sm:px-8 pb-4 overflow-y-auto flex-1" onKeyDown={handleKeyDown}>
              <AnimatePresence mode="wait">
                {/* Login Form */}
                {!loginSuccess && (
                  <motion.div
                    key="login-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <FloatingInput
                      icon={Phone}
                      label="Mobile Number"
                      type="tel"
                      name="mobileNo"
                      value={mobileNo}
                      onChange={(e) => {
                        setMobileNo(e.target.value);
                        if (errors.mobileNo)
                          setErrors((p) => ({ ...p, mobileNo: "" }));
                      }}
                      error={errors.mobileNo}
                    />

                    <FloatingInput
                      icon={Lock}
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password)
                          setErrors((p) => ({ ...p, password: "" }));
                      }}
                      error={errors.password}
                      rightElement={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      }
                    />

                    {/* Login Button */}
                    <motion.button
                      type="button"
                      onClick={handleLogin}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm
                        bg-gradient-to-r from-amber-500 via-orange-500 to-red-500
                        hover:from-amber-600 hover:via-orange-600 hover:to-red-600
                        shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40
                        transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                      whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          Sign In
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}

                {/* Login Success */}
                {loginSuccess && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-4 py-6"
                  >
                    <div className="text-center space-y-3">
                      <motion.div
                        className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl shadow-green-500/20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          delay: 0.1,
                        }}
                      >
                        <UserCheck className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.h3
                        className="text-xl font-bold text-gray-800 dark:text-white"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        Login Successful
                      </motion.h3>
                      <motion.p
                        className="text-sm text-gray-500 dark:text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Welcome back,{" "}
                        {loginData?.user?.first_name || "User"}!
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error Display */}
            {error && (
              <div className="px-6 sm:px-8 pb-4">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                      {error}
                    </p>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Footer */}
            {!loginSuccess && (
              <div className="px-6 sm:px-8 pb-6 pt-1">
                <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={closeModal}
                    className="font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                  >
                    Register here
                  </button>
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
