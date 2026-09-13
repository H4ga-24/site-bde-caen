"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Key, User, GraduationCap, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  
  // Champs formulaire
  const [fullName, setFullName] = useState("");
  const [promotion, setPromotion] = useState("L1");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Retours interface
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const resetMessages = () => {
    setError("");
    setMessage("");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. MOT DE PASSE OUBLIÉ
      if (mode === "forgot") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (resetError) {
          setError(resetError.message);
        } else {
          setMessage("Un e-mail de réinitialisation vous a été envoyé !");
        }
        setLoading(false);
        return;
      }

      // 2. VÉRIFICATION DU PAIEMENT HELLOASSO VIA L'API
      let isAdherent = false;
      try {
        const checkRes = await fetch("/api/check-adherent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail }),
        });
        const checkData = await checkRes.json();
        isAdherent = !!checkData.isAdherent;
      } catch (checkErr) {
        console.warn("Vérification HelloAsso indisponible :", checkErr);
      }

      // 3. CRÉATION DE COMPTE (SIGNUP)
      if (mode === "signup") {
        if (password.length < 6) {
          setError("Le mot de passe doit contenir au moins 6 caractères.");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Les deux mots de passe ne correspondent pas.");
          setLoading(false);
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              promotion,
              has_paid_dues: isAdherent,
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
        } else {
          if (data?.session) {
            // Connecté immédiatement
            router.push("/");
            router.refresh();
          } else {
            // Confirmation d'email requise selon réglage Supabase
            setMessage("Compte créé avec succès ! Tu peux maintenant te connecter.");
            setMode("signin");
            setPassword("");
            setConfirmPassword("");
          }
        }
      } 
      
      // 4. CONNEXION (SIGNIN)
      else if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (signInError) {
          setError("Identifiants incorrects ou compte inexistant.");
        } else {
          // Mise à jour rétroactive du statut adhérent si paiement récent
          if (isAdherent) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              await supabase
                .from("profiles")
                .update({ has_paid_dues: true })
                .eq("id", session.user.id);
            }
          }
          router.push("/");
          router.refresh();
        }
      }
    } catch {
      setError("Une erreur inattendue est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-8 shadow-xl">
        
        {/* Sélecteur Connexion / Création de compte */}
        {mode !== "forgot" && (
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                resetMessages();
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition ${
                mode === "signin"
                  ? "bg-white text-brand-navy shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                resetMessages();
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition ${
                mode === "signup"
                  ? "bg-white text-brand-navy shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Créer un compte
            </button>
          </div>
        )}

        {/* Titres */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
            {mode === "signin" && "Bon retour !"}
            {mode === "signup" && "Créer mon compte"}
            {mode === "forgot" && "Mot de passe oublié"}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            {mode === "signin" && "Connecte-toi pour accéder à tes avantages"}
            {mode === "signup" && "Utilise l'adresse de ton adhésion HelloAsso"}
            {mode === "forgot" && "Entre ton email pour réinitialiser ton mot de passe"}
          </p>
        </div>

        {/* Alertes erreurs / succès */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl text-xs sm:text-sm mb-4 border border-red-100">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs sm:text-sm mb-4 border border-emerald-150">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {/* Champs d'inscription supplémentaires */}
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nom et Prénom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Paul Martin"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-royal outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Promotion / Filière
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <GraduationCap size={18} />
                  </div>
                  <select
                    value={promotion}
                    onChange={(e) => setPromotion(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-royal outline-none bg-white"
                  >
                    <option value="L1">Licence 1 Éco-Gestion</option>
                    <option value="L2">Licence 2 Éco-Gestion</option>
                    <option value="Autre">Autre filière / Extérieur</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Adresse e-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prenom.nom@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-royal outline-none"
              />
            </div>
            {mode === "signup" && (
              <p className="text-[11px] text-gray-400 mt-1">
                Idéalement l'e-mail utilisé lors de ton adhésion sur HelloAsso.
              </p>
            )}
          </div>

          {/* Mot de passe */}
          {mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Mot de passe
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      resetMessages();
                    }}
                    className="text-xs text-brand-royal hover:underline"
                  >
                    Oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Key size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-royal outline-none"
                />
              </div>
            </div>
          )}

          {/* Confirmation mot de passe pour inscription */}
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Key size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-royal outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-royal hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow mt-2 text-sm"
          >
            {loading ? (
              "Patientez..."
            ) : mode === "signin" ? (
              <>Se connecter <ArrowRight size={16} /></>
            ) : mode === "signup" ? (
              <>Créer mon compte <ArrowRight size={16} /></>
            ) : (
              "Envoyer le lien"
            )}
          </button>
        </form>

        {/* Liens retour si mot de passe oublié */}
        {mode === "forgot" && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                resetMessages();
              }}
              className="text-xs text-brand-royal font-semibold hover:underline"
            >
              ← Retour à la connexion
            </button>
          </div>
        )}

      </div>
    </div>
  );
}