import React from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGspAuth } from "@/contexts/GspAuthContext";
import { getGspApplication, saveGspDraft, submitGspApplication, uploadGspDocument } from "@/services/gspApi";
import { useToast } from "@/components/ui/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { words, computeSectionState, computeProgressPct } from "@/lib/gspUtils";

const CAMEROON_REGIONS = [
  "Adamawa", "Centre", "East", "Far North", "Littoral", 
  "North", "North West", "West", "South", "South West"
];

const NATIONS = [
  "Cameroon", "Nigeria", "Ghana", "Kenya", "South Africa", 
  "Rwanda", "Uganda", "Senegal", "Other"
];

const COUNTRY_CODES = [
  { code: "+237", country: "CM" },
  { code: "+234", country: "NG" },
  { code: "+233", country: "GH" },
  { code: "+254", country: "KE" },
  { code: "+27", country: "ZA" },
  { code: "+250", country: "RW" },
  { code: "+256", country: "UG" },
  { code: "+221", country: "SN" },
];

const EDUCATION_LEVELS = [
  "None", "Primary School", "Secondary School (O-Level/A-Level)", 
  "Vocational/Technical", "Bachelor's Degree", "Master's Degree", "Doctorate (PhD)"
];

const defaultData = {
  r_id: "",
  firstName: "",
  lastName: "",
  dob: "",
  phoneCode: "+237",
  phone: "",
  email: "",
  gender: "",
  nationality: "",
  isPhoneOnWhatsApp: "yes",
  alternateWhatsApp: "",
  city: "",
  region: "",
  householdSize: "",
  primaryGuardianOccupation: "",
  secondGuardianOccupation: "",
  highestFamilyEducation: "",
  familyStudiedAbroad: "",
  familyAbroadDetails: "",
  schoolName: "",
  schoolCity: "",
  schoolRegion: "",
  currentClass: "",
  lowerSixthPathwayChoice: "",
  topSubjects: Array.from({ length: 5 }).map(() => ({ name: "", score: "", examTerm: "" })),
  intendedFieldWhy: "",
  communityEssay: "",
  activities: [{ title: "", roleDescription: "", duration: "", hoursPerWeek: "", weeksPerYear: "", isStillDoing: "", stoppedIn: "" }],
  housingOption: "",
  housingContactRelation: "",
  housingContactAware: "",
  canCoverHousingCost: "",
  participationConstraint: "",
  participationConstraintExplain: "",
  monthlyIncomeRange: "",
  worksToSupportFamily: "",
  workSupportDetails: "",
  costChallenge: "",
  applyingScholarship: "",
  scholarshipEssay: "",
  documents: {
    reportCard: null as any,
    olSlip: null as any,
    alSlip: null as any,
  },
  declarationConfirmed: false,
};

