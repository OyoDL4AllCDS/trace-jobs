import { Menu, User, Bookmark, LogOut, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDisplayName = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', user.id)
          .maybeSingle();

        setDisplayName(data?.display_name || user.email?.split('@')[0] || "User");
      } catch (error) {
        setDisplayName(user.email?.split('@')[0] || "User");
      }
    };

    fetchDisplayName();
  }, [user]);

  const getAvatarUrl = () => {
    const seed = displayName || user?.email || 'default';
    return `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(seed)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">

          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/jobtrace_logo.jpeg" 
              alt="JobTrace Logo" 
              className="h-8 w-full rounded-lg object-cover"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Jobs
            </Link>
            <Link to="/saved-jobs" className="text-sm font-medium hover:text-primary transition-colors">
              Saved Jobs
            </Link>
            <Link to="/career-tips" className="text-sm font-medium hover:text-primary transition-colors">
              Career Tips
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={getAvatarUrl()} alt="Profile Avatar" />
                        <AvatarFallback className="text-xs">
                          {displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{displayName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate("/saved-jobs")} className="cursor-pointer">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Saved Jobs
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center md:hidden">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={getAvatarUrl()} alt="Profile Avatar" />
                    <AvatarFallback className="text-xs">
                      {displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </>
            ) : (
              <Button asChild variant="outline" size="sm" className="hidden md:flex">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden" 
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent side="right" className="md:hidden w-full p-0 top-16 h-auto">
                <nav className="flex flex-col gap-2 px-6 py-6">
                  <Link to="/" className="py-2 text-base font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                    Jobs
                  </Link>
                  <Link to="/companies" className="py-2 text-base font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                    Companies
                  </Link>
                  <Link to="/career-tips" className="py-2 text-base font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                    Career Tips
                  </Link>
                  {user && (
                    <>
                      <Link to="/saved-jobs" className="py-2 text-base font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                        Saved Jobs
                      </Link>
                      <Link to="/profile" className="py-2 text-base font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                        Profile
                      </Link>
                    </>
                  )}
                </nav>
                
                <div className="px-6 pb-6">
                  {user ? (
                    <Button variant="outline" className="w-full" onClick={() => { signOut(); setOpen(false); }}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/auth" onClick={() => setOpen(false)}>Sign In</Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;