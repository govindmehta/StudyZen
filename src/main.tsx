// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";
// import { ClerkProvider } from "@clerk/clerk-react";

// // Get the Clerk Publishable Key from Environment Variables
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

// if (!PUBLISHABLE_KEY) {
//   console.error("❌ Clerk Publishable Key is missing! Please check your environment variables.");
// }

// // Wrapper Component to Handle Clerk Authentication
// const AppWithAuth = () => {
//   return (
//     <ClerkProvider
//       publishableKey={PUBLISHABLE_KEY}
//       signInUrl="/sign-in"
//       signUpUrl="/sign-up"
//       signInFallbackRedirectUrl="/dashboard" // ✅ Redirect after Sign-in
//       signUpFallbackRedirectUrl="/dashboard" // ✅ Redirect after Sign-up
//       afterSignOutUrl="/" // ✅ Redirect to home after logout
//     >
//       <App />
//     </ClerkProvider>
//   );
// };

// // Render the Application
// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <AppWithAuth />
//   </React.StrictMode>
// );



import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

// Get the Clerk Publishable Key from Environment Variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

if (!PUBLISHABLE_KEY) {
  console.error("❌ Clerk Publishable Key is missing! Please check your environment variables.");
}

// Wrapper Component to Handle Clerk Authentication
const AppWithAuth = () => {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      // navigate={(to) => window.location.href = to}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  );
};

// Render the Application
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithAuth />
  </React.StrictMode>
);