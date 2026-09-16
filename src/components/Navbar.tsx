"use client";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, Settings, Ticket } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const HELLOASSO_LINK =
  "https://www.helloasso.com/associations/bde-licence-economie-gestion-caen/adhesions/passeport-eco-gestion-2026-2027-adhesion-et-avantages-bde";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        setIsAdmin(data?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setIsAdmin(false);
      } else {
        checkAdmin();
      }
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
    { name: "Cours & Drives", href: "/cours" },
    { name: "Agenda", href: "/agenda" },
    { name: "Boutique", href: "/boutique" },
  ];

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 pb-2 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl shadow-slate-950/20">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white/5 border border-white/10">
              <Image
                src="/logo.png"
                alt="Logo BDE"
                width={32}
                height={32}
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-sm tracking-tight group-hover:text-blue-400 transition-colors">
                BDE <span className="text-amber-400">ÉCO-GESTION</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">CAEN</span>
            </div>
          </Link>

          {/* Liens Desktop */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 px-2 py-1 rounded-xl border border-white/5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Actions Droite */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={HELLOASSO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-amber-500/10 transition-all transform hover:scale-105 active:scale-95"
            >
              <Ticket size={14} />
              <span>Adhérer (3,50 €)</span>
            </a>

            {/* Menu Admin visible UNIQUEMENT si connecté */}
            {isAdmin && (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <Link
                  href="/admin"
                  className="text-amber-400 hover:text-amber-300 p-1.5 rounded-lg hover:bg-white/5 transition"
                  title="Espace Bureau / Admin"
                >
                  <Settings size={16} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition"
                  title="Déconnexion"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-slate-300 p-1.5 rounded-lg hover:bg-white/5 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="md:hidden border-t border-white/10 px-4 pt-3 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-2 border-t border-white/10 space-y-2">
              <a
                href={HELLOASSO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-sm"
                onClick={() => setIsOpen(false)}
              >
                <Ticket size={14} />
                <span>Adhérer (3,50 €)</span>
              </a>

              {isAdmin && (
                <div className="flex items-center justify-between px-2 pt-1 text-xs">
                  <Link
                    href="/admin"
                    className="text-amber-400 font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Panneau Admin
                  </Link>
                  <button onClick={handleLogout} className="text-red-400 font-medium">
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}