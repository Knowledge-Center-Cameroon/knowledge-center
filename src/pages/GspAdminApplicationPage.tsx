import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Download, ExternalLink, FileText, Mail, Phone, UserRound } from "lucide-react";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useGspAuth } from "@/contexts/GspAuthContext";
import { getDocumentUrl } from "@/lib/gspUtils";
import { adminGetApplication } from "@/services/gspApi";

type FieldSpec = {
  key: string;
  label: string;
  aliases?: string[];
  multiline?: boolean;
  wide?: boolean;
};

type PdfContext = {
  doc: PDFDocument;
  page: PDFPage;
  fonts: {
    regular: PDFFont;
    bold: PDFFont;
  };
  y: number;
};

const FORM_SECTIONS: Array<{ title: string; fields: FieldSpec[] }> = [
  {
    title: "Personal Information",
    fields: [
      { key: "firstName", label: "First name", aliases: ["first_name"] },
      { key: "lastName", label: "Last name", aliases: ["last_name"] },
      { key: "dob", label: "Date of birth", aliases: ["dateOfBirth", "date_of_birth"] },
      { key: "gender", label: "Gender" },
      { key: "nationality", label: "Nationality" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "Phone number", aliases: ["phone_number", "phone"] },
      { key: "isPhoneOnWhatsApp", label: "Phone is on WhatsApp", aliases: ["is_phone_on_whatsapp", "phoneOnWhatsApp"] },
      { key: "alternateWhatsApp", label: "Alternate WhatsApp", aliases: ["alternate_whatsapp"] },
      { key: "city", label: "City" },
      { key: "region", label: "Region" },
    ],
  },
  {
    title: "Family Background",
    fields: [
      { key: "householdSize", label: "Household size", aliases: ["household_size"] },
      { key: "primaryGuardianOccupation", label: "Primary guardian occupation", aliases: ["primary_guardian_occupation"] },
      { key: "secondaryGuardianOccupation", label: "Secondary guardian occupation", aliases: ["secondary_guardian_occupation", "secondGuardianOccupation"] },
      { key: "highestFamilyEducation", label: "Highest family education", aliases: ["highest_family_education"] },
      { key: "familyStudiedAbroad", label: "Family studied abroad", aliases: ["family_studied_abroad"] },
      { key: "familyAbroadDetails", label: "Family abroad details", aliases: ["family_abroad_details"], multiline: true, wide: true },
    ],
  },
  {
    title: "Academic Background",
    fields: [
      { key: "schoolName", label: "School name", aliases: ["school_name"] },
      { key: "schoolCity", label: "School city", aliases: ["school_city"] },
      { key: "schoolRegion", label: "School region", aliases: ["school_region"] },
      { key: "currentClass", label: "Current class", aliases: ["current_class"] },
      { key: "lowerSixthAlternatives", label: "Lower Sixth pathway alternatives", aliases: ["lower_sixth_alternatives"], wide: true },
      { key: "intendedFieldWhy", label: "Intended field and why", aliases: ["intended_field_why"], multiline: true, wide: true },
    ],
  },
  {
    title: "Short Answer",
    fields: [
      { key: "communityEssay", label: "Community essay", aliases: ["community_essay"], multiline: true, wide: true },
    ],
  },
  {
    title: "Logistics & Programme Fit",
    fields: [
      { key: "housingOption", label: "Housing option", aliases: ["housing_option"], wide: true },
      { key: "housingContactRelation", label: "Housing contact relation", aliases: ["housing_contact_relation"] },
      { key: "housingContactAware", label: "Housing contact aware", aliases: ["housing_contact_aware"] },
      { key: "canCoverHousingCost", label: "Can cover housing cost", aliases: ["can_cover_housing_cost"] },
      { key: "participationConstraint", label: "Participation constraint", aliases: ["participation_constraint"] },
      { key: "participationConstraintExplain", label: "Participation constraint explanation", aliases: ["participation_constraint_explain"], multiline: true, wide: true },
    ],
  },
  {
    title: "Financial Context",
    fields: [
      { key: "monthlyIncomeRange", label: "Monthly household income range", aliases: ["monthly_income_range"] },
      { key: "worksToSupportFamily", label: "Works to support family", aliases: ["works_to_support_family"] },
      { key: "workSupportDetails", label: "Work support details", aliases: ["work_support_details"], multiline: true, wide: true },
      { key: "costChallenge", label: "Cost challenge", aliases: ["cost_challenge"] },
      { key: "applyingScholarship", label: "Applying for scholarship", aliases: ["applying_scholarship"] },
      { key: "scholarshipEssay", label: "Financial aid application essay", aliases: ["scholarship_essay"], multiline: true, wide: true },
    ],
  },
  {
    title: "Declaration",
    fields: [
      { key: "declarationConfirmed", label: "Declaration confirmed", aliases: ["declaration_confirmed"] },
    ],
  },
];

