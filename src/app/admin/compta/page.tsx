"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import {
  FileSpreadsheet,
  PlusCircle,
  TrendingDown,
  TrendingUp,
  Wallet,
  Trash2,
  AlertCircle,
  UploadCloud,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState(false);

  // Formulaire d'écriture manuelle / facture
  const [label, setLabel] = useState("");
  const [invoiceRef, setInvoiceRef] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [category, setCategory] = useState("Adhésion");
  const [paymentMethod, setPaymentMethod] = useState("HelloAsso");
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const fullLabel = invoiceRef.trim() ? `${label.trim()} (Facture: ${invoiceRef.trim()})` : label.trim();

    const { data, error } = await supabase
      .from("accounting_entries")
      .insert([
        {
          label: fullLabel,
          amount: Number(parsedAmount.toFixed(2)),
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
      setInvoiceRef("");
      setSuccessMessage("Écriture comptable ajoutée avec succès.");
      setTimeout(() => setSuccessMessage(null), 3500);
    } else {
      fetchEntries();
      setLabel("");
      setAmount("");
      setInvoiceRef("");
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

  // Moteur d'import universel et intelligent HelloAsso
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary", cellDates: true });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws);

        if (!rows || rows.length === 0) {
          setErrorMessage("Le classeur sélectionné est vide.");
          setFileLoading(false);
          return;
        }

        const existingLabels = new Set(entries.map((item) => item.label));

        const newEntries: {
          label: string;
          amount: number;
          type: "INCOME" | "EXPENSE";
          category: string;
          payment_method: string;
        }[] = [];

        let skippedDuplicates = 0;
        let adminFreeCount = 0;

        // Fonction de recherche tolérante sur les clés du tableau
        const getCol = (row: Record<string, any>, candidates: string[]) => {
          for (const key of Object.keys(row)) {
            const cleanKey = key.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            for (const cand of candidates) {
              if (cleanKey === cand || cleanKey.startsWith(cand)) {
                return row[key];
              }
            }
          }
          return null;
        };

        rows.forEach((row) => {
          // Ignorer les commandes annulées / refusées
          const status = String(getCol(row, ["statut de la commande", "statut", "status"]) || "").toLowerCase();
          if (status && (status.includes("annul") || status.includes("refus") || status.includes("rembours"))) {
            return;
          }

          const refCmd = String(getCol(row, ["reference commande", "reference", "id commande"]) || "").trim();
          const nom = String(getCol(row, ["nom adherent", "nom payeur", "nom"]) || "").trim();
          const prenom = String(getCol(row, ["prenom adherent", "prenom payeur", "prenom"]) || "").trim();
          const niveau = String(getCol(row, ["votre niveau dans la licence", "niveau", "promo"]) || "").trim();
          const promoCode = String(getCol(row, ["code promo"]) || "").trim();

          // Calcul du montant net payé (Tarif - Code Promo)
          const rawTarif = getCol(row, ["montant tarif", "tarif", "montant total", "montant"]);
          const rawPromo = getCol(row, ["montant code promo", "remise", "reduction"]);

          let baseAmount = 3.5;
          if (rawTarif !== null && rawTarif !== undefined && rawTarif !== "") {
            const num = parseFloat(String(rawTarif).replace(",", ".").replace("€", "").trim());
            if (!isNaN(num)) baseAmount = num;
          }

          let promoDiscount = 0.0;
          if (rawPromo !== null && rawPromo !== undefined && rawPromo !== "") {
            const disc = parseFloat(String(rawPromo).replace(",", ".").replace("€", "").trim());
            if (!isNaN(disc)) promoDiscount = disc;
          }

          const netAmount = Math.round((baseAmount - promoDiscount) * 100) / 100;

          // Si le montant n'est pas strictement positif ou n'est pas un nombre valide, on l'écarte
          if (isNaN(netAmount) || netAmount <= 0) {
            adminFreeCount++;
            return;
          }

          let entryLabel = `${prenom} ${nom}`.trim();
          if (niveau && niveau !== "nan") entryLabel += ` (${niveau})`;
          if (promoCode && promoCode !== "nan") entryLabel += ` [${promoCode}]`;
          if (refCmd && refCmd !== "nan") entryLabel += ` - Réf: ${refCmd}`;

          if (existingLabels.has(entryLabel)) {
            skippedDuplicates++;
            return;
          }

          const rawMoyen = getCol(row, ["moyen de paiement", "mode de reglement"]);
          const moyen = rawMoyen ? String(rawMoyen).trim() : "Carte bancaire (HelloAsso)";

          newEntries.push({
            label: entryLabel,
            amount: Number(netAmount.toFixed(2)),
            type: "INCOME",
            category: "Adhésion",
            payment_method: moyen,
          });
        });

        if (newEntries.length === 0) {
          if (skippedDuplicates > 0) {
            setErrorMessage(`Toutes les adhésions payantes (${skippedDuplicates}) sont déjà présentes en base.`);
          } else {
            setErrorMessage("Aucune adhésion payante valide détectée.");
          }
        } else {
          const { error } = await supabase.from("accounting_entries").insert(newEntries);
          if (error) {
            setErrorMessage("Erreur lors de l'enregistrement dans la base : " + error.message);
          } else {
            await fetchEntries();
            const totalCash = newEntries.reduce((s, e) => s + e.amount, 0).toFixed(2);
            let msg = `✅ ${newEntries.length} adhésions enregistrées (+${totalCash} €).`;
            if (adminFreeCount > 0) msg += ` • ${adminFreeCount} gratuités écartées`;
            if (skippedDuplicates > 0) msg += ` • ${skippedDuplicates} doublons ignorés`;
            setSuccessMessage(msg);
            setTimeout(() => setSuccessMessage(null), 6000);
          }
        }
      } catch (err: any) {
        setErrorMessage("Erreur lors du traitement du fichier : " + (err?.message || "Format non reconnu."));
      } finally {
        setFileLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsBinaryString(file);
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
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
            >
              <ArrowLeft size={14} /> Retour au tableau de bord
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Trésorerie & Comptabilité BDE
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Enregistrement des opérations, import HelloAsso automatique et suivi de solde.
          </p>
        </div>

        <button
          onClick={exportToExcel}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow transition text-sm self-start sm:self-auto"
        >
          <FileSpreadsheet size={18} />
          Exporter en Excel (.xlsx)
        </button>
      </div>

      {/* Alertes d'état */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Cartes de synthèse financière */}
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

      {/* Module Import Excel Intelligent */}
      <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border border-blue-200 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-base font-bold text-blue-900 flex items-center justify-center sm:justify-start gap-2">
              <UploadCloud size={20} className="text-blue-600" />
              Import Automatique HelloAsso
            </h2>
            <p className="text-xs text-blue-700/80 max-w-xl">
              Glisse directement ton export Excel HelloAsso. Le système calcule les montants nets avec code promo, identifie la promo L1/L2 et bloque les doublons.
            </p>
          </div>

          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 whitespace-nowrap">
            <FileSpreadsheet size={16} />
            <span>{fileLoading ? "Lecture du fichier..." : "Choisir un export HelloAsso"}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Formulaire d'écriture manuelle */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <PlusCircle size={20} className="text-blue-600" />
          Nouvelle écriture manuelle ou facture
        </h2>

        <form onSubmit={handleAddEntry} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Intitulé / Bénéficiaire</label>
            <input
              type="text"
              required
              placeholder="Ex: Facture Impression Goodies, Achat boisson..."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Réf. Facture (optionnel)</label>
            <input
              type="text"
              placeholder="Ex: FAC-2026-01"
              value={invoiceRef}
              onChange={(e) => setInvoiceRef(e.target.value)}
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

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Adhésion">Adhésion</option>
              <option value="Événements">Événements</option>
              <option value="Boutique / Merch">Boutique / Merch</option>
              <option value="Fournitures & Boissons">Fournitures & Boissons</option>
              <option value="Frais Bancaires / Assurances">Frais Bancaires / Assurances</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Moyen de paiement</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="HelloAsso">HelloAsso</option>
              <option value="Carte Bancaire">Carte Bancaire</option>
              <option value="Virement Bancaire">Virement Bancaire</option>
              <option value="Espèces">Espèces</option>
              <option value="Chèque">Chèque</option>
            </select>
          </div>

          <div className="flex items-end sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-xl transition text-sm shadow"
            >
              {submitting ? "Ajout en cours..." : "Enregistrer dans le journal"}
            </button>
          </div>
        </form>
      </div>

      {/* Tableau des opérations */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">Journal des Opérations ({entries.length})</h3>
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
                  <th className="px-6 py-3">Catégorie</th>
                  <th className="px-6 py-3">Paiement</th>
                  <th className="px-6 py-3">Montant</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {entries.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5 text-gray-500 text-xs">
                      {new Date(item.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-gray-900 text-xs">{item.label}</td>
                    <td className="px-6 py-3.5 text-xs text-gray-600">{item.category}</td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">{item.payment_method}</td>
                    <td
                      className={`px-6 py-3.5 font-bold text-xs ${
                        item.type === "INCOME" ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {item.type === "INCOME" ? "+" : "-"}
                      {Number(item.amount).toFixed(2)} €
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-400 hover:text-red-600 transition p-1"
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