"use client";

import { useState } from "react";
import { Calculator, CheckCircle2, AlertTriangle, RotateCcw, BookOpen, Info } from "lucide-react";

// Dictionnaire des parcours et semestres (Généré depuis les fichiers Excel officiels)
const CURRICULUM_DATA: Record<string, Record<string, any[]>> = {
  "Licence 1 Économie": {
    "Semestre 1": [
      { id: "YEC1MAC", n: "Macroéconomie", c: 6.0, u: "Compétences disciplinaires en Eco 11", cc: 0.4, ct: 0.6 },
      { id: "YEC1IG", n: "Introduction à la Gestion", c: 4.0, u: "Compétences disciplinaires en Gest 12", cc: 0.0, ct: 1.0 },
      { id: "YEC1PG", n: "Pratiques de Gestion", c: 2.0, u: "Compétences disciplinaires en Gest 12", cc: 0.0, ct: 1.0 },
      { id: "YEC1MAT", n: "Mathématiques pour l'Economie et la Gestion 1", c: 6.0, u: "Compétences disciplinaires en Eco-Gest 13", cc: 0.4, ct: 0.6 },
      { id: "YEC1ANG", n: "Anglais pour l'Economie et la Gestion 1", c: 1.5, u: "Compétences transversales en Eco-Gest 14", cc: 0.0, ct: 1.0 },
      { id: "YEC1MTU", n: "Méthodologie du Travail Universitaire et Compétences Doc.", c: 1.5, u: "Compétences transversales en Eco-Gest 14", cc: 0.5, ct: 0.5 },
      { id: "YEC1STA", n: "Méthodes Statistiques pour l'Economie et la Gestion 1", c: 3.0, u: "Compétences transversales en Eco-Gest 14", cc: 0.4, ct: 0.6 },
      { id: "YEC1GEC", n: "Grands enjeux contemporains 1", c: 4.0, u: "Compétences personnalisables 15", cc: 0.5, ct: 0.5 },
      { id: "YEC1HFE", n: "Histoire des Faits Economiques 1", c: 2.0, u: "Compétences personnalisables 15", cc: 0.0, ct: 1.0 },
      { id: "YGO1CCDE", n: "Changements climatiques et dynamiques environnementale", c: 1.0, u: "Compétences personnalisables 15", cc: 0.0, ct: 1.0 }
    ],
    "Semestre 2": [
      { id: "YEC2MIC", n: "Microéconomie", c: 6.0, u: "Compétences disciplinaires en Eco 21", cc: 0.4, ct: 0.6 },
      { id: "YEC2IFIS", n: "Introduction à la fiscalité", c: 2.0, u: "Compétences disciplinaires en Gest 22", cc: 0.0, ct: 1.0 },
      { id: "YEC2ORGA", n: "Organisation et Gestion", c: 4.0, u: "Compétences disciplinaires en Gest 22", cc: 0.0, ct: 1.0 },
      { id: "YEC2MAT", n: "Mathématiques pour l'Economie et la Gestion 2", c: 2.0, u: "Compétences disciplinaires en Eco-Gest 23", cc: 0.4, ct: 0.6 },
      { id: "YEC2STA", n: "Méthodes Statistiques pour l'Economie et la Gestion 2", c: 4.0, u: "Compétences disciplinaires en Eco-Gest 23", cc: 0.4, ct: 0.6 },
      { id: "YEC2ANG", n: "Anglais pour l'Economie et la Gestion 2", c: 3.0, u: "Compétences transversales Eco-Gest 24", cc: 0.0, ct: 1.0 },
      { id: "YEC2CIR", n: "Compétences rédact., comm. et initiation à la recherche", c: 1.5, u: "Compétences transversales Eco-Gest 24", cc: 0.0, ct: 1.0 },
      { id: "YEC2PIP", n: "Préparation à l'Insertion professionnelle", c: 1.5, u: "Compétences transversales Eco-Gest 24", cc: 0.0, ct: 1.0 },
      { id: "YEC2GEC", n: "Grands enjeux contemporains 2", c: 4.0, u: "Compétences personnalisables 25", cc: 0.4, ct: 0.6 },
      { id: "YEC2HFE", n: "Histoire des Faits Economiques 2", c: 2.0, u: "Compétences personnalisables 25", cc: 0.5, ct: 0.5 },
      { id: "YGO2EAS", n: "Eaux et Soc", c: 1.0, u: "Compétences personnalisables 25", cc: 0.5, ct: 0.5 }
    ]
  },
  "Licence 1 Gestion": {
    "Semestre 1": [
      { id: "YEC1MAC", n: "Macroéconomie", c: 6.0, u: "Compétences disciplinaires en Eco 11", cc: 0.4, ct: 0.6 },
      { id: "YEC1IG", n: "Introduction à la Gestion", c: 4.0, u: "Compétences disciplinaires en Gest 12", cc: 0.0, ct: 1.0 },
      { id: "YEC1PG", n: "Pratiques de Gestion", c: 2.0, u: "Compétences disciplinaires en Gest 12", cc: 0.0, ct: 1.0 },
      { id: "YEC1MAT", n: "Mathématiques pour l'Economie et la Gestion 1", c: 6.0, u: "Compétences disciplinaires en Eco-Gest 13", cc: 0.4, ct: 0.6 },
      { id: "YEC1ANG", n: "Anglais pour l'Economie et la Gestion 1", c: 1.5, u: "Compétences transversales en Eco-Gest 14", cc: 0.0, ct: 1.0 },
      { id: "YEC1MTU", n: "Méthodologie du Travail Universitaire et Compétences Doc.", c: 1.5, u: "Compétences transversales en Eco-Gest 14", cc: 0.5, ct: 0.5 },
      { id: "YEC1STA", n: "Méthodes Statistiques pour l'Economie et la Gestion 1", c: 3.0, u: "Compétences transversales en Eco-Gest 14", cc: 0.4, ct: 0.6 },
      { id: "GS1FONCO", n: "Fondamentaux de la communication", c: 2.0, u: "Compétences personnalisables 15", cc: 0.0, ct: 1.0 },
      { id: "YEC1GEC", n: "Grands enjeux contemporains 1", c: 4.0, u: "Compétences personnalisables 15", cc: 0.5, ct: 0.5 }
    ],
    "Semestre 2": [
      { id: "YEC2MIC", n: "Microéconomie", c: 6.0, u: "Compétences disciplinaires en Eco 21", cc: 0.4, ct: 0.6 },
      { id: "YEC2IFIS", n: "Introduction à la fiscalité", c: 2.0, u: "Compétences disciplinaires en Gest 22", cc: 0.0, ct: 1.0 },
      { id: "YEC2ORGA", n: "Organisation et Gestion", c: 4.0, u: "Compétences disciplinaires en Gest 22", cc: 0.0, ct: 1.0 },
      { id: "YEC2MAT", n: "Mathématiques pour l'Economie et la Gestion 2", c: 2.0, u: "Compétences disciplinaires en Eco-Gest 23", cc: 0.4, ct: 0.6 },
      { id: "YEC2STA", n: "Méthodes Statistiques pour l'Economie et la Gestion 2", c: 4.0, u: "Compétences disciplinaires en Eco-Gest 23", cc: 0.4, ct: 0.6 },
      { id: "YEC2ANG", n: "Anglais pour l'Economie et la Gestion 2", c: 3.0, u: "Compétences transversales Eco-Gest 24", cc: 0.0, ct: 1.0 },
      { id: "YEC2CIR", n: "Compétences rédact., comm. et initiation à la recherche", c: 1.5, u: "Compétences transversales Eco-Gest 24", cc: 0.0, ct: 1.0 },
      { id: "YEC2PIP", n: "Préparation à l'Insertion professionnelle", c: 1.5, u: "Compétences transversales Eco-Gest 24", cc: 0.0, ct: 1.0 },
      { id: "YEC2GEC", n: "Grands enjeux contemporains 2", c: 4.0, u: "Compétences personnalisables 25", cc: 0.4, ct: 0.6 }
    ]
  },
  "Licence 2 Économie": {
    "Semestre 3": [
      { id: "YEC3MAC", n: "Macroéconomie", c: 1.0, u: "Compétences disciplinaires en Eco 31", cc: 0.4, ct: 0.6 },
      { id: "YEC3CGE", n: "Comptabilité Générale 1", c: 2.0, u: "Compétences disciplinaires en Gest 32", cc: 0.0, ct: 1.0 },
      { id: "YEC3TF", n: "Techniques Financières", c: 1.0, u: "Compétences disciplinaires en Gest 32", cc: 0.0, ct: 1.0 },
      { id: "YEC3INF", n: "Informatique appliquée à l'Economie et à la Gestion 1", c: 1.0, u: "Compétences disciplinaires en Eco-Gest 33", cc: 0.0, ct: 1.0 },
      { id: "YEC3MAT", n: "Mathématiques pour l'Economie et la Gestion 3", c: 2.0, u: "Compétences disciplinaires en Eco-Gest 33", cc: 0.4, ct: 0.6 },
      { id: "YEC3ANG", n: "Anglais pour l'Economie et la Gestion 3", c: 1.0, u: "Compétences tranversales Eco-Gest 34", cc: 0.0, ct: 1.0 },
      { id: "YEC3STA", n: "Méthodes Statistiques pour l'Economie et la Gestion 3", c: 2.0, u: "Compétences tranversales Eco-Gest 34", cc: 0.4, ct: 0.6 },
      { id: "YEC3HPE", n: "Histoire de la Pensée Economique", c: 1.0, u: "Compétences disciplinaires en Eco 35", cc: 0.0, ct: 1.0 },
      { id: "YEC3IPM", n: "Institutions et Politiques Monétaires", c: 1.0, u: "Compétences disciplinaires en Eco 35", cc: 0.0, ct: 1.0 }
    ],
    "Semestre 4": [
      { id: "YEC4MIC", n: "Microéconomie", c: 1.0, u: "Compétences disciplinaires en Eco 41", cc: 0.4, ct: 0.6 },
      { id: "YEC4CGE", n: "Comptabilité Générale 2", c: 2.0, u: "Compétences disciplinaires en Gest 42", cc: 0.0, ct: 1.0 },
      { id: "YEC4GOP", n: "Gestion Opérationnelle", c: 1.0, u: "Compétences disciplinaires en Gest 42", cc: 0.0, ct: 1.0 },
      { id: "YEC4INF", n: "Informatique appliquée à l'Economie et la Gestion 2", c: 1.0, u: "Compétences disciplinaires en Eco-Gest 43", cc: 0.0, ct: 1.0 },
      { id: "YEC4MAT", n: "Mathématiques pour l'Economie et la Gestion 4", c: 2.0, u: "Compétences disciplinaires en Eco-Gest 43", cc: 0.0, ct: 1.0 },
      { id: "YEC4ANG", n: "Anglais pour l'économie et la gestion 4", c: 1.0, u: "Compétences transversales Eco-Gest 44", cc: 0.0, ct: 1.0 },
      { id: "YEC4STA", n: "Méthodes Statistiques pour l'Economie et la Gestion 4", c: 2.0, u: "Compétences transversales Eco-Gest 44", cc: 0.4, ct: 0.6 },
      { id: "EC4TEJ", n: "Théories Economiques de la Justice", c: 1.0, u: "Compétences disciplinaires en Eco 45", cc: 0.0, ct: 1.0 },
      { id: "YEC4ECOE", n: "Economie de l'Environnement", c: 1.0, u: "Compétences disciplinaires en Eco 45", cc: 0.0, ct: 1.0 }
    ]
  },
  "Licence 2 Gestion": {
    "Semestre 3": [
      { id: "YEC3MAC", n: "Macroéconomie", c: 1.0, u: "Compétences disciplinaires en Eco 31", cc: 0.4, ct: 0.6 },
      { id: "YEC3CGE", n: "Comptabilité Générale 1", c: 2.0, u: "Compétences disciplinaires en Gest 32", cc: 0.0, ct: 1.0 },
      { id: "YEC3TF", n: "Techniques Financières", c: 1.0, u: "Compétences disciplinaires en Gest 32", cc: 0.0, ct: 1.0 },
      { id: "YEC3INF", n: "Informatique appliquée à l'Economie et à la Gestion 1", c: 1.0, u: "Compétences disciplinaires en Eco-Gest 33", cc: 0.0, ct: 1.0 },
      { id: "YEC3MAT", n: "Mathématiques pour l'Economie et la Gestion 3", c: 2.0, u: "Compétences disciplinaires en Eco-Gest 33", cc: 0.4, ct: 0.6 },
      { id: "YEC3ANG", n: "Anglais pour l'Economie et la Gestion 3", c: 1.0, u: "Compétences tranversales Eco-Gest 34", cc: 0.0, ct: 1.0 },
      { id: "YEC3STA", n: "Méthodes Statistiques pour l'Economie et la Gestion 3", c: 2.0, u: "Compétences tranversales Eco-Gest 34", cc: 0.4, ct: 0.6 },
      { id: "GS3ETMA", n: "Etudes de marché", c: 1.0, u: "Compétences disciplinaires en Gest 35", cc: 0.4, ct: 0.6 },
      { id: "YEC3IPM", n: "Institutions et Politiques Monétaires", c: 1.0, u: "Compétences disciplinaires en Gest 35", cc: 0.0, ct: 1.0 }
    ],
    "Semestre 4": [
      { id: "YEC4MIC", n: "Microéconomie", c: 1.0, u: "Compétences disciplinaires en Eco 41", cc: 0.4, ct: 0.6 },
      { id: "YEC4CGE", n: "Comptabilité Générale 2", c: 2.0, u: "Compétences disciplinaires en Gest 42", cc: 0.0, ct: 1.0 },
      { id: "YEC4GOP", n: "Gestion Opérationnelle", c: 1.0, u: "Compétences disciplinaires en Gest 42", cc: 0.0, ct: 1.0 },
      { id: "YEC4INF", n: "Informatique appliquée à l'Economie et la Gestion 2", c: 1.0, u: "Compétences disciplinaires en Eco-Gest 43", cc: 0.0, ct: 1.0 },
      { id: "YEC4MAT", n: "Mathématiques pour l'Economie et la Gestion 4", c: 2.0, u: "Compétences disciplinaires en Eco-Gest 43", cc: 0.0, ct: 1.0 },
      { id: "YEC4ANG", n: "Anglais pour l'économie et la gestion 4", c: 1.0, u: "Compétences transversales Eco-Gest 44", cc: 0.0, ct: 1.0 },
      { id: "YEC4STA", n: "Méthodes Statistiques pour l'Economie et la Gestion 4", c: 2.0, u: "Compétences transversales Eco-Gest 44", cc: 0.4, ct: 0.6 },
      { id: "GS4COM", n: "Communication digitale", c: 1.0, u: "Compétences disciplinaires en Gest 45", cc: 0.0, ct: 1.0 },
      { id: "GS4GPROD", n: "Gestion de la production", c: 1.0, u: "Compétences disciplinaires en Gest 45", cc: 0.0, ct: 1.0 },
      { id: "YEC4ECOE", n: "Economie de l'Environnement", c: 1.0, u: "Compétences disciplinaires en Gest 45", cc: 0.0, ct: 1.0 }
    ]
  },
  "Licence 3 Économie": {
    "Semestre 5": [
      { id: "EC5MIC", n: "Microéconomie", c: 6.0, u: "Compétences disciplinaires en Eco 51", cc: 0.0, ct: 1.0 },
      { id: "EC5ECOR", n: "Economie des organisations", c: 2.0, u: "Compétences disciplinaires en Eco 52", cc: 0.0, ct: 1.0 },
      { id: "EC5TDJ", n: "Théorie des jeux et choix en incertain", c: 4.0, u: "Compétences disciplinaires en Eco 52", cc: 0.0, ct: 1.0 },
      { id: "EC5CBE", n: "Croissance et bien être", c: 3.0, u: "Compétences disciplinaires en Eco 53", cc: 0.0, ct: 1.0 },
      { id: "EC5EDEV", n: "Economie du developpement", c: 3.0, u: "Compétences disciplinaires en Eco 53", cc: 0.0, ct: 1.0 },
      { id: "EC5ADD", n: "Analyse des données", c: 2.0, u: "Compétences transversales Economie 54", cc: 0.4, ct: 0.6 },
      { id: "EC5ANG", n: "Anglais pour l'économie", c: 2.0, u: "Compétences transversales Economie 54", cc: 0.5, ct: 0.5 },
      { id: "EC5INF", n: "Informatique appliquée 1", c: 2.0, u: "Compétences transversales Economie 54", cc: 0.0, ct: 1.0 },
      { id: "EC5MFI", n: "Marchés financiers", c: 3.0, u: "Compétences personnalisables 55", cc: 0.0, ct: 1.0 },
      { id: "YEC5EIND", n: "Economie industrielle", c: 3.0, u: "Compétences personnalisables 55", cc: 0.0, ct: 1.0 }
    ],
    "Semestre 6": [
      { id: "EC6MAC", n: "Macroéconomie", c: 6.0, u: "Compétences disciplinaires en Eco 61", cc: 0.0, ct: 1.0 },
      { id: "EC6ECONO", n: "Econométrie", c: 4.0, u: "Compétences disciplinaires en Eco 62", cc: 0.0, ct: 1.0 },
      { id: "EC6INF", n: "Informatique appliquée 2 (logiciel R)", c: 2.0, u: "Compétences disciplinaires en Eco 62", cc: 0.0, ct: 1.0 },
      { id: "EC6CI", n: "Commerce international", c: 2.0, u: "Compétences disciplinaires en Eco 63", cc: 0.0, ct: 1.0 },
      { id: "EC6ECTR", n: "Economie du travail", c: 2.0, u: "Compétences disciplinaires en Eco 63", cc: 0.0, ct: 1.0 },
      { id: "YEC6RFI", n: "Relations financières internationales", c: 2.0, u: "Compétences disciplinaires en Eco 63", cc: 0.0, ct: 1.0 },
      { id: "EC6ANG", n: "Anglais pour l'économie", c: 4.0, u: "Compétences transversales Economie 64", cc: 0.5, ct: 0.5 },
      { id: "EC6PPCM", n: "Projet professionnel & conférences des métiers", c: 2.0, u: "Compétences transversales Economie 64", cc: 0.0, ct: 1.0 },
      { id: "EC6ATRE", n: "Atelier recherche", c: 2.0, u: "Compétences personnalisables 65", cc: 0.0, ct: 1.0 },
      { id: "EC6ECGO", n: "Economie géographique", c: 2.0, u: "Compétences personnalisables 65", cc: 0.0, ct: 1.0 },
      { id: "EC6ECPU", n: "Economie publique", c: 2.0, u: "Compétences personnalisables 65", cc: 0.0, ct: 1.0 }
    ]
  },
  "Licence 3 Gestion (Gestion Opérationnelle)": {
    "Semestre 5": [
      { id: "YGS5CGE", n: "Comptabilité générale", c: 1.0, u: "Gestion 51 - COMPTABILITE", cc: 0.0, ct: 1.0 },
      { id: "YGS5CGS", n: "Comptabilité de gestion", c: 1.0, u: "Gestion 51 - COMPTABILITE", cc: 0.0, ct: 1.0 },
      { id: "YGS5AFI", n: "Analyse financière", c: 1.0, u: "Gestion 52 - FINANCE D'ENTREPRISE", cc: 0.0, ct: 1.0 },
      { id: "YGS5GFI", n: "Gestion financière", c: 1.0, u: "Gestion 52 - FINANCE D'ENTREPRISE", cc: 0.0, ct: 1.0 },
      { id: "YGS5AEM", n: "Aspects économiques de la mondialisation", c: 3.0, u: "UE 53 Stratégie", cc: 0.0, ct: 1.0 },
      { id: "YGS5MGT", n: "Management stratégique", c: 1.0, u: "UE 53 Stratégie", cc: 0.0, ct: 1.0 },
      { id: "YGS5ANG", n: "Anglais des affaires", c: 2.0, u: "Gestion 54 - COMPETENCES AU QUOTIDIEN", cc: 0.0, ct: 1.0 },
      { id: "YGS5INF", n: "Informatique appliquée", c: 1.0, u: "Gestion 54 - COMPETENCES AU QUOTIDIEN", cc: 0.0, ct: 1.0 },
      { id: "YGS5DTFI", n: "Droit fiscal", c: 1.0, u: "Gestion 55 - DROIT ET ENTREPRISE", cc: 0.0, ct: 1.0 },
      { id: "YGS5DTSO", n: "Droit des sociétés", c: 1.0, u: "Gestion 55 - DROIT ET ENTREPRISE", cc: 0.0, ct: 1.0 },
      { id: "YGS5DTTR", n: "Droit du travail", c: 1.0, u: "Gestion 55 - DROIT ET ENTREPRISE", cc: 0.0, ct: 1.0 }
    ],
    "Semestre 6": [
      { id: "YEC6RFI", n: "Relations financières internationales", c: 2.0, u: "UE Gestion 61 - FINANCE DE MARCHE", cc: 0.0, ct: 1.0 },
      { id: "YGS6GEPO", n: "Gestion de portefeuille", c: 2.0, u: "UE Gestion 61 - FINANCE DE MARCHE", cc: 0.0, ct: 1.0 },
      { id: "YGS6MFI", n: "Marchés Financiers", c: 2.0, u: "UE Gestion 61 - FINANCE DE MARCHE", cc: 0.0, ct: 1.0 },
      { id: "YGS6STRA", n: "Stratégie financière", c: 2.0, u: "UE Gestion 61 - FINANCE DE MARCHE", cc: 0.0, ct: 1.0 },
      { id: "YGS6GRH", n: "Gestion des ressources humaines", c: 1.0, u: "Gestion 62 - COMPETENCES MANAGERIALES", cc: 0.0, ct: 1.0 },
      { id: "YGS6MKT", n: "Marketing", c: 1.0, u: "Gestion 62 - COMPETENCES MANAGERIALES", cc: 0.4, ct: 0.6 },
      { id: "YGS6ADD", n: "Analyse des données", c: 2.0, u: "Gestion 63 - CONDUITE DES AFFAIRES EN RESPONSABILITE", cc: 0.0, ct: 1.0 },
      { id: "YGS6ANG", n: "Anglais des affaires 2", c: 1.0, u: "Gestion 63 - CONDUITE DES AFFAIRES EN RESPONSABILITE", cc: 0.0, ct: 1.0 },
      { id: "GS26DIFI", n: "Gestion de trésorerie", c: 1.0, u: "Gestion 64 - Pilotage et performance", cc: 0.0, ct: 1.0 },
      { id: "GS26LGS", n: "Logistique et Gestion de stocks", c: 1.0, u: "Gestion 64 - Pilotage et performance", cc: 0.0, ct: 1.0 },
      { id: "GS26TBP", n: "Tableaux de bord de pilotage", c: 1.0, u: "Gestion 64 - Pilotage et performance", cc: 0.0, ct: 1.0 },
      { id: "GS26PRCO", n: "Projet collectif", c: 4.0, u: "Gestion 65 - Mises en situation professionnelle", cc: 0.0, ct: 1.0 },
      { id: "GS26PSAP", n: "Préparation au stage", c: 1.0, u: "Gestion 65 - Mises en situation professionnelle", cc: 0.0, ct: 1.0 },
      { id: "GS26STLO", n: "Stage long", c: 4.0, u: "Gestion 65 - Mises en situation professionnelle", cc: 0.0, ct: 1.0 }
    ]
  },
  "Licence 3 Gestion (Entrepreneuriat & Dével.)": {
    "Semestre 5": [
      { id: "YGS5CGE", n: "Comptabilité générale", c: 1.0, u: "Gestion 51 - COMPTABILITE", cc: 0.0, ct: 1.0 },
      { id: "YGS5CGS", n: "Comptabilité de gestion", c: 1.0, u: "Gestion 51 - COMPTABILITE", cc: 0.0, ct: 1.0 },
      { id: "YGS5AFI", n: "Analyse financière", c: 1.0, u: "Gestion 52 - FINANCE D'ENTREPRISE", cc: 0.0, ct: 1.0 },
      { id: "YGS5GFI", n: "Gestion financière", c: 1.0, u: "Gestion 52 - FINANCE D'ENTREPRISE", cc: 0.0, ct: 1.0 },
      { id: "YGS5MGT", n: "Management stratégique", c: 1.0, u: "UE 53 - STRATEGIE", cc: 0.0, ct: 1.0 },
      { id: "YGS5ANG", n: "Anglais des affaires", c: 2.0, u: "Gestion 54 - COMPETENCES AU QUOTIDIEN", cc: 0.0, ct: 1.0 },
      { id: "YGS5INF", n: "Informatique appliquée", c: 1.0, u: "Gestion 54 - COMPETENCES AU QUOTIDIEN", cc: 0.0, ct: 1.0 },
      { id: "YGS5DTFI", n: "Droit fiscal", c: 1.0, u: "Gestion 55 - DROIT ET ENTREPRISE", cc: 0.0, ct: 1.0 },
      { id: "YGS5DTSO", n: "Droit des sociétés", c: 1.0, u: "Gestion 55 - DROIT ET ENTREPRISE", cc: 0.0, ct: 1.0 },
      { id: "YGS5DTTR", n: "Droit du travail", c: 1.0, u: "Gestion 55 - DROIT ET ENTREPRISE", cc: 0.0, ct: 1.0 }
    ],
    "Semestre 6": [
      { id: "YEC6RFI", n: "Relations financières internationales", c: 2.0, u: "UE Gestion 61 - FINANCE DE MARCHE", cc: 0.0, ct: 1.0 },
      { id: "YGS6GEPO", n: "Gestion de portefeuille", c: 2.0, u: "UE Gestion 61 - FINANCE DE MARCHE", cc: 0.0, ct: 1.0 },
      { id: "YGS6MFI", n: "Marchés Financiers", c: 2.0, u: "UE Gestion 61 - FINANCE DE MARCHE", cc: 0.0, ct: 1.0 },
      { id: "YGS6GRH", n: "Gestion des ressources humaines", c: 1.0, u: "Gestion 62 - COMPETENCES MANAGERIALES", cc: 0.0, ct: 1.0 },
      { id: "YGS6MKT", n: "Marketing", c: 1.0, u: "Gestion 62 - COMPETENCES MANAGERIALES", cc: 0.4, ct: 0.6 },
      { id: "YGS6ADD", n: "Analyse des données", c: 1.0, u: "UE Gestion 63 - CONDUITE DES AFFAIRES EN RESPONSABILITE", cc: 0.0, ct: 1.0 },
      { id: "YGS6ANG", n: "Anglais des affaires 2", c: 1.0, u: "UE Gestion 63 - CONDUITE DES AFFAIRES EN RESPONSABILITE", cc: 0.0, ct: 1.0 },
      { id: "GS16DEV", n: "Développement commercial", c: 1.0, u: "Gestion 64A - ENTREPRENEURIAT", cc: 0.0, ct: 1.0 },
      { id: "GS16ENT", n: "Entrepreneuriat", c: 2.0, u: "Gestion 64A - ENTREPRENEURIAT", cc: 0.0, ct: 1.0 },
      { id: "GS16MKD", n: "Marketing digital", c: 1.0, u: "Gestion 64A - ENTREPRENEURIAT", cc: 0.0, ct: 1.0 },
      { id: "GS16MIS", n: "Mission professionnelle", c: 1.0, u: "Gestion 64A - ENTREPRENEURIAT", cc: 0.0, ct: 1.0 },
      { id: "GS16STAG", n: "Stage", c: 1.0, u: "Gestion 64A - ENTREPRENEURIAT", cc: 0.0, ct: 1.0 }
    ]
  },
  "Licence 3 Gestion (Section Internationale)": {
    "Semestre 5": [
      { id: "YGS5CGE", n: "Comptabilité générale", c: 1.0, u: "Gestion 51 - COMPTABILITE", cc: 0.0, ct: 1.0 },
      { id: "YGS5CGS", n: "Comptabilité de gestion", c: 1.0, u: "Gestion 51 - COMPTABILITE", cc: 0.0, ct: 1.0 },
      { id: "YGS5AFI", n: "Analyse financière", c: 1.0, u: "Gestion 52 - FINANCE D'ENTREPRISE", cc: 0.0, ct: 1.0 },
      { id: "YGS5GFI", n: "Gestion financière", c: 1.0, u: "Gestion 52 - FINANCE D'ENTREPRISE", cc: 0.0, ct: 1.0 },
      { id: "YGS5AEM", n: "Aspects économiques de la mondialisation", c: 3.0, u: "UE 3 STRATEGIE", cc: 0.0, ct: 1.0 },
      { id: "YGS5MGT", n: "Management stratégique", c: 1.0, u: "UE 3 STRATEGIE", cc: 0.0, ct: 1.0 },
      { id: "YGS5ANG", n: "Anglais des affaires", c: 2.0, u: "Gestion 54 - COMPETENCES AU QUOTIDIEN", cc: 0.0, ct: 1.0 },
      { id: "YGS5INF", n: "Informatique appliquée", c: 1.0, u: "Gestion 54 - COMPETENCES AU QUOTIDIEN", cc: 0.0, ct: 1.0 },
      { id: "YGS5DTFI", n: "Droit fiscal", c: 1.0, u: "Gestion 55 - DROIT ET ENTREPRISE", cc: 0.0, ct: 1.0 },
      { id: "YGS5DTSO", n: "Droit des sociétés", c: 1.0, u: "Gestion 55 - DROIT ET ENTREPRISE", cc: 0.0, ct: 1.0 },
      { id: "YGS5DTTR", n: "Droit du travail", c: 1.0, u: "Gestion 55 - DROIT ET ENTREPRISE", cc: 0.0, ct: 1.0 }
    ],
    "Semestre 6": []
  }
};

