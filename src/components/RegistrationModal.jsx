import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Check,
  Calendar,
  Shield,
  Copy,
  Eye,
  EyeOff,
  PartyPopper,
  Loader2,
  Download,
  AlertTriangle,
  Globe,
} from "lucide-react";
import { registerUser, verifyOtp } from "../services/auth";
import { detectUserRegion } from "../services/geoService";
import { useRegistrationModal } from "../context/RegistrationModalContext";
import { useLoginModal } from "../context/LoginModalContext";

// Common country codes for the picker
const COUNTRY_CODES = [
  { code: "+91", country: "IN", label: "India (+91)" },
  { code: "+1", country: "US", label: "USA (+1)" },
  { code: "+44", country: "GB", label: "UK (+44)" },
  { code: "+971", country: "AE", label: "UAE (+971)" },
  { code: "+61", country: "AU", label: "Australia (+61)" },
  { code: "+49", country: "DE", label: "Germany (+49)" },
  { code: "+33", country: "FR", label: "France (+33)" },
  { code: "+81", country: "JP", label: "Japan (+81)" },
  { code: "+86", country: "CN", label: "China (+86)" },
  { code: "+65", country: "SG", label: "Singapore (+65)" },
  { code: "+966", country: "SA", label: "Saudi Arabia (+966)" },
  { code: "+974", country: "QA", label: "Qatar (+974)" },
  { code: "+968", country: "OM", label: "Oman (+968)" },
  { code: "+977", country: "NP", label: "Nepal (+977)" },
  { code: "+94", country: "LK", label: "Sri Lanka (+94)" },
  { code: "+880", country: "BD", label: "Bangladesh (+880)" },
  { code: "+60", country: "MY", label: "Malaysia (+60)" },
  { code: "+82", country: "KR", label: "South Korea (+82)" },
  { code: "+7", country: "RU", label: "Russia (+7)" },
  { code: "+55", country: "BR", label: "Brazil (+55)" },
  { code: "+27", country: "ZA", label: "South Africa (+27)" },
  { code: "+234", country: "NG", label: "Nigeria (+234)" },
  { code: "+254", country: "KE", label: "Kenya (+254)" },
];

// Category → download URL mapping
const CATEGORY_DOWNLOADS = {
  road: {
    label: "Road Design",
    filename: "3D%20Bharat%20Road%20Design%20Application_v1.0.0.zip",
  },
};

const DOWNLOAD_BASE_URL = "https://edu.3dbharat.com/downloads/application";

const STEPS = [
  { id: 1, label: "Personal" },
  { id: 2, label: "Role" },
  { id: 3, label: "Requirements" },
  { id: 4, label: "Verify" },
];

