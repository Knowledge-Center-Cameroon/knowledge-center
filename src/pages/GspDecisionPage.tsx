import React from "react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGspAuth } from "@/contexts/GspAuthContext";
import { getGspDecision } from "@/services/gspApi";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const confettiPieces = Array.from({ length: 80 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 0.9}s`,
  duration: `${2.4 + Math.random() * 1.6}s`,
}));

const GspDecisionPage: React.FC = () => {
  const { user, loading } = useGspAuth();
  const { toast } = useToast();
  const [state, setState] = React.useState<any>(null);
  const [fetching, setFetching] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const resp = await getGspDecision();
        setState(resp);
      } catch (error: any) {
        const message = error.message || "Your decision is not available yet.";
        setLoadError(message);
        if (!/not found|not submitted|decision/i.test(message)) {
          toast({ title: "Failed to load decision", description: message, variant: "destructive" as any });
        }
      } finally {
        setFetching(false);
      }
    })();
  }, [user, toast]);

  if (!loading && !user) return <Navigate to="/auth?redirect=/gsp/decision" replace />;

  const status = state?.decisionStatus;
  const accepted = state?.released && status === "accepted";
  const waitlisted = state?.released && status === "waitlisted";
  const declined = state?.released && status === "not_admitted";

  return (
    <section className="container mx-auto px-4 lg:px-8 py-14 lg:py-20 relative overflow-hidden">
      {accepted && (
        <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
          {confettiPieces.map((piece) => (
            <span
              key={piece.id}
              className="absolute top-[-12px] w-2 h-3 rounded-sm"
              style={{
                left: piece.left,
                animation: `drop ${piece.duration} linear ${piece.delay} infinite`,
                background: ["#2E3AF0", "#16a34a", "#f97316", "#f43f5e"][piece.id % 4],
              }}
            />
          ))}
        </div>
      )}
      <div className="max-w-3xl mx-auto">
        <Card className="rounded-3xl border-kc-blue/20 shadow-card">
          <CardContent className="p-8 md:p-12 text-center space-y-4">
            {fetching && (
              <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-kc-blue" />
                Checking your decision status...
              </div>
            )}
            {!fetching && loadError && (
              <>
                <h1 className="heading-2">Decision Not Available</h1>
                <p className="text-muted-foreground">We could not find a released decision for this account yet.</p>
              </>
            )}
            {!fetching && !loadError && !state?.released && (
              <>
                <h1 className="heading-2">Decision Not Yet Released</h1>
                <p className="text-muted-foreground">Your application is received. Decisions will appear here once the cycle is released.</p>
              </>
            )}
            {accepted && (
              <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                <h1 className="heading-2 text-kc-blue">Congratulations, {user?.name}</h1>
                <p className="text-lg">You have been admitted to the KC Global Scholars Programme.</p>
                <p className="text-muted-foreground">Reference: {state?.reference}</p>
              </motion.div>
            )}
            {waitlisted && (
              <>
                <h1 className="heading-2">You Have Been Waitlisted</h1>
                <p className="text-muted-foreground">
                  Your application remains under consideration. We appreciate the strength and seriousness of your submission.
                </p>
              </>
            )}
            {declined && (
              <>
                <h1 className="heading-2">Application Update</h1>
                <p className="text-muted-foreground">
                  Thank you for applying. After full review, we are unable to offer admission to this cohort.
                </p>
                {(state?.lowerSixthPathwayChoice || "").includes("summer") && (
                  <p className="text-muted-foreground">Based on your application, we encourage you to continue through the Summer Programme pathway.</p>
                )}
                {(state?.lowerSixthPathwayChoice || "").includes("mentor") && (
                  <p className="text-muted-foreground">You may also continue with one-on-one mentorship support in Upper Sixth.</p>
                )}
              </>
            )}
            <div className="pt-4">
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/gsp/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <style>{`
        @keyframes drop {
          0% { transform: translateY(-5vh) rotate(0deg); opacity: 0; }
          12% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default GspDecisionPage;
