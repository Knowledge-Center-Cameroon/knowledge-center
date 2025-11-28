import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Loader2, X } from "lucide-react";
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

const cmPhone = z
  .string()
  .regex(/^( ?237)?6\d{8}$/i, "Enter a valid Cameroonian mobile (e.g., 6XXXXXXXX)");

const minDOB = new Date(1900, 0, 1);
const maxDOB = new Date(); // Cannot be in the future

const CM_REGIONS = [
  "Adamawa", "Centre", "East", "Far North", "Littoral",
  "North", "North West", "West", "South", "South West",
];

const AVAILABLE_SUBJECTS = [
  { id: "math", name: "Mathematics" },
  { id: "physics", name: "Physics" },
  { id: "biology", name: "Biology" },
  { id: "chemistry", name: "Chemistry" },
];

// Pricing: 1 subject = 1000 FCFA, 4 subjects = 3000 FCFA
const calculateSubjectPrice = (count: number): number => {
  if (count === 0) return 0;
  if (count === 4) return 3000;
  return count * 1000;
};

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: cmPhone,
  guardianPhone: cmPhone,
  dob: z.date().min(minDOB, "Invalid date of birth").max(maxDOB, "You cannot be born in the future"),
  gender: z.enum(["male", "female", "other"]),
  educationLevel: z.enum(["olevel", "alevel"], { required_error: "Please select education level" }),
  schoolClass: z.string().min(1, "Class is required"),
  school: z.string().min(1, "School is required"),
  region: z.string().min(1, "Region is required"),
  examLocation: z.string().min(1, "Exam location/town is required"),
  subjects: z.array(z.string()).min(1, "Please select at least one subject"),
  expectations: z.string().min(10, "Please share your expectations (at least 10 characters)"),
  payerPhone: cmPhone,
});

export type StemRegistrationData = z.infer<typeof schema>;

const steps: Array<{ key: string; title: string; fields: (keyof StemRegistrationData)[] }> = [
  { key: "personal", title: "Personal Details", fields: ["fullName", "phone", "guardianPhone"] },
  { key: "profile", title: "Profile", fields: ["dob", "gender"] },
  { key: "education", title: "Education", fields: ["educationLevel", "schoolClass", "school", "region", "examLocation"] },
  { key: "subjects", title: "Subjects", fields: ["subjects"] },
  { key: "expectations", title: "Expectations", fields: ["expectations"] },
  { key: "payment", title: "Payment", fields: ["payerPhone"] },
];

interface Props {
  onSubmitted?: (data: StemRegistrationData) => void;
  initialValues?: Partial<StemRegistrationData>;
  mode?: "create" | "edit";
}

