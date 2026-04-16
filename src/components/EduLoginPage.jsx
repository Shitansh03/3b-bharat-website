// import { useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useLoginModal } from "../context/LoginModalContext";
// import { useAuth } from "../context/AuthContext";
// import Hero from "./Hero";
// import OfficialVideoSection from "./OfficialVideoSection";
// import About from "./About";
// import Challenges from "./Challenges";
// import Features from "./Features";
// import Create from "./Create";
// import Enquiry from "./Enquiry";

// /**
//  * EduLoginPage — renders the normal homepage but:
//  * 1. Stores userId + fileIds from URL into sessionStorage
//  * 2. Auto-opens the existing login modal
//  * 3. After login, redirects to /dashboard (which reads stored fileIds)
//  *
//  * URL: /edu-login/:userId/:fileIds
//  * Example: /edu-login/5/1,2,3
//  */
// const EduLoginPage = () => {
//   const { userId, fileIds } = useParams();   //********* */
//   const { openModal } = useLoginModal();
//   const { isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   // Store params + auto-open login modal on mount  **********************************
//   useEffect(() => {
//     if (userId) sessionStorage.setItem("edu_user_id", userId);
//     if (fileIds) sessionStorage.setItem("edu_file_ids", fileIds);

//     // Small delay to ensure page renders first, then open modal
//     const timer = setTimeout(() => {
//       if (!isAuthenticated) {
//         openModal();
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [userId, fileIds]);

//   // After login, redirect to dashboard
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/dashboard");
//     }
//   }, [isAuthenticated, navigate]);

//   // Render normal homepage content (Navbar + Footer come from App.jsx)
//   return (
//     <>
//       <Hero />
//       <OfficialVideoSection />
//       <About />
//       <Challenges />
//       <Features />
//       <Create />
//       <Enquiry />
//     </>
//   );
// };

// export default EduLoginPage;

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
 *
 * NEW VALIDATIONS:
 * V1 - ID mismatch: If user is already logged in BUT their ID doesn't match
 *      the userId param → logout that user and open the login modal so the
 *      correct user (the one whose ID was passed) can log in.
 *
 * V2 - ID match / already logged in: If user is already logged in AND their
 *      ID matches the userId param → skip the modal and go straight to dashboard.
 */
const EduLoginPage = () => {
  const { userId, fileIds } = useParams();
  const { openModal } = useLoginModal();
  const { isAuthenticated, user, logout } = useAuth(); // ← added: user, logout
  const navigate = useNavigate();

  useEffect(() => {
    // Always store params so dashboard can read them after login
    if (userId) sessionStorage.setItem("edu_user_id", userId);
    if (fileIds) sessionStorage.setItem("edu_file_ids", fileIds);

    const timer = setTimeout(() => {
      if (isAuthenticated && userId) {
        const loggedInId = String(user?.id ?? "");
        const paramId = String(userId);

        if (loggedInId === paramId) {
          // ── Validation 2 ──────────────────────────────────────────────
          // Same user is already logged in → skip modal, go to dashboard
          navigate("/user/dashboard");
        } else {
          // ── Validation 1 ──────────────────────────────────────────────
          // A DIFFERENT user is logged in → log them out, open modal so
          // the correct user (whose ID was passed in the URL) can sign in
          logout();          // clears auth state / tokens
          openModal();
        }
      } else if (!isAuthenticated) {
        // Normal flow: no one is logged in → open login modal as before
        openModal();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [userId, fileIds]);

  // After any login (original flow), redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/user/dashboard");
    }
  }, [isAuthenticated, navigate]);

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
