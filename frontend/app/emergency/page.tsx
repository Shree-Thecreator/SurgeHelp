"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Ambulance, Flame, AlertCircle, X } from "lucide-react";

const services = [
  {
    id: "police",
    name: "Police Station",
    icon: Shield,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50",
  },
  {
    id: "ambulance",
    name: "Ambulance",
    icon: Ambulance,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20 hover:border-rose-500/50",
  },
  {
    id: "fire",
    name: "Fire Brigade",
    icon: Flame,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:border-amber-500/50",
  },
];

export default function EmergencyCallPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Emergency Portal
        </Link>

        {/* Page Header */}
        <header className="border-b border-slate-800 pb-5">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Emergency Services
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Select a service to initiate dispatch contact.
          </p>
        </header>

        {/* Service Options Grid */}
        <div className="grid grid-cols-1 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.name)}
                className={`p-5 rounded-2xl border bg-slate-900 flex items-center justify-between text-left transition-all ${service.color}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <Icon size={24} />
                  </div>
                  <span className="text-lg font-bold text-white">{service.name}</span>
                </div>
                <span className="text-xs text-slate-400 font-medium bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  Connect
                </span>
              </button>
            );
          })}
        </div>

        {/* Future Enhancement Modal / Popup */}
        {selectedService && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center relative">
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertCircle size={24} />
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {selectedService}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct automated dialer and live dispatch integration for this service is reserved for **future enhancement**.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-xs transition border border-slate-700"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}