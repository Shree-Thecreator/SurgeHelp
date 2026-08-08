"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  HeartPulse,
  AlertTriangle,
  MapPin,
  Send,
  CheckCircle2,
  Ambulance,
  UserCheck,
  Stethoscope,
  Activity,
} from "lucide-react";

interface TriageOption {
  id: string;
  label: string;
  description: string;
  severity: "critical" | "moderate" | "minor";
}

const triageCategories: TriageOption[] = [
  {
    id: "severe_bleeding",
    label: "Severe Bleeding / Trauma",
    description: "Active arterial bleeding, deep lacerations, or structural crushed limb injury.",
    severity: "critical",
  },
  {
    id: "fracture",
    label: "Broken Bones / Fractures",
    description: "Inability to move limb, visible deformity, or severe joint displacement.",
    severity: "moderate",
  },
  {
    id: "burns",
    label: "Thermal or Chemical Burns",
    description: "Second or third-degree burns covering large areas of body or face.",
    severity: "critical",
  },
  {
    id: "head_trauma",
    label: "Head Injury / Unconscious",
    description: "Concussion symptoms, loss of consciousness, severe dizziness, or confusion.",
    severity: "critical",
  },
  {
    id: "breathing",
    label: "Respiratory Distress",
    description: "Severe asthma, smoke inhalation, choked airways, or shallow breathing.",
    severity: "critical",
  },
  {
    id: "minor_cuts",
    label: "Minor Cuts & Bruises",
    description: "Superficial wounds requiring basic first-aid, sanitization, and bandaging.",
    severity: "minor",
  },
];

export default function ReportInjuryPage() {
  const [selectedInjuries, setSelectedInjuries] = useState<string[]>(["severe_bleeding"]);
  const [patientCount, setPatientCount] = useState<number>(1);
  const [consciousStatus, setConsciousStatus] = useState<string>("conscious");
  const [locationDetails, setLocationDetails] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const toggleInjury = (id: string) => {
    setSelectedInjuries((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInjuries.length === 0) {
      alert("Please select at least one injury type.");
      return;
    }
    setIsSubmitting(true);

    // Simulate dispatching medical triage request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Emergency Portal
        </Link>

        {/* Page Header */}
        <header className="border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <HeartPulse size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Medical Triage & Injury Report
              </h1>
              <p className="text-slate-400 text-xs md:text-sm">
                Submit urgent medical assessment data to request paramedic dispatch or locate nearest field medic units.
              </p>
            </div>
          </div>
        </header>

        {submitted ? (
          /* Confirmation Screen */
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 animate-pulse">
              <Ambulance size={36} />
            </div>
            <h2 className="text-2xl font-bold text-white">Medical Triage Request Sent!</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Your report for <span className="text-white font-semibold">{patientCount} patient(s)</span> has been flagged with high priority for local field responders and nearby medical dispatchers.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={() => setSubmitted(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2.5 rounded-lg border border-slate-700 font-medium transition"
              >
                Update Report
              </button>
              <Link
                href="/"
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2.5 rounded-lg font-medium transition"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* Report Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Injury Type Selection */}
            <div>
              <label className="text-sm font-semibold text-slate-200 mb-3 block">
                1. Select Observed Injury Types
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {triageCategories.map((item) => {
                  const isSelected = selectedInjuries.includes(item.id);
                  const isCritical = item.severity === "critical";

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleInjury(item.id)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? isCritical
                            ? "bg-red-950/40 border-red-500/50 text-red-200 shadow-lg ring-1 ring-red-500/50"
                            : "bg-amber-950/40 border-amber-500/50 text-amber-200 shadow-lg ring-1 ring-amber-500/50"
                          : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="pt-0.5">
                        <Activity
                          size={18}
                          className={
                            isSelected
                              ? isCritical
                                ? "text-red-400"
                                : "text-amber-400"
                              : "text-slate-500"
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">{item.label}</h3>
                          <span
                            className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                              isCritical
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {item.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Patient Details & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Number of Injured Individuals
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={patientCount}
                  onChange={(e) => setPatientCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Patient Consciousness
                </label>
                <select
                  value={consciousStatus}
                  onChange={(e) => setConsciousStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                >
                  <option value="conscious">Conscious & Responsive</option>
                  <option value="semi_conscious">Semi-Conscious / Disoriented</option>
                  <option value="unconscious">Unconscious / Unresponsive</option>
                </select>
              </div>
            </div>

            {/* Location & Medical Context */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                  <MapPin size={14} className="text-red-400" /> Patient Location / Landmarks
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2nd Floor Apartment 3B, near damaged power lines"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Specific Medical Details or Pre-existing Conditions
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. High blood loss from left arm, patient is diabetic or elderly..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition disabled:opacity-50"
            >
              <Send size={16} />
              {isSubmitting ? "Dispatching Triage Signal..." : "Submit Urgent Medical Report"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}