const DOCUMENT_FIELDS = [
  { key: "reportCard", label: "Report Card", aliases: ["report_card", "reportcard"] },
  { key: "olSlip", label: "O-Level Slip", aliases: ["ol_slip", "oLevelSlip", "olevel_slip"] },
  { key: "alSlip", label: "A-Level Slip", aliases: ["al_slip", "aLevelSlip", "alevel_slip"] },
];

const PAYLOAD_KEYS = [
  "application",
  "registration",
  "gspRegistration",
  "gsp_registration",
  "submission",
  "record",
  "form",
  "payload",
  "answers",
  "fields",
  "data",
];

function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function collectPayloadRecords(source: any, depth = 0): Record<string, any>[] {
  if (!isRecord(source) || depth > 5) return [];

  const records: Record<string, any>[] = [source];

  for (const key of PAYLOAD_KEYS) {
    if (isRecord(source[key])) {
      records.push(...collectPayloadRecords(source[key], depth + 1));
    }
  }

  return records;
}

function mergeApplicationData(application: any) {
  return Object.assign({}, ...collectPayloadRecords(application));
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatValue(value: any) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return stripHtml(value).replace(/_/g, " ");
  return String(value).replace(/_/g, " ");
}

function readValue(data: Record<string, any>, field: FieldSpec) {
  const keys = [field.key, ...(field.aliases || [])];
  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      return data[key];
    }
  }
  return "";
}

function ReadOnlyField({ field, data }: { field: FieldSpec; data: Record<string, any> }) {
  const value = formatValue(readValue(data, field));
  const className = field.wide || field.multiline ? "md:col-span-2" : "";

  return (
    <div className={className}>
      <Label className="mb-2 block text-sm font-medium text-slate-700">{field.label}</Label>
      {field.multiline ? (
        <Textarea
          readOnly
          value={value}
          className="min-h-32 resize-y rounded-xl border-slate-200 bg-slate-50 text-slate-900"
          placeholder="Not provided"
        />
      ) : (
        <Input
          readOnly
          value={value}
          className="rounded-xl border-slate-200 bg-slate-50 text-slate-900"
          placeholder="Not provided"
        />
      )}
    </div>
  );
}

