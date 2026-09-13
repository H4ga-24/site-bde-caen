"use client";

import { useState } from "react";
import { 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Ticket,
  PartyPopper,
  Info
} from "lucide-react";

// Lien officiel de la campagne HelloAsso
const HELLOASSO_LINK = "https://www.helloasso.com/associations/bde-licence-economie-gestion-caen/adhesions/passeport-eco-gestion-2026-2027-adhesion-et-avantages-bde";

// Liens des dossiers Drive officiels L1 et L2
const DRIVE_LINKS = {
  L1: "https://drive.google.com/drive/folders/1Bjug614CEf9dRMgPK44Qj5XrPopuf28t?usp=drive_link",
  L2: "https://drive.google.com/drive/folders/1lQ4om8Hb6fXPC0gYszsdpJykOUlSVqD3?usp=drive_link",
};

export default function CoursPage() {
  const [selectedLevel, setSelectedLevel] = useState<"L1" | "L2">("L1");

  return (
    <div className="min-h-[85vh] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* En-tête */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <BookOpen size={16} /> Espace Pédagogique
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Banque de Cours & Annales
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Accédez aux dossiers partagés de cours, fiches de révision et annales d'examens. 
          L'accès est accordé automatiquement sur Google Drive dès validation de votre adhésion.
        </p>
      </div>

      {/* Rappel adhésion HelloAsso */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0">
            <Ticket size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Pas encore accès aux dossiers Google Drive ?
            </h3>
            <p className="text-xs text-gray-600">
              Cotisez au BDE pour seulement 3,50 € sur HelloAsso afin de débloquer l'accès avec votre adresse universitaire.
            </p>
          </div>
        </div>
        <a
          href={HELLOASSO_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
        >
          <Sparkles size={16} /> Adhérer (3,50 €)
        </a>
      </div>

      {/* Sélecteur de niveau : L1 et L2 uniquement */}
      <div className="flex justify-center gap-2 sm:gap-3 p-1.5 bg-gray-200/60 rounded-2xl max-w-xs mx-auto">
        {(["L1", "L2"] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition ${
              selectedLevel === lvl
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Licence {lvl.slice(1)}
          </button>
        ))}
      </div>

      {/* Carte du Drive actif */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm max-w-xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <BookOpen size={32} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dossier Drive — {selectedLevel} Éco-Gestion
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Polycopiés de cours, fiches de révisions, TD et annales d'examens pour le semestre 1 et le semestre 2.
          </p>
        </div>

        <div>
          <a
            href={DRIVE_LINKS[selectedLevel]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl transition shadow text-sm w-full sm:w-auto"
          >
            <ExternalLink size={18} />
            Ouvrir le Google Drive {selectedLevel}
          </a>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-100">
          <Info size={14} />
          <span>Connectez-vous avec l'adresse email renseignée sur HelloAsso.</span>
        </div>
      </div>

      {/* Encadré pour les adhérents "Autre filière / Soirées" */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6 max-w-xl mx-auto flex items-start gap-4">
        <div className="p-2.5 bg-purple-600 text-white rounded-xl shrink-0">
          <PartyPopper size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Adhérent extérieur ou autre licence ?
          </h3>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Même si vous n'êtes pas en L1 ou L2 Éco-Gestion, votre adhésion vous donne accès à toutes les réductions partenaires et aux tarifs préférentiels pour nos soirées et événements !
          </p>
        </div>
      </div>

    </div>
  );
}