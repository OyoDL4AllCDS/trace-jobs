import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";

export default function CheckEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "signup";

  const getMessage = () => {
    switch (type) {
      case "reset":
        return {
          title: "Password Reset Email Sent",
          description: "Check your email for the password reset link",
          message: `We've sent a password reset link to ${email}. Click the link in your email to reset your password.`
        };
      default:
        return {
          title: "Check Your Email",
          description: "Confirm your account to get started",
          message: `We've sent a confirmation link to ${email}. Click the link in your email to verify your account.`
        };
    }
  };

  const { title, description, message } = getMessage();

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/auth")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Button>

        <Card className="backdrop-blur-sm bg-background/80 border-border/50 shadow-elegant">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground">{message}</p>
              {email && (
                <p className="text-sm text-muted-foreground">
                  Didn't receive an email? Check your spam folder.
                </p>
              )}
            </div>

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}