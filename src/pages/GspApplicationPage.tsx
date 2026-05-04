import React from "react";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGspAuth } from "@/contexts/GspAuthContext";
import {
  getGspApplication,
  saveGspDraft,
  submitGspApplication,
  uploadGspDocument,
} from "@/services/gspApi";
import { useToast } from "@/components/ui/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { words, computeSectionState, computeProgressPct } from "@/lib/gspUtils";

const CAMEROON_REGIONS = [
  "Adamawa",
  "Centre",
  "East",
  "Far North",
  "Littoral",
  "North",
  "North West",
  "West",
  "South",
  "South West",
];

const NATIONS = [
  "Cameroon",
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Rwanda",
  "Uganda",
  "Senegal",
  "Other",
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
  "None",
  "Primary School",
  "Secondary School (O-Level/A-Level)",
  "Vocational/Technical",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate (PhD)",
];

const GSP_SECTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const SUBMITTABLE_SECTIONS = GSP_SECTIONS.filter((section) => section !== 0);
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
  topSubjects: Array.from({ length: 5 }).map(() => ({
    name: "",
    score: "",
    examTerm: "",
  })),
  intendedFieldWhy: "",
  communityEssay: "",
  activities: [
    {
      title: "",
      roleDescription: "",
      duration: "",
      hoursPerWeek: "",
      weeksPerYear: "",
      isStillDoing: "",
      stoppedIn: "",
    },
  ],
  housingOption: "",
  housingContactRelation: "",
  housingContactAware: "",
  canCoverHousingCost: "",
  participationConstraint: "",
  participationConstraintExplain: "",
  lowerSixthAlternatives: "",
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

const GUIDANCE_TEXT: Record<number, string> = {
  1: `Provide your legal name, date of birth, contact details and where you live. Be accurate — this information is used for identification and logistics.`,
  2: `Describe your household and guardian occupations. If any family members studied abroad, say who, where and when (brief).`,
  3: `List your school, region and top 5 subjects (include scores and exam/term). Explain briefly what you want to study and why (concise).`,
  4: `Answer each question in your own words. We are not looking for perfect writing. We are looking for real thinking. 75 words minimum - 225 words maximum per answer.`,
  5: `List up to three activities. These do not have to be clubs, awards, or formal programmes. Work at home counts. Caring for siblings counts. Selling goods counts. Coaching younger students counts. A church role counts. Farming counts. If it took real time and real effort, it belongs here.`,
  6: `Knowledge Center is based in Buea, and we expect all admits to reside in Buea for our Summer Global Education Programme. The programme runs from Summer 2026 through May 2027.`,
  7: `This section is for Lower Sixth students only. Lower Sixth students are fully eligible for the KC GSP. If you are not admitted to this cohort, KC offers alternative ways to keep building toward your goal.`,
  8: `This information helps us understand your background and assess financial need for the scholarship. It will not be used to disqualify any applicant.`,
  9: `The KC financial aid is awarded to the student who can most specifically and credibly show why they will make the most of this opportunity - for themselves, for the people around them, and eventually for this continent.`,
  10: `Upload your most recent school report card, Ordinary Level slip, and Advanced Level slip if applicable. PDF, JPG, or PNG. Maximum 10MB.`,
  11: `Before you submit, review your answers in each section. You can go back and edit anything. Once you submit, you will receive a confirmation email with your application reference number. You will not be able to edit your application after submission.`,
};

