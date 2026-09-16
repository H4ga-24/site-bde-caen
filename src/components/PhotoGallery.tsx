import { Camera, ArrowRight } from "lucide-react";

export default function PhotoGallery() {
  const events = [
    { title: "Soirée d'Intégration", tag: "Campus & Bar", bg: "from-blue-600 to-indigo-800" },
    { title: "Distribution Polycopiés", tag: "Hall Campus 1", bg: "from-amber-500 to-rose-600" },
    { title: "Afterwork & Blind Test", tag: "Centre-ville Caen", bg: "from-purple-600 to-blue-700" },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <Camera size={14} className="text-pink-500" />
            <span>Vie de Promo & Ambiance</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Retour en Images</h2>
        </div>
        <a
          href="https://www.instagram.com/bde.eco_gestion"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 transition"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <span>Voir toutes les photos sur @bde.eco_gestion</span>
          <ArrowRight size={13} />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {events.map((ev, i) => (
          <div
            key={i}
            className={`h-48 rounded-3xl bg-gradient-to-br ${ev.bg} p-6 flex flex-col justify-end text-white shadow-sm relative overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                {ev.tag}
              </span>
              <h3 className="font-bold text-base mt-2">{ev.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}