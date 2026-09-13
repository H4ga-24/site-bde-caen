"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShoppingBag, Sparkles, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price_regular: number;
  price_adherent: number;
  image_url: string | null;
  category: string;
  stock: number;
  helloasso_url?: string | null;
}

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdherent, setIsAdherent] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (data) setProducts(data);

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("has_paid_dues")
          .eq("id", session.user.id)
          .single();
        setIsAdherent(!!profile?.has_paid_dues);
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider">
          <ShoppingBag size={16} /> Boutique Officielle
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Goodies & Vêtements BDE
        </h1>
        <p className="text-gray-600 text-sm">
          Retrouvez les sweats de promo et les accessoires du BDE Éco-Gestion Caen.
        </p>
      </div>

      {!isAdherent && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-600 shrink-0" />
            <span>Adhérez ou connectez-vous pour débloquer le <strong>tarif adhérent</strong> sur tous les articles !</span>
          </div>
          <Link
            href="/login"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition"
          >
            Se connecter
          </Link>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-400 py-12 text-sm">Chargement des articles...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-3xl text-gray-400 text-sm">
          Aucun article en vente pour l'instant. Les nouveaux sweats arrivent bientôt !
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="w-full h-52 object-cover" />
              ) : (
                <div className="w-full h-52 bg-gray-100 flex items-center justify-center text-gray-400">
                  <ShoppingBag size={40} />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                      {p.category}
                    </span>
                    <span className="text-xs text-gray-400">Stock restant : {p.stock}</span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base">{p.name}</h3>
                  {p.description && <p className="text-xs text-gray-500 mt-1">{p.description}</p>}
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block">Prix</span>
                      <span className="text-xl font-black text-gray-900">
                        {isAdherent ? p.price_adherent.toFixed(2) : p.price_regular.toFixed(2)} €
                      </span>
                    </div>
                    {isAdherent ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
                        <CheckCircle2 size={13} /> Tarif Adhérent
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500">
                        {p.price_adherent.toFixed(2)} € pour les adhérents
                      </span>
                    )}
                  </div>

                  {p.helloasso_url ? (
                    <a
                      href={p.helloasso_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow"
                    >
                      Commander sur HelloAsso <ExternalLink size={14} />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-100 text-gray-400 font-bold py-2.5 rounded-xl text-xs cursor-not-allowed"
                    >
                      Vente bientôt disponible
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}