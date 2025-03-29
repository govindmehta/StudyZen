import Loader from "@/components/Loader";
import { SignUp as ClerkSignUp, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const [loading, setLoading] = useState(true);

  // Redirect after successful sign-up
  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
      if (isSignedIn) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isSignedIn, isLoaded, navigate]);

  // Show a loading screen while auth is being checked
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mb-8 flex items-center gap-2">
        <div className="bg-primary text-primary-foreground rounded-md w-10 h-10 flex items-center justify-center font-bold">
          S
        </div>
        <h1 className="text-3xl font-bold">StudyZen</h1>
      </div>

      <div className="w-full max-w-md">
        <ClerkSignUp 
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in" 
          redirectUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        />
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-all"
      >
        Back to home
      </button>
    </div>
  );
};

export default SignUp;