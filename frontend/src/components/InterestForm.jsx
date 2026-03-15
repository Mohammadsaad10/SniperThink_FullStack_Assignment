import { useState } from "react";
import { submitInterest } from "../services/api";

const InterestForm = ({ step }) => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setFeedback({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);

    try {
      await submitInterest({
        name: form.name,
        email: form.email,
        step,
      });

      setFeedback({
        type: "success",
        text: "Thanks! Your interest has been submitted successfully.",
      });
      setForm({ name: "", email: "" });
    } catch (err) {
      const apiError = err?.response?.data?.error || err?.response?.data;
      const errorMessage =
        typeof apiError === "string"
          ? apiError
          : apiError?.message ||
            err?.message ||
            "Something went wrong. Please try again.";
      setFeedback({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        Interested in: {step}
      </p>

      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={updateField("name")}
        required
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={updateField("email")}
        required
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      />

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {feedback.text && (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-lg px-3 py-2 text-sm ${
            feedback.type === "success"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-rose-100 text-rose-800"
          }`}
        >
          {feedback.text}
        </p>
      )}
    </form>
  );
};

export default InterestForm;
