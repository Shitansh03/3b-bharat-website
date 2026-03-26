import { useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import OfficialVideoSection from "./components/OfficialVideoSection";
import Challenges from "./components/Challenges";
import About from "./components/About";
import Features from "./components/Features";
import Create from "./components/Create";
import Enquiry from "./components/Enquiry";
import Footer from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import {
  RegistrationModalProvider,
  useRegistrationModal,
} from "./context/RegistrationModalContext";
import RegistrationModal from "./components/RegistrationModal";

// Lazy load heavy page components for better initial load performance
const Measurement = lazy(() => import("./components/measurenment/Measurement"));
const Videos = lazy(() => import("./components/videos/Videos"));
const PaymentGateway = lazy(() => import("./components/payment/PaymentGateway"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-black">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600 dark:border-white"></div>
  </div>
);

// Component to handle scrolling to hash sections
const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure the page has rendered
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  return null;
};

// Home page content (without Navbar/Footer)
const HomePage = () => {
  return (
    <>
      <Hero />
      <OfficialVideoSection />
      <About />
      <Challenges />
      <Features />
      <Create />
      <Enquiry />
    </>
  );
};

// Inner component that can access the registration modal context
const AppContent = () => {
  const { isOpen, closeModal } = useRegistrationModal();
  return (
    <>
      <div className="min-h-screen bg-stone-100 dark:bg-black text-gray-800 dark:text-white transition-colors duration-300">
        {/* Shared Navbar */}
        <Navbar />

        {/* Page Content */}
        <main id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/measurement"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Measurement />
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
          </Routes>
        </main>

        {/* Shared Footer */}

        <Footer />
      </div>
      {/* Registration Modal */}
      <RegistrationModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <RegistrationModalProvider>
        <Router>
          <ScrollToHash />
          <AppContent />
        </Router>
      </RegistrationModalProvider>
    </ThemeProvider>
  );
}

export default App;
