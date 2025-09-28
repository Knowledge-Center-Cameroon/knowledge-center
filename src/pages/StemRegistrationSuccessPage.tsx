import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Phone, Receipt, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import StemBackground from "@/components/StemBackground";
import { ArrowButton } from "@/components/arrowbtn";

const StemRegistrationSuccessPage: React.FC = () => {
  const location = useLocation() as any;
  const state = location?.state as { reference?: string; amount?: number; method?: "mtn" | "orange" } | undefined;

  // Fallback to last stored registration in localStorage if navigated directly
  let ref = state?.reference;
  let amt = state?.amount;
  let method = state?.method;
  if (!ref) {
    try {
      const list = JSON.parse(localStorage.getItem("kc_stem_regs") || "[]");
      const last = Array.isArray(list) && list.length > 0 ? list[list.length - 1] : null;
      if (last) {
        ref = last.reference;
        amt = last.amount;
        method = last.paymentMethod;
      }
    } catch {}
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="container mx-auto px-4 lg:px-8 py-16 relative"
    >
      <div className="absolute inset-0 -z-10">
        <StemBackground opacity={0.08} density={44} lineDistance={120} speed={0.4} showIcons={true} />
      </div>

      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
        <h1 className="heading-2 mt-3">Registration Started</h1>
        <p className="text-muted-foreground mt-2">We have initiated your payment. Keep your reference safe and follow the mobile money prompt on your phone to complete the transaction.</p>

        <div className="mt-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/50 p-6 text-left shadow-elegant">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-foreground/70">Reference</div>
              <div className="font-semibold">{ref ?? "—"}</div>
            </div>
            <div>
              <div className="text-foreground/70">Amount</div>
              <div className="font-semibold">{typeof amt === 'number' ? `${amt.toLocaleString()} XAF` : "—"}</div>
            </div>
            <div>
              <div className="text-foreground/70">Method</div>
              <div className="font-semibold capitalize">{method ?? "—"}</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-foreground/70 flex items-start gap-2"><Phone className="h-4 w-4" /> Approve the prompt on your mobile money number. If you missed it, open your mobile money app and check pending approvals.</div>
          <div className="mt-1 text-xs text-foreground/70 flex items-start gap-2"><Receipt className="h-4 w-4" /> You’ll receive SMS confirmation after successful payment. We will also reconcile your status shortly.</div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <ArrowButton
            text="Back to Registration"
            bgPrimaryColor="#ffffff"
            bgSecondaryColor="#111827"
            textPrimaryColor="#111827"
            textSecondaryColor="#ffffff"
            className="rounded-full"
            href="/stem"
          />
          <ArrowButton
            text="Go Home"
            bgPrimaryColor="#ffffff"
            bgSecondaryColor="#e11d48"
            textPrimaryColor="#e11d48"
            textSecondaryColor="#ffffff"
            className="rounded-full"
            href="/"
          />
        </div>

        {/* Post-registration management hint */}
        <div className="mt-6">
          <div className="max-w-xl mx-auto rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 p-4 text-left">
            <div className="text-sm text-foreground/80">
              You can view and edit your registration details later if needed.
            </div>
            <div className="mt-3 flex justify-center">
              <ArrowButton
                text="Manage Registration"
                bgPrimaryColor="#ffffff"
                bgSecondaryColor="#111827"
                textPrimaryColor="#111827"
                textSecondaryColor="#ffffff"
                className="rounded-full"
                href="/stem/manage"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default StemRegistrationSuccessPage;