const FloatingInput = ({
  icon: Icon,
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
}) => {
  const [focused, setFocused] = useState(false);
  const isDate = type === "date";
  const hasValue = value && value.length > 0;
  const isFloating = focused || hasValue || isDate;

  return (
    <div className="relative group pt-2">
      <div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300
        ${error
            ? "border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-500/5"
            : focused
              ? "border-amber-500 dark:border-amber-400 bg-amber-50/30 dark:bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
              : "border-gray-300 dark:border-white/15 bg-white/50 dark:bg-white/5 hover:border-gray-400 dark:hover:border-white/25"
          }`}
      >
        <Icon
          className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${focused
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
              ${!isDate && !hasValue && !focused ? "text-transparent" : ""}
              ${isDate && !hasValue ? "[color-scheme:light] dark:[color-scheme:dark] text-gray-400 dark:text-gray-500" : ""}`}
            placeholder=""
            autoComplete="new-password"
          />
          {/* Floating label — positioned on border */}
          <label
            className={`absolute left-0 pointer-events-none transition-all duration-200 ease-out whitespace-nowrap
            ${isFloating
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

const OTPInput = ({ value, onChange, length = 4 }) => {
  const inputRefs = useRef([]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (val.length > 1) return;
    const newOtp = value.split("");
    newOtp[index] = val;
    onChange(newOtp.join(""));
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    onChange(pastedData);
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {Array.from({ length }).map((_, index) => (
        <motion.input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className={`w-11 h-13 sm:w-13 sm:h-14 text-center text-xl font-bold rounded-xl border-2 
            bg-white/60 dark:bg-white/5 text-gray-800 dark:text-white outline-none
            transition-all duration-300
            ${value[index]
              ? "border-amber-500 dark:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              : "border-gray-300 dark:border-white/15 hover:border-gray-400 dark:hover:border-white/25"
            }
            focus:border-amber-500 dark:focus:border-amber-400 focus:shadow-[0_0_20px_rgba(245,158,11,0.2)]`}
        />
      ))}
    </div>
  );
};

const AgeLimitWarningModal = ({ isOpen, onClose, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-red-200 dark:border-red-500/20 shadow-2xl p-6 text-center space-y-4"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Age Restriction
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {message || "User must be 18 years or older to register."}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 shadow-lg shadow-red-500/20 transition-all duration-300 active:scale-[0.98]"
            >
              Understand
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const RegistrationModal = ({ isOpen, onClose, inline = false, forcedCategory = null }) => {
  const { selectedCategory: contextCategory } = useRegistrationModal();
  const selectedCategory = forcedCategory || contextCategory;
  const { openModal: openLoginModal } = useLoginModal();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAgeWarning, setShowAgeWarning] = useState(false);
  const [ageWarningMessage, setAgeWarningMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    mobile: "",
    countryCode: "+91",
    role: "", // "student" or "industry"
    collegeName: "",
    universityName: "",
    designation: "",
    organizationName: "",
    city: "",
    termsAccepted: false,
    sendOtpOnWhatsapp: false,
    otp: "",
  });
  const [errors, setErrors] = useState({});

  // Auto-detect country code via geo-detection
  useEffect(() => {
    if (isOpen || inline) {
      detectUserRegion().then((region) => {
        if (region?.isIndian) {
          setFormData((prev) => ({ ...prev, countryCode: "+91" }));
        }
      });
    }
  }, [isOpen, inline]);

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  useEffect(() => {
    if (inline) return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, inline]);

  // Reset on close
  useEffect(() => {
    if (!isOpen && !inline) {
      setTimeout(() => {
        setStep(1);
        setDirection(1);
        setOtpSent(false);
        setOtpTimer(0);
        setIsSubmitting(false);
        setSubmitError("");
        setRegistrationSuccess(false);
        setGeneratedPassword("");
        setShowPassword(false);
        setCopied(false);
        setShowAgeWarning(false);
        setAgeWarningMessage("");
        setFormData({
          firstName: "",
          lastName: "",
          dob: "",
          email: "",
          mobile: "",
          countryCode: "+91",
          role: "",
          collegeName: "",
          universityName: "",
          designation: "",
          organizationName: "",
          city: "",
          termsAccepted: false,
          sendOtpOnWhatsapp: false,
          otp: "",
        });
        setErrors({});
      }, 300);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleInputChange = (e) => handleChange(e);

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.dob) newErrors.dob = "Date of birth is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Invalid email format";
      if (!formData.mobile.trim())
        newErrors.mobile = "Mobile number is required";
      else if (!/^\d{7,15}$/.test(formData.mobile))
        newErrors.mobile = "Enter a valid mobile number";
      if (!formData.countryCode)
        newErrors.countryCode = "Country code is required";
    }
    if (currentStep === 2) {
      if (!formData.role) newErrors.role = "Please select your role";
      if (formData.role === "student") {
        if (!formData.collegeName.trim())
          newErrors.collegeName = "College name is required";
        if (!formData.universityName.trim())
          newErrors.universityName = "University name is required";
      }
      if (formData.role === "industry") {
        if (!formData.designation.trim())
          newErrors.designation = "Designation is required";
        if (!formData.organizationName.trim())
          newErrors.organizationName = "Organization name is required";
      }
      if (!formData.city.trim()) newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setDirection(1);
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const sendOTP = async () => {
    if (!formData.termsAccepted) {
      setErrors({ termsAccepted: "You must accept the terms & conditions" });
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await registerUser(formData);
      // Save password from register response — will show after OTP verification
      const password =
        response?.generated_password ||
        response?.data?.generated_password ||
        response?.password ||
        response?.data?.password ||
        response?.user_password ||
        "";
      setGeneratedPassword(password);
      setOtpSent(true);
      setOtpTimer(30);
    } catch (error) {
      if (error.status === 400 && error.data?.message?.toLowerCase().includes("18 years")) {
        setAgeWarningMessage(error.data.message);
        setShowAgeWarning(true);
      } else {
        setSubmitError(
          error?.data?.message ||
          error.message ||
          "Registration failed. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleSubmit = async () => {
    const newErrors = {};
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms & conditions";
    }
    if (formData.otp.length < 4) {
      newErrors.otp = "Please enter the complete verification code";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Manual fallback — verify OTP and show password
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await verifyOtp(formData.mobile, formData.otp);
      setRegistrationSuccess(true);
    } catch (error) {
      setSubmitError(
        error?.data?.message ||
        error.message ||
        "Invalid OTP. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPassword = async () => {
    if (generatedPassword) {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSuccessClose = () => {
    onClose();
    // After registration, open login modal for the user to sign in
    setTimeout(() => {
      openLoginModal();
    }, 300);
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <>
      <AnimatePresence>
        {(isOpen || inline) && (
          <motion.div
            className={inline ? "w-full" : "fixed inset-0 z-[100] flex items-center justify-center p-4"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            {!inline && (
              <motion.div
                className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}

            {/* Decorative floating orbs */}
            {!inline && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                  className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20"
                  style={{
                    background: "radial-gradient(circle, #f59e0b, transparent 70%)",
                  }}
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                  transition={{ duration: 15, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-15"
                  style={{
                    background: "radial-gradient(circle, #ef4444, transparent 70%)",
                  }}
                  animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
                  transition={{ duration: 12, repeat: Infinity }}
                />
              </div>
            )}

            {/* Modal */}
            <motion.div
              className={`relative w-full flex flex-col ${inline ? "bg-transparent h-full" : "max-w-lg max-h-[92vh] rounded-2xl bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl border border-gray-200/80 dark:border-white/10 shadow-2xl shadow-black/20 dark:shadow-black/50"}`}
              initial={inline ? { opacity: 0 } : { scale: 0.92, opacity: 0, y: 30 }}
              animate={inline ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
              exit={inline ? { opacity: 0 } : { scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              onClick={(e) => !inline && e.stopPropagation()}
            >
              {/* Top gradient accent */}
              {!inline && (
                <div className="absolute top-0 left-0 right-0 h-1 py-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-2xl" />
              )}

              {/* Close button */}
              {!inline && (
                <motion.button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full
                bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400
                hover:bg-gray-200 dark:hover:bg-white/20 hover:text-gray-700 dark:hover:text-white
                transition-all duration-200"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}

              {/* Header */}
              <div className={`px-6 sm:px-8 pt-7 pb-1 ${inline ? "hidden" : ""}`}>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 mb-1"
                >
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-lg shadow-amber-500/20">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      3D Evaluation and Education
                    </h2>
                    <p className="text-xs text-gray-800 dark:text-gray-400">
                      This is a fully funtional demo for your kind evaluation and education purpose.<br></br> Your valuable feedback is very much appreciated.       </p>
                  </div>
                </motion.div>
              </div>

              {/* Step Indicator */}
              <div className="px-6 sm:px-8 py-3">
                <div className="flex items-center justify-between">
                  {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <motion.div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step > s.id
                            ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                            : step === s.id
                              ? "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 ring-4 ring-amber-400/20 dark:ring-amber-400/10"
                              : "bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500"
                            }`}
                          animate={step === s.id ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                        </motion.div>
                        <span
                          className={`text-[10px] mt-1 font-medium ${step >= s.id
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-gray-400 dark:text-gray-500"
                            }`}
                        >
                          {s.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="w-8 sm:w-16 h-0.5 mx-1 -mt-3 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                            initial={{ width: "0%" }}
                            animate={{ width: step > s.id ? "100%" : "0%" }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="px-6 sm:px-8 pb-4 min-h-[300px] overflow-y-auto flex-1">
                <AnimatePresence mode="wait" custom={direction}>
                  {/* Step 1: Personal Info */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-3"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <FloatingInput
                          icon={User}
                          label="First Name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          error={errors.firstName}
                        />
                        <FloatingInput
                          icon={User}
                          label="Last Name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          error={errors.lastName}
                        />
                      </div>
                      <FloatingInput
                        icon={Calendar}
                        label="Date of Birth"
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        error={errors.dob}
                      />
                      <FloatingInput
                        icon={Mail}
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={errors.email}
                      />
                      {/* Country Code + Mobile Number */}
                      <div className="space-y-1">
                        <div className="flex gap-2">
                          {/* Country Code Selector */}
                          <div className="relative pt-2 w-[140px] flex-shrink-0">
                            <div
                              className={`relative flex items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all duration-300
                            ${errors.countryCode
                                  ? "border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-500/5"
                                  : "border-gray-300 dark:border-white/15 bg-white/50 dark:bg-white/5 hover:border-gray-400 dark:hover:border-white/25"
                                }`}
                            >
                              <Globe className="w-4 h-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                              <select
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleInputChange}
                                className="w-full bg-transparent text-gray-800 dark:text-white text-sm outline-none appearance-none cursor-pointer"
                              >
                                {COUNTRY_CODES.map((cc) => (
                                  <option key={cc.code} value={cc.code} className="bg-white dark:bg-gray-900">
                                    {cc.code}
                                  </option>
                                ))}
                              </select>
                              <ChevronRight className="w-3 h-3 rotate-90 text-gray-400 flex-shrink-0" />
                            </div>
                          </div>
                          {/* Mobile Number */}
                          <div className="flex-1">
                            <FloatingInput
                              icon={Phone}
                              label="Mobile Number"
                              type="tel"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleInputChange}
                              error={errors.mobile}
                            />
                          </div>
                        </div>
                      </div>
                      <motion.a
                        href="/manual.pdf"
                        download
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold
                        text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10
                        border-2 border-amber-300 dark:border-amber-500/30
                        hover:bg-amber-100 dark:hover:bg-amber-500/20
                        transition-all duration-300 mt-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download Manual
                      </motion.a>
                    </motion.div>
                  )}

                  {/* Step 2: Role Selection */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-3"
                    >
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Select your role
                      </p>
                      {errors.role && (
                        <p className="text-red-500 text-xs">{errors.role}</p>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Student Card */}
                        <motion.button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              role: "student",
                              designation: "",
                              organizationName: "",
                            }));
                            setErrors((prev) => ({ ...prev, role: "" }));
                          }}
                          className={`relative p-5 rounded-xl border-2 text-left transition-all duration-300 group overflow-hidden
                          ${formData.role === "student"
                              ? "border-amber-500 dark:border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 shadow-lg shadow-amber-500/10"
                              : "border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20"
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {formData.role === "student" && (
                            <motion.div
                              layoutId="roleCheck"
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
                            >
                              <Check className="w-3.5 h-3.5 text-white" />
                            </motion.div>
                          )}
                          <GraduationCap
                            className={`w-8 h-8 mb-2 transition-colors ${formData.role === "student" ? "text-amber-500" : "text-gray-400 dark:text-gray-500"}`}
                          />
                          <p
                            className={`font-semibold text-sm ${formData.role === "student" ? "text-gray-800 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
                          >
                            Education
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                            Academic learner
                          </p>
                        </motion.button>

                        {/* Industry Card */}
                        <motion.button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              role: "industry",
                              collegeName: "",
                              universityName: "",
                            }));
                            setErrors((prev) => ({ ...prev, role: "" }));
                          }}
                          className={`relative p-5 rounded-xl border-2 text-left transition-all duration-300 group overflow-hidden
                          ${formData.role === "industry"
                              ? "border-amber-500 dark:border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 shadow-lg shadow-amber-500/10"
                              : "border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20"
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {formData.role === "industry" && (
                            <motion.div
                              layoutId="roleCheck"
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
                            >
                              <Check className="w-3.5 h-3.5 text-white" />
                            </motion.div>
                          )}
                          <Briefcase
                            className={`w-8 h-8 mb-2 transition-colors ${formData.role === "industry" ? "text-amber-500" : "text-gray-400 dark:text-gray-500"}`}
                          />
                          <p
                            className={`font-semibold text-sm ${formData.role === "industry" ? "text-gray-800 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
                          >
                            Evaluation
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                            Working professional
                          </p>
                        </motion.button>
                      </div>

                      {/* Conditional Fields */}
                      <AnimatePresence mode="wait">
                        {formData.role === "student" && (
                          <motion.div
                            key="student-fields"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-3 overflow-hidden"
                          >
                            <FloatingInput
                              icon={Building2}
                              label="College Name"
                              name="collegeName"
                              value={formData.collegeName}
                              onChange={handleInputChange}
                              error={errors.collegeName}
                            />
                            <FloatingInput
                              icon={GraduationCap}
                              label="University Name"
                              name="universityName"
                              value={formData.universityName}
                              onChange={handleInputChange}
                              error={errors.universityName}
                            />
                          </motion.div>
                        )}
                        {formData.role === "industry" && (
                          <motion.div
                            key="industry-fields"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-3 overflow-hidden"
                          >
                            <FloatingInput
                              icon={Briefcase}
                              label="Designation"
                              name="designation"
                              value={formData.designation}
                              onChange={handleInputChange}
                              error={errors.designation}
                            />
                            <FloatingInput
                              icon={Building2}
                              label="Organization Name"
                              name="organizationName"
                              value={formData.organizationName}
                              onChange={handleInputChange}
                              error={errors.organizationName}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* City field - shown for both roles */}
                      {formData.role && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <FloatingInput
                            icon={Building2}
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            error={errors.city}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: System Requirements */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-4"
                    >
                      <div className="text-center space-y-2 mb-4">
                        <motion.div
                          className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-xl shadow-amber-500/20"
                          initial={{ rotate: -10 }}
                          animate={{ rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-7 h-7 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                          </svg>
                        </motion.div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                          System Requirements
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Ensure your system meets these minimum specifications to
                          run the software
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        {/* OS */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 }}
                          className="flex items-start gap-3 p-3.5 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5"
                        >
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/15">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 text-blue-600 dark:text-blue-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="2" y="3" width="20" height="14" rx="2" />
                              <line x1="8" y1="21" x2="16" y2="21" />
                              <line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white">
                              Operating System
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              Windows 10/11 (64-bit) or Linux (Ubuntu 20.04+,
                              Fedora 34+)
                            </p>
                          </div>
                        </motion.div>

                        {/* Storage */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex items-start gap-3 p-3.5 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5"
                        >
                          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/15">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 text-purple-600 dark:text-purple-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <ellipse cx="12" cy="5" rx="9" ry="3" />
                              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white">
                              Storage
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              Minimum 512 GB available disk space (SSD recommended
                              for faster load times)
                            </p>
                          </div>
                        </motion.div>

                        {/* RAM */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                          className="flex items-start gap-3 p-3.5 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5"
                        >
                          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-500/15">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 text-green-600 dark:text-green-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="1" y="6" width="22" height="12" rx="2" />
                              <line x1="6" y1="10" x2="6" y2="14" />
                              <line x1="10" y1="10" x2="10" y2="14" />
                              <line x1="14" y1="10" x2="14" y2="14" />
                              <line x1="18" y1="10" x2="18" y2="14" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white">
                              RAM (Memory)
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              Minimum 8 GB (16 GB recommended for complex 3D
                              models)
                            </p>
                          </div>
                        </motion.div>

                        {/* GPU */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-start gap-3 p-3.5 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5"
                        >
                          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-500/15">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 text-orange-600 dark:text-orange-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="4" y="4" width="16" height="16" rx="2" />
                              <rect x="8" y="8" width="8" height="8" rx="1" />
                              <line x1="2" y1="9" x2="4" y2="9" />
                              <line x1="2" y1="15" x2="4" y2="15" />
                              <line x1="20" y1="9" x2="22" y2="9" />
                              <line x1="20" y1="15" x2="22" y2="15" />
                              <line x1="9" y1="2" x2="9" y2="4" />
                              <line x1="15" y1="2" x2="15" y2="4" />
                              <line x1="9" y1="20" x2="9" y2="22" />
                              <line x1="15" y1="20" x2="15" y2="22" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white">
                              Graphics Card (GPU)
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              NVIDIA (GTX 1060+) or AMD (RX 580+) with latest
                              drivers installed
                            </p>
                          </div>
                        </motion.div>

                        {/* Internet */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.25 }}
                          className="flex items-start gap-3 p-3.5 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5"
                        >
                          <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-500/15">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 text-teal-600 dark:text-teal-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                              <line x1="12" y1="20" x2="12.01" y2="20" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white">
                              Internet Connection
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              Stable broadband connection (10 Mbps+ recommended
                              for 3D content streaming)
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      <div className="mt-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                        <p className="text-xs text-amber-700 dark:text-amber-400 text-center font-medium">
                          ⚠️ Higher specifications are recommended for the best 3D
                          visualization experience
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: OTP Verification */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-6"
                    >
                      <div className="text-center space-y-3">
                        <motion.div
                          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-xl shadow-amber-500/20"
                          animate={{ rotateY: [0, 360] }}
                          transition={{ duration: 2, delay: 0.3 }}
                        >
                          <Shield className="w-8 h-8 text-white" />
                        </motion.div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                          Verify Your Identity
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {otpSent ? (
                            <>
                              We've sent a 4-digit code to{" "}
                              <span className="font-medium text-gray-700 dark:text-gray-200">
                                {formData.mobile}
                              </span>
                            </>
                          ) : (
                            "Click below to receive a verification code"
                          )}
                        </p>
                      </div>

                      {!otpSent ? (
                        <div className="space-y-4">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <label className="flex items-center gap-3 cursor-pointer group w-max mx-auto">
                              <div className="relative flex items-center">
                                <input
                                  type="checkbox"
                                  name="sendOtpOnWhatsapp"
                                  checked={formData.sendOtpOnWhatsapp}
                                  onChange={handleChange}
                                  className="sr-only peer"
                                />
                                <div
                                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300
                                ${formData.sendOtpOnWhatsapp
                                      ? "bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 shadow-md shadow-green-500/20"
                                      : "border-gray-300 dark:border-white/20 bg-white/50 dark:bg-white/5 group-hover:border-gray-400 dark:group-hover:border-white/30"
                                    }`}
                                >
                                  {formData.sendOtpOnWhatsapp && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 25,
                                      }}
                                    >
                                      <Check className="w-3.5 h-3.5 text-white" />
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Send OTP on WhatsApp
                              </span>
                            </label>
                          </motion.div>
                          <motion.button
                            type="button"
                            onClick={sendOTP}
                            className="w-full py-3.5 rounded-xl font-semibold text-white text-sm
                            bg-gradient-to-r from-amber-500 via-orange-500 to-red-500
                            hover:from-amber-600 hover:via-orange-600 hover:to-red-600
                            shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40
                            transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Send Verification Code
                          </motion.button>
                        </div>
                      ) : (
                        <>
                          <FloatingInput
                            icon={Shield}
                            label="Enter 4-digit OTP"
                            name="otp"
                            value={formData.otp}
                            onChange={handleInputChange}
                          />
                          {isSubmitting && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400"
                            >
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Verifying & registering...</span>
                            </motion.div>
                          )}
                          <div className="text-center">
                            {otpTimer > 0 ? (
                              <p className="text-sm text-gray-400 dark:text-gray-500">
                                Resend code in{" "}
                                <span className="font-bold text-amber-500">
                                  {otpTimer}s
                                </span>
                              </p>
                            ) : (
                              <button
                                type="button"
                                onClick={sendOTP}
                                className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                              >
                                Didn't receive it? Resend Code
                              </button>
                            )}
                          </div>
                        </>
                      )}

                      {/* Terms and Conditions */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-2"
                      >
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className="relative mt-0.5">
                            <input
                              type="checkbox"
                              name="termsAccepted"
                              checked={formData.termsAccepted}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300
                            ${formData.termsAccepted
                                  ? "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-500 shadow-md shadow-amber-500/20"
                                  : "border-gray-300 dark:border-white/20 bg-white/50 dark:bg-white/5 group-hover:border-gray-400 dark:group-hover:border-white/30"
                                }`}
                            >
                              {formData.termsAccepted && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 25,
                                  }}
                                >
                                  <Check className="w-3.5 h-3.5 text-white" />
                                </motion.div>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            I agree to the{" "}
                            <a
                              href="/terms"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline underline-offset-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Terms & Conditions
                            </a>{" "}
                            and{" "}
                            <a
                              href="/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline underline-offset-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Privacy Policy
                            </a>
                            . By registering, I consent to the collection and use
                            of my data as described.
                          </span>
                        </label>
                        {errors.termsAccepted && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-1.5 ml-8"
                          >
                            {errors.termsAccepted}
                          </motion.p>
                        )}
                      </motion.div>

                      {/* Submit Error */}
                      {submitError && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"
                        >
                          <p className="text-xs text-red-600 dark:text-red-400 text-center font-medium">
                            {submitError}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Registration Success - Password Display */}
                  {registrationSuccess && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="space-y-5"
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
                          <PartyPopper className="w-8 h-8 text-white" />
                        </motion.div>
                        <motion.h3
                          className="text-xl font-bold text-gray-800 dark:text-white"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          Registration Successful!
                        </motion.h3>
                        <motion.p
                          className="text-sm text-gray-500 dark:text-gray-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          Welcome, {formData.firstName}! Your account has been
                          created.
                        </motion.p>
                      </div>

                      {generatedPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}
                          className="space-y-3"
                        >
                          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-300 dark:border-amber-500/30">
                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2 text-center">
                              🔐 Your Login Password
                            </p>
                            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg px-4 py-3 border border-amber-200 dark:border-amber-500/20">
                              <span className="flex-1 text-center font-mono text-lg font-bold text-gray-800 dark:text-white tracking-wider">
                                {showPassword
                                  ? generatedPassword
                                  : "\u2022".repeat(
                                    generatedPassword.length || 8,
                                  )}
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={copyPassword}
                                className={`p-1.5 rounded-lg transition-colors ${copied
                                  ? "bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400"
                                  : "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                  }`}
                              >
                                {copied ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                            <p className="text-xs text-red-600 dark:text-red-400 text-center font-medium">
                              ⚠️ Please save this password securely. You will need
                              it to log in.
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {/* Download Software Button */}
                      {selectedCategory && CATEGORY_DOWNLOADS[selectedCategory] && (() => {
                        const catInfo = CATEGORY_DOWNLOADS[selectedCategory];
                        const downloadUrl = `${DOWNLOAD_BASE_URL}/${selectedCategory}/${catInfo.filename}`;
                        return (
                          <motion.a
                            href={downloadUrl}
                            download
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white text-sm
                            bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600
                            hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700
                            shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                            transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Download className="w-5 h-5" />
                            Download {catInfo.label} Software
                          </motion.a>
                        );
                      })()}

                      <motion.button
                        type="button"
                        onClick={handleSuccessClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="w-full py-3 rounded-xl font-semibold text-white text-sm
                        bg-gradient-to-r from-green-500 to-emerald-600
                        hover:from-green-600 hover:to-emerald-700
                        shadow-lg shadow-green-500/25 hover:shadow-green-500/40
                        transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue to Dashboard
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="px-6 sm:px-8 pb-6 pt-2">
                <div className="flex items-center justify-between gap-4">
                  {step > 1 && !registrationSuccess ? (
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      disabled={isSubmitting}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium
                      text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/10
                      hover:bg-gray-200 dark:hover:bg-white/15 transition-all duration-200"
                      whileHover={{ x: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </motion.button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold text-white
                      bg-gradient-to-r from-amber-500 via-orange-500 to-red-500
                      hover:from-amber-600 hover:via-orange-600 hover:to-red-600
                      shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40
                      transition-all duration-300"
                      whileHover={{ x: 3, scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  ) : otpSent && step === 4 && !registrationSuccess ? (
                    <motion.button
                      type="button"
                      onClick={handleSubmit}
                      disabled={
                        formData.otp.length < 4 ||
                        !formData.termsAccepted ||
                        isSubmitting
                      }
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300
                      ${formData.otp.length === 4 &&
                          formData.termsAccepted &&
                          !isSubmitting
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                          : "bg-gray-300 dark:bg-white/10 cursor-not-allowed"
                        }`}
                      whileHover={
                        formData.otp.length === 4 &&
                          formData.termsAccepted &&
                          !isSubmitting
                          ? { scale: 1.02 }
                          : {}
                      }
                      whileTap={
                        formData.otp.length === 4 &&
                          formData.termsAccepted &&
                          !isSubmitting
                          ? { scale: 0.95 }
                          : {}
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Verify & Register
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Age Warning Modal */}
      <AgeLimitWarningModal
        isOpen={showAgeWarning}
        onClose={() => setShowAgeWarning(false)}
        message={ageWarningMessage}
      />
    </>
  );
};

export default RegistrationModal;
