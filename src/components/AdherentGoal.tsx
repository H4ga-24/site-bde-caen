"use client";

import { useEffect, useState } from "react";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7jG5IgjcvEmfymnE9PMBmngGw0hopjdX9a-bLL2P54LLfPe-kjymBVe2bVF-CIoq8-1ZjnJLpDUBI/pub?gid=87679688&single=true&output=csv";

const MILESTONES = [
  { goal: 1, pct: 0 },
  { goal: 25, pct: 18.5 },
  { goal: 50, pct: 38 },
  { goal: 75, pct: 58 },
  { goal: 100, pct: 78.5 },
  { goal: 200, pct: 100 },
];

function calculateFillPercentage(count: number) {
  if (count <= 1) return count === 1 ? 0 : 0;
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
        // Le paramètre timestamp &t évite que le navigateur garde l'ancien résultat en cache
        const res = await fetch(`${SHEET_CSV_URL}&t=${Date.now()}`);
        const text = await res.text();

        // Découpe les lignes CSV et retire les retours chariot vides
        const lines = text
          .trim()
          .split(/\r?\n/)
          .filter((line) => line.trim() !== "");

        // Nombre d'adhérents = total de lignes moins la première ligne (les titres de colonnes)
        const count = Math.max(0, lines.length - 1);

        setMembers(count);
        setFillHeight(calculateFillPercentage(count));
      } catch (err) {
        console.error("Erreur lors de la lecture du Google Sheet :", err);
      }
    }

    // Lecture immédiate au chargement
    updateCounter();

    // Actualisation automatique toutes les 15 secondes
    const interval = setInterval(updateCounter, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-[460px] mx-auto">
      {/* Conteneur avec l'affiche et le rail */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-[#0d1b3e] border border-white/10">
        <img
          src="/goal.jpg"
          alt="Adhérent Goal"
          className="block w-full h-auto"
        />

        {/* Rail positionné sur la ligne de l'affiche */}
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
          {/* Barre de progression */}
          <div
            className="w-full rounded transition-all duration-1000 ease-out relative"
            style={{
              height: `${fillHeight}%`,
              background: "linear-gradient(180deg, #ffd000, #ff4500)",
              boxShadow: "0 0 10px #ff6a00, 0 0 20px #ff3700",
            }}
          >
            {/* Curseur lumineux */}
            <div
              className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white"
              style={{
                boxShadow: "0 0 10px #ffea00, 0 0 22px #ff3700",
              }}
            />
          </div>
        </div>
      </div>

      {/* Badge du compteur */}
      <div className="mt-5 bg-white/10 backdrop-blur-md px-7 py-3 rounded-full border border-white/15 text-white font-bold text-xl text-center shadow-lg">
        <span className="text-[#ffd000]">{members}</span> / 200 adhérents
      </div>
    </div>
  );
}