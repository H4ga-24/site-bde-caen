"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShoppingBag, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AdminBoutiquePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceRegular, setPriceRegular] = useState("");
  const [priceAdherent, setPriceAdherent] = useState("");
  const [category, setCategory] = useState("Textile");
  const [stock, setStock] = useState("50");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createClient();

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let imageUrl = "";

      // 1. Upload de la photo dans le bucket Supabase
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error("Erreur upload photo : " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Insertion dans la base
      const { error: insertError } = await supabase.from("products").insert([
        {
          name: name.trim(),
          description: description.trim(),
          price_regular: parseFloat(priceRegular.replace(",", ".")),
          price_adherent: parseFloat(priceAdherent.replace(",", ".")),
          category,
          stock: parseInt(stock, 10) || 0,
          image_url: imageUrl || null,
        },
      ]);

      if (insertError) {
        throw new Error("Erreur base de données : " + insertError.message);
      }

      setSuccess("Article ajouté avec succès !");
      setName("");
      setDescription("");
      setPriceRegular("");
      setPriceAdherent("");
      setStock("50");
      setFile(null);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="text-purple-600" size={28} />
            Ajouter un article à la boutique
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Création d'un produit visible par les étudiants.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-2 rounded-xl transition"
        >
          ← Retour admin
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 p-4 rounded-2xl text-sm border border-emerald-150">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleCreateProduct} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Nom de l'article
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Sweat Promo 2026 Brodé"
            className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Prix Public (€)
            </label>
            <input
              type="text"
              required
              value={priceRegular}
              onChange={(e) => setPriceRegular(e.target.value)}
              placeholder="35.00"
              className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Prix Adhérent (€)
            </label>
            <input
              type="text"
              required
              value={priceAdherent}
              onChange={(e) => setPriceAdherent(e.target.value)}
              placeholder="30.00"
              className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Stock Initial
            </label>
            <input
              type="number"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Catégorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-600 bg-white"
            >
              <option value="Textile">Textile / Vêtements</option>
              <option value="Goodies">Goodies / Accessoires</option>
              <option value="Pack">Pack Événement</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Photo du produit
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border rounded-xl text-xs text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tailles disponibles, coupe, date de livraison..."
            className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="text-right pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-sm transition flex items-center gap-2 ml-auto shadow"
          >
            {loading ? "Enregistrement..." : <><Plus size={18} /> Mettre en vente</>}
          </button>
        </div>
      </form>
    </div>
  );
}