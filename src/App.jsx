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
