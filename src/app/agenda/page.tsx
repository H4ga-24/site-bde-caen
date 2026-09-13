"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  Lock, 
  Globe, 
  Users, 
  UserCheck, 
  AlertCircle 
} from "lucide-react";

interface PublicEvent {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  category: string;
}

interface InternalReunion {
  id: number;
  title: string;
  content: string;
  reunion_date: string;
  attendees: string[];
}

export default function AgendaPage() {
  const [activeTab, setActiveTab] = useState<"public" | "bureau">("public");
  const [publicEvents, setPublicEvents] = useState<PublicEvent[]>([]);
  const [reunions, setReunions] = useState<InternalReunion[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Formulaire Événement Public
  const [pubTitle, setPubTitle] = useState("");
  const [pubDate, setPubDate] = useState("");
  const [pubLocation, setPubLocation] = useState("Campus 1");
  const [pubCategory, setPubCategory] = useState("Soirée");
  const [pubDesc, setPubDesc] = useState("");

  // Formulaire Réunion Interne
  const [reuTitle, setReuTitle] = useState("");
  const [reuDate, setReuDate] = useState("");
  const [reuContent, setReuContent] = useState("");
  const [newAttendee, setNewAttendee] = useState<{ [id: number]: string }>({});

  const supabase = createClient();

  const loadData = async () => {
    setLoading(true);
    // 1. Événements publics
    const { data: pEvents } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    if (pEvents) setPublicEvents(pEvents);

    // 2. Réunions internes (uniquement si connecté)
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);

    if (session?.user) {
      const { data: intReunions } = await supabase
        .from("bde_reunions")
        .select("*")
        .order("reunion_date", { ascending: false });
      if (intReunions) setReunions(intReunions);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Ajout Événement Public
  const handleAddPublicEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle || !pubDate) return;

    const { error } = await supabase.from("events").insert([
      {
        title: pubTitle,
        description: pubDesc,
        event_date: pubDate,
        location: pubLocation,
        category: pubCategory,
      },
    ]);

    if (!error) {
      setPubTitle("");
      setPubDate("");
      setPubDesc("");
      loadData();
    }
  };

  // Ajout Réunion Interne Bureau
  const handleAddReunion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reuTitle || !reuDate) return;

    const { error } = await supabase.from("bde_reunions").insert([
      {
        title: reuTitle,
        content: reuContent,
        reunion_date: reuDate,
        attendees: [],
        created_by: user?.id,
      },
    ]);

    if (!error) {
      setReuTitle("");
      setReuDate("");
      setReuContent("");
      loadData();
    }
  };

  // Gestion des présents
  const handleAddAttendee = async (reunionId: number) => {
    const name = newAttendee[reunionId]?.trim();
    if (!name) return;

    const target = reunions.find((r) => r.id === reunionId);
    if (!target) return;

    const updated = [...(target.attendees || []), name];

    const { error } = await supabase
      .from("bde_reunions")
      .update({ attendees: updated })
      .eq("id", reunionId);

    if (!error) {
      setNewAttendee({ ...newAttendee, [reunionId]: "" });
      loadData();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* En-tête */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Agenda & Calendrier
        </h1>
        <p className="text-gray-500 text-sm">
          Retrouvez les événements associatifs et suivez les actions du BDE Éco-Gestion.
        </p>
      </div>

      {/* Sélecteur d'onglets étanche */}
      {user && (
        <div className="flex bg-gray-100 p-1.5 rounded-2xl max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("public")}
            className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === "public"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Globe size={16} /> Événements Publics
          </button>
          <button
            onClick={() => setActiveTab("bureau")}
            className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === "bureau"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Lock size={16} /> Réunions Bureau
          </button>
        </div>
      )}

      {/* ================= SECTION PUBLIQUE ================= */}
      {activeTab === "public" && (
        <div className="space-y-6">
          {/* Formulaire ajout public (uniquement si connecté) */}
          {user && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Plus size={18} className="text-blue-600" /> Publier un événement visible par les étudiants
              </h2>
              <form onSubmit={handleAddPublicEvent} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Titre de l'événement (ex: Soirée d'intégration)"
                  value={pubTitle}
                  onChange={(e) => setPubTitle(e.target.value)}
                  className="px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="datetime-local"
                  required
                  value={pubDate}
                  onChange={(e) => setPubDate(e.target.value)}
                  className="px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600"
                />
                <select
                  value={pubCategory}
                  onChange={(e) => setPubCategory(e.target.value)}
                  className="px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="Soirée">Soirée</option>
                  <option value="Permanence">Permanence</option>
                  <option value="Conférence">Conférence</option>
                  <option value="Vente Goodies">Vente Goodies</option>
                  <option value="Autre">Autre</option>
                </select>
                <input
                  type="text"
                  placeholder="Lieu (ex: Le Cargo, Hall A Campus 1...)"
                  value={pubLocation}
                  onChange={(e) => setPubLocation(e.target.value)}
                  className="px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600 sm:col-span-1"
                />
                <input
                  type="text"
                  placeholder="Description rapide / infos billetterie"
                  value={pubDesc}
                  onChange={(e) => setPubDesc(e.target.value)}
                  className="px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600 sm:col-span-2"
                />
                <div className="sm:col-span-3 text-right">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
                  >
                    Ajouter au calendrier public
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Liste publique */}
          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-sm text-gray-400 py-8">Chargement...</p>
            ) : publicEvents.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">
                Aucun événement public prévu pour le moment.
              </div>
            ) : (
              publicEvents.map((ev) => (
                <div key={ev.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                        {ev.category}
                      </span>
                      <h3 className="font-bold text-gray-900 text-base">{ev.title}</h3>
                    </div>
                    {ev.description && <p className="text-xs text-gray-500">{ev.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(ev.event_date).toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {ev.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= SECTION BUREAU INTERNE ================= */}
      {activeTab === "bureau" && user && (
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-200 text-amber-900 rounded-2xl p-4 flex items-center gap-3 text-xs">
            <Lock size={18} className="shrink-0 text-amber-600" />
            <span>
              <strong>Espace Réunions Sécurisé :</strong> Ces notes et dates de réunions sont réservées au bureau du BDE et sont invisibles pour les étudiants non connectés.
            </span>
          </div>

          {/* Formulaire ajout Réunion Bureau */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Plus size={18} className="text-amber-600" /> Nouveau Compte Rendu / Réunion Bureau
            </h2>
            <form onSubmit={handleAddReunion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Objet de la réunion (ex: Préparation Galettes & Partenariats)"
                  value={reuTitle}
                  onChange={(e) => setReuTitle(e.target.value)}
                  className="px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="datetime-local"
                  required
                  value={reuDate}
                  onChange={(e) => setReuDate(e.target.value)}
                  className="px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <textarea
                placeholder="Ordre du jour, décisions prises, tâches attribuées..."
                rows={3}
                value={reuContent}
                onChange={(e) => setReuContent(e.target.value)}
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="text-right">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
                >
                  Enregistrer la réunion
                </button>
              </div>
            </form>
          </div>

          {/* Liste des réunions bureau */}
          <div className="space-y-4">
            {reunions.length === 0 ? (
              <div className="text-center py-10 border border-dashed rounded-2xl text-gray-400 text-sm">
                Aucune réunion enregistrée.
              </div>
            ) : (
              reunions.map((r) => (
                <div key={r.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{r.title}</h3>
                      <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock size={12} />
                        {new Date(r.reunion_date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {r.content && (
                    <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed bg-gray-50 p-3 rounded-xl">
                      {r.content}
                    </p>
                  )}

                  {/* Présents */}
                  <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                      <Users size={12} /> Présents :
                    </span>
                    {(r.attendees || []).map((name, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        {name}
                      </span>
                    ))}
                    
                    {/* Émulation du bouton "Je suis présent" du panel */}
                    <div className="inline-flex items-center gap-1 ml-auto">
                      <input
                        type="text"
                        placeholder="Prénom..."
                        value={newAttendee[r.id] || ""}
                        onChange={(e) => setNewAttendee({ ...newAttendee, [r.id]: e.target.value })}
                        className="px-2 py-1 border rounded-lg text-xs w-24 outline-none"
                      />
                      <button
                        onClick={() => handleAddAttendee(r.id)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition"
                      >
                        <UserCheck size={12} /> Valider présence
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}