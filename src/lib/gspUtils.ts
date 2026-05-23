export function words(v: string) {
  if (!v) return 0;
  const text = v.replace(/<[^>]*>/g, '');
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

export function getDocumentUrl(document: unknown): string {
  if (!document) return "";
  if (typeof document === "string") return document;
  const record = asRecord(document);
  const url = record?.url || record?.file || record?.path;
  return typeof url === "string" ? url : "";
}

export function hasUploadedDocument(source: unknown, field: string): boolean {
  const sourceRecord = asRecord(source);
  const documentsRecord = asRecord(sourceRecord?.documents);
  return Boolean(
    getDocumentUrl(documentsRecord?.[field]) ||
      getDocumentUrl(sourceRecord?.[field])
  );
}

function hasPhoneContact(source: any): boolean {
  const phone = String(source?.phone || "").trim();
  const phoneNumber = String(
    source?.phoneNumber || source?.phone_number || source?.phone_number_display || "",
  ).trim();

  return Boolean(phone || phoneNumber);
}

export const GSP_PROGRESS_KEYS = [
  "section1",
  "section2",
  "section3",
  "section4",
  "section5",
  "section6",
  "section7",
  "section8",
  "section9",
  "review",
] as const;

export function computeSectionState(source: any): Record<string, boolean> {
  if (!source) return {};
  const hasPhone = hasPhoneContact(source);
  
  const st: Record<string, boolean> = {
    section1: Boolean(source.firstName && source.lastName && source.dob && hasPhone && source.email && source.gender && source.nationality && source.city && source.region),
    section2: Boolean(source.householdSize && source.primaryGuardianOccupation && source.highestFamilyEducation && source.familyStudiedAbroad && (source.familyStudiedAbroad !== "yes" || source.familyAbroadDetails)),
    section3: Boolean(
      source.schoolName &&
        source.schoolCity &&
        source.schoolRegion &&
        source.currentClass &&
        source.intendedFieldWhy &&
        (source.currentClass !== "lower_sixth" || source.lowerSixthAlternatives),
    ),
    section4:
      words(source.communityEssay) >= 75 && words(source.communityEssay) <= 225,
    section5:
      Array.isArray(source.activities) &&
      source.activities.length >= 1 &&
      source.activities.every(
        (a: any) =>
          a.title &&
          a.roleDescription &&
          a.duration &&
          a.hoursPerWeek &&
          a.weeksPerYear &&
          a.isStillDoing &&
          (a.isStillDoing !== "no" || a.stoppedIn),
      ),
    section6: Boolean(
      source.housingOption &&
        source.participationConstraint &&
        (source.housingOption !== "B" ||
          (source.housingContactRelation && source.housingContactAware)) &&
        (source.housingOption !== "C" || source.canCoverHousingCost) &&
        (source.participationConstraint !== "yes" ||
          source.participationConstraintExplain),
    ),
    section7: Boolean(
      source.monthlyIncomeRange &&
        source.worksToSupportFamily &&
        (source.worksToSupportFamily !== "yes" || source.workSupportDetails) &&
        source.costChallenge,
    ),
    section8: Boolean(
      source.applyingScholarship &&
        (source.applyingScholarship !== "yes" || source.scholarshipEssay),
    ),
    section9:
      hasUploadedDocument(source, "reportCard") &&
      hasUploadedDocument(source, "olSlip"),
    review: Boolean(source.declarationConfirmed),
  };
  
  if (Array.isArray(source.topSubjects) && source.topSubjects.length === 5) {
    st.section3 = st.section3 && source.topSubjects.every((s: any) => s.name && s.score && s.examTerm);
  } else {
    st.section3 = false;
  }
  
  return st;
}

export function computeProgressPct(sectionState: Record<string, boolean>): number {
  if (!sectionState) return 0;
  const done = GSP_PROGRESS_KEYS.filter((key) => Boolean(sectionState[key])).length;
  return Math.round((done / GSP_PROGRESS_KEYS.length) * 100);
}

export function getPersistedSectionState(source: any): Record<string, boolean> | null {
  if (!source) return null;

  const candidates = [
    source.sectionState,
    source.section_state,
    source.data?.sectionState,
    source.data?.section_state,
  ];

  const persisted = candidates.find((value) => value && typeof value === "object");
  return persisted ? (persisted as Record<string, boolean>) : null;
}
