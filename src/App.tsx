// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import {
//   SignedIn,
//   SignedOut,
//   RedirectToSignIn,
// } from "@clerk/clerk-react";
// import MainLayout from "./components/layout/MainLayout";
// import Dashboard from "./pages/Dashboard";
// import Quizzes from "./pages/Quizzes";
// import Timer from "./pages/Timer";
// import Settings from "./pages/Settings";
// import NotFound from "./pages/NotFound";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
// import HomePage from "./pages/HomePage";

// const queryClient = new QueryClient();

// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// const isClerkAvailable = !!PUBLISHABLE_KEY;

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
//   isClerkAvailable ? (
//     <>
//       <SignedIn>{children}</SignedIn>
//       <SignedOut>
//         <RedirectToSignIn />
//       </SignedOut>
//     </>
//   ) : (
//     <>{children}</>
//   )
// );

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<HomePage />} />

//           {/* Auth Routes */}
//           {isClerkAvailable && (
//             <>
//               <Route path="/sign-in/*" element={<SignIn />} />
//               <Route path="/sign-up/*" element={<SignUp />} />
//               <Route path="/sso-callback" element={<Navigate to="/dashboard" replace />} />
//             </>
//           )}

//           {/* Protected Routes */}
//           <Route
//             path="/dashboard/*"
//             element={
//               <ProtectedRoute>
//                 <MainLayout>
//                   <Dashboard />
//                 </MainLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/quizzes"
//             element={
//               <ProtectedRoute>
//                 <MainLayout>
//                   <Quizzes />
//                 </MainLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/timer"
//             element={
//               <ProtectedRoute>
//                 <MainLayout>
//                   <Timer />
//                 </MainLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/settings"
//             element={
//               <ProtectedRoute>
//                 <MainLayout>
//                   <Settings />
//                 </MainLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* 404 Not Found */}
//           <Route path="*" element={
//             <SignedIn>
//               <Navigate to="/dashboard" replace />
//             </SignedIn>
//           } />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;



import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Quizzes from "./pages/Quizzes";
import Timer from "./pages/Timer";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkAvailable = !!PUBLISHABLE_KEY;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  isClerkAvailable ? (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  ) : (
    <>{children}</>
  )
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Auth Routes */}
        {isClerkAvailable && (
          <>
            <Route path="/sign-in/*" element={<SignIn />} />
            <Route path="/sign-up/*" element={<SignUp />} />
            <Route path="/sso-callback" element={<Navigate to="/dashboard" replace />} />
          </>
        )}

        {/* Protected Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Quizzes />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/timer"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Timer />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all routes */}
        <Route path="*" element={
          <SignedIn>
            <Navigate to="/dashboard" replace />
          </SignedIn>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;