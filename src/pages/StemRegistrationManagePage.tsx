import React from "react";
import { motion } from "framer-motion";
import StemRegistrationForm, { type StemRegistrationData } from "@/components/StemRegistrationForm";

const StemRegistrationManagePage: React.FC = () => {
  // Load latest registration from localStorage as a simple edit target
  let initial: Partial<StemRegistrationData> | undefined;
  try {
    const key = "kc_stem_regs";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    if (Array.isArray(list) && list.length > 0) {
      const last = list[list.length - 1];
      initial = {
        fullName: last.fullName || "",
        phone: last.phone || "",
        guardianPhone: last.guardianPhone || "",
        dob: last.dobISO ? new Date(last.dobISO) : (undefined as any),
        gender: last.gender as any,
        school: last.school || "",
        schoolClass: last.schoolClass || "",
        region: (last.region as any) || (undefined as any),
        motivation: last.motivation || "",
        level: last.level as any,
        paymentMethod: last.paymentMethod as any,
        subjects: (last.subjects as any) || [],
        payerPhone: (last.payerPhone as any) || "",
        paymentScreenshot: undefined as any,
      };
    }
  } catch {}

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="container mx-auto px-4 lg:px-8 py-12 lg:py-20"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="heading-2 mb-2">
            Manage STEM <span className="text-kc-blue">Registration</span>
          </h1>
          <p className="text-muted-foreground">
            View and update your previously submitted details. Payment changes are not available here.
          </p>
        </div>
        <StemRegistrationForm initialValues={initial} mode="edit" />
      </div>
    </motion.section>
  );
};

export default StemRegistrationManagePage;
