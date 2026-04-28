import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  forgotPassword,
  registerGsp,
  resendVerificationCode,
  resetPassword,
  saveAuthToken,
  verifyEmailCode,
} from "@/services/gspApi";
import { useGspAuth } from "@/contexts/GspAuthContext";
import { useSeo } from "@/hooks/useSeo";

const GspAuthPage: React.FC = () => {
  const { user, refreshUser, signIn } = useGspAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("resetToken");

  const [mode, setMode] = React.useState<"login" | "signup" | "verify" | "forgot" | "reset">(resetToken ? "reset" : "login");
  const [loading, setLoading] = React.useState(false);
  const [resendingCode, setResendingCode] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  useSeo({
    title: "GSP Portal | Knowledge Center",
    description: "Sign in or create an account for the Knowledge Center Global Scholars Programme portal.",
  });

  React.useEffect(() => {
    if (user) navigate("/gsp/dashboard");
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (form.password !== form.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await registerGsp({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        toast({
          title: "Verification code sent",
          description: "Enter the code from your email to finish creating your account.",
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
        toast({
          title: "Account verified",
          description: "Your account has been created and you are now signed in.",
        });
        navigate("/gsp/dashboard");
      } else if (mode === "login") {
        await signIn(form.email, form.password);
        navigate("/gsp/dashboard");
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
      const message = error instanceof Error ? error.message : "Please try again."
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
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-8 items-stretch">
        <Card className="rounded-3xl border-kc-blue/10 shadow-card bg-white">
          <CardHeader>
            <CardTitle className="heading-2">KC Global Scholars Programme</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground/80 space-y-4">
            <p>
              Build your application in your own dashboard, save as you go, and submit once all sections are complete.
            </p>
            <p className="text-sm text-muted-foreground">
              Programme period: Summer 2026 through May 2027.
            </p>
            <div className="pt-4">
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/projects/gsp">Read about GSP</Link>
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
            <form onSubmit={onSubmit} className="space-y-4">
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
                    inputMode="numeric"
                    maxLength={6}
                    value={form.verificationCode}
                    onChange={(e) => setForm((p) => ({ ...p, verificationCode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
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
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};

export default GspAuthPage;
