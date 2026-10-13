import { useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

// Pre-lazy loading imports
// import OfficialVideoSection from "./components/OfficialVideoSection";
// import Challenges from "./components/Challenges";
// import About from "./components/About";
// import Features from "./components/Features";
// import Create from "./components/Create";
// import Enquiry from "./components/Enquiry";

// Lazy-loaded homepage components for performance
const OfficialVideoSection = lazy(() => import("./components/OfficialVideoSection"));
const Challenges = lazy(() => import("./components/Challenges"));
const About = lazy(() => import("./components/About"));
const Features = lazy(() => import("./components/Features"));
const Create = lazy(() => import("./components/Create"));
const Enquiry = lazy(() => import("./components/Enquiry"));

import Footer from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import {
  RegistrationModalProvider,
  useRegistrationModal,
} from "./context/RegistrationModalContext";
import { LoginModalProvider, useLoginModal } from "./context/LoginModalContext";
import { AuthProvider } from "./context/AuthContext";
import RegistrationModal from "./components/RegistrationModal";
import LoginModal from "./components/LoginModal";
import NotFound from "./components/NotFound";

// Lazy load heavy page components for better initial load performance
const InspectionPage = lazy(() => import("./components/InspectionPage"));
const DesignWorkPage = lazy(() => import("./components/DesignWorkPage"));
const MonitoringPage = lazy(() => import("./components/MonitoringPage"));
const TrialInfoPage = lazy(() => import("./components/TrialInfoPage"));
const Measurement = lazy(() => import("./components/measurenment/Measurement"));
const Videos = lazy(() => import("./components/videos/Videos"));
const PaymentGateway = lazy(() => import("./components/payment/PaymentGateway"));
const PurchaseDashboard = lazy(() => import("./components/PurchaseDashboard"));
const EduLoginPage = lazy(() => import("./components/EduLoginPage"));
const Methodology = lazy(() => import("./components/Methodology"));
const VisualizationPage = lazy(() => import("./components/VisualizationPage"));
const Openings = lazy(() => import("./components/Openings"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-black">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600 dark:border-white"></div>
  </div>
);

// Component to handle scrolling to hash sections and scroll-to-top on route change
const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Retry scrolling until the target element is in the DOM.
      // Needed because hash targets (About, Enquiry) are lazy-loaded and
      // may not exist yet when the location change fires.
      const id = location.hash.replace("#", "");
      let attempts = 0;
      const maxAttempts = 20; // try for up to 2 seconds (20 × 100ms)

      const tryScroll = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryScroll, 100);
        }
      };

      // Small initial delay to let React finish the current render
      setTimeout(tryScroll, 50);
    } else {
      // Scroll to top on route change (no hash)
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);

  return null;
};

// Home page content (without Navbar/Footer)
const HomePage = () => {
  return (
    <>
    
      <Hero />
      {/* 
        // Before lazy loading 
        <OfficialVideoSection />
        <About />
        <Challenges />
        <Features />
        <Create />
        <Enquiry />
      */}
      <Suspense fallback={<PageLoader />}>
        <OfficialVideoSection />
        <About />
        <Challenges />
        <Features />
        <Create />
        <Enquiry />
      </Suspense>
    </>
  );
};

// Inner component that can access the registration modal context
const AppContent = () => {
  const { isOpen, closeModal } = useRegistrationModal();
  const { isOpen: isLoginOpen, closeModal: closeLoginModal } = useLoginModal();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const hideFooter =
    location.pathname.startsWith("/methodology") ||
    location.pathname.startsWith("/our-approach") ||
    location.pathname.startsWith("/visualization") ||
    location.pathname.startsWith("/visualize") ||
    location.pathname.startsWith("/openings");

  return (
    <>
      <div className="min-h-screen bg-stone-100 dark:bg-black text-gray-800 dark:text-white transition-colors duration-300">
        {/* Shared Navbar */}
        <Navbar />

        {/* Page Content - add top padding on non-home pages to offset fixed navbar */}
        <main id="main-content" >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/methodology"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Methodology />
                </Suspense>
              }
            />
            <Route
              path="/our-approach"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Methodology />
                </Suspense>
              }
            />
            <Route
              path="/trial-info"
              element={
                <Suspense fallback={<PageLoader />}>
                  <TrialInfoPage />
                </Suspense>
              }
            />
            <Route
              path="/measurement"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Measurement />
                </Suspense>
              }
            />
            <Route
              path="/at-a-glance"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Videos />
                </Suspense>
              }
            />
            <Route
              path="/videos"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Videos />
                </Suspense>
              }
            />
            <Route
              path="/payment"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PaymentGateway />
                </Suspense>
              }
            />
            <Route
              path="/user/dashboard"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PurchaseDashboard />
                </Suspense>
              }
            />
            <Route
              path="/modules/inspection"
              element={
                <Suspense fallback={<PageLoader />}>
                  <InspectionPage />
                </Suspense>
              }
            />
            <Route
              path="/modules/design"
              element={
                <Suspense fallback={<PageLoader />}>
                  <DesignWorkPage />
                </Suspense>
              }
            />
            <Route
              path="/modules/monitoring"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MonitoringPage />
                </Suspense>
              }
            />
            <Route
              path="/edu-login/:userId/:fileIds"
              element={
                <Suspense fallback={<PageLoader />}>
                  <EduLoginPage />
                </Suspense>
              }
            />
            <Route
              path="/visualization"
              element={
                <Suspense fallback={<PageLoader />}>
                  <VisualizationPage />
                </Suspense>
              }
            />
            <Route
              path="/visualize"
              element={
                <Suspense fallback={<PageLoader />}>
                  <VisualizationPage />
                </Suspense>
              }
            />
            <Route
              path="/openings"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Openings />
                </Suspense>
              }
            />
            {/* Fallback route for 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
        </main>

        {/* Shared Footer */}
        {!hideFooter && <Footer />}
      </div>
      {/* Registration Modal */}
      <RegistrationModal isOpen={isOpen} onClose={closeModal} />
      {/* Login Modal */}
      <LoginModal />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RegistrationModalProvider>
          <LoginModalProvider>
            <Router>
              <ScrollToHash />
              <AppContent />
            </Router>
          </LoginModalProvider>
        </RegistrationModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