const StemRegistrationForm: React.FC<Props> = ({ onSubmitted, initialValues, mode = "create" }) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();
  
  const form = useForm<StemRegistrationData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      guardianPhone: "",
      dob: undefined,
      gender: undefined as any,
      educationLevel: undefined as any,
      schoolClass: "",
      school: "",
      region: undefined as any,
      examLocation: "",
      subjects: [],
      expectations: "",
      payerPhone: "",
      ...(initialValues || {}),
    },
    mode: "onTouched",
  });

  // Calculate total amount based on selected subjects
  const selectedSubjects = form.watch("subjects") || [];
  const totalAmount = calculateSubjectPrice(selectedSubjects.length);

  const handleDiscardDraft = () => {
    form.reset();
    toast({ title: "Draft discarded", description: "The form has been cleared." });
    setStepIndex(0);
  };

  const next = async () => {
    const fields = steps[stepIndex].fields;
    const output = await form.trigger(fields as any, { shouldFocus: true });
    if (!output) return;
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const prev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  async function onSubmit(data: StemRegistrationData) {
    setSubmitting(true);
    try {
      const payload: StemRegistrationPayload = {
        fullName: data.fullName,
        phone: data.payerPhone || data.phone,
        guardianPhone: data.guardianPhone,
        dobISO: data.dob.toISOString(),
        gender: data.gender,
        school: data.school,
        schoolClass: data.schoolClass,
        motivation: data.expectations,
        level: data.educationLevel,
      };

      const amount = totalAmount;

      const { reference, paymentMethod, amount: confirmedAmount } = await initiateStemPayment(
        payload,
        amount
      );

      toast({
        title: "Payment Initiated",
        description: `Reference ${reference}. Approve the ${paymentMethod?.toUpperCase()} prompt on your phone.`,
      });

      if (onSubmitted) {
        onSubmitted(data);
      }

      form.reset();
      setStepIndex(0);
      navigate('/stem/success', {
        state: {
          reference,
          amount: confirmedAmount,
          method: paymentMethod,
        },
      });
    } catch (error) {
      console.error('STEM payment initiation failed:', error);
      toast({
        title: "Payment Failed",
        description: "We could not initiate your mobile money payment. Please try again.",
        variant: "destructive" as any,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-2 flex-1 rounded-full overflow-hidden bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-kc-blue to-kc-red"
            initial={{ width: 0 }}
            animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
        <span className="text-sm text-muted-foreground">{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto text-muted-foreground hover:text-destructive"
          onClick={handleDiscardDraft}
        >
          <X className="h-4 w-4 mr-2" />
          Discard
        </Button>
      </div>

      <div className="bg-gradient-subtle rounded-2xl p-6 shadow-elegant">
        <h3 className="heading-3 mb-1">{steps[stepIndex].title}</h3>
        <p className="text-sm text-muted-foreground mb-6">Step {stepIndex + 1} of {steps.length}</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {stepIndex === 0 && (
              <>
                <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g. John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="e.g. 670123456" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="guardianPhone" render={({ field }) => (<FormItem><FormLabel>Guardian's Phone Number</FormLabel><FormControl><Input placeholder="e.g. 670123456" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </>
            )}

            {stepIndex === 1 && (
              <>
                <FormField 
                  control={form.control} 
                  name="dob" 
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button 
                              variant={"outline"} 
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal", 
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
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
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            defaultMonth={field.value || new Date(2010, 0)}
                            captionLayout="dropdown-buttons"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                            initialFocus 
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                <FormField control={form.control} name="gender" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Gender</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1"><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel className="font-normal">Male</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel className="font-normal">Female</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel className="font-normal">Other</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
              </>
            )}

            {stepIndex === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Education Level</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="olevel" />
                            </FormControl>
                            <FormLabel className="font-normal">O Level</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="alevel" />
                            </FormControl>
                            <FormLabel className="font-normal">A Level</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="schoolClass" render={({ field }) => (<FormItem><FormLabel>Class</FormLabel><FormControl><Input placeholder="e.g. Form 5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="school" render={({ field }) => (<FormItem><FormLabel>School</FormLabel><FormControl><Input placeholder="e.g. Government High School" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="region" render={({ field }) => (<FormItem><FormLabel>Region</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your region" /></SelectTrigger></FormControl><SelectContent>{CM_REGIONS.map(region => (<SelectItem key={region} value={region}>{region}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="examLocation" render={({ field }) => (<FormItem><FormLabel>Exam Location / Town</FormLabel><FormControl><Input placeholder="e.g. Buea, Douala, Yaoundé" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </>
            )}

            {stepIndex === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="subjects"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Select Subjects</FormLabel>
                        <p className="text-sm text-muted-foreground">Choose the subjects you want to register for (1,000 FCFA per subject, or 3,000 FCFA for all 4 subjects)</p>
                      </div>
                      <div className="space-y-3">
                        {AVAILABLE_SUBJECTS.map((subject) => (
                          <FormField
                            key={subject.id}
                            control={form.control}
                            name="subjects"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={subject.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(subject.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, subject.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== subject.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <div className="flex-1">
                                    <FormLabel className="text-sm font-normal">
                                      {subject.name}
                                    </FormLabel>
                                  </div>
                                  <div className="text-sm font-medium">
                                    1,000 FCFA
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      {selectedSubjects.length > 0 && (
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Amount:</span>
                            <span className="text-2xl font-bold text-kc-blue">{totalAmount.toLocaleString()} FCFA</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedSubjects.length} subject{selectedSubjects.length > 1 ? 's' : ''} selected
                            {selectedSubjects.length === 4 && " (Special discount applied!)"}
                          </p>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {stepIndex === 4 && (
              <>
                <FormField
                  control={form.control}
                  name="expectations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Expectations</FormLabel>
                      <p className="text-sm text-muted-foreground mb-2">
                        What do you hope to achieve from the STEM exam? Share your goals and expectations.
                      </p>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. I hope to improve my understanding of science concepts and prepare for advanced studies..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {stepIndex === 5 && (
              <>
                <div className="mb-6 p-4 bg-gradient-subtle rounded-lg border">
                  <h4 className="font-semibold mb-3">Payment Details</h4>
                  <div className="space-y-4">
                    <div className="p-3 bg-white rounded border">
                      <p className="font-medium text-sm mb-2">Total Amount to Pay:</p>
                      <p className="text-2xl font-bold text-kc-blue">{totalAmount.toLocaleString()} FCFA</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedSubjects.length} subject{selectedSubjects.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter the mobile money number that will be charged. We will automatically detect whether it is MTN or Orange and send a payment prompt to that phone.
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="payerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payer's Mobile Money Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 670123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-between pt-2">
              {stepIndex > 0 && (
                <Button type="button" variant="ghost" onClick={prev}>
                  Back
                </Button>
              )}
              {stepIndex < steps.length - 1 ? (
                <Button type="button" onClick={next} className="ml-auto">
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={submitting} className="ml-auto">
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
