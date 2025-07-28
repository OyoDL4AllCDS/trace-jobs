import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ConfirmEmail() {
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const confirmEmail = async () => {
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");
      const access_token = searchParams.get("access_token");
      const refresh_token = searchParams.get("refresh_token");

      if (token_hash && type) {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (error) {
            setError(error.message);
          } else {
            setConfirmed(true);
            toast({
              title: "Email confirmed!",
              description: "Your account has been successfully verified.",
            });
            
            setTimeout(() => {
              navigate("/");
            }, 3000);
          }
        } catch (err) {
          setError("An unexpected error occurred");
        } finally {
          setLoading(false);
        }
        return;
      }

      if (access_token && refresh_token) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            setError(error.message);
          } else {
            setConfirmed(true);
            toast({
              title: "Email confirmed!",
              description: "Your account has been successfully verified.",
            });
            
            setTimeout(() => {
              navigate("/");
            }, 3000);
          }
        } catch (err) {
          setError("An unexpected error occurred");
        } finally {
          setLoading(false);
        }
        return;
      }

      setError("Invalid confirmation link");
      setLoading(false);
    };

    confirmEmail();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-background/80 border-border/50 shadow-elegant">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Confirmation</CardTitle>
          <CardDescription>Verifying your account</CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {loading && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Confirming your email...</p>
            </div>
          )}

          {!loading && confirmed && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-green-700">Email Confirmed!</h3>
                <p className="text-muted-foreground">
                  Your account has been successfully verified. You'll be redirected to the homepage shortly.
                </p>
              </div>
              <Button onClick={() => navigate("/")} className="w-full">
                Continue to JobTrace
              </Button>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-12 w-12 text-destructive" />
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate("/auth")} 
                  variant="outline" 
                  className="w-full"
                >
                  Back to Sign In
                </Button>
                <Button 
                  onClick={() => navigate("/")} 
                  variant="ghost" 
                  className="w-full"
                >
                  Go to Homepage
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}