function FormSection({ title, fields, data }: { title: string; fields: FieldSpec[]; data: Record<string, any> }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <ReadOnlyField key={field.key} field={field} data={data} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TopSubjectsSection({ subjects }: { subjects: any[] }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Top Subjects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-slate-600">
                <th className="px-4 py-3 font-semibold">Subject</th>
                <th className="px-4 py-3 font-semibold">Score</th>
                <th className="px-4 py-3 font-semibold">Exam / Term</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {Array.from({ length: Math.max(subjects?.length || 0, 5) }).map((_, index) => {
                const subject = subjects?.[index] || {};
                return (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <Input readOnly value={formatValue(subject.name)} className="rounded-lg bg-slate-50" placeholder="Not provided" />
                    </td>
                    <td className="px-4 py-3">
                      <Input readOnly value={formatValue(subject.score)} className="rounded-lg bg-slate-50" placeholder="Not provided" />
                    </td>
                    <td className="px-4 py-3">
                      <Input readOnly value={formatValue(subject.examTerm || subject.exam_term)} className="rounded-lg bg-slate-50" placeholder="Not provided" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivitiesSection({ activities }: { activities: any[] }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {(activities?.length ? activities : [{}]).map((activity, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-4 font-semibold text-slate-900">Activity {index + 1}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <ReadOnlyField field={{ key: "title", label: "Activity title" }} data={activity || {}} />
              <ReadOnlyField field={{ key: "duration", label: "Duration" }} data={activity || {}} />
              <ReadOnlyField field={{ key: "hoursPerWeek", label: "Hours per week", aliases: ["hours_per_week"] }} data={activity || {}} />
              <ReadOnlyField field={{ key: "weeksPerYear", label: "Weeks per year", aliases: ["weeks_per_year"] }} data={activity || {}} />
              <ReadOnlyField field={{ key: "isStillDoing", label: "Still doing this?", aliases: ["is_still_doing"], }} data={activity || {}} />
              <ReadOnlyField field={{ key: "stoppedIn", label: "Stopped in", aliases: ["stopped_in"] }} data={activity || {}} />
              <ReadOnlyField field={{ key: "roleDescription", label: "Role description", aliases: ["role_description"], multiline: true, wide: true }} data={activity || {}} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function getDocumentSource(application: any, data: Record<string, any>, field: { key: string; aliases: string[] }) {
  const payloadRecords = collectPayloadRecords(application);
  const documentRecords = payloadRecords
    .map((record) => record.documents)
    .filter(isRecord);
  const keys = [field.key, ...field.aliases];

  for (const documents of documentRecords) {
    for (const key of keys) {
      const source = documents[key];
      const url = getDocumentUrl(source);
      if (url) return { source, url };
    }
  }

  for (const key of keys) {
    const source = data[key];
    const url = getDocumentUrl(source);
    if (url) return { source, url };
  }
  return { source: null, url: "" };
}

function getDocumentKind(source: any, url: string) {
  const format = String(source?.format || source?.resource_type || "").toLowerCase();
  const cleanUrl = url.split("?")[0].toLowerCase();
  if (format.includes("pdf") || cleanUrl.endsWith(".pdf")) return "pdf";
  if (["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg"].some((ext) => format.includes(ext) || cleanUrl.endsWith(`.${ext}`))) return "image";
  return "iframe";
}

function DocumentPreview({ label, source, url }: { label: string; source: any; url: string }) {
  const kind = getDocumentKind(source, url);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <FileText className="h-4 w-4 text-kc-blue" />
          {label}
        </div>
        {url && (
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <a href={url} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                Open
              </a>
            </Button>
            <Button asChild size="sm" variant="ghost" className="rounded-full">
              <a href={url} download>
                <Download className="mr-2 h-3.5 w-3.5" />
                Download
              </a>
            </Button>
          </div>
        )}
      </div>
      {url ? (
        kind === "image" ? (
          <div className="bg-slate-100 p-3">
            <img src={url} alt={label} className="mx-auto max-h-[760px] w-auto max-w-full rounded-lg object-contain shadow-sm" />
          </div>
        ) : (
          <iframe title={label} src={url} className="h-[760px] w-full bg-white" />
        )
      ) : (
        <div className="p-8 text-center text-sm text-slate-400">Not uploaded</div>
      )}
    </div>
  );
}

function DocumentsSection({ application, data }: { application: any; data: Record<string, any> }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Uploaded Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {DOCUMENT_FIELDS.map((field) => {
          const document = getDocumentSource(application, data, field);
          return <DocumentPreview key={field.key} label={field.label} source={document.source} url={document.url} />;
        })}
      </CardContent>
    </Card>
  );
}

const PDF_PAGE = {
  width: 595.28,
  height: 841.89,
  margin: 38,
  gap: 12,
};

const PDF_COLORS = {
  ink: rgb(0.09, 0.13, 0.2),
  muted: rgb(0.39, 0.45, 0.55),
  border: rgb(0.82, 0.86, 0.91),
  surface: rgb(0.97, 0.98, 0.99),
  brand: rgb(0.05, 0.27, 0.63),
  brandSoft: rgb(0.91, 0.95, 1),
  white: rgb(1, 1, 1),
};

function buildPdfFilename(name: string, reference: string) {
  const safeName = (name || "applicant")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const safeReference = (reference || "application")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `gsp-${safeName || "applicant"}-${safeReference || "application"}.pdf`;
}

function wrapPdfText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const normalized = formatValue(text) || "Not provided";
  const lines: string[] = [];

  for (const paragraph of normalized.split(/\n+/)) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = "";

    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= maxWidth) {
        line = next;
      } else {
        if (line) lines.push(line);
        line = word;
      }
    }

    lines.push(line || " ");
  }

  return lines;
}

function ensurePdfSpace(ctx: PdfContext, neededHeight: number) {
  if (ctx.y - neededHeight >= PDF_PAGE.margin) return;
  ctx.page = ctx.doc.addPage([PDF_PAGE.width, PDF_PAGE.height]);
  ctx.y = PDF_PAGE.height - PDF_PAGE.margin;
}

function drawRoundedRect(page: PDFPage, x: number, y: number, width: number, height: number, fill = PDF_COLORS.white) {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: fill,
    borderColor: PDF_COLORS.border,
    borderWidth: 0.8,
  });
}

function getPdfFieldHeight(ctx: PdfContext, field: FieldSpec, value: any, width: number) {
  const text = formatValue(value) || "Not provided";
  const labelSize = 8.5;
  const textSize = 10;
  const lines = wrapPdfText(text, ctx.fonts.regular, textSize, width - 18);
  const visibleLines = field.multiline ? lines : lines.slice(0, 2);
  const lineHeight = 13;
  const boxHeight = Math.max(field.multiline ? 72 : 36, 18 + visibleLines.length * lineHeight);
  return labelSize + 8 + boxHeight;
}

function drawPdfField(ctx: PdfContext, field: FieldSpec, data: Record<string, any>, x: number, y: number, width: number) {
  const value = readValue(data, field);
  const text = formatValue(value) || "Not provided";
  const labelSize = 8.5;
  const textSize = 10;
  const lines = wrapPdfText(text, ctx.fonts.regular, textSize, width - 18);
  const visibleLines = field.multiline ? lines : lines.slice(0, 2);
  const lineHeight = 13;
  const boxHeight = Math.max(field.multiline ? 72 : 36, 18 + visibleLines.length * lineHeight);

  ctx.page.drawText(field.label, {
    x,
    y: y - labelSize,
    size: labelSize,
    font: ctx.fonts.bold,
    color: PDF_COLORS.muted,
  });

  drawRoundedRect(ctx.page, x, y - labelSize - 8 - boxHeight, width, boxHeight, PDF_COLORS.surface);

  visibleLines.forEach((line, index) => {
    ctx.page.drawText(line, {
      x: x + 9,
      y: y - labelSize - 22 - index * lineHeight,
      size: textSize,
      font: ctx.fonts.regular,
      color: text ? PDF_COLORS.ink : PDF_COLORS.muted,
    });
  });

  return labelSize + 8 + boxHeight;
}

function drawPdfSection(ctx: PdfContext, title: string, fields: FieldSpec[], data: Record<string, any>) {
  ensurePdfSpace(ctx, 72);
  ctx.page.drawText(title, {
    x: PDF_PAGE.margin,
    y: ctx.y,
    size: 15,
    font: ctx.fonts.bold,
    color: PDF_COLORS.ink,
  });
  ctx.y -= 24;

  const contentWidth = PDF_PAGE.width - PDF_PAGE.margin * 2;
  const columnWidth = (contentWidth - PDF_PAGE.gap) / 2;
  let pending: FieldSpec[] = [];

  const flushPending = () => {
    while (pending.length) {
      const row = pending.splice(0, 2);
      const rowHeight = Math.max(
        ...row.map((field) => getPdfFieldHeight(ctx, field, readValue(data, field), columnWidth)),
      );
      ensurePdfSpace(ctx, rowHeight + 14);
      const heights = row.map((field, index) => {
        const x = PDF_PAGE.margin + index * (columnWidth + PDF_PAGE.gap);
        return drawPdfField(ctx, field, data, x, ctx.y, columnWidth);
      });
      ctx.y -= Math.max(...heights) + 14;
    }
  };

  for (const field of fields) {
    if (field.wide || field.multiline) {
      flushPending();
      const fieldHeight = getPdfFieldHeight(ctx, field, readValue(data, field), contentWidth);
      ensurePdfSpace(ctx, fieldHeight + 14);
      const usedHeight = drawPdfField(ctx, field, data, PDF_PAGE.margin, ctx.y, contentWidth);
      ctx.y -= usedHeight + 14;
      continue;
    }

    if (pending.length === 0) ensurePdfSpace(ctx, 64);
    pending.push(field);
    if (pending.length === 2) flushPending();
  }

  flushPending();
  ctx.y -= 6;
}

function drawPdfSubjects(ctx: PdfContext, subjects: any[]) {
  const rows = Array.from({ length: Math.max(subjects?.length || 0, 5) }).map((_, index) => subjects?.[index] || {});
  drawPdfSection(
    ctx,
    "Top Subjects",
    rows.flatMap((subject, index) => [
      { key: `subject-${index}-name`, label: `Subject ${index + 1}` },
      { key: `subject-${index}-score`, label: "Score" },
      { key: `subject-${index}-term`, label: "Exam / Term", wide: true },
    ]),
    rows.reduce((acc, subject, index) => {
      acc[`subject-${index}-name`] = subject.name;
      acc[`subject-${index}-score`] = subject.score;
      acc[`subject-${index}-term`] = subject.examTerm || subject.exam_term;
      return acc;
    }, {} as Record<string, any>),
  );
}

function drawPdfActivities(ctx: PdfContext, activities: any[]) {
  const rows = activities?.length ? activities : [{}];
  rows.forEach((activity, index) => {
    drawPdfSection(
      ctx,
      `Activity ${index + 1}`,
      [
        { key: "title", label: "Activity title" },
        { key: "duration", label: "Duration" },
        { key: "hoursPerWeek", label: "Hours per week", aliases: ["hours_per_week"] },
        { key: "weeksPerYear", label: "Weeks per year", aliases: ["weeks_per_year"] },
        { key: "isStillDoing", label: "Still doing this?", aliases: ["is_still_doing"] },
        { key: "stoppedIn", label: "Stopped in", aliases: ["stopped_in"] },
        { key: "roleDescription", label: "Role description", aliases: ["role_description"], multiline: true, wide: true },
      ],
      activity || {},
    );
  });
}

function addPdfHeader(ctx: PdfContext, applicantName: string, reference: string, status: string, decision: string, email: string, phone: string, submittedAt: string) {
  ctx.page.drawRectangle({
    x: 0,
    y: PDF_PAGE.height - 122,
    width: PDF_PAGE.width,
    height: 122,
    color: PDF_COLORS.brandSoft,
  });
  ctx.page.drawText("KC Global Scholars Programme", {
    x: PDF_PAGE.margin,
    y: PDF_PAGE.height - 48,
    size: 12,
    font: ctx.fonts.bold,
    color: PDF_COLORS.brand,
  });
  ctx.page.drawText(applicantName, {
    x: PDF_PAGE.margin,
    y: PDF_PAGE.height - 76,
    size: 24,
    font: ctx.fonts.bold,
    color: PDF_COLORS.ink,
  });

  const meta = [
    `Ref: ${reference}`,
    `Status: ${status}`,
    `Decision: ${decision}`,
    email,
    phone,
    submittedAt ? `Submitted: ${new Date(submittedAt).toLocaleString()}` : "",
  ].filter(Boolean);

  ctx.page.drawText(meta.join("   |   "), {
    x: PDF_PAGE.margin,
    y: PDF_PAGE.height - 102,
    size: 8.5,
    font: ctx.fonts.regular,
    color: PDF_COLORS.muted,
  });
  ctx.y = PDF_PAGE.height - 152;
}

async function fetchDocumentBytes(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not fetch ${url}`);
  return new Uint8Array(await response.arrayBuffer());
}

async function appendDocumentToPdf(doc: PDFDocument, document: { label: string; source: any; url: string }) {
  if (!document.url) return;

  const bytes = await fetchDocumentBytes(document.url);
  const kind = getDocumentKind(document.source, document.url);

  if (kind === "pdf") {
    const uploadedPdf = await PDFDocument.load(bytes);
    const pages = await doc.copyPages(uploadedPdf, uploadedPdf.getPageIndices());
    pages.forEach((page) => doc.addPage(page));
    return;
  }

  let image;
  const cleanUrl = document.url.split("?")[0].toLowerCase();
  const format = String(document.source?.format || "").toLowerCase();
  if (format.includes("png") || cleanUrl.endsWith(".png")) {
    image = await doc.embedPng(bytes);
  } else {
    image = await doc.embedJpg(bytes);
  }

  const page = doc.addPage([PDF_PAGE.width, PDF_PAGE.height]);
  page.drawText(document.label, {
    x: PDF_PAGE.margin,
    y: PDF_PAGE.height - PDF_PAGE.margin,
    size: 14,
    font: await doc.embedFont(StandardFonts.HelveticaBold),
    color: PDF_COLORS.ink,
  });

  const maxWidth = PDF_PAGE.width - PDF_PAGE.margin * 2;
  const maxHeight = PDF_PAGE.height - PDF_PAGE.margin * 2 - 34;
  const scaled = image.scale(Math.min(maxWidth / image.width, maxHeight / image.height, 1));
  page.drawImage(image, {
    x: (PDF_PAGE.width - scaled.width) / 2,
    y: PDF_PAGE.margin,
    width: scaled.width,
    height: scaled.height,
  });
}

async function generateApplicationPdf({
  application,
  data,
  applicantName,
  applicantEmail,
  applicationReference,
  submittedAt,
}: {
  application: any;
  data: Record<string, any>;
  applicantName: string;
  applicantEmail: string;
  applicationReference: string;
  submittedAt: string;
}) {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([PDF_PAGE.width, PDF_PAGE.height]);
  const ctx: PdfContext = {
    doc,
    page,
    fonts: { regular, bold },
    y: PDF_PAGE.height - PDF_PAGE.margin,
  };

  addPdfHeader(
    ctx,
    applicantName,
    applicationReference,
    formatValue(application?.status || data.status || "draft"),
    formatValue(application?.decisionStatus || data.decisionStatus || "pending"),
    applicantEmail,
    formatValue(data.phoneNumber || data.phone),
    submittedAt,
  );

  FORM_SECTIONS.forEach((section) => {
    drawPdfSection(ctx, section.title, section.fields, data);
  });
  drawPdfSubjects(ctx, data.topSubjects || data.top_subjects || []);
  drawPdfActivities(ctx, data.activities || []);

  const documents = DOCUMENT_FIELDS.map((field) => {
    const document = getDocumentSource(application, data, field);
    return { ...document, label: field.label };
  }).filter((document) => document.url);

  for (const document of documents) {
    try {
      await appendDocumentToPdf(doc, document);
    } catch {
      const fallbackPage = doc.addPage([PDF_PAGE.width, PDF_PAGE.height]);
      fallbackPage.drawText(`${document.label} could not be embedded.`, {
        x: PDF_PAGE.margin,
        y: PDF_PAGE.height - PDF_PAGE.margin,
        size: 14,
        font: bold,
        color: PDF_COLORS.ink,
      });
      fallbackPage.drawText(document.url, {
        x: PDF_PAGE.margin,
        y: PDF_PAGE.height - PDF_PAGE.margin - 24,
        size: 9,
        font: regular,
        color: PDF_COLORS.brand,
      });
    }
  }

  return doc.save();
}

function downloadBytes(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const GspAdminApplicationPage: React.FC = () => {
  const { id } = useParams();
  const { user, loading } = useGspAuth();
  const { toast } = useToast();
  const [application, setApplication] = React.useState<any>(null);
  const [fetching, setFetching] = React.useState(true);
  const [generatingPdf, setGeneratingPdf] = React.useState(false);

  React.useEffect(() => {
    if (!id || user?.role !== "admin") return;

    (async () => {
      setFetching(true);
      try {
        const resp = await adminGetApplication(id);
        setApplication(resp.application);
      } catch (error: any) {
        toast({
          title: "Application load failed",
          description: error.message || "Please return to the admin page and try again.",
          variant: "destructive" as any,
        });
      } finally {
        setFetching(false);
      }
    })();
  }, [id, toast, user?.role]);

  if (!loading && !user) return <Navigate to={`/auth?redirect=/gsp/admin/applications/${id || ""}`} replace />;
  if (!loading && user?.role !== "admin") return <Navigate to="/gsp/dashboard" replace />;

  const data = mergeApplicationData(application);
  const applicantName = application?.user?.name || [data.firstName, data.lastName].filter(Boolean).join(" ") || "Applicant";
  const applicantEmail = application?.user?.email || data.email || "";
  const submittedAt = application?.submittedAt || data.submittedAt || application?.createdAt || data.createdAt;
  const applicationReference = application?.reference || data.reference || "N/A";

  const downloadApplicationPdf = async () => {
    if (!application) return;
    setGeneratingPdf(true);
    try {
      const bytes = await generateApplicationPdf({
        application,
        data,
        applicantName,
        applicantEmail,
        applicationReference,
        submittedAt,
      });
      downloadBytes(bytes, buildPdfFilename(applicantName, applicationReference));
      toast({ title: "PDF generated", description: "The application PDF has been downloaded." });
    } catch (error: any) {
      toast({
        title: "PDF generation failed",
        description: error.message || "Please try again.",
        variant: "destructive" as any,
      });
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <section className="container mx-auto px-4 py-8 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/gsp/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Link>
          </Button>

          {fetching ? (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="space-y-4 p-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          ) : !application ? (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-8 text-center text-slate-500">Application not found.</CardContent>
            </Card>
          ) : (
            <>
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="rounded-full">Ref: {applicationReference}</Badge>
                        <Badge className="rounded-full">{formatValue(application.status || data.status || "draft")}</Badge>
                        <Badge variant="secondary" className="rounded-full">{formatValue(application.decisionStatus || data.decisionStatus || "pending")}</Badge>
                      </div>
                      <h1 className="mt-4 text-3xl font-heading font-bold text-slate-900">{applicantName}</h1>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                        {applicantEmail && (
                          <span className="inline-flex items-center gap-1.5">
                            <Mail className="h-4 w-4" />
                            {applicantEmail}
                          </span>
                        )}
                        {(data.phoneNumber || data.phone) && (
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="h-4 w-4" />
                            {data.phoneNumber || data.phone}
                          </span>
                        )}
                        {submittedAt && (
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(submittedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-kc-blue/10 text-kc-blue">
                      <UserRound className="h-7 w-7" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {FORM_SECTIONS.map((section) => (
                <FormSection key={section.title} title={section.title} fields={section.fields} data={data} />
              ))}
              <TopSubjectsSection subjects={data.topSubjects || data.top_subjects || []} />
              <ActivitiesSection activities={data.activities || []} />
              <DocumentsSection application={application} data={data} />
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">Download Application PDF</h2>
                    <p className="text-sm text-slate-500">
                      Generates a new PDF from the application data and appends uploaded documents as extra pages.
                    </p>
                  </div>
                  <Button onClick={downloadApplicationPdf} disabled={generatingPdf} className="rounded-full">
                    <Download className="mr-2 h-4 w-4" />
                    {generatingPdf ? "Generating..." : "Download PDF"}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default GspAdminApplicationPage;
