import { useMemo, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { steps } from "../data/steps";
import StrategyStep from "./StrategyStep.jsx";

const StrategyFlow = () => {
  const [activeStepId, setActiveStepId] = useState(steps[0].id);
  const [progressPercent, setProgressPercent] = useState(0);
  const activeIndex = useMemo(
    () =>
      Math.max(
        0,
        steps.findIndex((step) => step.id === activeStepId),
      ),
    [activeStepId],
  );

  const { scrollYProgress } = useScroll();
  const completion = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgressPercent(Math.max(0, Math.min(100, Math.round(latest * 100))));
  });

  const activeStep = steps[activeIndex] || steps[0];

  return (
    <section className="relative grid gap-6 sm:gap-8 lg:pr-80">
      <div className="sticky top-4 z-20 lg:hidden">
        <div className="rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 shadow-[0_14px_30px_-20px_rgba(251,146,60,0.8)] backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Progress
              </p>
              <p className="text-sm font-bold text-slate-800">
                Step {activeStep.id}: {activeStep.shortLabel}
              </p>
            </div>
            <p className="text-2xl font-black text-slate-900">
              {progressPercent}%
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-orange-100">
            <motion.div
              className="h-full origin-left rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
              style={{ scaleX: completion }}
            />
          </div>
        </div>
      </div>

      <aside className="hidden lg:fixed lg:bottom-6 lg:right-8 lg:block lg:w-64">
        <div className="rounded-2xl border border-orange-100 bg-white/85 p-5 shadow-[0_18px_40px_-24px_rgba(251,146,60,0.8)] backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Progress
          </p>
          <p className="mt-1 text-3xl font-black text-slate-900">
            {progressPercent}%
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-orange-100">
            <motion.div
              className="h-full origin-left rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
              style={{ scaleX: completion }}
            />
          </div>

          <ol className="mt-5 space-y-3">
            {steps.map((step, index) => {
              const passed = index <= activeIndex;
              return (
                <li
                  key={step.id}
                  className="flex items-center gap-3 rounded-xl px-2 py-1"
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold transition-all ${
                      passed
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {step.id}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500">{step.shortLabel}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>

      <div className="space-y-6 sm:space-y-8">
        {steps.map((step, index) => (
          <StrategyStep
            key={step.id}
            step={step}
            index={index}
            totalSteps={steps.length}
            isActive={step.id === activeStepId}
            onVisible={setActiveStepId}
          />
        ))}
      </div>
    </section>
  );
};

export default StrategyFlow;
