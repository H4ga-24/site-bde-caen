import Link from "next/link";
import { ShoppingBag, Sparkles, Shirt, Ticket, ArrowRight, Clock } from "lucide-react";

const HELLOASSO_LINK =
  "https://www.helloasso.com/associations/bde-licence-economie-gestion-caen/adhesions/passeport-eco-gestion-2026-2027-adhesion-et-avantages-bde";

export default function BoutiquePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider">
          <ShoppingBag size={13} /> Merch & Goodies
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Boutique Officielle du BDE
        </h1>
        <p className="text-sm text-slate-500">
          Sweats de promo, tote bags, écocups et accessoires aux couleurs d'Éco-Gestion Caen.
        </p>
      </div>

      {/* Carte d'attente principale */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-navy to-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-white/10 shadow-xl">
        <div className="relative z-10 max-w-lg space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold">
            <Clock size={14} />
            <span>Lancement prochainement</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Les précommandes de sweats arrivent bientôt !
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Nous finalisons les visuels et le choix des coupes pour la collection 2026-2027. Tous les adhérents du BDE bénéficieront d'un tarif préférentiel lors de l'ouverture des commandes.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href={HELLOASSO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs transition shadow-md"
            >
              <Ticket size={15} />
              <span>Prendre l'adhésion pour les tarifs réduits</span>
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-3 rounded-xl text-xs transition border border-white/10"
            >
              <span>Retour à l'accueil</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Aperçu des futurs articles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Shirt size={20} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Sweats de Promo</h3>
          <p className="text-xs text-slate-500">Broderie officielle Éco-Gestion Caen avec choix des coloris et tailles.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Sparkles size={20} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Pack Goodies</h3>
          <p className="text-xs text-slate-500">Stickers, écocups lavables pour les soirées et tote bags du BDE.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Ticket size={20} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Billetterie Soirées</h3>
          <p className="text-xs text-slate-500">Accès coupe-file et tarifs étudiants directement réservables en ligne.</p>
        </div>
      </div>
    </div>
  );
}