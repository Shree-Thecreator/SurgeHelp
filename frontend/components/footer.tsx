import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Radio,
  PhoneCall,
  BookOpen,
  Package,
  HeartPulse,
  Heart,
  Globe,
  
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400 text-xs mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand & Overview */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                <ShieldAlert size={18} />
              </div>
              <span className="font-bold text-white text-sm tracking-wide">
                SURGEHELP
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Real-time emergency response network providing immediate access to disaster field guides, supply requests, and injury triage.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px]">
              <Radio size={12} className="animate-pulse" />
              <span>Network Status: <strong>Online</strong></span>
            </div>
          </div>

          {/* Column 2: Emergency Actions */}
          <div className="space-y-3">
            
            <ul className="space-y-2">
              <li>
                <Link
                  href="/guides"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <BookOpen size={13} className="text-emerald-400" />
                 Emergency Hotlines
                </Link>
              </li>
              <li>
                <Link
                  href="/call"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <PhoneCall size={13} className="text-orange-400" />
                  Core Platform Capabilities
                </Link>
              </li>
              <li>
                <Link
                  href="/supplies"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Package size={13} className="text-blue-400" />
                  safety reminder
                </Link>
              </li>
              <li>
                <Link
                  href="/injury"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <HeartPulse size={13} className="text-rose-400" />
                  Provides a technical breakdown
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Response Directives */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
              Field Directives
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-slate-200 cursor-pointer">Disaster Radio Frequencies</li>
              <li className="hover:text-slate-200 cursor-pointer">Offline Cache Protocols</li>
              <li className="hover:text-slate-200 cursor-pointer">Medical Field Triage Guidelines</li>
              <li className="hover:text-slate-200 cursor-pointer">Community Shelter Map</li>
            </ul>
          </div>

          {/* Column 4: Notice & Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
              Project Information
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Designed as a resilient offline-ready emergency response platform for community safety.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
              >
                
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
              >
                <Globe size={14} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} SURGEHELP Emergency Network. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for rapid emergency response</span>
            <Heart size={12} className="text-rose-500 fill-rose-500/20 inline mx-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
}