import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import InterestForm from "./InterestForm.jsx";

const StrategyStep = ({ step, totalSteps, isActive, onVisible }) => {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 72 }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
      }}
      viewport={{ amount: 0.52, margin: "-10% 0px -12% 0px" }}
      onViewportEnter={() => onVisible(step.id)}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`relative overflow-hidden rounded-3xl border bg-white p-4 shadow-[0_18px_36px_-25px_rgba(15,23,42,0.35)] transition-colors sm:p-8 ${
        isActive
          ? "border-orange-300/80 ring-4 ring-orange-100/70"
          : "border-slate-200 hover:border-orange-200"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
          Step {step.id} of {totalSteps}
        </p>
        <span className="text-xs font-semibold text-slate-500">
          {step.metric}
        </span>
      </div>

      <h3 className="text-xl font-black text-slate-900 sm:text-3xl">
        {step.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
        {step.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {step.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 sm:w-auto"
        >
          {showForm ? "Close Form" : "I'm Interested"}
        </button>

        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 sm:w-auto"
        >
          {showDetails ? "Hide Details" : "View Transition Details"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showDetails && (
          <motion.div
            key="step-details"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="mt-4 overflow-hidden rounded-xl border border-orange-200/80 bg-orange-50 p-4"
          >
            <p className="text-sm leading-relaxed text-orange-900">
              {step.outcome}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {showForm && (
          <motion.div
            key="interest-form"
            initial={{ opacity: 0, y: 14, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="mt-5 overflow-hidden"
          >
            <InterestForm step={step.title} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StrategyStep;
