export function words(v: string) {
  if (!v) return 0;
  const text = v.replace(/<[^>]*>/g, '');
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function computeSectionState(source: any): Record<string, boolean> {
  if (!source) return {};
  
  const st: Record<string, boolean> = {
    section1: Boolean(source.firstName && source.lastName && source.dob && source.phoneCode && source.phone && source.email && source.gender && source.nationality && source.city && source.region),
    section2: Boolean(source.householdSize && source.primaryGuardianOccupation && source.highestFamilyEducation && source.familyStudiedAbroad && (source.familyStudiedAbroad !== "yes" || source.familyAbroadDetails)),
    section3: Boolean(source.schoolName && source.schoolCity && source.schoolRegion && source.currentClass && source.intendedFieldWhy),
    section4: words(source.communityEssay) >= 75 && words(source.communityEssay) <= 225,
    section5: Array.isArray(source.activities) && source.activities.length >= 1 && source.activities.every((a: any) => a.title && a.roleDescription && a.duration && a.hoursPerWeek && a.weeksPerYear && a.isStillDoing && (a.isStillDoing !== "no" || a.stoppedIn)),
    section6: Boolean(source.housingOption && source.participationConstraint && (source.housingOption !== "B" || (source.housingContactRelation && source.housingContactAware)) && (source.housingOption !== "C" || source.canCoverHousingCost) && (source.participationConstraint !== "yes" || source.participationConstraintExplain)),
    section8: Boolean(source.monthlyIncomeRange && source.worksToSupportFamily && (source.worksToSupportFamily !== "yes" || source.workSupportDetails) && source.costChallenge),
    section9: Boolean(source.applyingScholarship && (source.applyingScholarship !== "yes" || source.scholarshipEssay)),
    section10: Boolean(source.documents?.reportCard?.url && source.documents?.olSlip?.url),
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
  const total = Object.keys(sectionState).length || 10;
  const done = Object.values(sectionState).filter(Boolean).length;
  return Math.round((done / total) * 100);
}
