"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import { Skull, Share2, Download, X } from "lucide-react";

// Organ data with better descriptive reports
const ORGANS = [
  {
    id: "delulu",
    name: "Delulu Ventricle",
    emoji: "💭",
    report:
      "Severely enlarged from 47 instances of 'he's just busy'. The patient believed a blue-tick wait meant true love was brewing. Critical failure: chronically inflated hope.",
  },
  {
    id: "ghost",
    name: "Ghosting Aorta",
    emoji: "👻",
    report:
      "Completely blocked since February 2025. Last blood flow detected: one (1) 'Hey'. Habesha ghosting at its finest—even his mother knows more than you do.",
  },
  {
    id: "injera",
    name: "Injera Intestines",
    emoji: "🍞",
    report:
      "Tied in knots after the legendary 3-hour 'who eats the last piece' war. His mother took his side. The intestines never recovered from the betrayal.",
  },
  {
    id: "overthink",
    name: "Overthinker Sinus",
    emoji: "🧠",
    report:
      "Replayed one 'k' message 92 times at 3 AM. Also deep-dived his ex's Instagram, checked his LinkedIn activity, and analyzed his Spotify playlists. Critical inflammation.",
  },
  {
    id: "redflag",
    name: "Red-Flag Coronary",
    emoji: "🚩",
    report:
      "Toxic accumulation of 'he has potential' beliefs. You saw the flags. They were redder than your outfit at Timkat. You simply chose to ignore them.",
  },
  {
    id: "cringe",
    name: "Cringe Pericardium",
    emoji: "😬",
    report:
      "You said 'you too' when he said 'I love you'. In front of his entire family. During a family dinner. The pericardium is permanently scarred.",
  },
  {
    id: "habesha",
    name: "Habesha Hope Vein",
    emoji: "🤞",
    report:
      "Still believing 'next year he will change'. Your mama was betting against you. Your sisters were shaking their heads. Chronic, delusional optimism.",
  },
  {
    id: "moths",
    name: "Butterfly-Moths Atrium",
    emoji: "🦋",
    report:
      "Butterflies died long ago. Now only anxiety moths inhabit this chamber—they arrive at 2 AM and never leave. The atrium is their permanent residence.",
  },
];

const SECRET_ORGAN = {
  id: "amira",
  name: "Amira's Secret Heart",
  emoji: "💝",
  report:
    "Reserved for those who pay attention. You found the secret. This heart knows your pain isn't permanent. Maybe he wasn't worth saving after all.",
};

