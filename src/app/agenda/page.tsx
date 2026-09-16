"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Plus, 
  Lock, 
  Globe, 
  Users, 
  UserCheck,
  ChevronLeft,
  ChevronRight,
  PartyPopper
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

  // Vue Calendrier
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

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

  // Logique du Calendrier
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDayIndex }, (_, i) => i);

  const formatDate = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  // Événements publics filtrés par jour sélectionné
  const selectedDayEvents = publicEvents.filter((ev) => {
    if (!ev.event_date) return false;
    return ev.event_date.startsWith(selectedDate);
  });

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* En-tête */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Agenda & Calendrier
        </h1>
        <p className="text-slate-500 text-sm">
          Retrouvez les soirées, permanences et dates clés du BDE Éco-Gestion.
        </p>
      </div>

      {/* Onglets Public / Bureau si connecté */}
      {user && (
        <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("public")}
            className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === "public"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Globe size={16} /> Calendrier Public
          </button>
          <button
            onClick={() => setActiveTab("bureau")}
            className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === "bureau"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Lock size={16} /> Réunions Bureau
          </button>
        </div>
      )}

      {/* ================= SECTION PUBLIQUE ================= */}
      {activeTab === "public" && (
        <div className="space-y-8">
          {/* Formulaire ajout public (admin/connecté) */}
          {user && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Plus size={18} className="text-blue-600" /> Ajouter un événement au calendrier
              </h2>
              <form onSubmit={handleAddPublicEvent} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Titre de l'événement"
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
                  placeholder="Lieu (ex: Campus 1, Cargo...)"
                  value={pubLocation}
                  onChange={(e) => setPubLocation(e.target.value)}
                  className="px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600 sm:col-span-1"
                />
                <input
                  type="text"
                  placeholder="Description rapide / billetterie"
                  value={pubDesc}
                  onChange={(e) => setPubDesc(e.target.value)}
                  className="px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600 sm:col-span-2"
                />
                <div className="sm:col-span-3 text-right">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
                  >
                    Publier l'événement
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Grille Calendrier + Détails du jour */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Grille Calendrier (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {monthNames[month]} {year}
                </h2>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={prevMonth}
                    className="p-1.5 hover:bg-white rounded-lg transition text-slate-600 hover:text-slate-900"
                    aria-label="Mois précédent"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-1.5 hover:bg-white rounded-lg transition text-slate-600 hover:text-slate-900"
                    aria-label="Mois suivant"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mer</span>
                <span>Jeu</span>
                <span>Ven</span>
                <span>Sam</span>
                <span>Dim</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-sm">
                {blanksArray.map((_, i) => (
                  <div key={`blank-${i}`} className="h-11 sm:h-14 rounded-xl opacity-0" />
                ))}

                {daysArray.map((day) => {
                  const dateStr = formatDate(day);
                  const hasEvents = publicEvents.some(
                    (ev) => ev.event_date && ev.event_date.startsWith(dateStr)
                  );
                  const isSelected = selectedDate === dateStr;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`h-11 sm:h-14 rounded-2xl flex flex-col items-center justify-center relative transition-all ${
                        isSelected
                          ? "bg-slate-900 text-white font-bold shadow-md scale-105"
                          : hasEvents
                          ? "bg-amber-50 hover:bg-amber-100 text-slate-900 font-semibold border border-amber-200"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{day}</span>
                      {hasEvents && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                            isSelected ? "bg-amber-400" : "bg-amber-500"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Détails du jour sélectionné (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
                  <span>Programme du jour</span>
                  <span className="text-xs font-medium text-slate-500">
                    {new Date(selectedDate).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </h3>

                {loading ? (
                  <p className="text-center text-xs text-slate-400 py-6">Chargement...</p>
                ) : selectedDayEvents.length === 0 ? (
                  <div className="py-10 text-center space-y-2 text-slate-400">
                    <CalendarIcon size={32} className="mx-auto text-slate-300" />
                    <p className="text-sm">Aucun événement ce jour-ci.</p>
                    <p className="text-xs text-slate-400">Clique sur les dates signalées par un point doré.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-sm leading-tight">
                            {ev.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                            {ev.category}
                          </span>
                        </div>

                        {ev.description && (
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {ev.description}
                          </p>
                        )}

                        <div className="flex flex-col gap-1 text-xs text-slate-500 pt-1 border-t border-slate-200/60 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-slate-400" />
                            <span>
                              {new Date(ev.event_date).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-slate-400" />
                            <span>{ev.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION BUREAU INTERNE ================= */}
      {activeTab === "bureau" && user && (
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-200 text-amber-900 rounded-2xl p-4 flex items-center gap-3 text-xs">
            <Lock size={18} className="shrink-0 text-amber-600" />
            <span>
              <strong>Espace Réunions Sécurisé :</strong> Ces notes et dates sont réservées au bureau du BDE et invisibles pour les visiteurs.
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Plus size={18} className="text-amber-600" /> Nouveau Compte Rendu / Réunion Bureau
            </h2>
            <form onSubmit={handleAddReunion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Objet de la réunion"
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

          <div className="space-y-4">
            {reunions.length === 0 ? (
              <div className="text-center py-10 border border-dashed rounded-2xl text-slate-400 text-sm">
                Aucune réunion enregistrée.
              </div>
            ) : (
              reunions.map((r) => (
                <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{r.title}</h3>
                      <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
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
                    <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded-xl">
                      {r.content}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Users size={12} /> Présents :
                    </span>
                    {(r.attendees || []).map((name, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        {name}
                      </span>
                    ))}
                    
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
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition"
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