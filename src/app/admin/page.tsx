import Link from "next/link";
import { 
  Calculator, 
  Users, 
  ShoppingBag, 
  FileSpreadsheet, 
  ShieldCheck, 
  ArrowRight 
} from "lucide-react";

export default function AdminPage() {
  const modules = [
    {
      title: "Comptabilité & Trésorerie",
      description: "Saisie des recettes/dépenses, suivi du solde en temps réel et export Excel (.xlsx) pour le trésorier.",
      href: "/admin/compta",
      icon: Calculator,
      color: "bg-emerald-500",
      badge: "Actif",
    },
    {
      title: "Gestion des Adhérents",
      description: "Suivi des cotisations HelloAsso, synchronisation du Google Sheets et attribution des statuts.",
      href: "/admin/adherents",
      icon: Users,
      color: "bg-blue-500",
      badge: "Synchro Active",
    },
    {
      title: "Gestion des Commandes & Stock",
      description: "Commandes de sweats, packs goodies et réservations de soirées.",
      href: "/boutique",
      icon: ShoppingBag,
      color: "bg-purple-500",
      badge: "Bientôt",
    },
  ];

  return (
    <div className="min-h-[80vh] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-gray-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={16} /> Espace Bureau & Administration
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Tableau de bord BDE
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestion interne de l'association, trésorerie et outils de suivi.
          </p>
        </div>
        <Link
          href="/admin/compta"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow transition self-start sm:self-auto text-sm"
        >
          <FileSpreadsheet size={18} />
          Accéder à la compta
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.title}
              href={mod.href}
              className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl text-white ${mod.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                    {mod.badge}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
                  {mod.title}
                </h2>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-sm font-semibold text-gray-700 group-hover:text-blue-600">
                Ouvrir le module
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}