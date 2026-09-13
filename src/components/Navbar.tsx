"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, Settings, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";

const HELLOASSO_LINK = "https://www.helloasso.com/associations/bde-licence-economie-gestion-caen/adhesions/passeport-eco-gestion-2026-2027-adhesion-et-avantages-bde";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
        setIsAdmin(data?.role === "admin");
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    router.refresh();
  };

  // Redirection dynamique de la boutique selon le rôle
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
          <Link href="/" className="flex items-center text-white font-bold text-xl tracking-tight">
            BDE <span className="text-brand-royal ml-1">ÉCO-GESTION</span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-gray-300 hover:text-white transition">
                {link.name}
              </Link>
            ))}

            <a
              href={HELLOASSO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-gold hover:bg-yellow-500 text-brand-navy font-bold px-3.5 py-1.5 rounded-lg text-sm transition flex items-center gap-1.5 shadow-sm"
            >
              <Ticket size={16} /> Adhérer (3,50 €)
            </a>

            {user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link href="/admin" className="text-brand-gold hover:text-yellow-400 flex items-center gap-1 text-sm font-semibold">
                    <Settings size={18} /> Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="text-gray-300 hover:text-red-400 transition flex items-center gap-1" title="Déconnexion">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-brand-royal hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm">
                Connexion
              </Link>
            )}
          </div>

          <button className="md:hidden text-gray-300" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-brand-navy border-t border-white/10 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="block text-gray-300 hover:text-white py-2" onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          ))}
          <a
            href={HELLOASSO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-brand-gold text-brand-navy font-bold text-center py-2 rounded-lg my-2 text-sm"
            onClick={() => setIsOpen(false)}
          >
            Adhérer (3,50 €)
          </a>
          {!user && (
            <Link href="/login" className="block text-brand-royal font-medium py-2" onClick={() => setIsOpen(false)}>
              Connexion
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}