import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLoginModal } from "../context/LoginModalContext";
import { useAuth } from "../context/AuthContext";
import Hero from "./Hero";
import OfficialVideoSection from "./OfficialVideoSection";
import About from "./About";
import Challenges from "./Challenges";
import Features from "./Features";
import Create from "./Create";
import Enquiry from "./Enquiry";

/**
 * EduLoginPage — renders the normal homepage but:
 * 1. Stores userId + fileIds from URL into sessionStorage
 * 2. Auto-opens the existing login modal
 * 3. After login, redirects to /dashboard (which reads stored fileIds)
 *
 * URL: /edu-login/:userId/:fileIds
 * Example: /edu-login/5/1,2,3
 */
const EduLoginPage = () => {
  const { userId, fileIds } = useParams();   //********* */
  const { openModal } = useLoginModal();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Store params + auto-open login modal on mount  **********************************
  useEffect(() => {
    if (userId) sessionStorage.setItem("edu_user_id", userId);
    if (fileIds) sessionStorage.setItem("edu_file_ids", fileIds);

    // Small delay to ensure page renders first, then open modal
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        openModal();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [userId, fileIds]);

  // After login, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Render normal homepage content (Navbar + Footer come from App.jsx)
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

export default EduLoginPage;
