"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import {
  AlertTriangle,
  Send,
  PhoneCall,
  Search,
  Users,
  ShieldAlert,
  LifeBuoy,
  Radio,
  Shield,
  Compass,
  Maximize2,
  Minimize2,
} from "lucide-react";


import ParticleSphereAnimation from "../components/ui/orbiting-circles-02-utils/particalsPhear";


const DisasterMap = dynamic(() => import("../components/DisasterMap"), {
  ssr: false,
});

interface Message {
  type: string;
  sender_id?: string;
  text?: string;
  message?: string;
  ai_assessment?: string;
}

const orbits = [
  {
    size: "w-[280px] h-[280px] md:w-[450px] md:h-[450px]",
    duration: 18,
    icons: [
      { component: AlertTriangle, color: "text-red-500", label: "Danger", angle: -60 },
      { component: Radio, color: "text-amber-500", label: "SOS", angle: 0 },
      { component: Shield, color: "text-emerald-500", label: "Rescue", angle: 60 },
    ],
  },
  {
    size: "w-[380px] h-[380px] md:w-[560px] md:h-[560px]",
    duration: 24,
    icons: [
      { component: Users, color: "text-blue-500", label: "People", angle: 0 },
      { component: Compass, color: "text-indigo-500", label: "Nav", angle: -90 },
    ],
  },
  {
    size: "w-[460px] h-[460px] md:w-[680px] md:h-[680px]",
    duration: 30,
    icons: [
      { component: PhoneCall, color: "text-rose-500", label: "Call", angle: -60 },
      { component: Shield, color: "text-sky-500", label: "Safe", angle: 0 },
      { component: AlertTriangle, color: "text-orange-500", label: "Warning", angle: 60 },
    ],
  },
];
export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false); // Added full-screen map state
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>({
    lat: 22.5726,
    lng: 88.3639,
  });
  // ... rest of your code
  const [locationName, setLocationName] = useState("Kolkata, West Bengal");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  
  useEffect(() => {
    setUserId("user_" + Math.random().toString(36).substring(2, 7));
  }, []);

 
  useEffect(() => {
    if (!userId) return;
    const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => ws.close();
  }, [userId]);

  
  const handleLocationSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const topResult = data[0];
        setSelectedLocation({
          lat: parseFloat(topResult.lat),
          lng: parseFloat(topResult.lon),
        });
        setLocationName(topResult.display_name.split(",")[0]);
      } else {
        alert("Location not found. Please try another search term.");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Error searching location.");
    } finally {
      setIsSearching(false);
    }
  };

  // Broadcast WebSocket Message
  const sendMessage = () => {
    if (!inputText.trim() || !socketRef.current) return;
    socketRef.current.send(
      JSON.stringify({
        type: "CHAT",
        text: inputText,
        location: selectedLocation,
      })
    );
    setInputText("");
  };

  // Trigger Emergency SOS REST Call
  const triggerSOS = async () => {
    if (!userId) return alert("User ID not ready");
    await fetch("http://localhost:8000/api/emergency-sos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        message: `EMERGENCY near ${locationName}: Immediate assistance required!`,
      }),
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Dynamic Keyframes for CSS Orbiting Animations */}
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)) }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)) }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)) }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)) }
        }
      `}</style>

      {/* HEADER SECTION: TITLE & ORBITING CIRCLES GLOBE HERO */}
      <header className="relative bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 pt-8 pb-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-20">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldAlert size={14} /> Global Emergency Relief Network
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            SurgeHelp Disaster Portal
          </h1>
          <p className="mt-2 text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Real-time danger zone tracking, community SOS peer connectivity, and AI assistance.
          </p>
        </div>

        {/* Orbiting Circles Visual Graphic */}
        <div className="relative w-full h-70 md:h-90 overflow-hidden flex justify-center items-end mt-2">
          {/* Center Particle Sphere Animation */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 aspect-square pointer-events-none w-55 md:w-87.5 z-10">
            <ParticleSphereAnimation />
          </div>

          {/* Orbiting Rings */}
          {orbits.map((orbit, index) => {
            const isCW = index % 2 === 0;
            const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
            const counterAnim = isCW ? "counter-cw" : "counter-ccw";

            const allIcons = [
              ...orbit.icons,
              ...orbit.icons.map((ic) => ({
                ...ic,
                angle: ic.angle + 180,
                label: `${ic.label}-mirror`,
              })),
            ];

            return (
              <div
                key={index}
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-slate-700/40 ${orbit.size}`}
              >
                {allIcons.map((iconData, iconIndex) => {
                  const IconComp = iconData.component;
                  return (
                    <div
                      key={iconIndex}
                      className="absolute top-0 left-1/2 h-1/2 -ml-6 origin-bottom flex flex-col justify-start items-center"
                      style={
                        {
                          "--start-angle": `${iconData.angle}deg`,
                          animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                        } as React.CSSProperties
                      }
                    >
                      <div
                        className="p-2 sm:p-3 border border-slate-700 rounded-full bg-slate-900/90 -mt-6 relative z-10 shadow-lg backdrop-blur-sm"
                        style={
                          {
                            "--counter-offset": `${-iconData.angle}deg`,
                            animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                          } as React.CSSProperties
                        }
                      >
                        <IconComp className={`w-4 h-4 md:w-6 md:h-6 ${iconData.color}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </header>

      {/* DASHBOARD: MAP, COMMUNITY CONNECT & SOS FIND HELP */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FEATURE 1: MAP FOR DANGER ZONE */}
      <section
  className={
    isFullScreen
      ? "fixed inset-0 z-50 bg-slate-900 p-4 sm:p-6 flex flex-col"
      : "lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col shadow-xl"
  }
>
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
    <h2 className="text-lg font-bold text-white flex items-center gap-2">
      <AlertTriangle className="text-amber-500" /> Map for Danger Zone
    </h2>

    <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
      {/* Geocoding Location Search */}
      <form onSubmit={handleLocationSearch} className="flex w-full sm:w-auto gap-2">
        <input
          type="text"
          className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          placeholder="Search region (e.g., Assam, Kolkata)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={isSearching}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 font-medium transition disabled:opacity-50"
        >
          <Search size={14} /> {isSearching ? "..." : "Search"}
        </button>
      </form>

      {/* Full Screen Map Toggle Button */}
      <button
        type="button"
        onClick={() => setIsFullScreen(!isFullScreen)}
        className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-sm flex items-center justify-center gap-1.5 font-medium transition"
        title={isFullScreen ? "Exit Full Screen Mode" : "Expand Map to Full Screen"}
      >
        {isFullScreen ? (
          <>
            <Minimize2 size={14} />
            <span>Exit Full Screen</span>
          </>
        ) : (
          <>
            <Maximize2 size={14} />
            <span>Full Screen</span>
          </>
        )}
      </button>
    </div>
  </div>

  {/* Leaflet Dynamic Map Render Area */}
  <div className="flex-1 min-h-105 rounded-lg overflow-hidden border border-slate-800 relative z-0">
    <DisasterMap selectedLocation={selectedLocation} locationName={locationName} />
  </div>
</section>

        {/* RIGHT COLUMN: FEATURES 2 & 3 */}
        <div className="flex flex-col gap-6">
          {/* FEATURE 2: CONNECT WITH NEARBY PEOPLE */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-95 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Users className="text-blue-400" /> Connect with Nearby People
              {userId && <span className="text-xs text-slate-500">({userId})</span>}
            </h2>

            {/* Chat Stream Window */}
            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
              {messages.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-8">
                  No active local messages. Send a message to connect with people nearby.
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg text-xs ${
                      msg.type === "SOS_ALERT"
                        ? "bg-red-950/80 border border-red-500/50 text-red-200"
                        : msg.sender_id === userId
                        ? "bg-blue-600 text-white ml-auto max-w-[85%]"
                        : "bg-slate-800 text-slate-200 max-w-[85%]"
                    }`}
                  >
                    {msg.type === "SOS_ALERT" && (
                      <div className="font-bold text-red-400 mb-1">🚨 EMERGENCY ALERT</div>
                    )}
                    <div>{msg.text || msg.message}</div>
                    {msg.ai_assessment && (
                      <div className="mt-1.5 text-[11px] bg-red-900/40 text-red-300 p-1.5 rounded border border-red-800">
                        🤖 <strong>AI Assessment:</strong> {msg.ai_assessment}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Message Input Box */}
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Message nearby users..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
              >
                <Send size={14} />
              </button>
            </div>
          </section>

          {/* FEATURE 3: FIND HELP (BROADCAST EMERGENCY SOS) */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                <LifeBuoy className="text-emerald-400" /> Find Help & Emergency Response
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Instantly broadcast your coordinates to local emergency response teams and nearby network peers.
              </p>
            </div>

            <button
              onClick={triggerSOS}
              className="w-full bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 animate-pulse transition"
            >
              <PhoneCall size={18} /> BROADCAST EMERGENCY SOS
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}