const SECTION_LABELS: Record<number, string> = {
  0: "Getting Started",
  1: "Personal Information",
  2: "Family Background",
  3: "Academic Background",
  4: "Short Answer",
  5: "Activities",
  6: "Logistics & Programme Fit",
  7: "Lower Sixth Pathway",
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
  const [sectionState, setSectionState] = React.useState<
    Record<string, boolean>
  >({});
  const [fetching, setFetching] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState(0);
  const [sectionTransitioning, setSectionTransitioning] = React.useState(false);

  const progressPct = React.useMemo(() => {
    return computeProgressPct(sectionState);
  }, [sectionState]);

  React.useEffect(() => {
    if (!user) return;

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
        if (!loadedLocal) {
          const appRId = resp.application?.r_id;
          const mergedData = {
            ...defaultData,
            ...serverData,
            email: serverData.email || user.email,
            ...(appRId ? { r_id: appRId } : {}),
          };
          setData(mergedData);
          const nextSectionState =
            resp.application?.sectionState || computeSectionState(mergedData);
          setSectionState(nextSectionState);
        }
      } catch (error: any) {
        toast({
          title: "Failed to load application",
          description: error.message || "Please try again.",
          variant: "destructive" as any,
        });
      } finally {
        setFetching(false);
      }
    })();
  }, [user, toast]);

  React.useEffect(() => {
    if (!user || fetching) return;
    const next = computeSectionState(data);
    setSectionState(next);

    localStorage.setItem(`gsp_draft_${user.email}`, JSON.stringify(data));

    const id = setTimeout(async () => {
      try {
        setSaving(true);
        const res = await saveGspDraft(data, next, data.r_id);
        localStorage.setItem("gsp_reg_rid", data.r_id);
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

  if (!loading && !user)
    return <Navigate to="/auth?redirect=/gsp/application" replace />;

  const setField = (key: string, value: any) =>
    setData((prev: any) => ({ ...prev, [key]: value }));

  const canEditSection = (_s: number) => true;

  const updateSubject = (
    index: number,
    key: "name" | "score" | "examTerm",
    value: string,
  ) => {
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

  const editable = canEditSection(activeSection);

  const goToSection = (section: number) => {
    if (section === activeSection || sectionTransitioning) return;
    setSectionTransitioning(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      setActiveSection(section);
      setSectionTransitioning(false);
    }, 350);
  };

  const addActivity = () => {
    setData((prev: any) => {
      if (prev.activities.length >= 3) return prev;
      return {
        ...prev,
        activities: [
          ...prev.activities,
          {
            title: "",
            roleDescription: "",
            duration: "",
            hoursPerWeek: "",
            weeksPerYear: "",
            isStillDoing: "",
            stoppedIn: "",
          },
        ],
      };
    });
  };

  const removeActivity = (idx: number) => {
    setData((prev: any) => ({
      ...prev,
      activities: prev.activities.filter((_: any, i: number) => i !== idx),
    }));
  };

  const getMissingFields = (section: number) => {
    const missing: string[] = [];
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
      if (!data.primaryGuardianOccupation)
        missing.push("Primary guardian occupation");
      if (!data.highestFamilyEducation)
        missing.push("Highest family education");
      if (!data.familyStudiedAbroad) missing.push("Family studied abroad?");
      if (data.familyStudiedAbroad === "yes" && !data.familyAbroadDetails)
        missing.push("Family abroad details");
    }
    if (section === 3) {
      if (!data.schoolName) missing.push("School name");
      if (!data.schoolCity) missing.push("School city");
      if (!data.schoolRegion) missing.push("School region");
      if (!data.currentClass) missing.push("Current class");
      if (!data.intendedFieldWhy || words(data.intendedFieldWhy) === 0)
        missing.push("Intended field and reason");
      if (!Array.isArray(data.topSubjects) || data.topSubjects.length !== 5)
        missing.push("Top 5 subjects");
      else {
        data.topSubjects.forEach((s: any, i: number) => {
          if (!s.name || !s.score || !s.examTerm)
            missing.push(`Subject ${i + 1} (name/score/term)`);
        });
      }
    }
    if (section === 4) {
      const wc = words(data.communityEssay);
      if (wc < 75 || wc > 225)
        missing.push("Community challenge essay (75-225 words)");
    }
    if (section === 5) {
      if (!Array.isArray(data.activities) || data.activities.length < 1)
        missing.push("At least one activity");
      else {
        data.activities.forEach((a: any, i: number) => {
          if (!a.title) missing.push(`Activity ${i + 1}: title`);
          if (!a.roleDescription)
            missing.push(`Activity ${i + 1}: role description`);
          if (!a.duration) missing.push(`Activity ${i + 1}: duration`);
          if (!a.hoursPerWeek) missing.push(`Activity ${i + 1}: hours/week`);
          if (!a.weeksPerYear) missing.push(`Activity ${i + 1}: weeks/year`);
          if (!a.isStillDoing) missing.push(`Activity ${i + 1}: still doing?`);
          if (a.isStillDoing === "no" && !a.stoppedIn)
            missing.push(`Activity ${i + 1}: stopped in`);
        });
      }
    }
    if (section === 6) {
      if (!data.housingOption) missing.push("Housing option");
      if (data.housingOption === "B") {
        if (!data.housingContactRelation)
          missing.push("Housing contact relationship");
        if (!data.housingContactAware) missing.push("Housing contact aware?");
      }
      if (data.housingOption === "C" && !data.canCoverHousingCost)
        missing.push("Can cover housing cost");
      if (
        !data.participationConstraint &&
        data.participationConstraint !== "no"
      )
        missing.push("Participation constraint");
      if (
        data.participationConstraint === "yes" &&
        !data.participationConstraintExplain
      )
        missing.push("Participation constraint explanation");
    }
    if (section === 8) {
      if (!data.monthlyIncomeRange)
        missing.push("Monthly household income range");
      if (!data.worksToSupportFamily) missing.push("Works to support family?");
      if (data.worksToSupportFamily === "yes" && !data.workSupportDetails)
        missing.push("Work support details");
      if (!data.costChallenge) missing.push("Cost challenge response");
    }
    if (section === 9) {
      if (!data.applyingScholarship)
        missing.push("Applying for financial aid?");
      if (data.applyingScholarship === "yes" && !data.scholarshipEssay)
        missing.push("Scholarship essay");
    }
    if (section === 10) {
      if (!data.documents?.reportCard?.url) missing.push("Report card upload");
      if (!data.documents?.olSlip?.url)
        missing.push("Ordinary Level slip upload");
    }
    if (section === 11) {
      if (!data.declarationConfirmed) missing.push("Declaration confirmation");
    }

    return missing;
  };

  const uploadDocument = async (
    field: "reportCard" | "olSlip" | "alSlip",
    file?: File | null,
  ) => {
    if (!file) return;
    try {
      const uploaded = await uploadGspDocument({
        file: file,
        application: data.r_id,
      });
      setData((prev: any) => ({
        ...prev,
        documents: { ...prev.documents, [field]: uploaded },
      }));
      toast({
        title: "Upload complete",
        description: `${file.name} uploaded successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Please try another file.",
        variant: "destructive" as any,
      });
    }
  };

  const onSubmit = async () => {
    const allMissing: string[] = [];
    SUBMITTABLE_SECTIONS.forEach((s) => {
      const miss = getMissingFields(s);
      if (miss.length)
        allMissing.push(...miss.map((m) => `Section ${s}: ${m}`));
    });
    if (allMissing.length) {
      toast({
        title: "Cannot submit — missing fields",
        description:
          allMissing.slice(0, 6).join("; ") +
          (allMissing.length > 6 ? "..." : ""),
        variant: "destructive" as any,
      });
      return;
    }

    try {
      setSubmitting(true);
      await submitGspApplication(data, sectionState, data.r_id);
      localStorage.removeItem(`gsp_draft_${user?.email}`);
      toast({
        title: "Application submitted",
        description: "Your application is now locked for review.",
      });
      navigate("/gsp/dashboard");
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Please review required sections.",
        variant: "destructive" as any,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 lg:px-8 py-12 lg:py-16"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
        <Card className="rounded-2xl h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-xl">GSP Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Progress:{" "}
              <span className="font-semibold text-kc-blue">{progressPct}%</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {saving ? "Autosaving..." : "All changes saved automatically"}
            </p>
            <div className="pt-2 grid gap-2 text-sm">
              {GSP_SECTIONS.map((s) => {
                const completed =
                  s === 0 ||
                  Boolean(sectionState[s === 11 ? "review" : `section${s}`]);
                const label = SECTION_LABELS[s]
                  ? `Section ${s}: ${SECTION_LABELS[s]}`
                  : `Section ${s}`;
                return (
                  <button
                    key={s}
                    className={`text-left px-3 py-2 rounded-lg border flex justify-between items-center transition-all ${completed ? "border-kc-blue bg-kc-blue text-white shadow-sm" : activeSection === s ? "border-kc-blue bg-kc-blue/5 text-foreground" : "border-border bg-white text-foreground"} hover:border-kc-blue`}
                    onClick={() => goToSection(s)}
                  >
                    <span className="truncate max-w-[180px]">{label}</span>
                    <div className="flex items-center gap-2">
                      {completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4 opacity-60" />
                      )}
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
          {fetching ? (
            <Card className="rounded-2xl">
              <CardContent className="space-y-5 p-6 md:p-8">
                <div className="flex items-center gap-3 text-sm font-medium text-kc-blue">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Preparing your application
                </div>
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="grid gap-4 md:grid-cols-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {sectionTransitioning && (
                <div className="rounded-2xl border border-kc-blue/15 bg-kc-blue/5 p-4 text-sm text-kc-blue flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Opening {SECTION_LABELS[activeSection]}...
                </div>
              )}
              {activeSection === 0 && (
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle>Section 0: Before You Begin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      This application is for the KC Global Scholars Programme.
                      We admit a small cohort each year. Selection is
                      competitive.
                    </p>
                    <p className="mt-2">
                      Answer every question in your own words. We are looking
                      for the clearest picture of who you are, where you come
                      from, and what you intend to do.
                    </p>
                    <p className="mt-2">
                      The programme runs from Summer 2026 (on-site) through May
                      2027. Make sure you are available for this full period
                      before applying.
                    </p>
                    <p className="mt-2">
                      Set aside enough time to do this properly. Most students
                      take between 3 days and a week to complete the
                      application.
                    </p>
                  </CardContent>
                </Card>
              )}
              {activeSection === 1 && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle>Section 1: Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="col-span-full text-sm text-muted-foreground mb-2">
                      {GUIDANCE_TEXT[1]}
                    </div>
                    <div>
                      <Label>First name</Label>
                      <Input
                        disabled={!editable}
                        value={data.firstName}
                        onChange={(e) => setField("firstName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Last name</Label>
                      <Input
                        disabled={!editable}
                        value={data.lastName}
                        onChange={(e) => setField("lastName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Date of birth</Label>
                      <Input
                        disabled={!editable}
                        type="date"
                        value={data.dob}
                        onChange={(e) => setField("dob", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <div className="flex gap-2">
                        <Select
                          disabled={!editable}
                          value={data.phoneCode}
                          onValueChange={(val) => setField("phoneCode", val)}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRY_CODES.map((c) => (
                              <SelectItem key={c.code} value={c.code}>
                                {c.country} {c.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          disabled={!editable}
                          className="flex-1"
                          value={data.phone}
                          onChange={(e) => setField("phone", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        disabled={!editable}
                        type="email"
                        value={data.email}
                        onChange={(e) => setField("email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <Select
                        disabled={!editable}
                        value={data.gender}
                        onValueChange={(val) => setField("gender", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Nationality</Label>
                      <Select
                        disabled={!editable}
                        value={data.nationality}
                        onValueChange={(val) => setField("nationality", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {NATIONS.map((n) => (
                            <SelectItem key={n} value={n}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Is this phone number on WhatsApp?</Label>
                      <Select
                        disabled={!editable}
                        value={data.isPhoneOnWhatsApp}
                        onValueChange={(val) =>
                          setField("isPhoneOnWhatsApp", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.isPhoneOnWhatsApp === "no" && (
                      <div>
                        <Label>Alternate WhatsApp</Label>
                        <Input
                          disabled={!editable}
                          value={data.alternateWhatsApp}
                          onChange={(e) =>
                            setField("alternateWhatsApp", e.target.value)
                          }
                        />
                      </div>
                    )}
                    <div>
                      <Label>City</Label>
                      <Input
                        disabled={!editable}
                        value={data.city}
                        onChange={(e) => setField("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Region</Label>
                      <Select
                        disabled={!editable}
                        value={data.region}
                        onValueChange={(val) => setField("region", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {CAMEROON_REGIONS.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 2 && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle>Section 2: Family Background</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="col-span-full text-sm text-muted-foreground">
                      {GUIDANCE_TEXT[2]}
                    </div>
                    <div>
                      <Label>How many people live in your household?</Label>
                      <Input
                        disabled={!editable}
                        type="number"
                        value={data.householdSize}
                        onChange={(e) =>
                          setField("householdSize", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>
                        What is the occupation of your primary guardian?
                      </Label>
                      <Input
                        disabled={!editable}
                        value={data.primaryGuardianOccupation}
                        onChange={(e) =>
                          setField("primaryGuardianOccupation", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>
                        What is the occupation of your secondary guardian?
                        (optional)
                      </Label>
                      <Input
                        disabled={!editable}
                        value={data.secondGuardianOccupation}
                        onChange={(e) =>
                          setField("secondGuardianOccupation", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>
                        What is the highest level of education achieved by a
                        family member?
                      </Label>
                      <Select
                        disabled={!editable}
                        value={data.highestFamilyEducation}
                        onValueChange={(val) =>
                          setField("highestFamilyEducation", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select education" />
                        </SelectTrigger>
                        <SelectContent>
                          {EDUCATION_LEVELS.map((e) => (
                            <SelectItem key={e} value={e}>
                              {e}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>
                        Has anyone in your immediate family studied abroad or
                        attended university outside Cameroon?{" "}
                      </Label>
                      <Select
                        disabled={!editable}
                        value={data.familyStudiedAbroad}
                        onValueChange={(val) =>
                          setField("familyStudiedAbroad", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
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
                          onChange={(content) =>
                            setField("familyAbroadDetails", content)
                          }
                          readOnly={!editable}
                          modules={
                            editable
                              ? EDITABLE_QUILL_MODULES
                              : QUIET_QUILL_MODULES
                          }
                          className="mb-4 min-h-[120px]"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {words(data.familyAbroadDetails)} / 150 words
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeSection === 3 && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle>Section 3: Academic Background</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="col-span-full text-sm text-muted-foreground">
                      {GUIDANCE_TEXT[3]}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>School name</Label>
                        <Input
                          disabled={!editable}
                          value={data.schoolName}
                          onChange={(e) =>
                            setField("schoolName", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label>Town/City</Label>
                        <Input
                          disabled={!editable}
                          value={data.schoolCity}
                          onChange={(e) =>
                            setField("schoolCity", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label>Region</Label>
                        <Select
                          disabled={!editable}
                          value={data.schoolRegion}
                          onValueChange={(val) => setField("schoolRegion", val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            {CAMEROON_REGIONS.map((r) => (
                              <SelectItem key={r} value={r}>
                                {r}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Current class</Label>
                      <Select
                        disabled={!editable}
                        value={data.currentClass}
                        onValueChange={(val) => setField("currentClass", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lower_sixth">
                            Lower Sixth
                          </SelectItem>
                          <SelectItem value="upper_sixth">
                            Upper Sixth
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.currentClass === "lower_sixth" && (
                      <>
                        <div className="mt-4 p-4 rounded-xl border border-kc-blue/20 bg-kc-blue/5 space-y-3">
                          <div className="text-sm font-semibold text-kc-blue">
                            Lower Sixth students are fully eligible for the KC GSP.
                          </div>
                          <p className="text-sm text-muted-foreground">
                            If you are not admitted to this cohort, KC offers two ways to keep building toward your goal:
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li>The KC Summer Programme, to strengthen your preparation</li>
                            <li>One-on-one mentorship during your Upper Sixth year</li>
                          </ul>
                          <div className="pt-1">
                            <Label className="mb-1 block">
                              Would you be open to either of these if you are not admitted this cycle?
                            </Label>
                            <Select
                              disabled={!editable}
                              value={data.lowerSixthAlternatives}
                              onValueChange={(val) =>
                                setField("lowerSixthAlternatives", val)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="both">Yes, I am open to both</SelectItem>
                                <SelectItem value="summer">Yes — the Summer Programme</SelectItem>
                                <SelectItem value="mentorship">Yes — mentorship support</SelectItem>
                                <SelectItem value="none">Main cohort only — I am not interested in the alternatives</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="space-y-4">
                      <Label className="block text-sm font-medium">
                        List your five strongest subjects and your most recent
                        grade in each. Include the exam name or school term the
                        grade is from. e.g. Mathematics / 18/20 / GCE Mock 2026
                      </Label>
                      {data.topSubjects.map((subject: any, i: number) => (
                        <div key={i} className="grid md:grid-cols-3 gap-3 p-3 rounded-xl border border-border bg-muted/30">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Subject {i + 1}</Label>
                            <Input
                              disabled={!editable}
                              placeholder={`e.g. Mathematics`}
                              value={subject.name}
                              onChange={(e) =>
                                updateSubject(i, "name", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Score</Label>
                            <Select
                              disabled={!editable}
                              value={subject.score}
                              onValueChange={(val) => updateSubject(i, "score", val)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select score" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 20 }, (_, idx) => (
                                  <SelectItem key={idx + 1} value={`${idx + 1}/20`}>
                                    {idx + 1}/20
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Exam / Term</Label>
                            <Select
                              disabled={!editable}
                              value={subject.examTerm}
                              onValueChange={(val) => updateSubject(i, "examTerm", val)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select exam/term" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pre_mock">Pre-mock</SelectItem>
                                <SelectItem value="gce">GCE</SelectItem>
                                <SelectItem value="mock">Mock</SelectItem>
                                <SelectItem value="1st_term">1st Term</SelectItem>
                                <SelectItem value="2nd_term">2nd Term</SelectItem>
                                <SelectItem value="3rd_term">3rd Term</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <Label>
                        What do you want to study at university, and why does
                        that specific field appeal to you? (max 150 words)
                      </Label>
                      <ReactQuill
                        theme="snow"
                        value={data.intendedFieldWhy}
                        onChange={(content) =>
                          setField("intendedFieldWhy", content)
                        }
                        readOnly={!editable}
                        modules={
                          editable
                            ? EDITABLE_QUILL_MODULES
                            : QUIET_QUILL_MODULES
                        }
                        className="min-h-[140px] mb-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {words(data.intendedFieldWhy)} / 150 words
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 4 && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle>Section 4: Short Answer Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="text-sm text-muted-foreground p-4 rounded-xl bg-muted/40 border border-border">
                      {GUIDANCE_TEXT[4]}
                    </div>
                    <div className="space-y-3">
                      <Label className="block text-base font-medium leading-relaxed">
                        Every community has something broken that most people have
                        learned to walk past. Tell us about something in yours
                        that you could not walk past — a specific gap, failure, or
                        absence. What have you done about it, or what would you do
                        if you could?
                      </Label>
                      <ReactQuill
                        theme="snow"
                        value={data.communityEssay}
                        onChange={(content) =>
                          setField("communityEssay", content)
                        }
                        readOnly={!editable}
                        modules={
                          editable ? EDITABLE_QUILL_MODULES : QUIET_QUILL_MODULES
                        }
                        className="mb-14 h-[220px]"
                      />
                      <p className="text-xs text-muted-foreground mt-12">
                        {words(data.communityEssay)} / 75–225 words
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 5 && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle>Section 5: Activities (up to 3)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="col-span-full text-sm text-muted-foreground">
                      {GUIDANCE_TEXT[5]}
                    </div>
                    {data.activities.map((activity: any, i: number) => (
                      <div key={i} className="border rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">Activity {i + 1}</h4>
                          {data.activities.length > 1 && (
                            <Button
                              disabled={!editable}
                              size="sm"
                              variant="ghost"
                              onClick={() => removeActivity(i)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <Input
                          disabled={!editable}
                          placeholder="Activity title"
                          value={activity.title}
                          onChange={(e) =>
                            updateActivity(i, "title", e.target.value)
                          }
                        />
                        <Textarea
                          disabled={!editable}
                          placeholder="Write 2 to 3 sentences. Describe what YOU did — not what the group or organisation did. (2-3 sentences)"
                          value={activity.roleDescription}
                          onChange={(e) =>
                            updateActivity(i, "roleDescription", e.target.value)
                          }
                        />
                        <div className="grid md:grid-cols-3 gap-3">
                          <Input
                            disabled={!editable}
                            placeholder="How long have you been doing this, or how long did it last for?"
                            value={activity.duration}
                            onChange={(e) =>
                              updateActivity(i, "duration", e.target.value)
                            }
                          />
                          <Input
                            disabled={!editable}
                            type="number"
                            placeholder="Average Hours/week"
                            value={activity.hoursPerWeek}
                            onChange={(e) =>
                              updateActivity(i, "hoursPerWeek", e.target.value)
                            }
                          />
                          <Input
                            disabled={!editable}
                            type="number"
                            placeholder="Weeks/year"
                            value={activity.weeksPerYear}
                            onChange={(e) =>
                              updateActivity(i, "weeksPerYear", e.target.value)
                            }
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <Select
                              disabled={!editable}
                              value={activity.isStillDoing}
                              onValueChange={(val) =>
                                updateActivity(i, "isStillDoing", val)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Are you still doing this?" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {activity.isStillDoing === "no" && (
                            <Input
                              disabled={!editable}
                              placeholder="Stopped in..."
                              value={activity.stoppedIn}
                              onChange={(e) =>
                                updateActivity(i, "stoppedIn", e.target.value)
                              }
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    {data.activities.length < 3 && (
                      <Button
                        disabled={!editable}
                        variant="outline"
                        className="rounded-full"
                        onClick={addActivity}
                      >
                        Add Activity
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeSection === 6 && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle>
                      Section 6: Logistics and Programme Fit
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-sm text-muted-foreground p-4 rounded-xl bg-muted/40 border border-border leading-relaxed">
                      {GUIDANCE_TEXT[6]}
                    </div>
                    <div className="space-y-2">
                      <Label className="block font-medium">
                        Where would you be staying during the programme?
                      </Label>
                      <Select
                        disabled={!editable}
                        value={data.housingOption}
                        onValueChange={(val) => setField("housingOption", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select housing option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A — I already live in Buea</SelectItem>
                          <SelectItem value="B">B — I have a relative or trusted contact in Buea I can stay with</SelectItem>
                          <SelectItem value="C">C — I would need housing support from KC</SelectItem>
                          <SelectItem value="D">D — I am not yet sure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.housingOption === "B" && (
                      <div className="grid md:grid-cols-2 gap-4 p-4 rounded-xl border border-border bg-muted/30">
                        <div className="space-y-2">
                          <Label className="block">What is this person's relationship to you?</Label>
                          <Input
                            disabled={!editable}
                            value={data.housingContactRelation}
                            onChange={(e) =>
                              setField("housingContactRelation", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="block">Are they aware you plan to stay with them?</Label>
                          <Select
                            disabled={!editable}
                            value={data.housingContactAware}
                            onValueChange={(val) =>
                              setField("housingContactAware", val)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="not_yet">I have not told them yet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    {data.housingOption === "C" && (
                      <div className="p-4 rounded-xl border border-kc-blue/20 bg-kc-blue/5 space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          KC can provide on-campus housing in Buea for students who need it during the
                          summer camp, at a cost of <strong>60,000 FCFA per month</strong>. KC will
                          cover feeding, internet, and associated living bills.
                        </p>
                        <div className="space-y-2">
                          <Label className="block font-medium">Would you be able to cover this cost if admitted?</Label>
                          <Select
                            disabled={!editable}
                            value={data.canCoverHousingCost}
                            onValueChange={(val) =>
                              setField("canCoverHousingCost", val)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes, I can cover this</SelectItem>
                              <SelectItem value="no">No, I would not be able to cover this</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    <div className="space-y-3">
                      <Label className="block font-medium">
                        Is there anything in your circumstances that might affect your ability to fully
                        participate in the programme?
                      </Label>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        This includes your family situation, location, health, or displacement from the
                        crisis. Be honest — this will not automatically affect your admission. It helps
                        us plan support.
                      </p>
                      <Select
                        disabled={!editable}
                        value={data.participationConstraint}
                        onValueChange={(val) =>
                          setField("participationConstraint", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes — I will explain below</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.participationConstraint === "yes" && (
                      <div className="space-y-2">
                        <Label className="block font-medium">Please explain (max 200 words)</Label>
                        <Textarea
                          disabled={!editable}
                          value={data.participationConstraintExplain}
                          onChange={(e) =>
                            setField("participationConstraintExplain", e.target.value)
                          }
                          className="min-h-[120px]"
                        />
                        <p className="text-xs text-muted-foreground">
                          {words(data.participationConstraintExplain)} / 200 words
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeSection === 7 && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle>Section 7: Lower Sixth Pathway</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-sm text-muted-foreground p-4 rounded-xl bg-muted/40 border border-border leading-relaxed">
                      {GUIDANCE_TEXT[7]}
                    </div>
                    {data.currentClass !== "lower_sixth" ? (
                      <div className="p-4 rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground">
                        This section only applies to Lower Sixth students. Since you selected
                        <strong> {data.currentClass === "upper_sixth" ? "Upper Sixth" : "another class"}</strong>,
                        you may skip this section and continue.
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="p-4 rounded-xl border border-kc-blue/20 bg-kc-blue/5 space-y-3">
                          <p className="text-sm font-semibold text-kc-blue">Lower Sixth students are fully eligible for the KC GSP.</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            If you are not admitted to this cohort, KC offers two ways to keep building toward your goal:
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                            <li>The KC Summer Programme, to strengthen your preparation</li>
                            <li>One-on-one mentorship during your Upper Sixth year</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <Label className="block font-medium">
                            Would you be open to either of these if you are not admitted this cycle?
                          </Label>
                          <Select
                            disabled={!editable}
                            value={data.lowerSixthAlternatives}
                            onValueChange={(val) => setField("lowerSixthAlternatives", val)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="both">Yes, I am open to both</SelectItem>
                              <SelectItem value="summer">Yes — the Summer Programme</SelectItem>
                              <SelectItem value="mentorship">Yes — mentorship support</SelectItem>
                              <SelectItem value="none">Main cohort only — I am not interested in the alternatives</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeSection === 8 && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle>Section 8: Financial Context</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-sm text-muted-foreground p-4 rounded-xl bg-muted/40 border border-border leading-relaxed">
                      {GUIDANCE_TEXT[8]}
                    </div>
                    <div className="space-y-2">
                      <Label className="block font-medium">Monthly household income range</Label>
                      <Select
                        disabled={!editable}
                        value={data.monthlyIncomeRange}
                        onValueChange={(val) =>
                          setField("monthlyIncomeRange", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select income range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="below_50k">Below 50,000 FCFA</SelectItem>
                          <SelectItem value="50k_to_100k">50,000 to 100,000 FCFA</SelectItem>
                          <SelectItem value="100k_to_200k">100,000 to 200,000 FCFA</SelectItem>
                          <SelectItem value="200k_to_400k">200,000 to 400,000 FCFA</SelectItem>
                          <SelectItem value="400k_to_800k">400,000 to 800,000 FCFA</SelectItem>
                          <SelectItem value="800k_to_1_5m">800,000 to 1,500,000 FCFA</SelectItem>
                          <SelectItem value="1_5m_plus">1,500,000+ FCFA</SelectItem>
                          <SelectItem value="unknown">I do not know</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="block font-medium">
                        Do you currently work to support yourself or your family?
                      </Label>
                      <Select
                        disabled={!editable}
                        value={data.worksToSupportFamily}
                        onValueChange={(val) =>
                          setField("worksToSupportFamily", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.worksToSupportFamily === "yes" && (
                      <div className="space-y-2">
                        <Label className="block font-medium">Describe your work (max 100 words)</Label>
                        <Textarea
                          disabled={!editable}
                          value={data.workSupportDetails}
                          onChange={(e) =>
                            setField("workSupportDetails", e.target.value)
                          }
                          className="min-h-[100px]"
                        />
                        <p className="text-xs text-muted-foreground">
                          {words(data.workSupportDetails)} / 100 words
                        </p>
                      </div>
                    )}
                    <div className="space-y-3">
                      <Label className="block font-medium leading-relaxed">
                        The KC GSP has a full-package cost of 500,000 FCFA, distributed between your
                        SAT exam registration, exam prep, and programme tuition. We normally charge
                        1.6 million XAF ($2,900) for international students. Would the 500,000 XAF
                        cut-down price cause a significant challenge for your family?
                      </Label>
                      <Select
                        disabled={!editable}
                        value={data.costChallenge}
                        onValueChange={(val) => setField("costChallenge", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
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
                  <CardHeader>
                    <CardTitle>
                      Section 9: Financial Aid Application (Optional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-sm text-muted-foreground p-4 rounded-xl bg-muted/40 border border-border leading-relaxed">
                      {GUIDANCE_TEXT[9]}
                    </div>
                    <div className="space-y-2">
                      <Label className="block font-medium">
                        Are you applying for the KC GSP Financial Aid?
                      </Label>
                      <Select
                        disabled={!editable}
                        value={data.applyingScholarship}
                        onValueChange={(val) =>
                          setField("applyingScholarship", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes — I want to apply for the aid</SelectItem>
                          <SelectItem value="no">No — I am applying to the programme only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {data.applyingScholarship === "yes" && (
                      <div className="space-y-3">
                        <Label className="block font-medium">Financial aid application essay</Label>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Tell us: what does accessing this programme and a university education abroad
                          actually mean for your life and for the people around you? What will you do
                          with it that could not happen without it? Also ensure to state specifically
                          how much of the programme cost your family can cover.
                        </p>
                        <ReactQuill
                          theme="snow"
                          value={data.scholarshipEssay}
                          onChange={(content) =>
                            setField("scholarshipEssay", content)
                          }
                          readOnly={!editable}
                          modules={
                            editable
                              ? EDITABLE_QUILL_MODULES
                              : QUIET_QUILL_MODULES
                          }
                          className="min-h-[200px] mb-4"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeSection === 10 && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle>Section 10: Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {GUIDANCE_TEXT[10]}
                    </div>
                    <div>
                      <Label>Most recent report card (required)</Label>
                      <Input
                        disabled={!editable}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) =>
                          uploadDocument("reportCard", e.target.files?.[0])
                        }
                      />
                      {data.documents?.reportCard?.url && (
                        <p className="text-xs text-emerald-600 mt-1">
                          Uploaded
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Ordinary Level Slip (required)</Label>
                      <Input
                        disabled={!editable}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) =>
                          uploadDocument("olSlip", e.target.files?.[0])
                        }
                      />
                      {data.documents?.olSlip?.url && (
                        <p className="text-xs text-emerald-600 mt-1">
                          Uploaded
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Advanced Level Slip (if applicable)</Label>
                      <Input
                        disabled={!editable}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) =>
                          uploadDocument("alSlip", e.target.files?.[0])
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 11 && (
                <Card className="rounded-3xl border-kc-blue/20">
                  <CardHeader>
                    <CardTitle>Review and Submit</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {GUIDANCE_TEXT[11]}
                    </div>
                    <label className="flex gap-2 items-start text-sm">
                      <input
                        disabled={!editable}
                        type="checkbox"
                        checked={data.declarationConfirmed}
                        onChange={(e) =>
                          setField("declarationConfirmed", e.target.checked)
                        }
                      />
                      <span>
                        I confirm that all information in this application is
                        accurate and my own. I understand that providing false
                        information may result in my application being
                        disqualified.
                      </span>
                    </label>
                    <div className="flex flex-wrap justify-between gap-3">
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          goToSection(10);
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="blue"
                        className="rounded-full"
                        onClick={onSubmit}
                        disabled={submitting}
                      >
                        {submitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      I confirm the above declaration and I am ready to submit
                      my application.
                    </p>
                  </CardContent>
                </Card>
              )}

              {activeSection !== 11 && (
                <div className="flex justify-end pt-4">
                  <Button
                    variant="blue"
                    className="rounded-full px-8"
                    onClick={async () => {
                      const next = computeSectionState(data);
                      const missing =
                        activeSection === 0
                          ? []
                          : getMissingFields(activeSection);
                      try {
                        const res = await saveGspDraft(data, next, data.r_id);
                        if (res?.application?.r_id && !data.r_id) {
                          setData((prev: any) => ({
                            ...prev,
                            r_id: res.application.r_id,
                          }));
                        }
                        if (missing.length) {
                          toast({
                            title: "Draft saved",
                            description: `This section still needs: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? "..." : ""}`,
                          });
                        }
                      } catch (error: any) {
                        toast({
                          title: "Save failed",
                          description:
                            error?.message ||
                            "Could not save draft. Please try again.",
                          variant: "destructive" as any,
                        });
                        return;
                      }

                      const currentIndex = GSP_SECTIONS.indexOf(activeSection);
                      if (currentIndex < GSP_SECTIONS.length - 1) {
                        goToSection(GSP_SECTIONS[currentIndex + 1]);
                      }
                    }}
                  >
                    {activeSection === 0
                      ? "Begin Application"
                      : "Save & Continue"}
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
