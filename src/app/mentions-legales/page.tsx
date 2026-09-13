import { ShieldCheck, Scale, Database, Server, Mail } from "lucide-react";

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-gray-700 leading-relaxed text-sm">
      <div className="pb-6 border-b border-gray-200 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Scale size={14} /> Cadre Légal & Transparence
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Mentions Légales & Données Personnelles
        </h1>
        <p className="text-gray-500 text-xs mt-1">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
        </p>
      </div>

      <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="text-blue-600" size={20} />
          1. Éditeur du site
        </h2>
        <p>
          Le présent site web est édité par l'association étudiante :<br />
          <strong>BDE Licence Économie-Gestion Caen</strong> (Association loi 1901)<br />
          <strong>Siège social :</strong> UFR d'Économie et de Gestion — Esplanade de la Paix, 14000 Caen<br />
          <strong>Contact e-mail :</strong> bde.ecogestion.caen@gmail.com<br />
          <strong>Directeur de la publication :</strong> Le Président de l'association.
        </p>
      </section>

      <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Server className="text-blue-600" size={20} />
          2. Hébergement
        </h2>
        <p>
          Le site web et les interfaces applicatives sont hébergés par :<br />
          <strong>Netlify, Inc.</strong><br />
          44 Montgomery Street, Suite 300, San Francisco, California 94104, USA.<br />
          Base de données et services d'authentification assurés par <strong>Supabase, Inc.</strong>
        </p>
      </section>

      <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Database className="text-blue-600" size={20} />
          3. Gestion des données personnelles (RGPD)
        </h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés :
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>
            <strong>Finalité :</strong> Les données collectées (nom, prénom, adresse e-mail, promotion) servent exclusivement à la gestion des adhésions, à l'octroi des droits d'accès aux dossiers pédagogiques et aux commandes associatives.
          </li>
          <li>
            <strong>Confidentialité :</strong> Vos données ne sont ni vendues, ni cédées, ni transmises à des tiers à des fins publicitaires.
          </li>
          <li>
            <strong>Sécurité :</strong> Les mots de passe sont hachés cryptographiquement de façon irréversible et demeurent inaccessibles, y compris pour les administrateurs du bureau.
          </li>
          <li>
            <strong>Paiements :</strong> Les paiements des cotisations sont traités de manière sécurisée par la plateforme <strong>HelloAsso</strong>. Aucune coordonnée bancaire ne transite ni n'est stockée sur nos serveurs.
          </li>
        </ul>
      </section>

      <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Mail className="text-blue-600" size={20} />
          4. Vos droits (Accès, Rectification, Suppression)
        </h2>
        <p>
          Vous disposez d'un droit permanent d'accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit ou demander la clôture de votre compte, envoyez simplement un message à :<br />
          <a href="mailto:bde.ecogestion.caen@gmail.com" className="text-blue-600 font-semibold underline">
            bde.ecogestion.caen@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}