"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { 
  Calculator, 
  Users, 
  ShoppingBag, 
  FileSpreadsheet, 
  ShieldCheck, 
  ArrowRight,
  Lock,
  LogOut,
  Calendar
} from "lucide-react";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getSession();
  }, [supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Identifiants incorrects ou accès non autorisé.");
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      router.refresh();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

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
      title: "Gestion des Événements & Réunions",
      description: "Publication sur l'agenda public et rédaction des comptes rendus internes du bureau.",
      href: "/agenda",
      icon: Calendar,
      color: "bg-amber-500",
      badge: "Actif",
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 text-sm">
        Chargement...
      </div>
    );
  }

  // Écran de connexion si non connecté
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
              <Lock size={22} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Espace Bureau BDE</h1>
            <p className="text-xs text-slate-500">Connexion réservée aux membres autorisés.</p>
          </div>

          {errorMsg && (
            <div className="text-xs bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bde.ecogestion.caen@gmail.com"
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-sm"
            >
              Se connecter au panneau
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard complet si connecté
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

        <div className="flex items-center gap-3">
          <Link
            href="/admin/compta"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition text-sm"
          >
            <FileSpreadsheet size={18} />
            Accéder à la compta
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-600 font-semibold px-3 py-2.5 rounded-xl transition text-sm"
            title="Se déconnecter"
          >
            <LogOut size={16} />
            <span>Sortir</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
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
                <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition">
                  {mod.title}
                </h2>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-gray-700 group-hover:text-blue-600">
                Ouvrir le module
                <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}