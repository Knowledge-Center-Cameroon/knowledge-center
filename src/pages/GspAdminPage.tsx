import React from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGspAuth } from "@/contexts/GspAuthContext";
import {
  adminGetApplications,
  adminGetRelease,
  adminGetUsers,
  adminSetDecision,
  adminToggleRelease,
} from "@/services/gspApi";
import { useToast } from "@/components/ui/use-toast";

const GspAdminPage: React.FC = () => {
  const { user, loading } = useGspAuth();
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [applications, setApplications] = React.useState<any[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [isReleased, setIsReleased] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);

  const load = React.useCallback(async () => {
    setFetching(true);
    try {
      const [apps, usersResp] = await Promise.all([
        adminGetApplications(query),
        adminGetUsers(),
      ]);
      const releaseResp = await adminGetRelease();
      setApplications(apps.applications || []);
      setUsers(usersResp.users || []);
      setIsReleased(Boolean(releaseResp.release?.isReleased));
    } catch (error: any) {
      toast({ title: "Admin load failed", description: error.message || "Please refresh.", variant: "destructive" as any });
    } finally {
      setFetching(false);
    }
  }, [query, toast]);

  React.useEffect(() => {
    if (user?.role !== "admin") return;
    load();
  }, [user, load]);

  if (!loading && !user) return <Navigate to="/gsp" replace />;
  if (user?.role !== "admin") return <Navigate to="/gsp/dashboard" replace />;

  const setDecision = async (id: string, decisionStatus: "accepted" | "waitlisted" | "not_admitted" | "pending") => {
    try {
      await adminSetDecision(id, decisionStatus as any);
      await load();
    } catch (error: any) {
      toast({ title: "Failed to set decision", description: error.message || "Please retry.", variant: "destructive" as any });
    }
  };

  const exportCsv = () => {
    const header = ["name", "email", "status", "decisionStatus", "reference", "submittedAt"];
    const rows = applications.map((item) => [
      item?.user?.name || "",
      item?.user?.email || "",
      item?.status || "",
      item?.decisionStatus || "",
      item?.reference || "",
      item?.submittedAt || "",
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gsp-applications.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="container mx-auto px-4 lg:px-8 py-14 lg:py-20">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="heading-2">GSP Admin Dashboard</h1>
          <p className="text-muted-foreground">Admissions decisions, release controls, and user management.</p>
        </div>

        <Card className="rounded-3xl">
          <CardHeader><CardTitle>Decision Release</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button
              variant={isReleased ? "outline" : "blue"}
              className="rounded-full"
              onClick={async () => {
                try {
                  await adminToggleRelease(!isReleased);
                  setIsReleased(!isReleased);
                  toast({ title: "Release updated", description: !isReleased ? "Decisions are now visible to students." : "Decisions are now hidden." });
                } catch (error: any) {
                  toast({ title: "Release update failed", description: error.message || "Please retry.", variant: "destructive" as any });
                }
              }}
            >
              {isReleased ? "Hide Decisions" : "Release Decisions"}
            </Button>
            <span className="text-sm text-muted-foreground">Current: {isReleased ? "Released" : "Not released"}</span>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader><CardTitle>Applications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email" />
              <Button variant="outline" className="rounded-full" onClick={load}>Search</Button>
              <Button variant="outline" className="rounded-full" onClick={exportCsv}>Export CSV</Button>
            </div>
            {fetching ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Applicant</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Decision</th>
                      <th className="text-left py-2">Reference</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td className="py-3">
                          <div>{item?.user?.name || "Unknown"}</div>
                          <div className="text-muted-foreground">{item?.user?.email || ""}</div>
                        </td>
                        <td>{item.status}</td>
                        <td className="uppercase">{item.decisionStatus}</td>
                        <td>{item.reference || "-"}</td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => setDecision(item._id, "accepted")}>Accept</Button>
                            <Button size="sm" variant="outline" onClick={() => setDecision(item._id, "waitlisted")}>Waitlist</Button>
                            <Button size="sm" variant="outline" onClick={() => setDecision(item._id, "not_admitted")}>Decline</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader><CardTitle>Users</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Role</th>
                  <th className="text-left py-2">Verified</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="py-2">{u.name}</td>
                    <td>{u.email}</td>
                    <td className="uppercase">{u.role}</td>
                    <td>{u.isEmailVerified ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default GspAdminPage;
