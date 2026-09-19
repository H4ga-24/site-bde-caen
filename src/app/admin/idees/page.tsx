"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lightbulb, Trash2, ArrowLeft, RefreshCw, Tag, Clock } from "lucide-react";
import Link from "next/link";

interface Suggestion {
  id: string;
  created_at: string;
  content: string;
  category: string;
}

export default function AdminIdeesPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("Toutes");
  const supabase = createClient();

  const fetchSuggestions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSuggestions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette idée ?")) return;
    const { error } = await supabase.from("suggestions").delete().eq("id", id);
    if (!error) {
      setSuggestions((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const categories = ["Toutes", "Soirée / Bar", "Tournoi Sport / E-sport", "Cours & Révisions", "Goodies / Sweats"];

  const filtered = filterCategory === "Toutes" 
    ? suggestions 
    : suggestions.filter((s) => s.category === filterCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition mb-2"
          >
            <ArrowLeft size={14} /> Retour au tableau de bord
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Lightbulb className="text-amber-500" size={28} />
            Boîte à Idées & Retours Étudiants
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Consulte et trie les propositions envoyées anonymement depuis la page d'accueil.
          </p>
        </div>

        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Actualiser
        </button>
      </div>

      {/* Filtres de catégorie */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition ${
              filterCategory === cat
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Liste des retours */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-sm text-gray-400">
            Chargement des idées...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-12 text-center text-sm text-gray-400">
            Aucune idée enregistrée pour le moment dans cette catégorie.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start justify-between gap-4 hover:border-gray-300 transition"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    <Tag size={11} /> {item.category || "Général"}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(item.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  {item.content}
                </p>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-gray-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition shrink-0"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}