"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, ShieldAlert, Droplets, Flame, Activity } from "lucide-react";

const guides = [
  {
    id: "flood",
    title: "Flood & Flash Water Survival",
    icon: Droplets,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    steps: [
      "Move immediately to higher ground or the top floor of a sturdy building.",
      "Do not walk or drive through moving water (6 inches can knock you over).",
      "Disconnect main electricity switches and gas valves if safe to do so.",
      "Fill clean containers with drinking water in case municipal supplies are cut.",
    ],
  },
  {
    id: "earthquake",
    title: "Earthquake Immediate Response",
    icon: Activity,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    steps: [
      "DROP down onto your hands and knees to prevent being knocked over.",
      "COVER your head and neck under a sturdy table or desk.",
      "HOLD ON until the shaking stops entirely.",
      "Stay away from windows, glass, outside doors, and heavy furniture.",
    ],
  },
  {
    id: "fire",
    title: "Fire Evacuation & Smoke Inhalation",
    icon: Flame,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    steps: [
      "Crawl low under smoke to your nearest clear emergency exit.",
      "Check door handles with the back of your hand before opening—if hot, do not open.",
      "If clothes catch fire: Stop, Drop, and Roll.",
      "Never use elevators during a structural fire emergency.",
    ],
  },
];

export default function SurvivalGuidesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Emergency Portal
        </Link>

        {/* Page Header */}
        <header className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="text-emerald-400 h-8 w-8" />
            <h1 className="text-3xl font-extrabold text-white">Emergency Survival Guides</h1>
          </div>
          <p className="text-slate-400 text-sm max-w-xl">
            Offline-ready field instructions for critical disaster response. Read thoroughly and follow safety procedures.
          </p>
        </header>

        {/* Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <div
                key={guide.id}
                className={`bg-slate-900 border ${guide.borderColor} rounded-xl p-6 shadow-xl flex flex-col justify-between`}
              >
                <div>
                  <div className={`p-3 ${guide.bgColor} rounded-lg w-fit mb-4`}>
                    <Icon className={`h-6 w-6 ${guide.color}`} />
                  </div>
                  <h2 className="text-lg font-bold text-white mb-4">{guide.title}</h2>
                  <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                    {guide.steps.map((step, idx) => (
                      <li key={idx} className="marker:font-bold marker:text-slate-500">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}