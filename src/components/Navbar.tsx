"use client";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, Settings, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";

const HELLOASSO_LINK =
  "https://www.helloasso.com/associations/bde-licence-economie-gestion-caen/adhesions/passeport-eco-gestion-2026-2027-adhesion-et-avantages-bde";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setIsAdmin(data?.role === "admin");
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    router.refresh();
  };

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Cours", href: "/cours" },
    { name: "Boutique", href: isAdmin ? "/admin/boutique" : "/boutique" },
    { name: "Agenda", href: "/agenda" },
  ];

  return (
    <nav className="bg-brand-navy border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + Marque */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo BDE Éco-Gestion Caen"
              width={38}
              height={38}
              className="h-9 w-auto object-contain rounded-md"
              priority
            />
            <span className="text-white font-bold text-xl tracking-tight">
              BDE <span className="text-brand-royal ml-1">ÉCO-GESTION</span>
            </span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white transition font-medium text-sm"
              >
                {link.name}
              </Link>
            ))}

            <a
              href={HELLOASSO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-gold hover:bg-yellow-500 text-brand-navy font-bold px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 shadow-sm"
            >
              <Ticket size={16} />
              <span>Adhérer (3,50 €)</span>
            </a>

            {user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-brand-gold hover:text-yellow-400 flex items-center gap-1 text-sm font-semibold"
                  >
                    <Settings size={18} /> Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-400 transition flex items-center gap-1"
                  title="Déconnexion"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-brand-royal hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Bouton Hamburger Mobile */}
          <button
            className="md:hidden text-gray-300 p-2 rounded-md hover:text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      {isOpen && (
        <div className="md:hidden bg-brand-navy border-t border-white/10 px-4 pt-2 pb-5 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-gray-300 hover:text-white py-2 font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <a
            href={HELLOASSO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-brand-gold text-brand-navy font-bold text-center py-2.5 rounded-lg my-2 text-sm shadow-sm"
            onClick={() => setIsOpen(false)}
          >
            <Ticket size={16} />
            <span>Adhérer (3,50 €)</span>
          </a>

          {user ? (
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-brand-gold hover:text-yellow-400 flex items-center gap-1 text-sm font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings size={18} /> Panel Admin
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-gray-300 hover:text-red-400 flex items-center gap-1 text-sm"
              >
                <LogOut size={18} /> Déconnexion
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="block text-brand-royal font-semibold py-2 text-center bg-white/5 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Connexion
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}