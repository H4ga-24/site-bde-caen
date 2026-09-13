import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, Ticket, Calendar } from "lucide-react";
import AdherentGoal from "@/components/AdherentGoal";

const HELLOASSO_LINK = "https://www.helloasso.com/associations/bde-licence-economie-gestion-caen/adhesions/passeport-eco-gestion-2026-2027-adhesion-et-avantages-bde";

export default async function Home() {
  const supabase = await createClient();
  const { data: nextEvent } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(1)
    .single();

  return (
    <div className="w-full">
      {/* Hero Header */}
      <section className="relative bg-brand-navy py-16 text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Portail BDE <span className="text-brand-royal">Éco-Gestion Caen</span>
          </h1>
          <p className="text-gray-300 mb-8 text-base md:text-lg">
            Adhérez pour seulement 3,50 € et débloquez tous les paliers de rentrée, vos cours et vos soirées.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href={HELLOASSO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-gold hover:bg-yellow-500 text-brand-navy font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition"
            >
              Adhérer maintenant <Ticket size={18} />
            </a>
            <Link
              href="/cours"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition"
            >
              Drives de cours <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section Centrale */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Colonne Gauche : Jauge d'adhésion animée */}
        <div>
          <AdherentGoal />
        </div>

        {/* Colonne Droite : Événement & Informations */}
        <div className="space-y-6">
          <div className="bg-brand-navy rounded-3xl p-8 text-white shadow-xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calendar size={100} />
            </div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              Prochain Événement
            </h3>
            {nextEvent ? (
              <div>
                <span className="inline-block bg-brand-royal text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                  {nextEvent.tag || nextEvent.category}
                </span>
                <h4 className="text-2xl font-extrabold mb-2">{nextEvent.title}</h4>
                <p className="text-gray-300 text-sm">
                  {new Date(nextEvent.event_date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  • {nextEvent.location}
                </p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                Aucun événement public pour l'instant. Le bureau prépare l'intégration !
              </p>
            )}
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
            <h3 className="text-xl font-bold text-brand-navy mb-3">Pourquoi adhérer ?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Accès direct aux Drives de cours (L1 et L2)</li>
              <li>• Réductions chez nos commerçants partenaires à Caen</li>
              <li>• Tarifs préférentiels sur les sweats et les soirées</li>
              <li>• Déblocage des paliers funs pour toute la promo</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}