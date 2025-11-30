import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, collection, deleteDoc } from 'firebase/firestore';

// ============================================
// CONFIGURATION FIREBASE
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyCXPLFvFUAg43VBe86_Cv7VxzQYgUJKsNY",
  authDomain: "calendrier-chantier-2556c.firebaseapp.com",
  projectId: "calendrier-chantier-2556c",
  storageBucket: "calendrier-chantier-2556c.firebasestorage.app",
  messagingSenderId: "858143925404",
  appId: "1:858143925404:web:3c874577c3ca198967f959"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================
// CONFIGURATION DES UTILISATEURS AUTORISÉS
// ============================================
const UTILISATEURS_AUTORISES = [
  { email: 'vincent.pavanello@gmail.com', motDePasse: '123456', nom: 'Vincent P. (Gmail)' },
  { email: 'vincent.pavanello@realestech.eu', motDePasse: '654321', nom: 'Vincent P. (Realestech)' },
];
// ============================================
// COMPOSANT DE CONNEXION
// ============================================
function PageConnexion({ onConnexion }) {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    setTimeout(() => {
      const utilisateur = UTILISATEURS_AUTORISES.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.motDePasse === motDePasse
      );

      if (utilisateur) {
        localStorage.setItem('session_calendrier', JSON.stringify({
          email: utilisateur.email,
          nom: utilisateur.nom,
          connecteA: new Date().toISOString()
        }));
        onConnexion(utilisateur);
      } else {
        setErreur('Email ou mot de passe incorrect');
      }
      setChargement(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl shadow-lg mb-4">
            <span className="text-4xl">🏗️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Calendrier Chantier</h1>
          <p className="text-slate-400">Outil collaboratif de suivi d'opération</p>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-emerald-400 text-sm">Temps réel activé</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Connexion</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
              <input
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {erreur && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-300 text-sm text-center">
                {erreur}
              </div>
            )}

            <button
              type="submit"
              disabled={chargement}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {chargement ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          🔄 Les modifications sont synchronisées en temps réel
        </p>
      </div>
    </div>
  );
}
// ============================================
// DONNÉES INITIALES DU PLANNING
// ============================================
const PHASES = {
  ETUDES: { nom: 'Études & Conception', couleur: '#6366F1' },
  ADMINISTRATIF: { nom: 'Administratif', couleur: '#8B5CF6' },
  COMMERCIAL: { nom: 'Commercial', couleur: '#EC4899' },
  PREPARATION: { nom: 'Préparation Chantier', couleur: '#F59E0B' },
  GROS_OEUVRE: { nom: 'Gros Œuvre', couleur: '#EF4444' },
  CLOS_COUVERT: { nom: 'Clos & Couvert', couleur: '#10B981' },
  SECOND_OEUVRE: { nom: 'Second Œuvre', couleur: '#3B82F6' },
  FINITIONS: { nom: 'Finitions', couleur: '#F97316' },
  LIVRAISON: { nom: 'Livraison', couleur: '#14B8A6' },
};

const lotsInitiaux = [
  { id: 1, nom: 'Études de faisabilité', phase: 'ETUDES', duree: 30, typeDebut: 'fixe', dateDebut: '2025-01-06', dependances: [], decalage: 0, jalon: false },
  { id: 2, nom: 'Études géotechniques', phase: 'ETUDES', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [1], decalage: 0, jalon: false },
  { id: 3, nom: 'Esquisse architecturale', phase: 'ETUDES', duree: 45, typeDebut: 'dependance', dateDebut: '', dependances: [1], decalage: 0, jalon: false },
  { id: 4, nom: 'APS (Avant-Projet Sommaire)', phase: 'ETUDES', duree: 30, typeDebut: 'dependance', dateDebut: '', dependances: [3], decalage: 0, jalon: false },
  { id: 5, nom: 'APD (Avant-Projet Définitif)', phase: 'ETUDES', duree: 45, typeDebut: 'dependance', dateDebut: '', dependances: [4], decalage: 0, jalon: false },
  { id: 6, nom: 'PRO/DCE', phase: 'ETUDES', duree: 60, typeDebut: 'dependance', dateDebut: '', dependances: [5], decalage: 0, jalon: false },
  { id: 7, nom: 'Dépôt Permis de Construire', phase: 'ADMINISTRATIF', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [5], decalage: 0, jalon: true },
  { id: 8, nom: 'Instruction PC', phase: 'ADMINISTRATIF', duree: 90, typeDebut: 'dependance', dateDebut: '', dependances: [7], decalage: 0, jalon: false },
  { id: 9, nom: 'Obtention Permis de Construire', phase: 'ADMINISTRATIF', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [8], decalage: 0, jalon: true },
  { id: 10, nom: 'Purge recours des tiers', phase: 'ADMINISTRATIF', duree: 60, typeDebut: 'dependance', dateDebut: '', dependances: [9], decalage: 0, jalon: false },
  { id: 11, nom: 'Permis purgé', phase: 'ADMINISTRATIF', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [10], decalage: 0, jalon: true },
  { id: 12, nom: 'Lancement commercial', phase: 'COMMERCIAL', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [9], decalage: 0, jalon: true },
  { id: 13, nom: 'Commercialisation', phase: 'COMMERCIAL', duree: 365, typeDebut: 'dependance', dateDebut: '', dependances: [12], decalage: 0, jalon: false },
  { id: 14, nom: 'Atteinte 50% réservations (GFA)', phase: 'COMMERCIAL', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [12], decalage: 90, jalon: true },
  { id: 15, nom: 'Consultation entreprises', phase: 'PREPARATION', duree: 45, typeDebut: 'dependance', dateDebut: '', dependances: [6], decalage: 0, jalon: false },
  { id: 16, nom: 'Analyse offres & négociations', phase: 'PREPARATION', duree: 30, typeDebut: 'dependance', dateDebut: '', dependances: [15], decalage: 0, jalon: false },
  { id: 17, nom: 'Signature marchés', phase: 'PREPARATION', duree: 14, typeDebut: 'dependance', dateDebut: '', dependances: [16, 11, 14], decalage: 0, jalon: false },
  { id: 18, nom: 'Installation chantier', phase: 'PREPARATION', duree: 14, typeDebut: 'dependance', dateDebut: '', dependances: [17], decalage: 0, jalon: false },
  { id: 19, nom: 'Terrassement général', phase: 'PREPARATION', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [18], decalage: 0, jalon: false },
  { id: 20, nom: 'Fondations spéciales', phase: 'GROS_OEUVRE', duree: 30, typeDebut: 'dependance', dateDebut: '', dependances: [19], decalage: 0, jalon: false },
  { id: 21, nom: 'Infrastructure (sous-sols)', phase: 'GROS_OEUVRE', duree: 45, typeDebut: 'dependance', dateDebut: '', dependances: [20], decalage: 0, jalon: false },
  { id: 22, nom: 'Superstructure RDC', phase: 'GROS_OEUVRE', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [21], decalage: 0, jalon: false },
  { id: 23, nom: 'Superstructure R+1', phase: 'GROS_OEUVRE', duree: 18, typeDebut: 'dependance', dateDebut: '', dependances: [22], decalage: 0, jalon: false },
  { id: 24, nom: 'Superstructure R+2', phase: 'GROS_OEUVRE', duree: 18, typeDebut: 'dependance', dateDebut: '', dependances: [23], decalage: 0, jalon: false },
  { id: 25, nom: 'Superstructure R+3', phase: 'GROS_OEUVRE', duree: 18, typeDebut: 'dependance', dateDebut: '', dependances: [24], decalage: 0, jalon: false },
  { id: 26, nom: 'Superstructure R+4 (attique)', phase: 'GROS_OEUVRE', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [25], decalage: 0, jalon: false },
  { id: 27, nom: 'Achèvement Gros Œuvre', phase: 'GROS_OEUVRE', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [26], decalage: 0, jalon: true },
  { id: 28, nom: 'Charpente', phase: 'CLOS_COUVERT', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [26], decalage: 0, jalon: false },
  { id: 29, nom: 'Couverture / Étanchéité toiture', phase: 'CLOS_COUVERT', duree: 28, typeDebut: 'dependance', dateDebut: '', dependances: [28], decalage: 0, jalon: false },
  { id: 30, nom: 'Menuiseries extérieures', phase: 'CLOS_COUVERT', duree: 35, typeDebut: 'dependance', dateDebut: '', dependances: [24], decalage: 7, jalon: false },
  { id: 31, nom: 'Étanchéité façades', phase: 'CLOS_COUVERT', duree: 28, typeDebut: 'dependance', dateDebut: '', dependances: [30], decalage: 0, jalon: false },
  { id: 32, nom: 'Mise hors d\'eau hors d\'air', phase: 'CLOS_COUVERT', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [29, 30, 31], decalage: 0, jalon: true },
  { id: 33, nom: 'Plomberie - réseaux', phase: 'SECOND_OEUVRE', duree: 60, typeDebut: 'dependance', dateDebut: '', dependances: [32], decalage: 0, jalon: false },
  { id: 34, nom: 'Électricité - réseaux', phase: 'SECOND_OEUVRE', duree: 60, typeDebut: 'dependance', dateDebut: '', dependances: [32], decalage: 0, jalon: false },
  { id: 35, nom: 'CVC - Installation', phase: 'SECOND_OEUVRE', duree: 50, typeDebut: 'dependance', dateDebut: '', dependances: [32], decalage: 7, jalon: false },
  { id: 36, nom: 'Cloisons / Doublages', phase: 'SECOND_OEUVRE', duree: 45, typeDebut: 'dependance', dateDebut: '', dependances: [34], decalage: 14, jalon: false },
  { id: 37, nom: 'Chapes / Ragréages', phase: 'SECOND_OEUVRE', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [33, 34], decalage: 0, jalon: false },
  { id: 38, nom: 'Menuiseries intérieures', phase: 'SECOND_OEUVRE', duree: 30, typeDebut: 'dependance', dateDebut: '', dependances: [36], decalage: 0, jalon: false },
  { id: 39, nom: 'Plomberie - appareillages', phase: 'SECOND_OEUVRE', duree: 28, typeDebut: 'dependance', dateDebut: '', dependances: [37], decalage: 14, jalon: false },
  { id: 40, nom: 'Électricité - appareillages', phase: 'SECOND_OEUVRE', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [37], decalage: 14, jalon: false },
  { id: 41, nom: 'Peintures', phase: 'FINITIONS', duree: 45, typeDebut: 'dependance', dateDebut: '', dependances: [36], decalage: 7, jalon: false },
  { id: 42, nom: 'Faïences / Carrelages', phase: 'FINITIONS', duree: 35, typeDebut: 'dependance', dateDebut: '', dependances: [37], decalage: 7, jalon: false },
  { id: 43, nom: 'Parquets / Sols souples', phase: 'FINITIONS', duree: 28, typeDebut: 'dependance', dateDebut: '', dependances: [42], decalage: 0, jalon: false },
  { id: 44, nom: 'Équipements cuisines', phase: 'FINITIONS', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [39, 40, 42], decalage: 0, jalon: false },
  { id: 45, nom: 'Ravalement façades', phase: 'FINITIONS', duree: 45, typeDebut: 'dependance', dateDebut: '', dependances: [31], decalage: 30, jalon: false },
  { id: 46, nom: 'VRD / Espaces verts', phase: 'FINITIONS', duree: 35, typeDebut: 'dependance', dateDebut: '', dependances: [21], decalage: 60, jalon: false },
  { id: 47, nom: 'Pré-réception', phase: 'LIVRAISON', duree: 14, typeDebut: 'dependance', dateDebut: '', dependances: [41, 43, 44, 45, 46], decalage: 0, jalon: false },
  { id: 48, nom: 'Levée des réserves', phase: 'LIVRAISON', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [47], decalage: 0, jalon: false },
  { id: 49, nom: 'OPR (Opérations Préalables Réception)', phase: 'LIVRAISON', duree: 7, typeDebut: 'dependance', dateDebut: '', dependances: [48], decalage: 0, jalon: false },
  { id: 50, nom: 'Réception / Livraison', phase: 'LIVRAISON', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [49], decalage: 0, jalon: true },
  { id: 51, nom: 'Livraisons acquéreurs', phase: 'LIVRAISON', duree: 30, typeDebut: 'dependance', dateDebut: '', dependances: [50], decalage: 0, jalon: false },
  { id: 52, nom: 'GPA (Garantie Parfait Achèvement)', phase: 'LIVRAISON', duree: 365, typeDebut: 'dependance', dateDebut: '', dependances: [50], decalage: 0, jalon: false },
];
