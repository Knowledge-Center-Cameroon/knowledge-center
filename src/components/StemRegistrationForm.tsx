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
  .regex(/^(237)?6\d{8}$/i, "Enter a valid Cameroonian mobile (e.g., 6XXXXXXXX)");

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
];

const DRAFT_KEY = "kc_stem_form_draft";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: cmPhone,
  guardianPhone: cmPhone,
  dob: z.date().min(minDOB, "Invalid date of birth").max(maxDOB, "Invalid date of birth"),
  gender: z.enum(["male", "female", "other"]),
  school: z.string().min(1, "School is required"),
  schoolClass: z.string().min(1, "Class is required"),
  region: z.string().min(1, "Region is required"),
  motivation: z.string().optional(),
  level: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  payerPhone: cmPhone,
  paymentScreenshot: z.instanceof(File).optional(),
});

const steps: Array<{ key: string; title: string; fields: (keyof StemRegistrationData)[] }> = [
  { key: "personal", title: "Personal Details", fields: ["fullName", "phone", "guardianPhone"] },
  { key: "profile", title: "Profile", fields: ["dob", "gender"] },
  { key: "school", title: "School", fields: ["school", "schoolClass", "region"] },
  { key: "subjects", title: "Subjects", fields: ["subjects"] },
  { key: "payment", title: "Payment", fields: ["payerPhone", "paymentScreenshot"] },
];

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

  const handleDiscardDraft = () => {
    form.reset();
    toast({ title: "Draft discarded", description: "The form has been cleared." });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button
          type="button"
          variant="ghost"
          className="ml-auto"
          onClick={handleDiscardDraft}
        >
          <X className="h-4 w-4" />
          Discard draft
        </Button>
      </div>
      {/* Rest of the form goes here */}
    </div>
  );
};

export default StemRegistrationForm;
