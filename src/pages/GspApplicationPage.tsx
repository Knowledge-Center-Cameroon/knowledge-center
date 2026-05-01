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

// Inline guidance placeholders. Replace the strings below with exact text
// from the attached PDF where appropriate.
const GUIDANCE_TEXT: Record<number, string> = {
  1: `Provide your legal name, date of birth, contact details and where you live. Be accurate — this information is used for identification and logistics.`,
  2: `Describe your household and guardian occupations. If any family members studied abroad, say who, where and when (brief).`,
  3: `List your school, region and top 5 subjects (include scores and exam/term). Explain briefly what you want to study and why (concise).`,
  4: `Community challenge essay: describe a real challenge in your community and your involvement or proposed solutions. Aim for clarity and concrete examples.`,
  5: `List up to three activities. For each, state your role, duration and weekly time commitment. Be specific about responsibilities.`,
  6: `Indicate housing preference and whether a contact/host is aware. Note any constraints that may affect your participation in the programme.`,
  8: `Provide an accurate estimate of monthly household income and explain any work you do to support your family.`,
  9: `If applying for financial aid, explain why the support is needed and how it will be used.`,
  10: `Upload required documents: recent report card and Ordinary Level slip are mandatory. PDF or image formats accepted.`,
  11: `Review carefully before submitting. Once submitted, the application will be locked for review.`,
};

const SECTION_LABELS: Record<number, string> = {
  1: "Personal Information",
  2: "Family Background",
  3: "Academic Background",
  4: "Short Answer",
  5: "Activities",
  6: "Logistics & Programme Fit",
  8: "Financial Context",
  9: "Financial Aid",
  10: "Documents",
  11: "Review & Submit",
};

