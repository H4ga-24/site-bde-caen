import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4 text-center">
      <span className="text-6xl mb-4">🐒</span>
      <h1 className="text-4xl font-extrabold text-brand-navy mb-2">404 - Page introuvable</h1>
      <p className="text-slate-600 max-w-md mb-6">
        Oups, ce cours ou cette page n'existe pas ou a été déplacé.
      </p>
      <Link
        href="/"
        className="bg-brand-royal hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-md"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}