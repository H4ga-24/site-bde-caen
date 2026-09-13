"use client";

import { useEffect, useState } from "react";

const MILESTONES = [
  { goal: 1, pct: 0 },
  { goal: 25, pct: 18.5 },
  { goal: 50, pct: 38 },
  { goal: 75, pct: 58 },
  { goal: 100, pct: 78.5 },
  { goal: 200, pct: 100 },
];

function calculateFillPercentage(count: number) {
  if (count <= 1) return 0;
  if (count >= 200) return 100;
  for (let i = 0; i < MILESTONES.length - 1; i++) {
    const current = MILESTONES[i];
    const next = MILESTONES[i + 1];
    if (count >= current.goal && count <= next.goal) {
      const ratio = (count - current.goal) / (next.goal - current.goal);
      return current.pct + ratio * (next.pct - current.pct);
    }
  }
  return 0;
}

export default function AdherentGoal() {
  const [members, setMembers] = useState<number>(0);
  const [fillHeight, setFillHeight] = useState<number>(0);

  useEffect(() => {
    async function updateCounter() {
      try {
        const res = await fetch(`/api/adherent-count?t=${Date.now()}`);
        const data = await res.json();
        const count = data.count || 0;
        setMembers(count);
        setFillHeight(calculateFillPercentage(count));
      } catch (err) {
        console.error("Erreur compteur adhérents :", err);
      }
    }

    updateCounter();
    const interval = setInterval(updateCounter, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-[460px] mx-auto">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-[#0d1b3e] border border-white/10">
        <img
          src="/goal.jpg"
          alt="Adhérent Goal"
          className="block w-full h-auto"
        />
        <div
          className="absolute pointer-events-none"
          style={{
            left: "23.3%",
            top: "26.5%",
            bottom: "24%",
            width: "6px",
            transform: "translateX(-50%)",
          }}
        >
          <div
            className="w-full rounded transition-all duration-1000 ease-out relative"
            style={{
              height: `${fillHeight}%`,
              background: "linear-gradient(180deg, #ffd000, #ff4500)",
              boxShadow: "0 0 10px #ff6a00, 0 0 20px #ff3700",
            }}
          >
            <div
              className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white"
              style={{
                boxShadow: "0 0 10px #ffea00, 0 0 22px #ff3700",
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 bg-white/10 backdrop-blur-md px-7 py-3 rounded-full border border-white/15 text-white font-bold text-xl text-center shadow-lg">
        <span className="text-[#ffd000]">{members}</span> / 200 adhérents
      </div>
    </div>
  );
}