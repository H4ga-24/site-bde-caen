import Link from "next/link";
import { Mail, ExternalLink, Ticket, BookOpen, Calendar, ShoppingBag, Scale } from "lucide-react";

const HELLOASSO_LINK = "https://www.helloasso.com/associations/bde-licence-economie-gestion-caen/adhesions/passeport-eco-gestion-2026-2027-adhesion-et-avantages-bde";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-gray-300 border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Colonne 1 : Présentation */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center text-white font-extrabold text-xl tracking-tight">
              BDE <span className="text-brand-royal ml-1.5">ÉCO-GESTION</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Association étudiante de la filière Économie-Gestion à l'Université de Caen Normandie.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center transition border border-white/5"
                title="Instagram"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="mailto:bde.ecogestion.caen@gmail.com"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center transition border border-white/5"
                title="Contact mail"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/cours" className="hover:text-white transition flex items-center gap-1.5">
                  <BookOpen size={14} className="text-brand-royal" /> Cours & Annales
                </Link>
              </li>
              <li>
                <Link href="/agenda" className="hover:text-white transition flex items-center gap-1.5">
                  <Calendar size={14} className="text-brand-royal" /> Agenda & Soirées
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="hover:text-white transition flex items-center gap-1.5">
                  <ShoppingBag size={14} className="text-brand-royal" /> Boutique du BDE
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Espace Membre & Adhésion */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Adhésion & Avantages
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={HELLOASSO_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-gold hover:text-yellow-400 font-semibold transition flex items-center gap-1.5"
                >
                  <Ticket size={14} /> Adhérer sur HelloAsso (3,50 €)
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Se connecter à mon compte
                </Link>
              </li>
              <li>
                <span className="text-xs text-gray-400 block pt-1">
                  Accès immédiat aux polycopiés et fiches de révisions L1 et L2 dès confirmation.
                </span>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Campus & Informations */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Campus 1
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Université de Caen Normandie<br />
              UFR d'Économie et de Gestion<br />
              Esplanade de la Paix, 14000 Caen
            </p>
            <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-1.5">
              <a
                href={HELLOASSO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
              >
                Passeport Éco-Gestion HelloAsso <ExternalLink size={12} />
              </a>
              <Link
                href="/mentions-legales"
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
              >
                <Scale size={12} /> Mentions Légales & RGPD
              </Link>
            </div>
          </div>
        </div>

        {/* Ligne de copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {currentYear} BDE Éco-Gestion Caen. Tous droits réservés.</p>
          <p className="text-gray-400">
            Fait par et pour les étudiants d'Éco-Gestion
          </p>
        </div>
      </div>
    </footer>
  );
}