"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import { Skull, FileText, Share2, Play, Download } from "lucide-react";

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
