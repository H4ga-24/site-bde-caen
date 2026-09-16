import Link from "next/link";
import { 
  BookOpen, 
  Sparkles, 
  PartyPopper, 
  ShieldCheck, 
  ArrowRight, 
  GraduationCap, 
  Download, 
  Users 
} from "lucide-react";

const HELLOASSO_LINK =
  "https://www.helloasso.com/associations/bde-licence-economie-gestion-caen/adhesions/passeport-eco-gestion-2026-2027-adhesion-et-avantages-bde";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Halo lumineux en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-brand-royal/25 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-[350px] h-[250px] bg-brand-gold/15 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
        {/* Badge Pilule */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200 text-slate-800 shadow-sm backdrop-blur-md text-xs sm:text-sm font-semibold mb-8">
          <Sparkles size={16} className="text-amber-500" />
          <span>Année universitaire 2026 - 2027</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Titre Impactant */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
          Réussis ton année. <br />
          <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-500 bg-clip-text text-transparent">
            Profite de ta vie étudiante.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed mb-10">
          Rejoins le BDE Éco-Gestion de l'Université de Caen. Débloque tous les cours et annales L1/L2, accède aux réductions soirées et participe aux événements du campus.
        </p>

        {/* Call to Action Principal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={HELLOASSO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold px-8 py-4 rounded-2xl text-base shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Prendre mon adhésion (3,50 €)</span>
            <ArrowRight size={18} />
          </a>

          <Link
            href="/cours"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-slate-700 border border-slate-200 font-semibold px-6 py-4 rounded-2xl text-base transition shadow-sm hover:border-slate-300"
          >
            <BookOpen size={18} className="text-blue-600" />
            <span>Explorer les cours</span>
          </Link>
        </div>

        {/* Reassurance text */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-600" /> Paiement sécurisé HelloAsso
          </span>
          <span>•</span>
          <span>Accès direct aux Drives</span>
        </div>
      </section>

      {/* Grille des 3 Piliers (Cartes Modernes) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Carte 1 */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all hover:border-blue-200 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Download size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Drives & Annales</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Fiches de révision, partiels des années passées et synthèses de cours pour la L1 et la L2 triés par matière.
            </p>
          </div>

          {/* Carte 2 */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all hover:border-amber-200 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PartyPopper size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Tarifs Avantages</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tarifs réduits réservés aux adhérents pour les soirées partenaires, le gala de fin d'année et les goodies du BDE.
            </p>
          </div>

          {/* Carte 3 */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Réseau & Parrainage</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Système de parrainage entre promotions, entraide sur le Campus 1 et intégration dans la promo Éco-Gestion.
            </p>
          </div>
        </div>
      </section>

      {/* Bannière d'appel finale */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-brand-navy via-slate-900 to-brand-navy rounded-3xl p-8 sm:p-12 text-center text-white border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <GraduationCap className="w-12 h-12 text-brand-gold mx-auto" />
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Prêt à intégrer le BDE ?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              L'adhésion est valable pour toute l'année universitaire. Rejoins les étudiants déjà inscrits en quelques clics.
            </p>
            <div className="pt-4">
              <a
                href={HELLOASSO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold px-8 py-3.5 rounded-xl text-base shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                Adhérer maintenant
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}