import Loader from "@/components/Loader";
import { SignIn as ClerkSignIn, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    
    setLoading(false); 
    if (isSignedIn) {
      const redirectTo = new URLSearchParams(location.search).get("redirect_url") || "/dashboard";
      navigate(redirectTo, { replace: true });
    }
  }, [isSignedIn, isLoaded, navigate, location.search]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader/>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <h1 className="text-3xl font-bold">StudyZen</h1>

      <div className="w-full max-w-md">
        <ClerkSignIn 
          routing="path" 
          path="/sign-in" 
          signUpUrl="/sign-up" 
          afterSignInUrl="/dashboard"
        />
      </div>

      <button 
        onClick={() => navigate("/")} 
        className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-all"
      >
        Back to home
      </button>
    </div>
  );
};

export default SignIn;