export default function SimulateurPage() {
  const parcoursList = Object.keys(CURRICULUM_DATA);
  const [selectedParcours, setSelectedParcours] = useState(parcoursList[0]);

  const semestres = Object.keys(CURRICULUM_DATA[selectedParcours] || {});
  const [selectedSemestre, setSelectedSemestre] = useState(semestres[0] || "");

  // Notes state holds an object for each subject ID: { cc?: string, ct?: string, unique?: string }
  const [notes, setNotes] = useState<Record<string, Record<string, string>>>({});

  const currentSubjects = (CURRICULUM_DATA[selectedParcours] && CURRICULUM_DATA[selectedParcours][selectedSemestre]) ? CURRICULUM_DATA[selectedParcours][selectedSemestre] : [];

  const handleParcoursChange = (parcours: string) => {
    setSelectedParcours(parcours);
    const availableSemestres = Object.keys(CURRICULUM_DATA[parcours] || {});
    setSelectedSemestre(availableSemestres[0] || "");
    setNotes({});
  };

  const handleSemestreChange = (sem: string) => {
    setSelectedSemestre(sem);
    setNotes({});
  };

  const handleNoteChange = (id: string, field: string, val: string) => {
    const sanitized = val.replace(",", ".");
    if (sanitized === "" || (!isNaN(Number(sanitized)) && Number(sanitized) >= 0 && Number(sanitized) <= 20)) {
      setNotes((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] || {}),
          [field]: sanitized
        }
      }));
    }
  };

  const handleReset = () => setNotes({});

  let totalPoints = 0;
  let totalCoefs = 0;
  let enteredCount = 0;

  currentSubjects.forEach((sub) => {
    const subjNotes = notes[sub.id] || {};
    let finalNote = null;

    if (sub.cc > 0 && sub.ct > 0) {
      const ccVal = subjNotes.cc;
      const ctVal = subjNotes.ct;
      if (ccVal !== undefined && ccVal !== "" && ctVal !== undefined && ctVal !== "") {
        finalNote = (parseFloat(ccVal) * sub.cc) + (parseFloat(ctVal) * sub.ct);
      }
    } else {
      const uniqueVal = subjNotes.unique;
      if (uniqueVal !== undefined && uniqueVal !== "") {
        finalNote = parseFloat(uniqueVal);
      }
    }

    if (finalNote !== null) {
      totalPoints += finalNote * sub.c;
      totalCoefs += sub.c;
      enteredCount++;
    }
  });

  const average = totalCoefs > 0 ? totalPoints / totalCoefs : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Calculator size={13} /> Outil Officiel du BDE
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Simulateur de Moyenne & Compensation
        </h1>
        <p className="text-sm text-slate-500">
          Sélectionne ta promotion et ton semestre pour charger la grille officielle des coefficients et des répartitions CC/CT de l'UFR SEGGAT.
        </p>
      </div>

      {/* Sélecteurs */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            1. Choisis ta promotion / parcours
          </label>
          <div className="flex flex-wrap gap-2">
            {parcoursList.map((p) => (
              <button
                key={p}
                onClick={() => handleParcoursChange(p)}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold transition ${
                  selectedParcours === p
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            2. Choisis le semestre
          </label>
          <div className="flex flex-wrap gap-2">
            {semestres.map((s) => (
              <button
                key={s}
                onClick={() => handleSemestreChange(s)}
                className={`text-xs px-4 py-2 rounded-xl font-bold transition ${
                  selectedSemestre === s
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Résultat Flottant */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Moyenne du {selectedSemestre}
          </span>
          <div className="text-4xl sm:text-5xl font-black text-amber-400">
            {average !== null ? `${average.toFixed(2)} / 20` : "-- / 20"}
          </div>
          <p className="text-xs text-slate-400">
            {enteredCount} sur {currentSubjects.length} matières notées
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {average !== null && (
            <div
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
                average >= 10
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }`}
            >
              {average >= 10 ? (
                <>
                  <CheckCircle2 size={16} /> Semestre Validé
                </>
              ) : (
                <>
                  <AlertTriangle size={16} /> En rattrapages
                </>
              )}
            </div>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/10 px-3 py-2 rounded-xl transition"
          >
            <RotateCcw size={14} /> Effacer les notes
          </button>
        </div>
      </div>

      {/* Grille des matières */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={18} className="text-blue-600" />
            Matières & Coefficients officiels
          </h2>
          <span className="text-xs text-slate-400">Notes sur 20</span>
        </div>

        <div className="space-y-3">
          {currentSubjects.map((sub) => {
            // Si la matière a des poids CC et CT > 0, elle demande 2 inputs
            const needsTwoInputs = sub.cc > 0 && sub.ct > 0;

            return (
              <div
                key={sub.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-4"
              >
                <div className="flex-1">
                  <span className="block font-bold text-sm text-slate-900">{sub.n}</span>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-500">{sub.u}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Coef {sub.c}
                    </span>
                    {needsTwoInputs && (
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                        <Info size={10}/> CC ({sub.cc * 100}%) + CT ({sub.ct * 100}%)
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 self-end md:self-auto">
                  {needsTwoInputs ? (
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <label className="text-[10px] font-bold text-slate-400 mb-1">CC</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="Note"
                            value={notes[sub.id]?.cc || ""}
                            onChange={(e) => handleNoteChange(sub.id, "cc", e.target.value)}
                            className="w-14 px-2 py-1.5 text-center font-bold text-slate-900 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <label className="text-[10px] font-bold text-slate-400 mb-1">CT</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="Note"
                            value={notes[sub.id]?.ct || ""}
                            onChange={(e) => handleNoteChange(sub.id, "ct", e.target.value)}
                            className="w-14 px-2 py-1.5 text-center font-bold text-slate-900 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <label className="text-[10px] font-bold text-slate-400 mb-1">Note unique</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="Note"
                          value={notes[sub.id]?.unique || ""}
                          onChange={(e) => handleNoteChange(sub.id, "unique", e.target.value)}
                          className="w-14 px-2 py-1.5 text-center font-bold text-slate-900 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}