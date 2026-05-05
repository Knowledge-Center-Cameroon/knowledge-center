import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  createPortalAccount,
  forgotPassword,
  registerGsp,
  resendVerificationCode,
  resetPassword,
  saveAuthToken,
  verifyEmailCode,
} from "@/services/gspApi";
import { useGspAuth } from "@/contexts/GspAuthContext";
import { useSeo } from "@/hooks/useSeo";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

type GoogleProfile = {
  sub: string;
  name?: string;
  email?: string;
};

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("resetToken");
  const redirectUrl = searchParams.get("redirect") || "/gsp/dashboard";
  
  const [mode, setMode] = React.useState<"login" | "signup" | "verify" | "forgot" | "reset">(resetToken ? "reset" : "login");
  const [loading, setLoading] = React.useState(false);
  const [resendingCode, setResendingCode] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [redirecting, setRedirecting] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  
  const { user, refreshUser, signIn } = useGspAuth();

  const handleGoogleAccessToken = React.useCallback(
    async (accessToken: string) => {
      setGoogleLoading(true);
      try {
        const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const profile = (await profileRes.json().catch(() => ({}))) as GoogleProfile;
        if (!profileRes.ok || !profile.sub || !profile.email) {
          throw new Error("Could not read your Google profile.");
        }

        const data = await registerGsp({
          google_id: profile.sub,
          username: profile.name || profile.email,
          email: profile.email,
        });
        const token = data?.access || data?.token;
        if (!data?.success || !token) {
          throw new Error("Unable to register with Google account.");
        }

        saveAuthToken(token);
        await refreshUser();
        navigate(redirectUrl);
      } catch (error: unknown) {
        googleLogout();
        const message =
          error instanceof Error
            ? error.message
            : "Unable to register with Google account. Please try signing in with email and password.";
        toast({
          title: "Google sign-in failed",
          description: message,
          variant: "destructive",
        });
      } finally {
        setGoogleLoading(false);
      }
    },
    [navigate, redirectUrl, refreshUser, toast],
  );

  const googleLogin = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: (tokenResponse) => {
      handleGoogleAccessToken(tokenResponse.access_token);
    },
    onError: (errorResponse) => {
      toast({
        title: "Google sign-in failed",
        description:
          errorResponse.error_description ||
          "Unable to authenticate with Google. Please try again.",
        variant: "destructive",
      });
    },
    onNonOAuthError: () => {
      toast({
        title: "Google sign-in cancelled",
        description: "The Google sign-in window was closed before authentication finished.",
        variant: "destructive",
      });
    },
  });

  

  useSeo({
    title: "GSP Portal | Knowledge Center",
    description: "Sign in or create an account for the Knowledge Center Global Scholars Programme portal.",
  });


  React.useEffect(() => {
    if (user) {
      setRedirecting(true);
      const slowTimer = setTimeout(() => {
        toast({
          title: "Loading your portal...",
          description: "Please wait while we set things up. This may take a moment.",
        });
      }, 3000);
      navigate(redirectUrl);
      return () => clearTimeout(slowTimer);
    }
  }, [user, navigate, redirectUrl, toast]);




  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (form.password !== form.confirmPassword) throw new Error("Passwords do not match");
        const data = await createPortalAccount({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        if (data.token) {
          saveAuthToken(data.token);
          await refreshUser();
          navigate(redirectUrl);
          return;
        }
        toast({
          title: "Verification code sent",
          description: data.message || "Enter the code from your email to finish creating your account.",
        });
        setForm((prev) => ({ ...prev, password: "", confirmPassword: "", verificationCode: "" }));
        setMode("verify");
      } else if (mode === "verify") {
        const data = await verifyEmailCode({
          email: form.email,
          code: form.verificationCode,
        });
        saveAuthToken(data.token);
        await refreshUser();
        navigate(redirectUrl);
      } else if (mode === "login") {
        await signIn(form.email, form.password);
        navigate(redirectUrl);
      } else if (mode === "forgot") {
        await forgotPassword(form.email);
        toast({ title: "Reset link sent", description: "If your account exists, a password reset link has been sent." });
      } else if (mode === "reset") {
        if (!resetToken) throw new Error("Missing reset token");
        if (form.password !== form.confirmPassword) throw new Error("Passwords do not match");
        await resetPassword(resetToken, form.password);
        toast({ title: "Password updated", description: "You can now sign in with your new password." });
        setMode("login");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Please try again.";
      toast({
        title: "Request failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onResendCode = async () => {
    setResendingCode(true);
    try {
      await resendVerificationCode(form.email);
      toast({
        title: "Code resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Please try again.";
      toast({
        title: "Unable to resend code",
        description: message,
        variant: "destructive",
      });
    } finally {
      setResendingCode(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="container mx-auto px-4 lg:px-8 py-16 lg:py-24"
    >
      {redirecting && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-kc-blue border-t-transparent rounded-full" />
          <p className="text-sm text-muted-foreground font-medium">Redirecting to your portal...</p>
        </div>
      )}
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-8 items-stretch">
        <Card className="rounded-3xl border-kc-blue/10 shadow-card bg-white">
          <CardHeader>
            <CardTitle className="heading-2">Knowledge Center Portal</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground/80 space-y-4">
            <p>
              Sign in or create an account to access your personalized Knowledge Center dashboard.
            </p>
            <div className="pt-4">
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-kc-blue/10 shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl font-heading">
              {mode === "signup" && "Start your account"}
              {mode === "verify" && "Verify your email"}
              {mode === "login" && "Sign in"}
              {mode === "forgot" && "Reset password"}
              {mode === "reset" && "Choose a new password"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
              </div>
              {mode === "verify" && (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification code</Label>
                  <Input
                    id="verificationCode"
                    // inputMode="numeric"
                    // maxLength={6}
                    value={form.verificationCode}
                    onChange={(e) => setForm((p) => ({ ...p, verificationCode: e.target.value }))}
                    required
                  />
                </div>
              )}
              {mode !== "forgot" && mode !== "verify" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
                </div>
              )}
              {(mode === "signup" || mode === "reset") && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input id="confirmPassword" type="password" value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} required />
                </div>
              )}
              <Button type="submit" variant="blue" className="rounded-full w-full" disabled={loading}>
                {loading ? "Please wait..." : "Continue"}
              </Button>
            </form>
            {mode === "verify" && (
              <div className="mt-4">
                <Button type="button" variant="outline" className="rounded-full w-full" onClick={onResendCode} disabled={resendingCode}>
                  {resendingCode ? "Sending..." : "Resend verification code"}
                </Button>
              </div>
            )}
            <div className="mt-4 text-sm flex flex-wrap gap-3 text-muted-foreground">
              {mode !== "login" && (
                <button className="underline" onClick={() => setMode("login")} type="button">Sign in</button>
              )}
              {mode !== "signup" && mode !== "verify" && (
                <button className="underline" onClick={() => setMode("signup")} type="button">Create account</button>
              )}
              {mode !== "forgot" && mode !== "reset" && mode !== "verify" && (
                <button className="underline" onClick={() => setMode("forgot")} type="button">Forgot password</button>
              )}
            </div>
            {(mode === "login" || mode === "signup") && (
              <>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <button
                  type="button"
                  onClick={() => googleLogin()}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {googleLoading ? "Please wait..." : "Continue with Google"}
                </button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};

export default AuthPage;
