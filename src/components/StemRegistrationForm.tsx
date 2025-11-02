import React, { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { initiateStemPayment, type StemRegistrationPayload } from "@/services/api";
import { ArrowButton } from "@/components/arrowbtn";

const cmPhone = z
  .string()
  .regex(/^(\+237)?6\d{8}$/i, "Enter a valid Cameroonian mobile (e.g., 6XXXXXXXX)");

const minDOB = new Date(1900, 0, 1);
const maxDOB = new Date(2025, 11, 31);

const CM_REGIONS = [
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
] as const;

// helpers
const normalizePhone = (v: string) => v.replace(/\D/g, "");
const DRAFT_KEY = "kc_stem_form_draft";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  // student's own phone is optional
  phone: z.union([cmPhone, z.literal("")]).optional().default(""),
  guardianPhone: cmPhone,
  dob: z
    .date({ required_error: "Date of birth is required" })
    .refine((d) => d >= minDOB && d <= maxDOB, {
      message: "DOB must be between 1900 and 2025",
    }),
  gender: z.enum(["male", "female"], { required_error: "Select a gender" }),
  school: z.string().min(2, "School name is required"),
  schoolClass: z.string().min(1, "Current class is required"),
  region: z.enum(CM_REGIONS, { required_error: "Select your region" }),
  // goals/motivation is optional; if provided, enforce minimum length 10
  motivation: z.union([z.string().min(10, "Please tell us more (min 10 chars)"), z.literal("")]).optional().default(""),
  level: z.enum(["olevel", "alevel"], { required_error: "Select your level" }),
  subjects: z.array(z.enum(["math", "physics", "chemistry", "biology"]))
    .min(1, "Select at least one subject"),
  payerPhone: cmPhone,
  paymentScreenshot: z
    .any()
    .optional(),
});

export type StemRegistrationData = z.infer<typeof schema>;

const steps: Array<{ key: string; title: string; fields: (keyof StemRegistrationData)[] }> = [
  { key: "personal", title: "Personal Details", fields: ["fullName", "phone", "guardianPhone"] },
  { key: "profile", title: "Profile", fields: ["dob", "gender"] },
  { key: "school", title: "School", fields: ["school", "schoolClass", "region"] },
  { key: "motiv", title: "Your Goals", fields: ["motivation", "level"] },
  { key: "subjects", title: "Subjects", fields: ["subjects"] },
  { key: "payment", title: "Payment", fields: ["payerPhone", "paymentScreenshot"] },
];

type Props = {
  onSubmitted?: (data: StemRegistrationData) => void;
  initialValues?: Partial<StemRegistrationData>;
  mode?: "create" | "edit";
};

