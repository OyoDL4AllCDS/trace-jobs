import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ConfirmEmail from "./pages/ConfirmEmail";
import CheckEmail from "./pages/CheckEmail";
import ResetPassword from "./pages/ResetPassword";
import SavedJobs from "./pages/SavedJobs";
import Profile from "./pages/Profile";
import CareerTips from "./pages/CareerTips"
import CareerTipDetail from "./pages/CareerTipDetail"
import Header from "@/components/Layout/Header";
import Footer from "./pages/Footer"
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const CHEEKY_WORDS = [
  "Getting your page up...",
  "Hunting Dream Jobs...",
  "Making Connections...",
  "Leveling Up Skills...",
  "Manifesting Offers...",
  "Sending Good Vibes...",
  "Sharpening Pencils...",
];

const App = () => {
  const [loading, setLoading] = useState(true);
  const [cheeky, setCheeky] = useState("");

  useEffect(() => {
    setCheeky(CHEEKY_WORDS[Math.floor(Math.random() * CHEEKY_WORDS.length)]);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
        <Loader2 className="animate-spin h-16 w-16 text-primary mb-4" />
        <span className="text-muted-foreground text-lg font-medium">{cheeky}</span>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/confirm" element={<ConfirmEmail />} />
              <Route path="/auth/check-email" element={<CheckEmail />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/career-tips" element={<CareerTips />} />
              <Route path="/career-tips/:slug" element={<CareerTipDetail />} />
              <Route path="/saved-jobs" element={<SavedJobs />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
