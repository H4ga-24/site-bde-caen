"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Search, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  ShieldCheck, 
  GraduationCap,
  FileSpreadsheet
} from "lucide-react";

interface MemberRecord {
  id?: string;
  email: string;
  fullName: string;
  promo: string;
  hasAccount: boolean;
  hasPaidDues: boolean;
  source: "HelloAsso" | "Site Web" | "Les deux";
}

export default function AdminAdherentsPage() {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingEmail, setUpdatingEmail] = useState<string | null>(null);

  const supabase = createClient();

  const loadAllMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/adherents", { cache: "no-store" });
      const data = await res.json();
      if (data?.members) {
        setMembers(data.members);
      }
    } catch (err) {
      console.error("Erreur chargement adhérents :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllMembers();
  }, []);

  const togglePaidStatus = async (member: MemberRecord) => {
    if (!member.id) {
      alert("Cet étudiant n'a pas encore créé de compte sur le site. Son statut sera validé dès sa première inscription.");
      return;
    }

    setUpdatingEmail(member.email);
    const newStatus = !member.hasPaidDues;

    const { error } = await supabase
      .from("profiles")
      .update({ has_paid_dues: newStatus })
      .eq("id", member.id);

    if (!error) {
      setMembers((prev) =>
        prev.map((m) => (m.email === member.email ? { ...m, hasPaidDues: newStatus } : m))
      );
    }
    setUpdatingEmail(null);
  };

  const filtered = members.filter(
    (m) =>
      m.fullName.toLowerCase().includes(filter.toLowerCase()) ||
      m.email.toLowerCase().includes(filter.toLowerCase()) ||
      m.promo.toLowerCase().includes(filter.toLowerCase())
  );

  const totalAdherents = members.filter((m) => m.hasPaidDues).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-blue-600" size={30} />
            Gestion des Adhérents
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tableau croisé des paiements HelloAsso et des comptes du site BDE.
          </p>
        </div>

        <button
          onClick={loadAllMembers}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Actualiser les données
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase">Cotisants validés</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">{totalAdherents}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase">Comptes créés sur le site</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">
            {members.filter((m) => m.hasAccount).length}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase">Total contacts répertoriés</div>
          <div className="text-3xl font-extrabold text-gray-900 mt-2">{members.length}</div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Rechercher par nom, prénom, e-mail ou promotion (L1, L2)..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Étudiant</th>
                <th className="py-3.5 px-4">Promotion</th>
                <th className="py-3.5 px-4">Statut Cotisation</th>
                <th className="py-3.5 px-4">Compte Web</th>
                <th className="py-3.5 px-4">Origine</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                    Chargement et synchronisation des données...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                    Aucun adhérent trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.email} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">{m.fullName}</div>
                      <div className="text-xs text-gray-400">{m.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        <GraduationCap size={13} /> {m.promo}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {m.hasPaidDues ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                          <CheckCircle size={13} /> Cotisé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                          <XCircle size={13} /> Non cotisé
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {m.hasAccount ? (
                        <span className="text-xs font-semibold text-blue-600">Inscrit</span>
                      ) : (
                        <span className="text-xs text-gray-400">Non créé</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <FileSpreadsheet size={13} className="text-gray-400" />
                        {m.source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => togglePaidStatus(m)}
                        disabled={updatingEmail === m.email || !m.hasAccount}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                          m.hasPaidDues
                            ? "border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40"
                            : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-40"
                        }`}
                      >
                        {m.hasPaidDues ? "Révoquer" : "Valider"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}