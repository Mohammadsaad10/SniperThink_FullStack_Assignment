import React from "react";
import StrategyFlow from "./components/StrategyFlow.jsx";
import ProgressBar from "./components/ProgressBar.jsx";

const App = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-amber-50 text-slate-800">
      <ProgressBar />
      <main className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:px-12">
        <header className="mx-auto mb-8 max-w-4xl text-center sm:mb-12">
          <p className="mb-3 inline-block rounded-full border border-amber-300/80 bg-amber-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
            Interactive Strategy Flow
          </p>
          <h1 className="text-balance text-3xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            How SniperThink Turns Raw Inputs Into Actionable Outcomes
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-pretty text-sm leading-relaxed text-slate-600 sm:mt-5 sm:text-lg">
            Scroll through each stage to explore the strategy engine. Every step
            is data-driven, animated on viewport entry, and directly connected
            to backend integration through the interest form.
          </p>
        </header>

        <StrategyFlow />
      </main>
    </div>
  );
};

export default App;
