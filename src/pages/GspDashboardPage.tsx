import React from "react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useGspAuth } from "@/contexts/GspAuthContext";
import { getGspApplication } from "@/services/gspApi";
import { useToast } from "@/components/ui/use-toast";
import { computeSectionState, computeProgressPct } from "@/lib/gspUtils";

const GspDashboardPage: React.FC = () => {
  const { user, loading, signOut } = useGspAuth();
  const { toast } = useToast();
  const [application, setApplication] = React.useState<any>(null);
  const [fetching, setFetching] = React.useState(true);
  const [localProgress, setLocalProgress] = React.useState<number | null>(null);
  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "Applicant";
  const hasApplication = Boolean(application?.r_id || application?.id || application?.status || application?.reference);

  React.useEffect(() => {
    if (!user) return;
    const draftKey = `gsp_draft_${user.email}`;
    const localDraft = localStorage.getItem(draftKey);
    if (localDraft) {
      try {
        const parsed = JSON.parse(localDraft);
        const st = computeSectionState(parsed);
        setLocalProgress(computeProgressPct(st));
      } catch (e) {}
    }

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

  if (!loading && !user) return <Navigate to="/auth?redirect=/gsp/dashboard" replace />;

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
            <p className="text-muted-foreground">Welcome, <span className="font-medium text-foreground">{displayName}</span></p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-3xl md:col-span-2 p-0 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-kc-blue/10 via-white to-kc-blue/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Global Scholars Programme 2026</h3>
                  <p className="text-sm text-muted-foreground mt-1">Application overview and quick actions</p>
                </div>
                <div className="text-right">
                  <Badge variant={application?.status === 'submitted' ? 'default' : (application?.status === 'under_review' ? 'secondary' : 'outline')}>
                    {(application?.status || 'draft').toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="mt-6">
                {fetching ? (
                  <p className="text-muted-foreground">Loading application...</p>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-muted-foreground">Progress</div>
                            <div className="text-2xl font-bold">
                              {application?.status === 'submitted'
                                ? 100
                                : (localProgress !== null
                                  ? Math.max(localProgress, application?.progressPct || 0)
                                  : (application?.progressPct || 0))}%
                            </div>
                          </div>
                          <div className="w-1/2">
                            <Progress
                              value={application?.status === 'submitted'
                                ? 100
                                : (localProgress !== null
                                  ? Math.max(localProgress, application?.progressPct || 0)
                                  : (application?.progressPct || 0))}
                            />
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-muted-foreground">
                          Reference: <span className="font-medium text-foreground">{application?.reference || 'Not submitted yet'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                      <Button asChild variant="blue" className="rounded-full px-6 py-3">
                        <Link to="/gsp/application">
                          {application?.status === "submitted"
                            ? "View Application"
                            : (!hasApplication && localProgress === null
                              ? "Start Application"
                              : "Continue Application")}
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-full px-6 py-3">
                        <Link to="/gsp/decision">View Decision</Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl p-4">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Completed Sections</div>
                <div className="font-semibold">
                  {application?.sectionState ? Object.values(application.sectionState).filter(Boolean).length : 0}/10
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Last saved</div>
                <div className="font-semibold">
                  {application?.updatedAt ? new Date(application.updatedAt).toLocaleString() : '—'}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Submission Ref</div>
                <div className="font-semibold text-foreground">{application?.reference || 'Not submitted'}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.section>
  );
};

export default GspDashboardPage;
