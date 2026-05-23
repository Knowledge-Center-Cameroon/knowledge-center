import React from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useGspAuth } from "@/contexts/GspAuthContext";
import {
  adminGetApplications,
  adminGetRelease,
  adminGetUsers,
  adminSetDecision,
  adminToggleRelease,
} from "@/services/gspApi";
import { adminGetBlogComments, adminModerateBlogComment, type BlogComment } from "@/services/blogApi";
import { useToast } from "@/components/ui/use-toast";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  Download, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ShieldCheck,
  LayoutDashboard
} from "lucide-react";

const GspAdminPage: React.FC = () => {
  const { user, loading } = useGspAuth();
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [applications, setApplications] = React.useState<any[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [blogComments, setBlogComments] = React.useState<BlogComment[]>([]);
  const [isReleased, setIsReleased] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);

  const load = React.useCallback(async () => {
    setFetching(true);
    try {
      const [apps, usersResp, commentResp] = await Promise.all([
        adminGetApplications(query),
        adminGetUsers(),
        adminGetBlogComments("pending"),
      ]);
      const releaseResp = await adminGetRelease();
      setApplications(apps.applications || []);
      setUsers(usersResp.users || []);
      setBlogComments(commentResp.comments || []);
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

  if (!loading && !user) return <Navigate to="/auth?redirect=/gsp/admin" replace />;
  if (user?.role !== "admin") return <Navigate to="/gsp/dashboard" replace />;

  const setDecision = async (id: string, decisionStatus: "accepted" | "waitlisted" | "not_admitted" | "pending") => {
    try {
      await adminSetDecision(id, decisionStatus as any);
      toast({ title: "Decision updated", description: `Applicant marked as ${decisionStatus}.` });
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
    a.download = `gsp-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const moderateComment = async (commentId: string, status: "approved" | "rejected") => {
    try {
      await adminModerateBlogComment(commentId, status);
      setBlogComments((prev) => prev.filter((comment) => comment._id !== commentId));
      toast({
        title: status === "approved" ? "Comment approved" : "Comment rejected",
        description: "The blog comment moderation queue has been updated.",
      });
    } catch (error: any) {
      toast({ title: "Moderation failed", description: error.message || "Please retry.", variant: "destructive" as any });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted': return <Badge className="rounded-full bg-kc-blue text-white hover:bg-kc-blue border-0">Submitted</Badge>;
      case 'pending': return <Badge variant="outline" className="rounded-full">Pending</Badge>;
      default: return <Badge variant="secondary" className="rounded-full">{status}</Badge>;
    }
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision.toLowerCase()) {
      case 'accepted': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 rounded-full">Accepted</Badge>;
      case 'waitlisted': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 rounded-full">Waitlisted</Badge>;
      case 'not_admitted': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 rounded-full">Declined</Badge>;
      default: return <Badge variant="outline" className="rounded-full">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <section className="container mx-auto px-4 lg:px-8 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-5 w-5 text-kc-blue" />
                <span className="text-sm font-semibold text-kc-blue uppercase tracking-wider">Admin Portal</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">Site Administration</h1>
              <p className="text-slate-500 mt-1 text-lg">Manage GSP applications, blog engagement, and system controls.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant={isReleased ? "outline" : "blue"}
                className="rounded-full shadow-sm"
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
                <Settings className="mr-2 h-4 w-4" />
                {isReleased ? "Hide Decisions" : "Release Decisions"}
              </Button>
              <Button variant="outline" className="rounded-full shadow-sm" onClick={load}>
                Refresh Data
              </Button>
            </div>
          </div>

          <Tabs defaultValue="applications" className="w-full space-y-6">
            <TabsList className="bg-white p-1 rounded-2xl border shadow-sm w-full md:w-auto overflow-x-auto justify-start">
              <TabsTrigger value="applications" className="rounded-xl data-[state=active]:bg-kc-blue data-[state=active]:text-white gap-2">
                <FileText className="h-4 w-4" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="comments" className="rounded-xl data-[state=active]:bg-kc-blue data-[state=active]:text-white gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments
                {blogComments.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full leading-none">
                    {blogComments.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-xl data-[state=active]:bg-kc-blue data-[state=active]:text-white gap-2">
                <Users className="h-4 w-4" />
                User Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="space-y-4">
              <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">GSP Applications</CardTitle>
                      <CardDescription>Review and process scholar applications.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                          value={query} 
                          onChange={(e) => setQuery(e.target.value)} 
                          placeholder="Search applicants..." 
                          className="pl-10 rounded-full w-full md:w-64 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        />
                      </div>
                      <Button variant="outline" className="rounded-full" onClick={exportCsv}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {fetching ? (
                    <div className="py-20 text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-kc-blue border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
                      <p className="mt-4 text-slate-500">Loading applications...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="text-left px-6 py-4 font-semibold text-slate-700">Applicant</th>
                            <th className="text-left px-6 py-4 font-semibold text-slate-700">Submission</th>
                            <th className="text-left px-6 py-4 font-semibold text-slate-700">Decision</th>
                            <th className="text-left px-6 py-4 font-semibold text-slate-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {applications.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-6 py-10 text-center text-slate-500">No applications found.</td>
                            </tr>
                          ) : (
                            applications.map((item) => (
                              <tr key={item._id} className="hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="font-medium text-slate-900">{item?.user?.name || "Unknown"}</div>
                                  <div className="text-slate-500 text-xs">{item?.user?.email || ""}</div>
                                  <div className="text-[10px] mt-1 text-slate-400 font-mono">Ref: {item.reference || "N/A"}</div>
                                </td>
                                <td className="px-6 py-4">
                                  {getStatusBadge(item.status)}
                                  <div className="text-[10px] text-slate-400 mt-1">
                                    {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'Draft'}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  {getDecisionBadge(item.decisionStatus || 'pending')}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-1">
                                    <Button size="sm" variant="ghost" className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => setDecision(item._id, "accepted")}>
                                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                      Accept
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50" onClick={() => setDecision(item._id, "waitlisted")}>
                                      <Clock className="h-3.5 w-3.5 mr-1" />
                                      Waitlist
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setDecision(item._id, "not_admitted")}>
                                      <XCircle className="h-3.5 w-3.5 mr-1" />
                                      Decline
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl">Pending Moderation</CardTitle>
                  <CardDescription>Review comments before they appear on the blog.</CardDescription>
                </CardHeader>
                <CardContent>
                  {fetching ? (
                    <p className="text-center py-10 text-slate-500">Loading comments...</p>
                  ) : blogComments.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-slate-600">All clear!</h3>
                      <p className="text-slate-400">No comments waiting for moderation.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {blogComments.map((comment) => (
                        <div key={comment._id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all">
                          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-kc-blue/10 flex items-center justify-center text-kc-blue font-bold">
                                {comment.author.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{comment.author}</div>
                                <div className="text-xs text-slate-400">
                                  {new Date(comment.created_at).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="blue" className="rounded-full px-4" onClick={() => moderateComment(comment._id, "approved")}>
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="rounded-full px-4 text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700" onClick={() => moderateComment(comment._id, "rejected")}>
                                Reject
                              </Button>
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed italic border-l-4 border-kc-blue/30">
                            "{comment.content}"
                          </div>
                          <div className="mt-3 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                            Post ID: {comment.postId || "Unknown"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl">Platform Users</CardTitle>
                  <CardDescription>All registered users and their roles.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-slate-600">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="text-left px-6 py-4 font-semibold text-slate-700">User</th>
                          <th className="text-left px-6 py-4 font-semibold text-slate-700">Role</th>
                          <th className="text-left px-6 py-4 font-semibold text-slate-700">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-900">{u.name}</div>
                              <div className="text-slate-500 text-xs">{u.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={u.role === 'admin' ? 'blue' : 'secondary'} className="rounded-full uppercase text-[10px]">
                                {u.role}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              {u.isEmailVerified ? (
                                <span className="flex items-center text-xs text-green-600">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Verified
                                </span>
                              ) : (
                                <span className="flex items-center text-xs text-slate-400">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Unverified
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default GspAdminPage;