const StemRegistrationForm: React.FC<Props> = ({ onSubmitted, initialValues, mode = "create" }) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const form = useForm<StemRegistrationData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      guardianPhone: "",
      dob: undefined,
      gender: undefined as any,
      school: "",
      schoolClass: "",
      region: undefined as any,
      motivation: "",
      level: undefined as any,
      subjects: [],
      payerPhone: "",
      paymentScreenshot: undefined,
      ...(initialValues || {}),
    },
    mode: "onTouched",
  });

  // Autosave draft (debounced) and restore on mount
  const saveTimer = useRef<number | null>(null);
  useEffect(() => {
    const restore = () => {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw || initialValues) return;
      try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') throw new Error('bad_draft');
        // Only reset known fields; guard invalid date
        let dob: Date | undefined = undefined as unknown as Date;
        if (parsed.dob) {
          const d = new Date(parsed.dob);
          if (!isNaN(d.getTime())) dob = d;
        }
        form.reset({
          fullName: parsed.fullName || "",
          phone: parsed.phone || "",
          guardianPhone: parsed.guardianPhone || "",
          dob,
          gender: parsed.gender,
          school: parsed.school || "",
          schoolClass: parsed.schoolClass || "",
          region: parsed.region,
          motivation: parsed.motivation || "",
          level: parsed.level,
          subjects: parsed.subjects || [],
          payerPhone: parsed.payerPhone || "",
          paymentScreenshot: undefined,
        });
      } catch (e) {
        try { localStorage.removeItem(DRAFT_KEY); } catch {}
      }
    };
    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sub = form.watch((value) => {
      window.clearTimeout(saveTimer.current as any);
      saveTimer.current = window.setTimeout(() => {
        try {
          const toSave = {
            ...value,
            dob:
              value?.dob && value.dob instanceof Date && !isNaN((value.dob as Date).getTime())
                ? (value.dob as Date).toISOString()
                : undefined,
            paymentScreenshot: undefined,
          };
          localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
        } catch {}
      }, 400);
    });
    return () => {
      sub.unsubscribe?.();
      window.clearTimeout(saveTimer.current as any);
    };
  }, [form]);

  const [stepIndex, setStepIndex] = useState(0);
  const effectiveSteps = useMemo(() => {
    if (mode === "edit") {
      return steps.filter((s) => s.key !== "payment");
    }
    return steps;
  }, [mode]);
  const current = effectiveSteps[stepIndex];
  const isLast = stepIndex === effectiveSteps.length - 1;
  const progress = useMemo(() => Math.round(((stepIndex + 1) / effectiveSteps.length) * 100), [stepIndex, effectiveSteps.length]);
  const selectedSubjects = form.watch("subjects") || [];
  const subjectsCount = selectedSubjects.length;
  const subjectsAmount = subjectsCount === 4 ? 3000 : subjectsCount * 1000;
  const [paymentRef, setPaymentRef] = useState<string | null>(null);

  // Warn before unload if draft not submitted (must run after paymentRef is declared)
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const hasDraft = !!localStorage.getItem(DRAFT_KEY);
      if (hasDraft && !paymentRef) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [paymentRef]);

  const next = async () => {
    const valid = await form.trigger(current.fields as any, { shouldFocus: true });
    if (!valid) return;
    setStepIndex((s) => Math.min(s + 1, effectiveSteps.length - 1));
  };

  const prev = () => setStepIndex((s) => Math.max(s - 1, 0));

  // Final submit
  const onSubmit = async (data: StemRegistrationData) => {
    if (mode === "create") {
      if (!paymentRef) {
        toast({ title: "Payment not initiated", description: "Please tap Initiate Payment first.", variant: "destructive" as any });
        return;
      }
      // proceed
      onSubmitted?.(data);
      navigate("/stem/success", { state: { reference: paymentRef, amount: subjectsAmount } });
      form.reset();
      setStepIndex(0);
      setPaymentRef(null);
      // clear draft after successful flow
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
    } else {
      try {
        const key = "kc_stem_regs";
        const list = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(list) && list.length > 0) {
          // Update the last record by default (or you could match by a stored reference in initialValues if provided)
          const last = list[list.length - 1];
          const updated = {
            ...last,
            fullName: data.fullName,
            phone: data.phone,
            guardianPhone: data.guardianPhone,
            dobISO: data.dob?.toISOString?.(),
            gender: data.gender,
            school: data.school,
            schoolClass: data.schoolClass,
            region: data.region,
            motivation: data.motivation,
            level: data.level,
            subjects: data.subjects,
            payerPhone: data.payerPhone,
          };
          list[list.length - 1] = updated;
          localStorage.setItem(key, JSON.stringify(list));
          toast({ title: "Details updated", description: "Your registration details were saved." });
        }
      } catch {}
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-2 flex-1 rounded-full overflow-hidden bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200">
          <motion.div
            className="h-full bg-gradient-to-r from-kc-blue to-kc-red"
            initial={{ width: 0 }}
          Discard draft
        </Button>
      </div>

      <div className="bg-gradient-subtle rounded-2xl p-6 shadow-elegant">
        <h3 className="heading-3 mb-1">{current.title}</h3>
        <p className="text-sm text-muted-foreground mb-6">Step {stepIndex + 1} of {effectiveSteps.length}</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {current.key === "personal" && (
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Provide your full name as on your birth certificate*</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provide your Phone Number <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="6XXXXXXXX" inputMode="tel" {...field} onBlur={(e) => form.setValue("phone", normalizePhone(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guardianPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provide your Parent or guardian's Phone number</FormLabel>
                      <FormControl>
                        <Input placeholder="6XXXXXXXX" inputMode="tel" {...field} onBlur={(e) => form.setValue("guardianPhone", normalizePhone(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {current.key === "subjects" && (
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="subjects"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select your subjects</FormLabel>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          { key: "math", label: "Mathematics" },
                          { key: "physics", label: "Physics" },
                          { key: "chemistry", label: "Chemistry" },
                          { key: "biology", label: "Biology" },
                        ].map((s) => (
                          <div key={s.key} className="flex items-center gap-3 border rounded-xl px-4 py-3">
                            <Checkbox
                              checked={selectedSubjects?.includes(s.key as any)}
                              onCheckedChange={(v) => {
                                const set = new Set(selectedSubjects);
                                if (v) set.add(s.key as any);
                                else set.delete(s.key as any);
                                form.setValue("subjects", Array.from(set) as any, { shouldValidate: true });
                              }}
                            />
                            <span>{s.label}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Pricing: 1 subject = 1000 XAF, all 4 subjects = 3000 XAF.</p>
                      <div className="mt-2 font-medium">Amount: {subjectsAmount.toLocaleString()} XAF</div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {current.key === "profile" && (
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Your date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value && field.value instanceof Date && !isNaN(field.value.getTime())
                                ? format(field.value, "PPP")
                                : <span>Select date</span>
                              }
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value && field.value instanceof Date && !isNaN(field.value.getTime()) ? field.value : undefined}
                            onSelect={field.onChange}
                            captionLayout="dropdown-buttons"
                            fromYear={1900}
                            toYear={2025}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-2 gap-2"
                      >
                        <FormItem className="flex items-center gap-2 border rounded-md px-3 py-2">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="m-0">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-2 border rounded-md px-3 py-2">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="m-0">Female</FormLabel>
                        </FormItem>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {current.key === "school" && (
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>What is the name of your current school?</FormLabel>
                      <FormControl>
                        <Input placeholder="School name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="schoolClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your current class</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="form4">Form 4</SelectItem>
                          <SelectItem value="form5">Form 5</SelectItem>
                          <SelectItem value="lower-sixth">Lower Sixth</SelectItem>
                          <SelectItem value="upper-sixth">Upper Sixth</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your region in Cameroon</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CM_REGIONS.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {current.key === "motiv" && (
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="motivation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Now let's hear from you, future scientist. What are you hoping to gain or experience during the STEM competition? <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Share your goals and expectations" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select your level for the STEM</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="olevel">O Level</SelectItem>
                          <SelectItem value="alevel">A Level</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {current.key === "payment" && mode === "create" && (
              <div className="grid gap-4">
                <div className="text-sm text-muted-foreground">
                  Registration can be paid via MTN MoMo or Orange Money. We'll auto-detect the carrier from your number.
                </div>

                <FormField
                  control={form.control}
                  name="payerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile money number to pay from</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 6XXXXXXXX" inputMode="tel" {...field} onBlur={(e) => form.setValue("payerPhone", normalizePhone(e.target.value))} />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">
                        Carrier: {(() => {
                          const v = form.watch("payerPhone") || "";
                          const m = v.replace(/\D/g, "");
                          const prefix = m.slice(0, 3);
                          const carrier = /^(650|651|652|653|670|671|672|673|674|675|676|677|678|679)$/.test(prefix)
                            ? "MTN MoMo"
                            : /^(655|656|657|658|659|690|691|692|693|694|695|696|697|698|699)$/.test(prefix)
                            ? "Orange Money"
                            : v ? "Unknown" : "—";
                          return carrier;
                        })()}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-wrap gap-3 items-center">
                  <ArrowButton
                    text={submitting ? "Initiating…" : "Initiate Payment"}
                    bgPrimaryColor="#ffffff"
                    bgSecondaryColor="#e11d48"
                    textPrimaryColor="#e11d48"
                    textSecondaryColor="#ffffff"
                    className="rounded-full shadow-lg shadow-kc-red/30 animate-pulse hover:animate-none"
                    onClick={async () => {
                      if (submitting) return;
                      setSubmitting(true);
                      const allFields: (keyof StemRegistrationData)[] = [
                        "fullName","phone","guardianPhone","dob","gender","school","schoolClass","region","motivation","level","subjects","payerPhone"
                      ];
                      const valid = await form.trigger(allFields as any, { shouldFocus: true });
                      if (!valid) { setSubmitting(false); return; }
                      const payload: StemRegistrationPayload = {
                        fullName: form.getValues("fullName"),
                        phone: form.getValues("phone"),
                        guardianPhone: form.getValues("guardianPhone"),
                        dobISO: form.getValues("dob")?.toISOString,
                        gender: form.getValues("gender") as any,
                        school: form.getValues("school"),
                        schoolClass: form.getValues("schoolClass"),
                        motivation: form.getValues("motivation"),
                        level: form.getValues("level") as any,
                      } as StemRegistrationPayload;
                      try {
                        const resp = await initiateStemPayment(payload, subjectsAmount);
                        setPaymentRef(resp.reference);
                        toast({ title: "Payment initiated", description: `Ref: ${resp.reference} • Amount: ${subjectsAmount.toLocaleString()} XAF` });
                        // enrich saved record with extra fields for future edits
                        try {
                          const key = "kc_stem_regs";
                          const list = JSON.parse(localStorage.getItem(key) || "[]");
                          if (Array.isArray(list) && list.length > 0) {
                            const lastIdx = list.findIndex((x: any) => x.reference === resp.reference) ?? (list.length - 1);
                            const idx = lastIdx >= 0 ? lastIdx : (list.length - 1);
                            const existing = list[idx];
                            list[idx] = {
                              ...existing,
                              region: form.getValues("region"),
                              subjects: form.getValues("subjects"),
                              payerPhone: form.getValues("payerPhone"),
                            };
                            localStorage.setItem(key, JSON.stringify(list));
                          }
                        } catch {}
                      } catch (e) {
                        toast({ title: "Failed to initiate", description: "Please try again.", variant: "destructive" as any });
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  />
                  {paymentRef && (
                    <div className="text-sm text-muted-foreground">Ref: {paymentRef}</div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="paymentScreenshot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload payment screenshot (optional)</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button type="button" variant="ghost" onClick={prev} disabled={stepIndex === 0}>
                Back
              </Button>
              {!isLast ? (
                <Button type="button" onClick={next}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</span>
                  ) : (
                    "Submit"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default StemRegistrationForm;
