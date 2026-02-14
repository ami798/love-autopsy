"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Skull, FileText, Share2, Play } from "lucide-react";

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
  { id: 1, name: "Delulu Left Ventricle", label: "DELULU", report: "Severely enlarged from 47 instances of 'he's just busy'. Cause: chronic hope.", voiceText: "Detective... the Delulu Ventricle is critically enlarged.", x: "38%", y: "32%" },
  { id: 2, name: "Ghosting Aorta", label: "GHOST", report: "Completely blocked. Last blood flow: February 2025. Classic Habesha ghosting.", voiceText: "The Ghosting Aorta shows total occlusion.", x: "62%", y: "28%" },
  { id: 3, name: "Injera Intestines", label: "INJERA", report: "Tied in knots after the 3-hour 'who eats the last piece' fight.", voiceText: "Injera Intestines are in complete disarray.", x: "45%", y: "55%" },
  { id: 4, name: "Overthinker Sinus Node", label: "OVERTHINK", report: "Replayed one 'k' message 92 times at 3 AM.", voiceText: "The Overthinker node is in arrhythmia.", x: "55%", y: "42%" },
  { id: 5, name: "Red-Flag Coronary", label: "RED FLAG", report: "Toxic levels of 'he has potential' detected.", voiceText: "Coronary artery flooded with red flags.", x: "30%", y: "48%" },
  { id: 6, name: "Cringe Pericardium", label: "CRINGE", report: "You said 'you too' when he said 'I love you'.", voiceText: "Pericardium shows extreme cringe inflammation.", x: "68%", y: "52%" },
  { id: 7, name: "Habesha Hope Pulmonary Vein", label: "HABESHA HOPE", report: "Still believing 'next time he'll change'.", voiceText: "Pulmonary vein full of false Habesha hope.", x: "48%", y: "65%" },
  { id: 8, name: "Butterfly Moths Atrium", label: "MOTHS", report: "Butterflies died. Only anxiety moths remain.", voiceText: "Atrium now inhabited by moths of anxiety.", x: "52%", y: "38%" },
];

const questions = [
  "How did the victim die? (ghosted / fought / said k / etc.)",
  "Last words from the suspect? (paste text or describe)",
  "One red flag you completely ignored?",
];

export default function Home() {
  const [step, setStep] = useState<"intro" | "intake" | "lab" | "complete">("intro");
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [collected, setCollected] = useState<number[]>([]);
  const [selectedOrgan, setSelectedOrgan] = useState<Organ | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse spotlight (morgue lamp effect)
  useEffect(() => {
    const move = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
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
    speak(organ.voiceText);
    speak(organ.report);
    setCollected(prev => [...prev, organ.id]);
  };

  const completeAutopsy = () => {
    setStep("complete");
    confetti({ particleCount: 400, spread: 100, origin: { y: 0.6 }, colors: ["#ef4444", "#b91c1c"] });
    speak("Case closed. Romance is officially dead.");
  };

  const share = () => {
    const text = `Dr. Amira just autopsied my love life 💀\nFailed organs: ${collected.length}\nSee yours: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    alert("Copied! Send to your group chat 😂");
  };

  useEffect(() => {
    if (step === "intro") setTimeout(() => speak("Welcome to the lab, Detective. Romance has been murdered."), 800);
  }, [step]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#0a0a0a] text-white relative">
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
        </motion.div>
      )}

      {/* INTAKE FORM */}
      {step === "intake" && (
        <div className="max-w-2xl mx-auto pt-32 px-6">
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

            {organs.map(organ => (
              <motion.div
                key={organ.id}
                style={{ left: organ.x, top: organ.y }}
                className="absolute w-20 h-20 md:w-24 md:h-24 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                whileHover={{ scale: 1.4, rotate: 8 }}
                onClick={() => handleOrganClick(organ)}
              >
                <div className="w-6 h-6 bg-yellow-400 absolute -top-3 -right-3 rotate-45 flex items-center justify-center text-xs font-bold text-black border-2 border-black"> {organ.id} </div>
                <div className="absolute inset-0 border-2 border-yellow-400 rounded-full flex items-center justify-center text-xs md:text-sm font-mono text-yellow-300 tracking-widest bg-black/70">
                  {organ.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Evidence Log (corkboard style) */}
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-zinc-950 border border-yellow-400/30 p-6 w-72 rounded-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-yellow-400" />
              <span className="text-xl font-bold">EVIDENCE LOG</span>
            </div>
            {collected.length === 0 && <p className="text-gray-500 italic text-center py-8">Click organs to collect evidence...</p>}
            {collected.map(id => {
              const o = organs.find(org => org.id === id)!;
              return <div key={id} className="text-yellow-200 mb-3">✓ {o.name}</div>;
            })}
            {collected.length >= 6 && (
              <motion.button whileHover={{ scale: 1.05 }} onClick={completeAutopsy} className="mt-8 w-full py-5 bg-red-600 font-bold text-xl rounded-xl">
                COMPLETE AUTOPSY
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      <AnimatePresence>
        {showReport && selectedOrgan && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setShowReport(false)}>
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} className="bg-zinc-900 border border-red-600 max-w-lg w-full mx-4 rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-red-900 px-8 py-4 flex items-center gap-3">
                <Skull className="w-8 h-8" />
                <span className="text-2xl font-bold">FORENSIC REPORT #{selectedOrgan.id}</span>
              </div>
              <div className="p-10 text-lg leading-relaxed">{selectedOrgan.report}</div>
              <div className="p-4 border-t border-zinc-700 text-center text-sm text-gray-400">Click outside to close • Voice narration active</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPLETE SCREEN */}
      {step === "complete" && (
        <div className="h-screen flex items-center justify-center relative">
          <div className="text-center">
            <div className="text-[180px] mb-6">💀</div>
            <h1 className="text-7xl font-bold neon-pink mb-4">CASE CLOSED</h1>
            <p className="text-3xl mb-12">Romance pronounced dead — 14 Feb 2026</p>
            <div className="max-w-md mx-auto bg-zinc-950 border border-red-600 p-8 rounded-2xl text-left">
              <div className="text-yellow-400 mb-6">COLLECTED EVIDENCE:</div>
              {collected.map(id => <div key={id} className="mb-2">• {organs.find(o => o.id === id)!.name}</div>)}
            </div>
            <button onClick={share} className="mt-12 flex items-center gap-4 mx-auto px-12 py-6 bg-white text-black font-bold text-2xl rounded-full hover:bg-yellow-300">
              SHARE MY AUTOPSY <Share2 />
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-zinc-600">Made with savage love by @amiprin7 — Valentine's 2026</div>
    </div>
  );
}