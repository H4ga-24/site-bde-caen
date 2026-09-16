"use client";

import { useState } from "react";
import { Lightbulb, Send, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function FeedbackBox() {
  const [idea, setIdea] = useState("");
  const [category, setCategory] = useState("Soirée / Bar");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    try {
      await supabase.from("suggestions").insert([
        { content: idea, category: category }
      ]);
    } catch {
      // Évite de bloquer l'UI si la table distante n'est pas configurée
    }

    setLoading(false);
    setSubmitted(true);
    setIdea("");
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-2.5 text-amber-800 font-bold text-base mb-1">
        <Lightbulb size={20} className="text-amber-600" />
        <h3>Boîte à Idées & Sondage Flash</h3>
      </div>
      <p className="text-xs text-amber-900/80 mb-4">
        Une idée de soirée, un tournoi e-sport, un voyage ou un partenariat ? Dis-le nous de façon anonyme.
      </p>

      {submitted ? (
        <div className="bg-white/80 border border-amber-200 rounded-2xl p-4 text-center space-y-1">
          <CheckCircle2 size={24} className="text-emerald-500 mx-auto" />
          <p className="font-bold text-xs text-slate-800">Merci pour ton idée !</p>
          <p className="text-[11px] text-slate-500">L'équipe du bureau en discute lors de la prochaine réunion.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-[11px] text-amber-700 font-semibold underline pt-1 block mx-auto"
          >
            Envoyer une autre idée
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {["Soirée / Bar", "Tournoi Sport / E-sport", "Cours & Révisions", "Goodies / Sweats"].map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                  category === cat
                    ? "bg-amber-500 text-white font-bold"
                    : "bg-white/80 text-amber-900 hover:bg-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <textarea
            rows={2}
            required
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Ex : Organiser un blind test au bar Rue Écuyère..."
            className="w-full px-3.5 py-2.5 bg-white border border-amber-200 rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-500"
          />

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              <Send size={13} />
              <span>{loading ? "Envoi..." : "Envoyer anonymement"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}