const QUIET_QUILL_MODULES = { toolbar: false };
const EDITABLE_QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    ["link", "blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
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

  const canEditSection = (s: number) => {
    // replicate previous logic but expose as a function so we can allow viewing while preventing edits
    const sections = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11];
    const index = sections.indexOf(s);
    if (index === 0) return true;
    return sections.slice(0, index).every((prevSec) => sectionState[prevSec === 11 ? "review" : `section${prevSec}`]);
  };

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

  const editable = canEditSection(activeSection);

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

  const getMissingFields = (section: number) => {
    const missing: string[] = [];
    const get = (k: string) => (data[k] ? true : false);
    if (section === 1) {
      if (!data.firstName) missing.push("First name");
      if (!data.lastName) missing.push("Last name");
      if (!data.dob) missing.push("Date of birth");
      if (!data.phone) missing.push("Phone number");
      if (!data.email) missing.push("Email");
      if (!data.gender) missing.push("Gender");
      if (!data.nationality) missing.push("Nationality");
      if (!data.city) missing.push("City");
      if (!data.region) missing.push("Region");
    }
    if (section === 2) {
      if (!data.householdSize) missing.push("Household size");
      if (!data.primaryGuardianOccupation) missing.push("Primary guardian occupation");
      if (!data.highestFamilyEducation) missing.push("Highest family education");
      if (!data.familyStudiedAbroad) missing.push("Family studied abroad?");
      if (data.familyStudiedAbroad === "yes" && !data.familyAbroadDetails) missing.push("Family abroad details");
    }
    if (section === 3) {
      if (!data.schoolName) missing.push("School name");
      if (!data.schoolCity) missing.push("School city");
      if (!data.schoolRegion) missing.push("School region");
      if (!data.currentClass) missing.push("Current class");
      if (data.currentClass === "lower_sixth" && !data.lowerSixthPathwayChoice) missing.push("Fallback preference for Lower Sixth");
      if (!data.intendedFieldWhy || words(data.intendedFieldWhy) === 0) missing.push("Intended field and reason");
      if (!Array.isArray(data.topSubjects) || data.topSubjects.length !== 5) missing.push("Top 5 subjects");
      else {
        data.topSubjects.forEach((s: any, i: number) => {
          if (!s.name || !s.score || !s.examTerm) missing.push(`Subject ${i + 1} (name/score/term)`);
        });
      }
    }
    if (section === 4) {
      const wc = words(data.communityEssay);
      if (wc < 75 || wc > 225) missing.push("Community challenge essay (75-225 words)");
    }
    if (section === 5) {
      if (!Array.isArray(data.activities) || data.activities.length < 1) missing.push("At least one activity");
      else {
        data.activities.forEach((a: any, i: number) => {
          if (!a.title) missing.push(`Activity ${i + 1}: title`);
          if (!a.roleDescription) missing.push(`Activity ${i + 1}: role description`);
          if (!a.duration) missing.push(`Activity ${i + 1}: duration`);
          if (!a.hoursPerWeek) missing.push(`Activity ${i + 1}: hours/week`);
          if (!a.weeksPerYear) missing.push(`Activity ${i + 1}: weeks/year`);
          if (!a.isStillDoing) missing.push(`Activity ${i + 1}: still doing?`);
          if (a.isStillDoing === "no" && !a.stoppedIn) missing.push(`Activity ${i + 1}: stopped in`);
        });
      }
    }
    if (section === 6) {
      if (!data.housingOption) missing.push("Housing option");
      if (data.housingOption === "B") {
        if (!data.housingContactRelation) missing.push("Housing contact relationship");
        if (!data.housingContactAware) missing.push("Housing contact aware?");
      }
      if (data.housingOption === "C" && !data.canCoverHousingCost) missing.push("Can cover housing cost");
      if (!data.participationConstraint && data.participationConstraint !== "no" ) missing.push("Participation constraint");
      if (data.participationConstraint === "yes" && !data.participationConstraintExplain) missing.push("Participation constraint explanation");
    }
    if (section === 8) {
      if (!data.monthlyIncomeRange) missing.push("Monthly household income range");
      if (!data.worksToSupportFamily) missing.push("Works to support family?");
      if (data.worksToSupportFamily === "yes" && !data.workSupportDetails) missing.push("Work support details");
      if (!data.costChallenge) missing.push("Cost challenge response");
    }
    if (section === 9) {
      if (!data.applyingScholarship) missing.push("Applying for financial aid?");
      if (data.applyingScholarship === "yes" && !data.scholarshipEssay) missing.push("Scholarship essay");
    }
    if (section === 10) {
      if (!data.documents?.reportCard?.url) missing.push("Report card upload");
      if (!data.documents?.olSlip?.url) missing.push("Ordinary Level slip upload");
    }
    if (section === 11) {
      if (!data.declarationConfirmed) missing.push("Declaration confirmation");
    }

    return missing;
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
    // Validate all sections and provide exact missing-field feedback
    const sections = [1,2,3,4,5,6,8,9,10,11];
    const allMissing: string[] = [];
    sections.forEach((s) => {
      const miss = getMissingFields(s);
      if (miss.length) allMissing.push(...miss.map(m => `Section ${s}: ${m}`));
    });
    if (allMissing.length) {
      toast({ title: "Cannot submit — missing fields", description: allMissing.slice(0,6).join('; ')+ (allMissing.length>6? '...': ''), variant: "destructive" as any });
      return;
    }

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
        <Card className="rounded-3xl h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-xl">GSP Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Progress: <span className="font-semibold text-kc-blue">{progressPct}%</span></p>
            <p className="text-xs text-muted-foreground">{saving ? "Autosaving..." : "All changes saved automatically"}</p>
            <div className="pt-2 grid gap-2 text-sm">
              {[1, 2, 3, 4, 5, 6, 8, 9, 10, 11].map((s, index, arr) => {
                const canEdit = index === 0 || arr.slice(0, index).every((prevSec) => sectionState[prevSec === 11 ? "review" : `section${prevSec}`]);
                const label = SECTION_LABELS[s] ? `Section ${s}: ${SECTION_LABELS[s]}` : `Section ${s}`;
                return (
                  <button 
                    key={s}
                    className={`text-left px-3 py-2 rounded-lg border flex justify-between items-center ${activeSection === s ? "border-kc-blue bg-kc-blue/5" : "border-border"} ${!canEdit ? "opacity-80" : "hover:border-kc-blue"}`} 
                    onClick={() => setActiveSection(s)}
                  >
                    <span className="truncate max-w-[180px]">{label}</span>
                    <div className="flex items-center gap-2">
                      {!canEdit && <span className="text-xs text-muted-foreground">🔒</span>}
                      {sectionState[s === 11 ? "review" : `section${s}`] && <span>✅</span>}
                    </div>
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
          {/* Before You Begin guidance — placed at the top of the form */}
          <Card className="rounded-3xl">
            <CardHeader><CardTitle>Before You Begin</CardTitle></CardHeader>
            <CardContent>
              <p>This application is for the KC Global Scholars Programme. We admit a small cohort each year. Selection is competitive.</p>
              <p className="mt-2">Answer every question in your own words. We are not looking for the most polished answers. We are looking for the clearest picture of who you are, where you come from, and what you intend to do.</p>
              <p className="mt-2">The programme runs from Summer 2026 (on-site) through May 2027. Make sure you are available for this full period before applying.</p>
              <p className="mt-2">Set aside enough time to do this properly. Most students take between 3 days and a week to complete the application.</p>
            </CardContent>
          </Card>
          {fetching ? (
            <Card className="rounded-3xl"><CardContent className="p-8">Loading application...</CardContent></Card>
          ) : (
            <>
              {activeSection === 1 && (
                <Card className="rounded-3xl">
                  <CardHeader><CardTitle>Section 1: Personal Information</CardTitle></CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="col-span-full text-sm text-muted-foreground mb-2">{GUIDANCE_TEXT[1]}</div>
                    {/* determine editability for this section */}
                    {/** inputs will be disabled when section locked */}
                    
                    
                    <div><Label>First name</Label><Input disabled={!editable} value={data.firstName} onChange={(e) => setField("firstName", e.target.value)} /></div>
                    <div><Label>Last name</Label><Input disabled={!editable} value={data.lastName} onChange={(e) => setField("lastName", e.target.value)} /></div>
                    <div><Label>Date of birth</Label><Input disabled={!editable} type="date" value={data.dob} onChange={(e) => setField("dob", e.target.value)} /></div>
                    <div>
                      <Label>Phone</Label>
                      <div className="flex gap-2">
                        <Select disabled={!editable} value={data.phoneCode} onValueChange={(val) => setField("phoneCode", val)}>
                          <SelectTrigger className="w-[100px]"><SelectValue placeholder="Code" /></SelectTrigger>
                          <SelectContent>
                            {COUNTRY_CODES.map((c) => <SelectItem key={c.code} value={c.code}>{c.country} {c.code}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Input disabled={!editable} className="flex-1" value={data.phone} onChange={(e) => setField("phone", e.target.value)} />
                      </div>
                    </div>
                    <div><Label>Email</Label><Input disabled={!editable} type="email" value={data.email} onChange={(e) => setField("email", e.target.value)} /></div>
                    <div>
                      <Label>Gender</Label>
                      <Select disabled={!editable} value={data.gender} onValueChange={(val) => setField("gender", val)}>
                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Nationality</Label>
                      <Select disabled={!editable} value={data.nationality} onValueChange={(val) => setField("nationality", val)}>
                        <SelectTrigger><SelectValue placeholder="Select nationality" /></SelectTrigger>
                        <SelectContent>
                          {NATIONS.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Primary number on WhatsApp?</Label>
                      <Select disabled={!editable} value={data.isPhoneOnWhatsApp} onValueChange={(val) => setField("isPhoneOnWhatsApp", val)}>
                        <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.isPhoneOnWhatsApp === "no" && <div><Label>Alternate WhatsApp</Label><Input disabled={!editable} value={data.alternateWhatsApp} onChange={(e) => setField("alternateWhatsApp", e.target.value)} /></div>}
                    <div><Label>City</Label><Input disabled={!editable} value={data.city} onChange={(e) => setField("city", e.target.value)} /></div>
                    <div>
                      <Label>Region</Label>
                      <Select disabled={!editable} value={data.region} onValueChange={(val) => setField("region", val)}>
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
                    <div className="col-span-full text-sm text-muted-foreground">{GUIDANCE_TEXT[2]}</div>
                    <div><Label>Household size</Label><Input disabled={!editable} type="number" value={data.householdSize} onChange={(e) => setField("householdSize", e.target.value)} /></div>
                    <div><Label>Primary guardian occupation</Label><Input disabled={!editable} value={data.primaryGuardianOccupation} onChange={(e) => setField("primaryGuardianOccupation", e.target.value)} /></div>
                    <div><Label>Second guardian occupation (optional)</Label><Input disabled={!editable} value={data.secondGuardianOccupation} onChange={(e) => setField("secondGuardianOccupation", e.target.value)} /></div>
                    <div>
                      <Label>Highest family education</Label>
                      <Select disabled={!editable} value={data.highestFamilyEducation} onValueChange={(val) => setField("highestFamilyEducation", val)}>
                        <SelectTrigger><SelectValue placeholder="Select education" /></SelectTrigger>
                        <SelectContent>
                          {EDUCATION_LEVELS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Family studied abroad?</Label>
                      <Select disabled={!editable} value={data.familyStudiedAbroad} onValueChange={(val) => setField("familyStudiedAbroad", val)}>
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
                        <ReactQuill
                          theme="snow"
                          value={data.familyAbroadDetails}
                          onChange={(content) => setField("familyAbroadDetails", content)}
                          readOnly={!editable}
                          modules={editable ? EDITABLE_QUILL_MODULES : QUIET_QUILL_MODULES}
                          className="mb-4 min-h-[120px]"
                        />
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
                    <div className="col-span-full text-sm text-muted-foreground">{GUIDANCE_TEXT[3]}</div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div><Label>School name</Label><Input disabled={!editable} value={data.schoolName} onChange={(e) => setField("schoolName", e.target.value)} /></div>
                      <div><Label>Town/City</Label><Input disabled={!editable} value={data.schoolCity} onChange={(e) => setField("schoolCity", e.target.value)} /></div>
                      <div>
                        <Label>Region</Label>
                        <Select disabled={!editable} value={data.schoolRegion} onValueChange={(val) => setField("schoolRegion", val)}>
                          <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                          <SelectContent>
                            {CAMEROON_REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Current class</Label>
                      <Select disabled={!editable} value={data.currentClass} onValueChange={(val) => setField("currentClass", val)}>
                        <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lower_sixth">Lower Sixth</SelectItem>
                          <SelectItem value="upper_sixth">Upper Sixth</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.currentClass === "lower_sixth" && (
                      <div><Label>If not admitted, fallback preference</Label><Input disabled={!editable} value={data.lowerSixthPathwayChoice} onChange={(e) => setField("lowerSixthPathwayChoice", e.target.value)} /></div>
                    )}
                    <div className="space-y-3">
                      <Label>Top 5 subjects with score and exam term</Label>
                      {data.topSubjects.map((subject: any, i: number) => (
                        <div key={i} className="grid md:grid-cols-3 gap-3">
                          <Input disabled={!editable} placeholder={`Subject ${i + 1}`} value={subject.name} onChange={(e) => updateSubject(i, "name", e.target.value)} />
                          <Input disabled={!editable} placeholder="Score" value={subject.score} onChange={(e) => updateSubject(i, "score", e.target.value)} />
                          <Input disabled={!editable} placeholder="Exam/Term" value={subject.examTerm} onChange={(e) => updateSubject(i, "examTerm", e.target.value)} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <Label>What do you want to study at university and why? (max 150 words)</Label>
                      <ReactQuill
                        theme="snow"
                        value={data.intendedFieldWhy}
                        onChange={(content) => setField("intendedFieldWhy", content)}
                        readOnly={!editable}
                        modules={editable ? EDITABLE_QUILL_MODULES : QUIET_QUILL_MODULES}
                        className="min-h-[140px] mb-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">{words(data.intendedFieldWhy)} / 150 words</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 4 && (
                <Card className="rounded-3xl">
                  <CardHeader><CardTitle>Section 4: Short Answer</CardTitle></CardHeader>
                  <CardContent>
                    <div className="col-span-full text-sm text-muted-foreground mb-2">{GUIDANCE_TEXT[4]}</div>
                    <Label className="mb-2 block">Community challenge essay (75-225 words)</Label>
                    <ReactQuill 
                      theme="snow" 
                      value={data.communityEssay} 
                      onChange={(content) => setField("communityEssay", content)} 
                      readOnly={!editable}
                      modules={editable ? EDITABLE_QUILL_MODULES : QUIET_QUILL_MODULES}
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
                    <div className="col-span-full text-sm text-muted-foreground">{GUIDANCE_TEXT[5]}</div>
                    {data.activities.map((activity: any, i: number) => (
                      <div key={i} className="border rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">Activity {i + 1}</h4>
                          {data.activities.length > 1 && <Button disabled={!editable} size="sm" variant="ghost" onClick={() => removeActivity(i)}>Remove</Button>}
                        </div>
                        <Input disabled={!editable} placeholder="Activity title" value={activity.title} onChange={(e) => updateActivity(i, "title", e.target.value)} />
                        <Textarea disabled={!editable} placeholder="What did you actually do? (2-3 sentences)" value={activity.roleDescription} onChange={(e) => updateActivity(i, "roleDescription", e.target.value)} />
                        <div className="grid md:grid-cols-3 gap-3">
                          <Input disabled={!editable} placeholder="Duration" value={activity.duration} onChange={(e) => updateActivity(i, "duration", e.target.value)} />
                          <Input disabled={!editable} type="number" placeholder="Hours/week" value={activity.hoursPerWeek} onChange={(e) => updateActivity(i, "hoursPerWeek", e.target.value)} />
                          <Input disabled={!editable} type="number" placeholder="Weeks/year" value={activity.weeksPerYear} onChange={(e) => updateActivity(i, "weeksPerYear", e.target.value)} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <Select disabled={!editable} value={activity.isStillDoing} onValueChange={(val) => updateActivity(i, "isStillDoing", val)}>
                              <SelectTrigger><SelectValue placeholder="Still doing?" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {activity.isStillDoing === "no" && <Input disabled={!editable} placeholder="Stopped in..." value={activity.stoppedIn} onChange={(e) => updateActivity(i, "stoppedIn", e.target.value)} />}
                        </div>
                      </div>
                    ))}
                    {data.activities.length < 3 && <Button disabled={!editable} variant="outline" className="rounded-full" onClick={addActivity}>Add Activity</Button>}
                  </CardContent>
                </Card>
              )}

              {activeSection === 6 && (
                <Card className="rounded-3xl">
                  <CardHeader><CardTitle>Section 6: Logistics and Programme Fit</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="col-span-full text-sm text-muted-foreground">{GUIDANCE_TEXT[6]}</div>
                    <div>
                      <Label>Housing option</Label>
                      <Select disabled={!editable} value={data.housingOption} onValueChange={(val) => setField("housingOption", val)}>
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
                        <div><Label>Relationship to contact</Label><Input disabled={!editable} value={data.housingContactRelation} onChange={(e) => setField("housingContactRelation", e.target.value)} /></div>
                        <div>
                          <Label>Are they aware?</Label>
                          <Select disabled={!editable} value={data.housingContactAware} onValueChange={(val) => setField("housingContactAware", val)}>
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
                        <Select disabled={!editable} value={data.canCoverHousingCost} onValueChange={(val) => setField("canCoverHousingCost", val)}>
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
                      <Select disabled={!editable} value={data.participationConstraint} onValueChange={(val) => setField("participationConstraint", val)}>
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
                        <Textarea disabled={!editable} value={data.participationConstraintExplain} onChange={(e) => setField("participationConstraintExplain", e.target.value)} />
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
                    <div className="text-sm text-muted-foreground">{GUIDANCE_TEXT[8]}</div>
                    <div>
                      <Label>Monthly household income range</Label>
                      <Select disabled={!editable} value={data.monthlyIncomeRange} onValueChange={(val) => setField("monthlyIncomeRange", val)}>
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
                      <Select disabled={!editable} value={data.worksToSupportFamily} onValueChange={(val) => setField("worksToSupportFamily", val)}>
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
                        <Textarea disabled={!editable} value={data.workSupportDetails} onChange={(e) => setField("workSupportDetails", e.target.value)} />
                        <p className="text-xs text-muted-foreground mt-1">{words(data.workSupportDetails)} / 100 words</p>
                      </div>
                    )}
                    <div>
                      <Label>Would 500,000 XAF still be a challenge?</Label>
                      <Select disabled={!editable} value={data.costChallenge} onValueChange={(val) => setField("costChallenge", val)}>
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
                    <div className="text-sm text-muted-foreground">{GUIDANCE_TEXT[9]}</div>
                    <div>
                      <Label>Applying for Financial Aid?</Label>
                      <Select disabled={!editable} value={data.applyingScholarship} onValueChange={(val) => setField("applyingScholarship", val)}>
                        <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.applyingScholarship === "yes" && (
                      <div className="mt-2">
                        <Label>Financial aid essay</Label>
                        <ReactQuill
                          theme="snow"
                          value={data.scholarshipEssay}
                          onChange={(content) => setField("scholarshipEssay", content)}
                          readOnly={!editable}
                          modules={editable ? EDITABLE_QUILL_MODULES : QUIET_QUILL_MODULES}
                          className="min-h-[180px]"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeSection === 10 && (
                <Card className="rounded-3xl">
                  <CardHeader><CardTitle>Section 10: Documents</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">{GUIDANCE_TEXT[10]}</div>
                    <div>
                      <Label>Most recent report card (required)</Label>
                      <Input disabled={!editable} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => uploadDocument("reportCard", e.target.files?.[0])} />
                      {data.documents?.reportCard?.url && <p className="text-xs text-emerald-600 mt-1">Uploaded</p>}
                    </div>
                    <div>
                      <Label>Ordinary Level Slip (required)</Label>
                      <Input disabled={!editable} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => uploadDocument("olSlip", e.target.files?.[0])} />
                      {data.documents?.olSlip?.url && <p className="text-xs text-emerald-600 mt-1">Uploaded</p>}
                    </div>
                    <div>
                      <Label>Advanced Level Slip (optional)</Label>
                      <Input disabled={!editable} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => uploadDocument("alSlip", e.target.files?.[0])} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 11 && (
                <Card className="rounded-3xl border-kc-blue/20">
                  <CardHeader><CardTitle>Review and Submit</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">{GUIDANCE_TEXT[11]}</div>
                    <label className="flex gap-2 items-start text-sm">
                      <input disabled={!editable} type="checkbox" checked={data.declarationConfirmed} onChange={(e) => setField("declarationConfirmed", e.target.checked)} />
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
                  const missing = getMissingFields(activeSection);
                  toast({
                    title: "Incomplete Section",
                    description: missing.length ? `Missing: ${missing.join(', ')}` : "Please fill out all required fields in this section before proceeding.",
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
