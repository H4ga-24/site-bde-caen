"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import {
  FileSpreadsheet,
  PlusCircle,
  TrendingDown,
  TrendingUp,
  Wallet,
  Trash2,
  AlertCircle
} from "lucide-react";

interface Entry {
  id: string;
  label: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  payment_method: string;
  created_at: string;
}

export default function ComptaPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Formulaire
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [category, setCategory] = useState("Adhésion");
  const [paymentMethod, setPaymentMethod] = useState("HelloAsso");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    setLoading(true);
    setErrorMessage(null);
    const { data, error } = await supabase
      .from("accounting_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lecture compta:", error);
      setErrorMessage("Erreur lors de la récupération des écritures : " + error.message);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  }

  async function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!label || !amount) return;

    setSubmitting(true);
    setErrorMessage(null);

    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Veuillez saisir un montant valide supérieur à 0.");
      setSubmitting(false);
      return;
    }

    const { data, error } = await supabase
      .from("accounting_entries")
      .insert([
        {
          label,
          amount: parsedAmount,
          type,
          category,
          payment_method: paymentMethod,
        },
      ])
      .select();

    if (error) {
      console.error("Erreur insertion:", error);
      setErrorMessage("Impossible d'enregistrer : " + error.message);
    } else if (data && data.length > 0) {
      setEntries((prev) => [data[0], ...prev]);
      setLabel("");
      setAmount("");
    } else {
      fetchEntries();
      setLabel("");
      setAmount("");
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette ligne comptable ?")) return;

    const { error } = await supabase
      .from("accounting_entries")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erreur de suppression : " + error.message);
    } else {
      setEntries((prev) => prev.filter((item) => item.id !== id));
    }
  }

  function exportToExcel() {
    if (entries.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    const rows = entries.map((e) => ({
      Date: new Date(e.created_at).toLocaleDateString("fr-FR"),
      Intitulé: e.label,
      Type: e.type === "INCOME" ? "Recette" : "Dépense",
      "Montant (€)": e.amount,
      Catégorie: e.category,
      "Moyen de paiement": e.payment_method,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Comptabilité");
    XLSX.writeFile(
      workbook,
      `compta_bde_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }

  // Calculs totaux
  const totalIncome = entries
    .filter((e) => e.type === "INCOME")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalExpense = entries
    .filter((e) => e.type === "EXPENSE")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Trésorerie & Comptabilité
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Enregistrement des opérations et suivi du solde associatif.
          </p>
        </div>

        <button
          onClick={exportToExcel}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow transition text-sm"
        >
          <FileSpreadsheet size={18} />
          Exporter en Excel (.xlsx)
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Cartes de synthèse */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recettes</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">+{totalIncome.toFixed(2)} €</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-red-100 text-red-600">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dépenses</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">-{totalExpense.toFixed(2)} €</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className={`p-3.5 rounded-xl ${balance >= 0 ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"}`}>
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Solde Actuel</p>
            <p className={`text-2xl font-bold mt-0.5 ${balance >= 0 ? "text-blue-600" : "text-amber-600"}`}>
              {balance.toFixed(2)} €
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <PlusCircle size={20} className="text-blue-600" />
          Nouvelle écriture
        </h2>

        <form onSubmit={handleAddEntry} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Intitulé</label>
            <input
              type="text"
              required
              placeholder="Ex: Vente Sweat promo, Achat gobelets..."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Montant (€)</label>
            <input
              type="text"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "INCOME" | "EXPENSE")}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="INCOME">Recette (+)</option>
              <option value="EXPENSE">Dépense (-)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-xl transition text-sm shadow"
            >
              {submitting ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>

      {/* Tableau des écritures */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Journal des Opérations</h3>
        </div>

        {loading ? (
          <p className="p-8 text-center text-sm text-gray-400">Chargement des opérations...</p>
        ) : entries.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-400">Aucune opération enregistrée pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Intitulé</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Montant</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {entries.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5 text-gray-500">
                      {new Date(item.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-gray-900">{item.label}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          item.type === "INCOME"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.type === "INCOME" ? "Recette" : "Dépense"}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-3.5 font-bold ${
                        item.type === "INCOME" ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {item.type === "INCOME" ? "+" : "-"}
                      {Number(item.amount).toFixed(2)} €
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-400 hover:text-red-600 transition"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}