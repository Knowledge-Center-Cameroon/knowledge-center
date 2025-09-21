import React, { useMemo, useState } from "react";
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
  .regex(/^(\+237)?6\d{8}$/i, "Enter a valid Cameroonian mobile (e.g., +2376XXXXXXXX)");

const minDOB = new Date(2000, 0, 1);
const maxDOB = new Date(2015, 11, 31);

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: cmPhone,
  guardianPhone: cmPhone,
  dob: z
    .date({ required_error: "Date of birth is required" })
    .refine((d) => d >= minDOB && d <= maxDOB, {
      message: "DOB must be between 2000 and 2015",
    }),
  gender: z.enum(["male", "female"], { required_error: "Select a gender" }),
  school: z.string().min(2, "School name is required"),
  schoolClass: z.string().min(1, "Current class is required"),
  motivation: z.string().min(10, "Please tell us more (min 10 chars)"),
  level: z.enum(["olevel", "alevel"], { required_error: "Select your level" }),
  paymentMethod: z.enum(["mtn", "orange"], { required_error: "Select a payment method" }),
  subjects: z.array(z.enum(["math", "physics", "chemistry", "biology"])).min(1, "Select at least one subject"),
  payerPhone: cmPhone,
  paymentScreenshot: z
    .any()
    .refine((f) => !!f && typeof f === 'object', { message: "Payment screenshot is required" }),
});

export type StemRegistrationData = z.infer<typeof schema>;

const steps: Array<{ key: string; title: string; fields: (keyof StemRegistrationData)[] }> = [
  { key: "personal", title: "Personal Details", fields: ["fullName", "phone", "guardianPhone"] },
  { key: "profile", title: "Profile", fields: ["dob", "gender"] },
  { key: "school", title: "School", fields: ["school", "schoolClass"] },
  { key: "motiv", title: "Your Goals", fields: ["motivation", "level"] },
  { key: "subjects", title: "Subjects", fields: ["subjects"] },
  { key: "payment", title: "Payment", fields: ["paymentMethod", "payerPhone", "paymentScreenshot"] },
];

type Props = {
  onSubmitted?: (data: StemRegistrationData) => void;
};

const StemRegistrationForm: React.FC<Props> = ({ onSubmitted }) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const form = useForm<StemRegistrationData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      guardianPhone: "",
      dob: undefined as unknown as Date,
      gender: undefined as unknown as "male" | "female",
      school: "",
      schoolClass: "",
      motivation: "",
      level: undefined as unknown as "olevel" | "alevel",
      paymentMethod: undefined as unknown as "mtn" | "orange",
      subjects: [],
      payerPhone: "",
      paymentScreenshot: undefined as any,
    },
    mode: "onTouched",
  });

  const [stepIndex, setStepIndex] = useState(0);
  const current = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const progress = useMemo(() => Math.round(((stepIndex + 1) / steps.length) * 100), [stepIndex]);
  const selectedSubjects = form.watch("subjects") || [];
  const subjectsCount = selectedSubjects.length;
  const subjectsAmount = subjectsCount === 4 ? 3000 : subjectsCount * 1000;
  const [paymentRef, setPaymentRef] = useState<string | null>(null);

  const next = async () => {
    const valid = await form.trigger(current.fields as any, { shouldFocus: true });
    if (!valid) return;
    setStepIndex((s) => Math.min(s + 1, steps.length - 1));
  };

  const prev = () => setStepIndex((s) => Math.max(s - 1, 0));

  // Final submit: allowed only if payment was initiated and screenshot provided
  const onSubmit = async (data: StemRegistrationData) => {
    if (!paymentRef) {
      toast({ title: "Payment not initiated", description: "Please tap Initiate Payment first.", variant: "destructive" as any });
      return;
    }
    // data.paymentScreenshot is required by schema; proceed
    onSubmitted?.(data);
    navigate("/stem-registration/success", { state: { reference: paymentRef, amount: subjectsAmount, method: form.getValues("paymentMethod") } });
    form.reset();
    setStepIndex(0);
    setPaymentRef(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-kc-blue"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>

      <div className="bg-gradient-subtle rounded-2xl p-6 shadow-elegant">
        <h3 className="heading-3 mb-1">{current.title}</h3>
        <p className="text-sm text-muted-foreground mb-6">Step {stepIndex + 1} of {steps.length}</p>

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
                      <FormLabel>Provide your Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+2376XXXXXXXX" inputMode="tel" {...field} />
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
                        <Input placeholder="+2376XXXXXXXX" inputMode="tel" {...field} />
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
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown-buttons"
                            fromYear={2000}
                            toYear={2015}
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
              </div>
            )}

            {current.key === "motiv" && (
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="motivation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Now let's hear from you, future scientist. What are you hoping to gain or experience during the STEM competition?</FormLabel>
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

            {current.key === "payment" && (
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment (MTN MoMo or Orange Money)</FormLabel>
                      <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-2 gap-3">
                        <FormItem className="border rounded-xl px-4 py-3 flex items-center gap-3 hover:shadow-sm transition">
                          <FormControl>
                            <RadioGroupItem value="mtn" />
                          </FormControl>
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-6 h-6 rounded-sm" style={{ backgroundColor: '#FFCB05' }} />
                            <FormLabel className="m-0">MTN MoMo</FormLabel>
                          </div>
                        </FormItem>
                        <FormItem className="border rounded-xl px-4 py-3 flex items-center gap-3 hover:shadow-sm transition">
                          <FormControl>
                            <RadioGroupItem value="orange" />
                          </FormControl>
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-6 h-6 rounded-sm bg-orange-500" />
                            <FormLabel className="m-0">Orange Money</FormLabel>
                          </div>
                        </FormItem>
                      </RadioGroup>
                      <p className="text-xs text-muted-foreground mt-1">We will send you payment instructions after you submit.</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile money number to pay from</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., +2376XXXXXXXX" inputMode="tel" {...field} />
                      </FormControl>
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
                        "fullName","phone","guardianPhone","dob","gender","school","schoolClass","motivation","level","subjects","paymentMethod","payerPhone"
                      ];
                      const valid = await form.trigger(allFields as any, { shouldFocus: true });
                      if (!valid) { setSubmitting(false); return; }
                      const payload: StemRegistrationPayload = {
                        fullName: form.getValues("fullName"),
                        phone: form.getValues("phone"),
                        guardianPhone: form.getValues("guardianPhone"),
                        dobISO: form.getValues("dob")?.toISOString(),
                        gender: form.getValues("gender") as any,
                        school: form.getValues("school"),
                        schoolClass: form.getValues("schoolClass"),
                        motivation: form.getValues("motivation"),
                        level: form.getValues("level") as any,
                        paymentMethod: form.getValues("paymentMethod") as any,
                      } as StemRegistrationPayload;
                      try {
                        const resp = await initiateStemPayment(payload, subjectsAmount);
                        setPaymentRef(resp.reference);
                        toast({ title: "Payment initiated", description: `Ref: ${resp.reference} • Amount: ${subjectsAmount.toLocaleString()} XAF` });
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
