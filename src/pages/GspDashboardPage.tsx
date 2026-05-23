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
import {
  computeSectionState,
  computeProgressPct,
  GSP_PROGRESS_KEYS,
  getPersistedSectionState,
} from "@/lib/gspUtils";

const hasCompletedSection = (state: Record<string, boolean>) =>
  GSP_PROGRESS_KEYS.some((key) => Boolean(state[key]));

const DashboardCardSkeleton = () => (
  <div className="space-y-4" aria-label="Loading application overview">
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded-full bg-kc-blue/10" />
          <div className="h-8 w-20 rounded-xl bg-kc-blue/15" />
        </div>
        <div className="h-3 w-44 max-w-[45%] rounded-full bg-kc-blue/15" />
      </div>
      <div className="h-4 w-64 max-w-full rounded-full bg-kc-blue/10" />
    </div>
    <div className="flex flex-col gap-3 pt-4 sm:flex-row">
      <div className="h-11 w-full rounded-full bg-kc-blue/15 sm:w-44" />
      <div className="h-11 w-full rounded-full bg-kc-blue/10 sm:w-36" />
    </div>
  </div>
);

const GspDashboardPage: React.FC = () => {
  const { user, loading, signOut } = useGspAuth();
  const { toast } = useToast();
  const [application, setApplication] = React.useState<any>(null);
  const [fetching, setFetching] = React.useState(true);
  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "Applicant";
  const appPayload = React.useMemo(
    () => ({ ...(application?.data || {}), ...(application || {}) }),
    [application]
  );
  const derivedSectionState = React.useMemo(() => {
    const computed = computeSectionState(appPayload);
    if (hasCompletedSection(computed)) return computed;
    return (
      getPersistedSectionState(application) ||
      getPersistedSectionState(appPayload) ||
      computed
    );
  }, [application, appPayload]);
  const applicationStatus = String(application?.status || appPayload.status || "").toLowerCase();
  const isSubmitted = applicationStatus === "submitted";
  const completedSections = isSubmitted
    ? GSP_PROGRESS_KEYS.length
    : GSP_PROGRESS_KEYS.filter((key) => Boolean(derivedSectionState?.[key])).length;
  const totalSections = GSP_PROGRESS_KEYS.length;
  const progressPct = isSubmitted ? 100 : computeProgressPct(derivedSectionState);
  const submissionRef = application?.reference || application?.submissionReference || application?.ref || appPayload.reference || appPayload.r_id || application?.id;
  const lastSavedRaw = application?.updatedAt || application?.updated_at || application?.modifiedAt || application?.modified_at || application?.createdAt || application?.created_at;
  const lastSaved = lastSavedRaw ? new Date(lastSavedRaw).toLocaleString() : "Not saved yet";
  const hasApplication = Boolean(application?.r_id || application?.id || application?.status || submissionRef);

  React.useEffect(() => {
    if (!user) return;

    let cancelled = false;
    setFetching(true);

    (async () => {
      try {
        const data = await getGspApplication();
        if (!cancelled) setApplication(data.application);
      } catch (error: any) {
        if (!cancelled) {
          toast({ title: "Failed to load dashboard", description: error.message || "Please refresh", variant: "destructive" as any });
        }
      } finally {
        if (!cancelled) setFetching(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, toast]);

  if (!loading && !user) return <Navigate to="/auth?redirect=%2Fgsp%2Fdashboard" replace />;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 lg:px-8 py-8 sm:py-14 lg:py-20"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold">Application Dashboard</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Welcome, <span className="font-medium text-foreground">{displayName}</span></p>
            <p className="text-xs sm:text-sm text-muted-foreground break-all">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === "admin" && (
              <Button asChild variant="outline" className="rounded-full text-xs sm:text-sm">
                <Link to="/gsp/admin">Admin</Link>
              </Button>
            )}
            <Button variant="ghost" className="rounded-full text-xs sm:text-sm" onClick={signOut}>Sign out</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="rounded-3xl md:col-span-2 p-0 overflow-hidden border-kc-blue/10 shadow-card">
            <div className="min-h-[250px] p-4 sm:p-6 bg-[linear-gradient(135deg,hsl(var(--kc-blue)/0.12),#fff_48%,hsl(var(--kc-blue)/0.08))]">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold">Global Scholars Programme 2026</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Application overview and quick actions</p>
                </div>
                <div className="sm:text-right">
                  <Badge variant={fetching ? "outline" : (application?.status === 'submitted' ? 'default' : (application?.status === 'under_review' ? 'secondary' : 'outline'))}>
                    {(fetching ? "loading" : application?.status || 'draft').toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 sm:mt-6">
                {fetching ? (
                  <DashboardCardSkeleton />
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Progress</div>
                          <div className="text-xl sm:text-2xl font-bold">
                            {progressPct}%
                          </div>
                        </div>
                        <div className="flex-1 max-w-[200px]">
                          <Progress value={progressPct} />
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        Reference: <span className="font-medium text-foreground">{submissionRef || 'Not submitted yet'}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-4">
                      <Button asChild variant="blue" className="rounded-full px-6 py-3 text-sm">
                        <Link to="/gsp/application">
                          {application?.status === "submitted"
                            ? "View Application"
                            : (!hasApplication
                              ? "Start Application"
                              : "Continue Application")}
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-full px-6 py-3 text-sm">
                        <Link to="/gsp/decision">View Decision</Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl p-3 sm:p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs sm:text-sm text-muted-foreground">Completed Sections</div>
                <div className="font-semibold text-sm sm:text-base">
                  {completedSections}/{totalSections}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs sm:text-sm text-muted-foreground">Last saved</div>
                <div className="font-semibold text-xs sm:text-sm">{lastSaved}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs sm:text-sm text-muted-foreground">Submission Ref</div>
                <div className="font-semibold text-foreground text-xs sm:text-sm break-all">{submissionRef || 'Not submitted'}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.section>
  );
};

export default GspDashboardPage;
