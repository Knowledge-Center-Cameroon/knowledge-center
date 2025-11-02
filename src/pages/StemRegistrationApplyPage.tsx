import { motion } from "framer-motion";
import StemRegistrationForm from "../components/StemRegistrationForm";

const StemRegistrationApplyPage: React.FC = () => {
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
            STEM Registration <span className="text-kc-blue">Form</span>
          </h1>
          <p className="text-muted-foreground">
            Please provide accurate information. Payments are processed via MTN MoMo or Orange Money.
          </p>
        </div>
        <StemRegistrationForm />
      </div>
    </motion.section>
  );
};

export default StemRegistrationApplyPage;
