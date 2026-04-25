import React from "react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGspAuth } from "@/contexts/GspAuthContext";
import { getGspApplication } from "@/services/gspApi";
import { useToast } from "@/components/ui/use-toast";

const GspDashboardPage: React.FC = () => {
  const { user, loading, signOut } = useGspAuth();
  const { toast } = useToast();
  const [application, setApplication] = React.useState<any>(null);
  const [fetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getGspApplication();
        setApplication(data.application);
      } catch (error: any) {
        toast({ title: "Failed to load dashboard", description: error.message || "Please refresh", variant: "destructive" as any });
      } finally {
        setFetching(false);
      }
    })();
  }, [user, toast]);

  if (!loading && !user) return <Navigate to="/gsp" replace />;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 lg:px-8 py-14 lg:py-20"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h1 className="heading-2">Application Dashboard</h1>
            <p className="text-muted-foreground">{user?.name} ({user?.email})</p>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === "admin" && (
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/gsp/admin">Admin</Link>
              </Button>
            )}
            <Button variant="ghost" className="rounded-full" onClick={signOut}>Sign out</Button>
          </div>
        </div>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Global Scholars Programme 2026</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {fetching ? (
              <p className="text-muted-foreground">Loading application...</p>
            ) : (
              <>
                <p>Status: <span className="font-semibold uppercase">{application?.status || "draft"}</span></p>
                <p>Progress: <span className="font-semibold">{application?.progressPct || 0}%</span></p>
                <p>Reference: <span className="font-semibold">{application?.reference || "Not submitted yet"}</span></p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild variant="blue" className="rounded-full">
                    <Link to="/gsp/application">{application?.status === "submitted" ? "View Application" : "Continue Application"}</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/gsp/decision">View Decision</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};

export default GspDashboardPage;
