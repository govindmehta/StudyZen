import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  SquarePen, 
  Clock, 
  Settings,
  LogOut,
  Table,
  SquareStack,
  Bot
} from 'lucide-react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Study Assistant",
    href: "/study-assistant",
    icon: <Bot className="h-5 w-5" />,
  },
  {
    title: "Quizzes",
    href: "/quizzes",
    icon: <SquarePen className="h-5 w-5" />,
  },
  {
    title: "Flash Cards",
    href: "/flash-cards",
    icon: <SquareStack className="h-5 w-5" />,
  },
  {
    title: "Time-Table",
    href: "/table",
    icon: <Table className="h-5 w-5" />,
  },
  {
    title: "Study Timer",
    href: "/timer",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

// Helper function to check if Clerk is available
const isClerkAvailable = () => {
  return !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Only use Clerk hooks if Clerk is available
  const clerkEnabled = isClerkAvailable();
  const clerk = clerkEnabled ? useClerk() : null;
  const userHook = clerkEnabled ? useUser() : null;
  
  // Get user data if available
  const user = userHook?.user;
  
  const handleSignOut = () => {
    if (clerk) {
      clerk.signOut(() => {
        navigate("/");
      });
    }
  };
  
  return (
    <aside className="fixed inset-y-0 left-0 w-16 md:w-64 bg-primary text-primary-foreground flex flex-col border-r border-primary/10">
      <div className="p-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-white text-primary rounded-md w-8 h-8 flex items-center justify-center font-bold">
            S
          </div>
          <h1 className="text-xl font-bold hidden md:block">StudyZen</h1>
        </Link>
      </div>
      
      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  "hover:bg-primary-foreground/10",
                  location.pathname === item.href
                    ? "bg-primary-foreground/10 font-medium"
                    : "transparent"
                )}
              >
                {item.icon}
                <span className="hidden md:inline-block">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto flex flex-col gap-4">
        {clerkEnabled && user ? (
          <>
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                {user.firstName ? (
                  <span className="text-xs">{user.firstName[0]}{user.lastName?.[0] || ''}</span>
                ) : (
                  <span className="text-xs">US</span>
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user.firstName || 'User'}</p>
                <p className="text-xs opacity-70">{user.emailAddresses[0].emailAddress || 'student@college.edu'}</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="justify-start text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground md:w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden md:inline-block">Sign Out</span>
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-xs">GU</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Guest User</p>
              <p className="text-xs opacity-70">No authentication</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