const GspApplicationPage: React.FC = () => {
  const { user, loading } = useGspAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [data, setData] = React.useState<any>(defaultData);
  const [sectionState, setSectionState] = React.useState<Record<string, boolean>>({});
  const [fetching, setFetching] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState(1);

  const progressPct = React.useMemo(() => {
    return computeProgressPct(sectionState);
  }, [sectionState]);

  React.useEffect(() => {
    if (!user) return;
    
    // Attempt to load from localStorage first for instant recovery
    const draftKey = `gsp_draft_${user.email}`;
    const localDraft = localStorage.getItem(draftKey);
    let loadedLocal = false;

    if (localDraft) {
      try {
        const parsed = JSON.parse(localDraft);
        setData((prev: any) => ({ ...prev, ...parsed }));
        loadedLocal = true;
      } catch (e) {}
    }

    (async () => {
      try {
        const resp = await getGspApplication();
        const serverData = resp.application?.data || {};
        // Use server data if no local draft exists to prevent overwriting recent offline edits
        if (!loadedLocal) {
          // If the server provides an r_id for this application, include it in the local state
          const appRId = resp.application?.r_id;
          const mergedData = {
            ...defaultData,
            ...serverData,
            email: serverData.email || user.email,
            ...(appRId ? { r_id: appRId } : {}),
          };
          setData(mergedData);
          const nextSectionState = resp.application?.sectionState || computeSectionState(mergedData);
          setSectionState(nextSectionState);
        }
      } catch (error: any) {
        toast({ title: "Failed to load application", description: error.message || "Please try again.", variant: "destructive" as any });
      } finally {
        setFetching(false);
      }
    })();
  }, [user, toast]);

  React.useEffect(() => {
    if (!user || fetching) return;
    const next = computeSectionState(data);
    setSectionState(next);
    
    // Save to local storage synchronously on every data change
    localStorage.setItem(`gsp_draft_${user.email}`, JSON.stringify(data));

    const id = setTimeout(async () => {
      try {
        setSaving(true);
        const res = await saveGspDraft(data, next, data.r_id);
        localStorage.setItem('gsp_reg_rid', data.r_id)
        if (res?.application?.r_id && !data.r_id) {
          setData((prev: any) => ({ ...prev, r_id: res.application.r_id }));
        }
      } catch {
      } finally {
        setSaving(false);
      }
    }, 1200);
    return () => clearTimeout(id);
  }, [data, user, fetching]);

  if (!loading && !user) return <Navigate to="/auth?redirect=/gsp/application" replace />;

  const setField = (key: string, value: any) => setData((prev: any) => ({ ...prev, [key]: value }));

  const updateSubject = (index: number, key: "name" | "score" | "examTerm", value: string) => {
    setData((prev: any) => {
      const topSubjects = [...prev.topSubjects];
      topSubjects[index] = { ...topSubjects[index], [key]: value };
      return { ...prev, topSubjects };
    });
  };

  const updateActivity = (index: number, key: string, value: string) => {
    setData((prev: any) => {
      const activities = [...prev.activities];
      activities[index] = { ...activities[index], [key]: value };
      return { ...prev, activities };
    });
  };

  console.log("Draft saved with r_id:", );

  const addActivity = () => {
    setData((prev: any) => {
      if (prev.activities.length >= 3) return prev;
      return {
        ...prev,
        activities: [...prev.activities, { title: "", roleDescription: "", duration: "", hoursPerWeek: "", weeksPerYear: "", isStillDoing: "", stoppedIn: "" }],
      };
    });
  };

  const removeActivity = (idx: number) => {
    setData((prev: any) => ({ ...prev, activities: prev.activities.filter((_: any, i: number) => i !== idx) }));
  };

  const uploadDocument = async (field: "reportCard" | "olSlip" | "alSlip", file?: File | null) => {
    if (!file) return;
    try {
      const uploaded = await uploadGspDocument({ file: file, application: data.r_id });
      setData((prev: any) => ({
        ...prev,
        documents: { ...prev.documents, [field]: uploaded },
      }));
      toast({ title: "Upload complete", description: `${file.name} uploaded successfully.` });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message || "Please try another file.", variant: "destructive" as any });
    }
  };

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      await submitGspApplication(data, sectionState, data.r_id);
      localStorage.removeItem(`gsp_draft_${user?.email}`);
      toast({ title: "Application submitted", description: "Your application is now locked for review." });
      navigate("/gsp/dashboard");
    } catch (error: any) {
      toast({ title: "Submission failed", description: error.message || "Please review required sections.", variant: "destructive" as any });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
        <Card className="rounded-3xl h-fit sticky top-24">
          <CardHeader>
            <CardTitle className="text-xl">GSP Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Progress: <span className="font-semibold text-kc-blue">{progressPct}%</span></p>
            <p className="text-xs text-muted-foreground">{saving ? "Autosaving..." : "All changes saved automatically"}</p>
            <div className="pt-2 grid gap-2 text-sm">
              {[1, 2, 3, 4, 5, 6, 8, 9, 10, 11].map((s, index, arr) => {
                const canAccess = index === 0 || arr.slice(0, index).every((prevSec) => sectionState[prevSec === 11 ? "review" : `section${prevSec}`]);
                return (
                  <button 
                    key={s} 
                    disabled={!canAccess}
                    className={`text-left px-3 py-2 rounded-lg border flex justify-between items-center ${activeSection === s ? "border-kc-blue bg-kc-blue/5" : "border-border"} ${!canAccess ? "opacity-50 cursor-not-allowed" : "hover:border-kc-blue"}`} 
                    onClick={() => setActiveSection(s)}
                  >
                    <span>{s === 11 ? "Review & Submit" : `Section ${s}`}</span>
                    {sectionState[s === 11 ? "review" : `section${s}`] && <span>✅</span>}
                  </button>
                );
              })}
            </div>
            <div className="pt-3">
              <Button asChild variant="outline" className="rounded-full w-full">
                <Link to="/gsp/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {fetching ? (
            <Card className="rounded-3xl"><CardContent className="p-8">Loading application...</CardContent></Card>
          ) : (
            <>
              {activeSection === 1 && (
                <Card className="rounded-3xl">
                  <CardHeader><CardTitle>Section 1: Personal Information</CardTitle></CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    <div><Label>First name</Label><Input value={data.firstName} onChange={(e) => setField("firstName", e.target.value)} /></div>
                    <div><Label>Last name</Label><Input value={data.lastName} onChange={(e) => setField("lastName", e.target.value)} /></div>
                    <div><Label>Date of birth</Label><Input type="date" value={data.dob} onChange={(e) => setField("dob", e.target.value)} /></div>
                    <div>
                      <Label>Phone</Label>
                      <div className="flex gap-2">
                        <Select value={data.phoneCode} onValueChange={(val) => setField("phoneCode", val)}>
                          <SelectTrigger className="w-[100px]"><SelectValue placeholder="Code" /></SelectTrigger>
                          <SelectContent>
                            {COUNTRY_CODES.map((c) => <SelectItem key={c.code} value={c.code}>{c.country} {c.code}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Input className="flex-1" value={data.phone} onChange={(e) => setField("phone", e.target.value)} />
                      </div>
                    </div>
                    <div><Label>Email</Label><Input type="email" value={data.email} onChange={(e) => setField("email", e.target.value)} /></div>
                    <div>
                      <Label>Gender</Label>
                      <Select value={data.gender} onValueChange={(val) => setField("gender", val)}>
                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Nationality</Label>
                      <Select value={data.nationality} onValueChange={(val) => setField("nationality", val)}>
                        <SelectTrigger><SelectValue placeholder="Select nationality" /></SelectTrigger>
                        <SelectContent>
                          {NATIONS.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Primary number on WhatsApp?</Label>
                      <Select value={data.isPhoneOnWhatsApp} onValueChange={(val) => setField("isPhoneOnWhatsApp", val)}>
                        <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.isPhoneOnWhatsApp === "no" && <div><Label>Alternate WhatsApp</Label><Input value={data.alternateWhatsApp} onChange={(e) => setField("alternateWhatsApp", e.target.value)} /></div>}
                    <div><Label>City</Label><Input value={data.city} onChange={(e) => setField("city", e.target.value)} /></div>
                    <div>
                      <Label>Region</Label>
                      <Select value={data.region} onValueChange={(val) => setField("region", val)}>
                        <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                        <SelectContent>
                          {CAMEROON_REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 2 && (
                <Card className="rounded-3xl">
                  <CardHeader><CardTitle>Section 2: Family Background</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div><Label>Household size</Label><Input type="number" value={data.householdSize} onChange={(e) => setField("householdSize", e.target.value)} /></div>
                    <div><Label>Primary guardian occupation</Label><Input value={data.primaryGuardianOccupation} onChange={(e) => setField("primaryGuardianOccupation", e.target.value)} /></div>
                    <div><Label>Second guardian occupation (optional)</Label><Input value={data.secondGuardianOccupation} onChange={(e) => setField("secondGuardianOccupation", e.target.value)} /></div>
                    <div>
                      <Label>Highest family education</Label>
                      <Select value={data.highestFamilyEducation} onValueChange={(val) => setField("highestFamilyEducation", val)}>
                        <SelectTrigger><SelectValue placeholder="Select education" /></SelectTrigger>
                        <SelectContent>
                          {EDUCATION_LEVELS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Family studied abroad?</Label>
                      <Select value={data.familyStudiedAbroad} onValueChange={(val) => setField("familyStudiedAbroad", val)}>
                        <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.familyStudiedAbroad === "yes" && (
                      <div>
                        <Label>Who, where, when (max 150 words)</Label>
                        <Textarea value={data.familyAbroadDetails} onChange={(e) => setField("familyAbroadDetails", e.target.value)} />
                        <p className="text-xs text-muted-foreground mt-1">{words(data.familyAbroadDetails)} / 150 words</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeSection === 3 && (
                <Card className="rounded-3xl">
                  <CardHeader><CardTitle>Section 3: Academic Background</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div><Label>School name</Label><Input value={data.schoolName} onChange={(e) => setField("schoolName", e.target.value)} /></div>
                      <div><Label>Town/City</Label><Input value={data.schoolCity} onChange={(e) => setField("schoolCity", e.target.value)} /></div>
                      <div>
                        <Label>Region</Label>
                        <Select value={data.schoolRegion} onValueChange={(val) => setField("schoolRegion", val)}>
                          <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                          <SelectContent>
                            {CAMEROON_REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Current class</Label>
                      <Select value={data.currentClass} onValueChange={(val) => setField("currentClass", val)}>
                        <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lower_sixth">Lower Sixth</SelectItem>
                          <SelectItem value="upper_sixth">Upper Sixth</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.currentClass === "lower_sixth" && (
                      <div><Label>If not admitted, fallback preference</Label><Input value={data.lowerSixthPathwayChoice} onChange={(e) => setField("lowerSixthPathwayChoice", e.target.value)} /></div>
                    )}
                    <div className="space-y-3">
                      <Label>Top 5 subjects with score and exam term</Label>
                      {data.topSubjects.map((subject: any, i: number) => (
                        <div key={i} className="grid md:grid-cols-3 gap-3">
                          <Input placeholder={`Subject ${i + 1}`} value={subject.name} onChange={(e) => updateSubject(i, "name", e.target.value)} />
                          <Input placeholder="Score" value={subject.score} onChange={(e) => updateSubject(i, "score", e.target.value)} />
                          <Input placeholder="Exam/Term" value={subject.examTerm} onChange={(e) => updateSubject(i, "examTerm", e.target.value)} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <Label>What do you want to study at university and why? (max 150 words)</Label>
                      <Textarea value={data.intendedFieldWhy} onChange={(e) => setField("intendedFieldWhy", e.target.value)} />
                      <p className="text-xs text-muted-foreground mt-1">{words(data.intendedFieldWhy)} / 150 words</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 4 && (
                <Card className="rounded-3xl">
                  <CardHeader><CardTitle>Section 4: Short Answer</CardTitle></CardHeader>
                  <CardContent>
                    <Label className="mb-2 block">Community challenge essay (75-225 words)</Label>
                    <ReactQuill 
                      theme="snow" 
                      value={data.communityEssay} 
                      onChange={(content) => setField("communityEssay", content)} 
                      className="mb-14 h-[200px]"
                    />
                    <p className="text-xs text-muted-foreground mt-12">{words(data.communityEssay)} words</p>
                  </CardContent>
                </Card>
              )}

              {activeSection === 5 && (
                <Card className="rounded-3xl">
                  <CardHeader><CardTitle>Section 5: Activities (up to 3)</CardTitle></CardHeader>
                  <CardContent className="space-y-5">
                    {data.activities.map((activity: any, i: number) => (
                      <div key={i} className="border rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">Activity {i + 1}</h4>
                          {data.activities.length > 1 && <Button size="sm" variant="ghost" onClick={() => removeActivity(i)}>Remove</Button>}
                        </div>
                        <Input placeholder="Activity title" value={activity.title} onChange={(e) => updateActivity(i, "title", e.target.value)} />
                        <Textarea placeholder="What did you actually do? (2-3 sentences)" value={activity.roleDescription} onChange={(e) => updateActivity(i, "roleDescription", e.target.value)} />
                        <div className="grid md:grid-cols-3 gap-3">
                          <Input placeholder="Duration" value={activity.duration} onChange={(e) => updateActivity(i, "duration", e.target.value)} />
                          <Input type="number" placeholder="Hours/week" value={activity.hoursPerWeek} onChange={(e) => updateActivity(i, "hoursPerWeek", e.target.value)} />
                          <Input type="number" placeholder="Weeks/year" value={activity.weeksPerYear} onChange={(e) => updateActivity(i, "weeksPerYear", e.target.value)} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <Select value={activity.isStillDoing} onValueChange={(val) => updateActivity(i, "isStillDoing", val)}>
                              <SelectTrigger><SelectValue placeholder="Still doing?" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {activity.isStillDoing === "no" && <Input placeholder="Stopped in..." value={activity.stoppedIn} onChange={(e) => updateActivity(i, "stoppedIn", e.target.value)} />}
                        </div>
                      </div>
                    ))}
                    {data.activities.length < 3 && <Button variant="outline" className="rounded-full" onClick={addActivity}>Add Activity</Button>}
                  </CardContent>
                </Card>
              )}

              {activeSection === 6 && (
                <Card className="rounded-3xl">
                  <CardHeader><CardTitle>Section 6: Logistics and Programme Fit</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Housing option</Label>
                      <Select value={data.housingOption} onValueChange={(val) => setField("housingOption", val)}>
                        <SelectTrigger><SelectValue placeholder="Select housing option" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A: With family</SelectItem>
                          <SelectItem value="B">B: With host/contact</SelectItem>
                          <SelectItem value="C">C: Independent</SelectItem>
                          <SelectItem value="D">D: Need full housing support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.housingOption === "B" && (
                      <div className="grid md:grid-cols-2 gap-4 mt-2">
                        <div><Label>Relationship to contact</Label><Input value={data.housingContactRelation} onChange={(e) => setField("housingContactRelation", e.target.value)} /></div>
                        <div>
                          <Label>Are they aware?</Label>
                          <Select value={data.housingContactAware} onValueChange={(val) => setField("housingContactAware", val)}>
                            <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="not_yet">Not yet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    {data.housingOption === "C" && (
                      <div className="mt-2">
                        <Label>Can cover 60,000 FCFA/month?</Label>
                        <Select value={data.canCoverHousingCost} onValueChange={(val) => setField("canCoverHousingCost", val)}>
                          <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div>
                      <Label>Any circumstance affecting participation?</Label>
                      <Select value={data.participationConstraint} onValueChange={(val) => setField("participationConstraint", val)}>
                        <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.participationConstraint === "yes" && (
                      <div className="mt-2">
                        <Label>Please explain (max 200 words)</Label>
                        <Textarea value={data.participationConstraintExplain} onChange={(e) => setField("participationConstraintExplain", e.target.value)} />
                        <p className="text-xs text-muted-foreground mt-1">{words(data.participationConstraintExplain)} / 200 words</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeSection === 8 && (
                <Card className="rounded-3xl">
                  <CardHeader><CardTitle>Section 8: Financial Context</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Monthly household income range</Label>
                      <Select value={data.monthlyIncomeRange} onValueChange={(val) => setField("monthlyIncomeRange", val)}>
                        <SelectTrigger><SelectValue placeholder="Select income range" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under_50k">Under 50,000 XAF</SelectItem>
                          <SelectItem value="50k_to_150k">50,000 - 150,000 XAF</SelectItem>
                          <SelectItem value="150k_to_300k">150,000 - 300,000 XAF</SelectItem>
                          <SelectItem value="above_300k">Above 300,000 XAF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Do you work to support family?</Label>
                      <Select value={data.worksToSupportFamily} onValueChange={(val) => setField("worksToSupportFamily", val)}>
                        <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.worksToSupportFamily === "yes" && (
                      <div className="mt-2">
                        <Label>Describe your work (max 100 words)</Label>
                        <Textarea value={data.workSupportDetails} onChange={(e) => setField("workSupportDetails", e.target.value)} />
                        <p className="text-xs text-muted-foreground mt-1">{words(data.workSupportDetails)} / 100 words</p>
                      </div>
                    )}
                    <div>
                      <Label>Would 500,000 XAF still be a challenge?</Label>
                      <Select value={data.costChallenge} onValueChange={(val) => setField("costChallenge", val)}>
                        <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="not_sure">Not sure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 9 && (
                <Card className="rounded-3xl">
                  <CardHeader><CardTitle>Section 9: Financial Aid (Optional)</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Applying for scholarship?</Label>
                      <Select value={data.applyingScholarship} onValueChange={(val) => setField("applyingScholarship", val)}>
                        <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.applyingScholarship === "yes" && (
                      <div className="mt-2">
                        <Label>Scholarship essay</Label>
                        <Textarea className="min-h-[200px]" value={data.scholarshipEssay} onChange={(e) => setField("scholarshipEssay", e.target.value)} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeSection === 10 && (
                <Card className="rounded-3xl">
                  <CardHeader><CardTitle>Section 10: Documents</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Most recent report card (required)</Label>
                      <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => uploadDocument("reportCard", e.target.files?.[0])} />
                      {data.documents?.reportCard?.url && <p className="text-xs text-emerald-600 mt-1">Uploaded</p>}
                    </div>
                    <div>
                      <Label>Ordinary Level Slip (required)</Label>
                      <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => uploadDocument("olSlip", e.target.files?.[0])} />
                      {data.documents?.olSlip?.url && <p className="text-xs text-emerald-600 mt-1">Uploaded</p>}
                    </div>
                    <div>
                      <Label>Advanced Level Slip (optional)</Label>
                      <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => uploadDocument("alSlip", e.target.files?.[0])} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 11 && (
                <Card className="rounded-3xl border-kc-blue/20">
                  <CardHeader><CardTitle>Review and Submit</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <label className="flex gap-2 items-start text-sm">
                      <input type="checkbox" checked={data.declarationConfirmed} onChange={(e) => setField("declarationConfirmed", e.target.checked)} />
                      <span>I confirm all information in this application is accurate and my own.</span>
                    </label>
                    <div className="flex flex-wrap justify-between gap-3">
                      <Button variant="outline" className="rounded-full" onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setActiveSection(10);
                      }}>Back</Button>
                      <Button variant="blue" className="rounded-full" onClick={onSubmit} disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">After submission, this application becomes read-only.</p>
                  </CardContent>
                </Card>
              )}

              {activeSection !== 11 && (
                <div className="flex justify-end pt-4">
                  <Button
                    variant="blue"
                    className="rounded-full px-8"
              onClick={async () => {
                const currentSecKey = activeSection === 11 ? "review" : `section${activeSection}`;
                const next = computeSectionState(data);
                // Validate current section before attempting to save
                if (!next[currentSecKey]) {
                  toast({
                    title: "Incomplete Section",
                    description: "Please fill out all required fields in this section before proceeding.",
                    variant: "destructive" as any,
                  });
                  return;
                }
                // Attempt to save draft and only continue after a successful response
                try {
                  const res = await saveGspDraft(data, next, data.r_id);
                  if (res?.application?.r_id && !data.r_id) {
                    setData((prev: any) => ({ ...prev, r_id: res.application.r_id }));
                  }
                } catch (error: any) {
                  toast({ title: "Save failed", description: error?.message || "Could not save draft. Please try again.", variant: "destructive" as any });
                  return;
                }

                const sections = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11];
                const currentIndex = sections.indexOf(activeSection);
                if (currentIndex < sections.length - 1) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActiveSection(sections[currentIndex + 1]);
                }
              }}
                  >
                    Save & Continue
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default GspApplicationPage;