export default function Home() {
  const [step, setStep] = useState<"intro" | "form" | "lab" | "complete">(
    "intro"
  );
  const [collected, setCollected] = useState<string[]>([]);
  const [selectedOrgan, setSelectedOrgan] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);
  const [answers, setAnswers] = useState(["", "", ""]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showSecret, setShowSecret] = useState(false);
  const [thunder, setThunder] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const organs = [...ORGANS, ...(showSecret ? [SECRET_ORGAN] : [])];

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Easter egg: type "amira"
  useEffect(() => {
    let buffer = "";
    const handleKeyDown = (e: KeyboardEvent) => {
      buffer += e.key.toLowerCase();
      if (buffer.endsWith("amira")) {
        setShowSecret(true);
        speak(
          "You found the secret. This heart was meant for someone who listens."
        );
      }
      if (buffer.length > 8) buffer = buffer.slice(-8);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Thunder flash during lab
  useEffect(() => {
    if (step === "lab") {
      const interval = setInterval(() => {
        if (Math.random() < 0.08) {
          setThunder(true);
          setTimeout(() => setThunder(false), 180);
        }
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [step]);

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.92;
      u.pitch = 0.78;
      window.speechSynthesis.speak(u);
    }
  };

  const handleOrganClick = (organ: any) => {
    if (collected.includes(organ.id)) return;
    setSelectedOrgan(organ);
    setShowReport(true);
    speak(organ.report);
    setCollected((prev) => [...prev, organ.id]);
  };

  const completeAutopsy = () => {
    setStep("complete");
    confetti({
      particleCount: 400,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#dc2626", "#b91c1c"],
    });
    speak("Case closed. Romance is officially dead.");
  };

  const downloadReport = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#1a1a1a",
        scale: 2,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = `autopsy-${selectedOrgan.id}.png`;
      link.click();
    } catch (err) {
      console.error("[v0] Download failed:", err);
    }
  };

  const share = () => {
    const text = `Dr. Amira just autopsied my love life 💀\nFailed organs: ${collected.length}/${organs.length}\n${window.location.href}`;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard! Share with your group chat");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e5e5e5] overflow-hidden">
      {/* Thunder Flash */}
      {thunder && <div className="thunder-flash" />}

      {/* Morgue Spotlight */}
      <div
        className="morgue-spotlight"
        style={{
          "--x": `${mousePos.x}px`,
          "--y": `${mousePos.y}px`,
        } as any}
      />

      {/* Police Tape Top */}
      <div className="fixed top-0 left-0 right-0 h-8 -rotate-3 z-50 flex items-center justify-center police-tape flicker text-black text-xs md:text-sm font-bold">
        POLICE LINE — DO NOT CROSS — LOVE CRIME SCENE
      </div>

      {/* Police Tape Bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-8 rotate-3 z-50 flex items-center justify-center police-tape flicker text-black text-xs md:text-sm font-bold">
        POLICE LINE — DO NOT CROSS — LOVE CRIME SCENE
      </div>

      {/* INTRO SCREEN */}
      {step === "intro" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-screen flex flex-col items-center justify-center text-center px-4"
        >
          <div className="text-8xl mb-8">💀</div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-2 neon-text">
            DR. AMIRA'S
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-[#a0a0a0]">
            LOVE AUTOPSY LAB
          </h2>
          <p className="text-sm md:text-base text-[#a0a0a0] mb-2 font-mono tracking-widest">
            CASE #VDAYMURDER2026
          </p>
          <p className="text-base md:text-lg text-[#808080] mb-12 max-w-md leading-relaxed">
            Your situationship didn't survive. Let's figure out which organs failed.
          </p>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep("form")}
            className="btn-primary text-base md:text-lg px-8 py-3"
          >
            Enter the Lab →
          </motion.button>
          {showSecret && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-sm text-[#ec4899] font-mono"
            >
              SECRET UNLOCKED
            </motion.p>
          )}
        </motion.div>
      )}

      {/* FORM SCREEN */}
      {step === "form" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center px-4 py-20"
        >
          <div className="max-w-2xl w-full">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Victim Statement</h1>
              <p className="text-[#a0a0a0]">
                Tell us about the crime. Complete honesty required.
              </p>
            </div>

            <div className="space-y-8">
              {[
                "How did it die? (ghosted, fought, said 'k', etc.)",
                "Last words from the suspect?",
                "One red flag you ignored?",
              ].map((question, i) => (
                <div key={i}>
                  <label className="block text-sm font-mono text-[#a0a0a0] mb-3">
                    {question}
                  </label>
                  <input
                    type="text"
                    value={answers[i]}
                    onChange={(e) => {
                      const newAns = [...answers];
                      newAns[i] = e.target.value;
                      setAnswers(newAns);
                    }}
                    placeholder="Type here..."
                    className="w-full"
                  />
                </div>
              ))}

              <button
                onClick={() => setStep("lab")}
                disabled={answers.some((a) => a.trim().length < 3)}
                className="btn-primary w-full mt-12 text-base md:text-lg py-3"
              >
                Take me to the body →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* LAB SCREEN */}
      {step === "lab" && (
        <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-20 gap-12">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] bg-[length:40px_40px] opacity-20 pointer-events-none" />

          {/* Heart */}
          <div className="relative w-full md:w-1/2 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.8, repeat: Infinity }}
              className="w-64 h-64 md:w-72 md:h-72 pulse-heart"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full text-[#dc2626] drop-shadow-[0_0_40px_#dc2626]"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </motion.div>
          </div>

          {/* Organs Grid */}
          <div className="relative w-full md:w-1/2 z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-8">Collect Evidence</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {organs.map((organ) => (
                <motion.button
                  key={organ.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOrganClick(organ)}
                  disabled={collected.includes(organ.id)}
                  className={`card-crime-scene text-center ${
                    collected.includes(organ.id)
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="text-4xl md:text-5xl mb-3">{organ.emoji}</div>
                  <div className="text-xs md:text-sm font-mono font-bold tracking-wide line-clamp-1">
                    {organ.name.split(" ")[0]}
                  </div>
                  {collected.includes(organ.id) && (
                    <div className="text-xs text-[#80c080] mt-2">✓ Collected</div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mb-8 p-4 card-crime-scene">
              <p className="text-xs text-[#a0a0a0] mb-2 font-mono">
                EVIDENCE COLLECTED
              </p>
              <div className="w-full bg-[#262626] rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(collected.length / organs.length) * 100}%`,
                  }}
                  className="bg-[#dc2626] h-2 rounded-full"
                />
              </div>
              <p className="text-xs text-[#a0a0a0] mt-2 font-mono">
                {collected.length}/{organs.length} organs
              </p>
            </div>

            {/* Complete button */}
            {collected.length >= (showSecret ? 7 : 6) && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={completeAutopsy}
                className="btn-primary w-full text-base md:text-lg py-3"
              >
                Complete Autopsy →
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      <AnimatePresence>
        {showReport && selectedOrgan && (
          <div
            className="modal-overlay"
            onClick={() => setShowReport(false)}
          >
            <motion.div
              ref={reportRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content max-w-lg w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowReport(false)}
                className="absolute top-4 right-4 p-2 hover:bg-[#262626] rounded-lg transition-all z-10"
              >
                <X size={20} />
              </button>

              {/* Polaroid Header */}
              <div className="bg-white p-6 text-center">
                <div className="text-5xl mb-3">{selectedOrgan.emoji}</div>
                <h3 className="text-xl font-bold text-black">
                  {selectedOrgan.name}
                </h3>
                <p className="text-xs text-[#666] font-mono mt-2">
                  {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Report Header */}
              <div className="bg-[#dc2626] px-6 py-4 flex items-center gap-3">
                <Skull size={24} />
                <span className="font-bold text-lg">Forensic Report</span>
              </div>

              {/* Report Content */}
              <div className="p-8 bg-[#1a1a1a] min-h-48">
                <p className="text-base md:text-lg leading-relaxed text-[#e5e5e5]">
                  {selectedOrgan.report}
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-[#262626] border-t border-[#333] flex items-center justify-between gap-4">
                <p className="text-xs text-[#808080] font-mono">
                  Voice active • Close to dismiss
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadReport();
                  }}
                  className="btn-secondary text-sm flex items-center gap-2 py-2 px-3"
                >
                  <Download size={16} />
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPLETE SCREEN */}
      {step === "complete" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20"
        >
          <div className="text-7xl md:text-8xl mb-8">💀</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 neon-text">
            Case Closed
          </h1>
          <p className="text-base md:text-lg text-[#a0a0a0] mb-12 font-mono">
            Romance pronounced dead • {new Date().toLocaleDateString()}
          </p>

          {/* Evidence Board */}
          <div className="max-w-2xl w-full evidence-board texture-cork p-8 rounded-lg mb-12">
            <div className="pin" style={{ top: "-10px", left: "20%" }} />
            <div className="pin" style={{ top: "-10px", right: "20%" }} />

            <div className="mb-8">
              <h3 className="text-lg font-bold text-black mb-1">
                Evidence Collected
              </h3>
              <p className="text-sm text-[#333] font-mono">
                {collected.length} of {organs.length} organs analyzed
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {collected.map((id) => {
                const organ = organs.find((o) => o.id === id);
                return (
                  <div key={id} className="bg-white/30 p-4 rounded">
                    <div className="text-3xl mb-2">{organ?.emoji}</div>
                    <p className="text-xs font-bold text-black line-clamp-2">
                      {organ?.name}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-[#333] italic font-mono">
              Dr. Amira's Investigation Report • Case #{new Date().getFullYear()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={share}
              className="btn-primary flex items-center justify-center gap-2 px-6 py-3"
            >
              <Share2 size={18} />
              Share Results
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setStep("intro");
                setCollected([]);
                setAnswers(["", "", ""]);
              }}
              className="btn-secondary flex items-center justify-center gap-2 px-6 py-3"
            >
              Start New Case
            </motion.button>
          </div>

          <p className="text-xs text-[#666] mt-12 font-mono">
            Made by @amiprin7 • Valentine's 2026
          </p>
        </motion.div>
      )}
    </div>
  );
}

interface Organ {
  id: number;
  name: string;
  label: string;
  report: string;
  voiceText: string;
  x: string;
  y: string;
}

const organs: Organ[] = [
  { id: 1, name: "Delulu Left Ventricle", label: "DELULU", report: "Severely enlarged from 47 instances of 'he's just busy'. Cause: chronic hope. The valves are permanently stuck in the 'maybe he'll text' phase.", voiceText: "Detective... the Delulu Ventricle is critically enlarged.", x: "38%", y: "32%" },
  { id: 2, name: "Ghosting Aorta", label: "GHOST", report: "Completely blocked. Last blood flow: February 2025. Classic Habesha ghosting—left you on read since the Genna. His family knows more than you do.", voiceText: "The Ghosting Aorta shows total occlusion.", x: "62%", y: "28%" },
  { id: 3, name: "Injera Intestines", label: "INJERA", report: "Tied in knots after the 3-hour 'who eats the last piece' fight. Your mama's opinions didn't help. This intestine never recovered.", voiceText: "Injera Intestines are in complete disarray.", x: "45%", y: "55%" },
  { id: 4, name: "Overthinker Sinus Node", label: "OVERTHINK", report: "Replayed one 'k' message 92 times at 3 AM. Also analyzed his LinkedIn profile history. Also checked if his ex liked his Instagram post.", voiceText: "The Overthinker node is in arrhythmia.", x: "55%", y: "42%" },
  { id: 5, name: "Red-Flag Coronary", label: "RED FLAG", report: "Toxic levels of 'he has potential' detected. The flags were redder than your outfit at Timkat. You knew. You just didn't care.", voiceText: "Coronary artery flooded with red flags.", x: "30%", y: "48%" },
  { id: 6, name: "Cringe Pericardium", label: "CRINGE", report: "You said 'you too' when he said 'I love you'. In front of his mother. At a family dinner. The pericardium is permanently humiliated.", voiceText: "Pericardium shows extreme cringe inflammation.", x: "68%", y: "52%" },
  { id: 7, name: "Habesha Hope Pulmonary Vein", label: "HABESHA HOPE", report: "Still believing 'next time he'll change'. Habesha mothers were betting on this too. The vein is delusional beyond repair.", voiceText: "Pulmonary vein full of false Habesha hope.", x: "48%", y: "65%" },
  { id: 8, name: "Butterfly Moths Atrium", label: "MOTHS", report: "Butterflies died long ago. Only anxiety moths remain—they arrive at 2 AM and bring their friends. The atrium is now their mansion.", voiceText: "Atrium now inhabited by moths of anxiety.", x: "52%", y: "38%" },
];

const questions = [
  "How did the victim die? (ghosted / fought / said k / etc.)",
  "Last words from the suspect? (paste text or describe)",
  "One red flag you completely ignored?",
];

// Utility: Encode/decode state to URL
const encodeState = (answers: string[], collected: number[]) => {
  return Buffer.from(JSON.stringify({ answers, collected })).toString("base64");
};

const decodeState = (encoded: string) => {
  try {
    return JSON.parse(Buffer.from(encoded, "base64").toString());
  } catch {
    return null;
  }
};

// Easter egg: detect 'AMIRA' key sequence
const useEasterEggDetection = (callback: () => void) => {
  const [sequence, setSequence] = useState("");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const newSeq = sequence + e.key.toUpperCase();
      const target = "AMIRA";
      
      if (newSeq.endsWith(target)) {
        callback();
        setSequence("");
      } else if (target.startsWith(newSeq)) {
        setSequence(newSeq);
      } else {
        setSequence(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sequence, callback]);
};

export default function Home() {
  const [step, setStep] = useState<"intro" | "intake" | "lab" | "complete">("intro");
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [collected, setCollected] = useState<number[]>([]);
  const [selectedOrgan, setSelectedOrgan] = useState<Organ | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [unlockedEasterEgg, setUnlockedEasterEgg] = useState(false);
  const [showThunderFlash, setShowThunderFlash] = useState(false);
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);

  // Load state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const state = params.get("state");
    
    if (state) {
      const decoded = decodeState(state);
      if (decoded) {
        setAnswers(decoded.answers);
        setCollected(decoded.collected);
        setStep("lab");
      }
    }
  }, []);

  // Mouse spotlight
  useEffect(() => {
    const move = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Easter egg detection
  useEasterEggDetection(() => {
    setUnlockedEasterEgg(true);
    speak("You found the secret... How very Habesha of you.");
  });

  // Thunder flash on heart pulse
  useEffect(() => {
    if (step === "lab") {
      const interval = setInterval(() => {
        if (Math.random() > 0.94) {
          setShowThunderFlash(true);
          setTimeout(() => setShowThunderFlash(false), 120);
        }
      }, 2800);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Typewriter effect for report
  useEffect(() => {
    if (!showReport || !selectedOrgan) return;
    
    const text = selectedOrgan.report;
    if (typewriterIndex < text.length) {
      const timer = setTimeout(() => setTypewriterIndex(prev => prev + 1), 25);
      return () => clearTimeout(timer);
    }
  }, [showReport, selectedOrgan, typewriterIndex]);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.92;
      u.pitch = 0.78;
      window.speechSynthesis.speak(u);
    }
  };

  const handleOrganClick = (organ: Organ) => {
    if (collected.includes(organ.id)) return;
    setSelectedOrgan(organ);
    setShowReport(true);
    setTypewriterIndex(0);
    speak(organ.voiceText);
    setTimeout(() => speak(organ.report), 1200);
    setCollected(prev => [...prev, organ.id]);
  };

  const completeAutopsy = () => {
    setStep("complete");
    confetti({ particleCount: 400, spread: 100, origin: { y: 0.6 }, colors: ["#ef4444", "#b91c1c"] });
    speak("Case closed. Romance is officially dead.");
  };

  const share = () => {
    const shareUrl = `${window.location.origin}?state=${encodeState(answers, collected)}`;
    const text = `Dr. Amira just autopsied my love life 💀\nFailed organs: ${collected.length}/8\n${shareUrl}`;
    navigator.clipboard.writeText(text);
    alert("Copied! Send to your group chat 😂");
  };

  const downloadReport = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#0a0a0a",
        scale: 2,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "love-autopsy-report.png";
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // Add secret 9th organ if easter egg unlocked
  const displayOrgans = unlockedEasterEgg 
    ? [...organs, {
        id: 9,
        name: "Amira's Secret Heart",
        label: "SECRET",
        report: "Reserved for the one who pays attention. Found you in the sequence. This heart beats for those who appreciate dark humor and Habesha culture. Maybe he's worth saving after all?",
        voiceText: "A secret has been revealed...",
        x: "50%",
        y: "50%",
      }]
    : organs;

  return (
    <div className="min-h-screen overflow-hidden bg-[#0a0a0a] text-white relative">
      {/* Thunder Flash */}
      {showThunderFlash && (
        <div className="fixed inset-0 bg-white/40 pointer-events-none z-30 animate-pulse" />
      )}

      {/* Mouse Spotlight */}
      <div className="spotlight" style={{ "--x": `${mousePos.x}px`, "--y": `${mousePos.y}px` } as any} />

      {/* Police Tape */}
      <div className="police-tape absolute top-0 left-0 right-0 h-8 rotate-[-3deg] z-50 flex items-center justify-center text-black font-bold text-sm tracking-[4px] flicker">
        POLICE LINE — DO NOT CROSS — LOVE CRIME SCENE
      </div>
      <div className="police-tape absolute bottom-0 left-0 right-0 h-8 rotate-[3deg] z-50 flex items-center justify-center text-black font-bold text-sm tracking-[4px] flicker">
        POLICE LINE — DO NOT CROSS — LOVE CRIME SCENE
      </div>

      {/* INTRO SCREEN */}
      {step === "intro" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="text-7xl mb-6">💀🔬</div>
          <h1 className="text-6xl md:text-8xl font-bold neon-pink tracking-tighter flicker">DR. AMIRA'S</h1>
          <h2 className="text-5xl md:text-7xl font-bold neon-cyan -mt-4 tracking-[6px]">LOVE AUTOPSY LAB</h2>
          <p className="mt-8 text-xl md:text-2xl max-w-md">Case #VDayMurder2026<br />Your situationship didn't survive.</p>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep("intake")}
            className="mt-16 px-16 py-6 bg-red-600 hover:bg-red-700 text-2xl font-bold rounded-full flex items-center gap-4 shadow-2xl shadow-red-900"
          >
            ENTER THE MORGUE <Play className="w-8 h-8" />
          </motion.button>
          {unlockedEasterEgg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-pink-400 text-sm italic">
              ✨ Secret unlocked ✨
            </motion.div>
          )}
        </motion.div>
      )}

      {/* INTAKE FORM */}
      {step === "intake" && (
        <div className="max-w-2xl mx-auto pt-32 px-6 pb-20">
          <h2 className="text-4xl font-bold text-center mb-12 neon-pink">VICTIM STATEMENT</h2>
          {questions.map((q, i) => (
            <div key={i} className="mb-10">
              <p className="text-xl mb-3">{q}</p>
              <input
                type="text"
                value={answers[i]}
                onChange={(e) => {
                  const newAns = [...answers];
                  newAns[i] = e.target.value;
                  setAnswers(newAns);
                }}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-pink-500 p-5 text-xl rounded-xl outline-none"
                placeholder="Be brutally honest..."
              />
            </div>
          ))}
          <button
            onClick={() => setStep("lab")}
            disabled={answers.some(a => a.trim().length < 3)}
            className="w-full py-7 bg-gradient-to-r from-red-600 to-pink-600 text-2xl font-bold rounded-2xl disabled:opacity-50"
          >
            TAKE ME TO THE BODY
          </button>
        </div>
      )}

      {/* LAB SCREEN */}
      {step === "lab" && (
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] bg-[length:40px_40px] opacity-40" />

          <div className="relative w-[420px] h-[420px] md:w-[500px] md:h-[500px]">
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.8, repeat: Infinity }}
              className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Diagram_of_the_human_heart_%28no_labels%29.svg/800px-Diagram_of_the_human_heart_%28no_labels%29.svg.png')] bg-contain bg-center bg-no-repeat filter drop-shadow-[0_0_120px_#ef4444]"
            />

            {displayOrgans.map(organ => (
              <motion.div
                key={organ.id}
                style={{ left: organ.x, top: organ.y }}
                className="absolute w-20 h-20 md:w-24 md:h-24 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                whileHover={{ scale: 1.4, rotate: 8 }}
                onClick={() => handleOrganClick(organ)}
              >
                <div className="w-6 h-6 bg-yellow-400 absolute -top-3 -right-3 rotate-45 flex items-center justify-center text-xs font-bold text-black border-2 border-black"> {organ.id} </div>
                <div className={`absolute inset-0 border-2 rounded-full flex items-center justify-center text-xs md:text-sm font-mono tracking-widest bg-black/70 ${organ.id === 9 ? 'border-pink-500 text-pink-300' : 'border-yellow-400 text-yellow-300'}`}>
                  {organ.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Evidence Log - Corkboard Style */}
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-corkboard border-4 border-yellow-600 p-6 w-72 rounded-xl shadow-2xl shadow-black/80 relative">
            {/* Push pins */}
            <div className="absolute -top-3 left-1/4 w-5 h-5 bg-red-600 rounded-full shadow-md shadow-red-900" />
            <div className="absolute -top-3 right-1/4 w-5 h-5 bg-red-600 rounded-full shadow-md shadow-red-900" />
            
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-yellow-400" />
              <span className="text-xl font-bold">EVIDENCE LOG</span>
            </div>
            {collected.length === 0 && <p className="text-gray-500 italic text-center py-8">Click organs to collect evidence...</p>}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {collected.map(id => {
                const o = displayOrgans.find(org => org.id === id)!;
                return (
                  <motion.div
                    key={id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={`text-sm ${o.id === 9 ? 'text-pink-300' : 'text-yellow-200'}`}
                  >
                    ✓ {o.name}
                  </motion.div>
                );
              })}
            </div>
            {collected.length >= (unlockedEasterEgg ? 9 : 6) && (
              <motion.button whileHover={{ scale: 1.05 }} onClick={completeAutopsy} className="mt-8 w-full py-5 bg-red-600 font-bold text-xl rounded-xl hover:bg-red-700">
                COMPLETE AUTOPSY
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      <AnimatePresence>
        {showReport && selectedOrgan && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setShowReport(false)}>
            <motion.div
              ref={reportRef}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-zinc-900 border-4 border-red-600 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl shadow-red-900/50 relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Polaroid-style top */}
              <div className="bg-white p-3 pb-12 text-center">
                <div className="text-black font-bold text-lg mb-1">FORENSIC REPORT</div>
                <div className="text-red-600 font-mono text-xs">Case #{selectedOrgan.id} — {new Date().toLocaleDateString()}</div>
              </div>

              <div className="bg-red-900 px-8 py-4 flex items-center gap-3">
                <Skull className="w-8 h-8" />
                <span className="text-2xl font-bold">{selectedOrgan.name}</span>
              </div>
              
              <div className="p-10 text-lg leading-relaxed min-h-32 bg-zinc-950">
                <span className="text-yellow-300">
                  {selectedOrgan.report.substring(0, typewriterIndex)}
                </span>
                {typewriterIndex < selectedOrgan.report.length && (
                  <span className="animate-pulse">|</span>
                )}
              </div>

              <div className="p-4 border-t border-zinc-700 text-center text-sm text-gray-400">
                Click outside to close • Voice narration active
              </div>

              {/* Download button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadReport();
                }}
                className="absolute top-4 right-4 p-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg transition"
                title="Download as PNG"
              >
                <Download className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPLETE SCREEN */}
      {step === "complete" && (
        <div className="h-screen flex items-center justify-center relative px-4">
          <div className="text-center">
            <div className="text-[180px] mb-6 animate-bounce">💀</div>
            <h1 className="text-7xl font-bold neon-pink mb-4">CASE CLOSED</h1>
            <p className="text-3xl mb-12">Romance pronounced dead — 14 Feb 2026</p>
            <div className="max-w-md mx-auto bg-corkboard border-4 border-yellow-600 p-8 rounded-2xl text-left shadow-xl">
              <div className="text-yellow-700 font-bold mb-6 text-lg">COLLECTED EVIDENCE:</div>
              <div className="space-y-2">
                {collected.map(id => (
                  <div key={id} className="text-yellow-900 font-mono text-sm">
                    • {displayOrgans.find(o => o.id === id)!.name}
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t-2 border-yellow-700 text-yellow-700 text-sm">
                Total organs analyzed: {collected.length}/{displayOrgans.length}
              </div>
            </div>
            <div className="flex gap-4 mt-12 justify-center flex-wrap">
              <button
                onClick={share}
                className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-yellow-300 transition"
              >
                SHARE <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setStep("intro")}
                className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-full hover:bg-red-700 transition"
              >
                NEW CASE
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-zinc-600 text-center">
        Made with savage love by @amiprin7 — Valentine's 2026<br />
        {unlockedEasterEgg && <span className="text-pink-400">Secret unlocked ✨</span>}
      </div>
    </div>
  );
}
