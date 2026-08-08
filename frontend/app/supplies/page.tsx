"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Droplets,
  Utensils,
  BatteryCharging,
  Package,
  Send,
  CheckCircle2,
  MapPin,
  AlertCircle,
} from "lucide-react";

interface SupplyOption {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const supplyCategories: SupplyOption[] = [
  {
    id: "water",
    name: "Clean Drinking Water",
    category: "Hydration",
    icon: Droplets,
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    description: "Bottled water, purification tablets, or bulk clean water supply.",
  },
  {
    id: "food",
    name: "Ration & Ready-to-Eat Food",
    category: "Nutrition",
    icon: Utensils,
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    description: "Dry rations, emergency food kits, infant formula, or canned goods.",
  },
  {
    id: "power",
    name: "Power Banks & Lighting",
    category: "Energy",
    icon: BatteryCharging,
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    description: "Solar power banks, rechargeable flashlights, or batteries.",
  },
  {
    id: "shelter_kit",
    name: "Shelter & Sanitation Kit",
    category: "Essentials",
    icon: Package,
    color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    description: "Tarps, emergency blankets, hygiene items, and basic tools.",
  },
];

export default function SuppliesPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>(["water", "food"]);
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [address, setAddress] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [urgency, setUrgency] = useState<"normal" | "urgent" | "critical">("urgent");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      alert("Please select at least one supply item.");
      return;
    }
    setIsSubmitting(true);

    // Simulate sending broadcast request to network
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
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Package size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Request Emergency Supplies & Food
              </h1>
              <p className="text-slate-400 text-xs md:text-sm">
                Submit a dispatch request for essential rations, water, and power equipment to local relief networks.
              </p>
            </div>
          </div>
        </header>

        {submitted ? (
          /* Confirmation State */
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-bold text-white">Supply Request Broadcasted!</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Your request for <span className="text-white font-semibold">{peopleCount} person(s)</span> has been logged and broadcasted to nearby rescue centers and volunteer supply teams.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={() => setSubmitted(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2.5 rounded-lg border border-slate-700 font-medium transition"
              >
                Submit Another Request
              </button>
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2.5 rounded-lg font-medium transition"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* Request Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Supply Item Selection */}
            <div>
              <label className="text-sm font-semibold text-slate-200 mb-3 block">
                1. Select Needed Resources
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supplyCategories.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleSelection(item.id)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? `${item.color} shadow-lg ring-1 ring-blue-500/50`
                          : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${item.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">{item.name}</h3>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "bg-blue-500 border-blue-400"
                                : "border-slate-600"
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
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

            {/* Quantity and Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Number of People Affected
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["normal", "urgent", "critical"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      className={`py-2 rounded-lg text-xs capitalize font-medium transition ${
                        urgency === lvl
                          ? lvl === "critical"
                            ? "bg-red-600 text-white"
                            : lvl === "urgent"
                            ? "bg-amber-600 text-white"
                            : "bg-blue-600 text-white"
                          : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Location & Details */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                  <MapPin size={14} className="text-blue-400" /> Delivery Address / Landmark
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Community Center, Sector 4, Block B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Additional Medical or Dietary Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g., Need baby food, diabetic supplies, or clean water priority."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition disabled:opacity-50"
            >
              <Send size={16} />
              {isSubmitting ? "Broadcasting Request..." : "Broadcast Supply Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}