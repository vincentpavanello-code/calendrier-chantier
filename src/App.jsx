import React, { useState, useMemo, useCallback, useEffect } from 'react';

// ============================================
// CONFIGURATION DES UTILISATEURS AUTORISÉS
// ⚠️ En production, utiliser un vrai système d'auth (Firebase, Auth0, etc.)
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

    // Simulation d'un délai de vérification
    setTimeout(() => {
      const utilisateur = UTILISATEURS_AUTORISES.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.motDePasse === motDePasse
      );

      if (utilisateur) {
        // Stocker la session
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
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl shadow-lg mb-4">
            <span className="text-4xl">🏗️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Calendrier Chantier</h1>
          <p className="text-slate-400">Outil de suivi d'opération immobilière</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Connexion</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Adresse email
              </label>
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Mot de passe
              </label>
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

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Accès réservé aux utilisateurs autorisés
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
  // ÉTUDES & CONCEPTION
  { id: 1, nom: 'Études de faisabilité', phase: 'ETUDES', duree: 30, typeDebut: 'fixe', dateDebut: '2025-01-06', dependances: [], decalage: 0, jalon: false },
  { id: 2, nom: 'Études géotechniques', phase: 'ETUDES', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [1], decalage: 0, jalon: false },
  { id: 3, nom: 'Esquisse architecturale', phase: 'ETUDES', duree: 45, typeDebut: 'dependance', dateDebut: '', dependances: [1], decalage: 0, jalon: false },
  { id: 4, nom: 'APS (Avant-Projet Sommaire)', phase: 'ETUDES', duree: 30, typeDebut: 'dependance', dateDebut: '', dependances: [3], decalage: 0, jalon: false },
  { id: 5, nom: 'APD (Avant-Projet Définitif)', phase: 'ETUDES', duree: 45, typeDebut: 'dependance', dateDebut: '', dependances: [4], decalage: 0, jalon: false },
  { id: 6, nom: 'PRO/DCE', phase: 'ETUDES', duree: 60, typeDebut: 'dependance', dateDebut: '', dependances: [5], decalage: 0, jalon: false },
  
  // ADMINISTRATIF
  { id: 7, nom: 'Dépôt Permis de Construire', phase: 'ADMINISTRATIF', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [5], decalage: 0, jalon: true },
  { id: 8, nom: 'Instruction PC', phase: 'ADMINISTRATIF', duree: 90, typeDebut: 'dependance', dateDebut: '', dependances: [7], decalage: 0, jalon: false },
  { id: 9, nom: 'Obtention Permis de Construire', phase: 'ADMINISTRATIF', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [8], decalage: 0, jalon: true },
  { id: 10, nom: 'Purge recours des tiers', phase: 'ADMINISTRATIF', duree: 60, typeDebut: 'dependance', dateDebut: '', dependances: [9], decalage: 0, jalon: false },
  { id: 11, nom: 'Permis purgé', phase: 'ADMINISTRATIF', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [10], decalage: 0, jalon: true },
  
  // COMMERCIAL
  { id: 12, nom: 'Lancement commercial', phase: 'COMMERCIAL', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [9], decalage: 0, jalon: true },
  { id: 13, nom: 'Commercialisation', phase: 'COMMERCIAL', duree: 365, typeDebut: 'dependance', dateDebut: '', dependances: [12], decalage: 0, jalon: false },
  { id: 14, nom: 'Atteinte 50% réservations (GFA)', phase: 'COMMERCIAL', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [12], decalage: 90, jalon: true },
  
  // PRÉPARATION CHANTIER
  { id: 15, nom: 'Consultation entreprises', phase: 'PREPARATION', duree: 45, typeDebut: 'dependance', dateDebut: '', dependances: [6], decalage: 0, jalon: false },
  { id: 16, nom: 'Analyse offres & négociations', phase: 'PREPARATION', duree: 30, typeDebut: 'dependance', dateDebut: '', dependances: [15], decalage: 0, jalon: false },
  { id: 17, nom: 'Signature marchés', phase: 'PREPARATION', duree: 14, typeDebut: 'dependance', dateDebut: '', dependances: [16, 11, 14], decalage: 0, jalon: false },
  { id: 18, nom: 'Installation chantier', phase: 'PREPARATION', duree: 14, typeDebut: 'dependance', dateDebut: '', dependances: [17], decalage: 0, jalon: false },
  { id: 19, nom: 'Terrassement général', phase: 'PREPARATION', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [18], decalage: 0, jalon: false },
  
  // GROS ŒUVRE
  { id: 20, nom: 'Fondations spéciales', phase: 'GROS_OEUVRE', duree: 30, typeDebut: 'dependance', dateDebut: '', dependances: [19], decalage: 0, jalon: false },
  { id: 21, nom: 'Infrastructure (sous-sols)', phase: 'GROS_OEUVRE', duree: 45, typeDebut: 'dependance', dateDebut: '', dependances: [20], decalage: 0, jalon: false },
  { id: 22, nom: 'Superstructure RDC', phase: 'GROS_OEUVRE', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [21], decalage: 0, jalon: false },
  { id: 23, nom: 'Superstructure R+1', phase: 'GROS_OEUVRE', duree: 18, typeDebut: 'dependance', dateDebut: '', dependances: [22], decalage: 0, jalon: false },
  { id: 24, nom: 'Superstructure R+2', phase: 'GROS_OEUVRE', duree: 18, typeDebut: 'dependance', dateDebut: '', dependances: [23], decalage: 0, jalon: false },
  { id: 25, nom: 'Superstructure R+3', phase: 'GROS_OEUVRE', duree: 18, typeDebut: 'dependance', dateDebut: '', dependances: [24], decalage: 0, jalon: false },
  { id: 26, nom: 'Superstructure R+4 (attique)', phase: 'GROS_OEUVRE', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [25], decalage: 0, jalon: false },
  { id: 27, nom: 'Achèvement Gros Œuvre', phase: 'GROS_OEUVRE', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [26], decalage: 0, jalon: true },
  
  // CLOS & COUVERT
  { id: 28, nom: 'Charpente', phase: 'CLOS_COUVERT', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [26], decalage: 0, jalon: false },
  { id: 29, nom: 'Couverture / Étanchéité toiture', phase: 'CLOS_COUVERT', duree: 28, typeDebut: 'dependance', dateDebut: '', dependances: [28], decalage: 0, jalon: false },
  { id: 30, nom: 'Menuiseries extérieures', phase: 'CLOS_COUVERT', duree: 35, typeDebut: 'dependance', dateDebut: '', dependances: [24], decalage: 7, jalon: false },
  { id: 31, nom: 'Étanchéité façades', phase: 'CLOS_COUVERT', duree: 28, typeDebut: 'dependance', dateDebut: '', dependances: [30], decalage: 0, jalon: false },
  { id: 32, nom: 'Mise hors d\'eau hors d\'air', phase: 'CLOS_COUVERT', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [29, 30, 31], decalage: 0, jalon: true },
  
  // SECOND ŒUVRE
  { id: 33, nom: 'Plomberie - réseaux', phase: 'SECOND_OEUVRE', duree: 60, typeDebut: 'dependance', dateDebut: '', dependances: [32], decalage: 0, jalon: false },
  { id: 34, nom: 'Électricité - réseaux', phase: 'SECOND_OEUVRE', duree: 60, typeDebut: 'dependance', dateDebut: '', dependances: [32], decalage: 0, jalon: false },
  { id: 35, nom: 'CVC - Installation', phase: 'SECOND_OEUVRE', duree: 50, typeDebut: 'dependance', dateDebut: '', dependances: [32], decalage: 7, jalon: false },
  { id: 36, nom: 'Cloisons / Doublages', phase: 'SECOND_OEUVRE', duree: 45, typeDebut: 'dependance', dateDebut: '', dependances: [34], decalage: 14, jalon: false },
  { id: 37, nom: 'Chapes / Ragréages', phase: 'SECOND_OEUVRE', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [33, 34], decalage: 0, jalon: false },
  { id: 38, nom: 'Menuiseries intérieures', phase: 'SECOND_OEUVRE', duree: 30, typeDebut: 'dependance', dateDebut: '', dependances: [36], decalage: 0, jalon: false },
  { id: 39, nom: 'Plomberie - appareillages', phase: 'SECOND_OEUVRE', duree: 28, typeDebut: 'dependance', dateDebut: '', dependances: [37], decalage: 14, jalon: false },
  { id: 40, nom: 'Électricité - appareillages', phase: 'SECOND_OEUVRE', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [37], decalage: 14, jalon: false },
  
  // FINITIONS
  { id: 41, nom: 'Peintures', phase: 'FINITIONS', duree: 45, typeDebut: 'dependance', dateDebut: '', dependances: [36], decalage: 7, jalon: false },
  { id: 42, nom: 'Faïences / Carrelages', phase: 'FINITIONS', duree: 35, typeDebut: 'dependance', dateDebut: '', dependances: [37], decalage: 7, jalon: false },
  { id: 43, nom: 'Parquets / Sols souples', phase: 'FINITIONS', duree: 28, typeDebut: 'dependance', dateDebut: '', dependances: [42], decalage: 0, jalon: false },
  { id: 44, nom: 'Équipements cuisines', phase: 'FINITIONS', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [39, 40, 42], decalage: 0, jalon: false },
  { id: 45, nom: 'Ravalement façades', phase: 'FINITIONS', duree: 45, typeDebut: 'dependance', dateDebut: '', dependances: [31], decalage: 30, jalon: false },
  { id: 46, nom: 'VRD / Espaces verts', phase: 'FINITIONS', duree: 35, typeDebut: 'dependance', dateDebut: '', dependances: [21], decalage: 60, jalon: false },
  
  // LIVRAISON
  { id: 47, nom: 'Pré-réception', phase: 'LIVRAISON', duree: 14, typeDebut: 'dependance', dateDebut: '', dependances: [41, 43, 44, 45, 46], decalage: 0, jalon: false },
  { id: 48, nom: 'Levée des réserves', phase: 'LIVRAISON', duree: 21, typeDebut: 'dependance', dateDebut: '', dependances: [47], decalage: 0, jalon: false },
  { id: 49, nom: 'OPR (Opérations Préalables Réception)', phase: 'LIVRAISON', duree: 7, typeDebut: 'dependance', dateDebut: '', dependances: [48], decalage: 0, jalon: false },
  { id: 50, nom: 'Réception / Livraison', phase: 'LIVRAISON', duree: 1, typeDebut: 'dependance', dateDebut: '', dependances: [49], decalage: 0, jalon: true },
  { id: 51, nom: 'Livraisons acquéreurs', phase: 'LIVRAISON', duree: 30, typeDebut: 'dependance', dateDebut: '', dependances: [50], decalage: 0, jalon: false },
  { id: 52, nom: 'GPA (Garantie Parfait Achèvement)', phase: 'LIVRAISON', duree: 365, typeDebut: 'dependance', dateDebut: '', dependances: [50], decalage: 0, jalon: false },
];

// ============================================
// COMPOSANT PRINCIPAL DU CALENDRIER
// ============================================
function CalendrierApp({ utilisateur, onDeconnexion }) {
  const [versions, setVersions] = useState(() => {
    // Charger depuis localStorage si disponible
    const saved = localStorage.getItem(`calendrier_versions_${utilisateur.email}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erreur chargement données:', e);
      }
    }
    return [{
      id: 1,
      nom: 'Version initiale',
      date: new Date().toISOString(),
      lots: JSON.parse(JSON.stringify(lotsInitiaux)),
      notes: 'Planning de référence',
      creePar: utilisateur.email
    }];
  });

  const [versionActive, setVersionActive] = useState(1);
  const [zoom, setZoom] = useState(0.8);
  const [phasesFiltrees, setPhasesFiltrees] = useState(Object.keys(PHASES));
  const [lotSelectionne, setLotSelectionne] = useState(null);
  const [afficherJalons, setAfficherJalons] = useState(true);
  const [modeComparaison, setModeComparaison] = useState(false);
  const [versionComparee, setVersionComparee] = useState(null);
  const [nomNouvelleVersion, setNomNouvelleVersion] = useState('');
  const [notesNouvelleVersion, setNotesNouvelleVersion] = useState('');
  const [showNewVersionModal, setShowNewVersionModal] = useState(false);

  // Sauvegarder automatiquement
  useEffect(() => {
    localStorage.setItem(`calendrier_versions_${utilisateur.email}`, JSON.stringify(versions));
  }, [versions, utilisateur.email]);

  const versionCourante = versions.find(v => v.id === versionActive);
  const lots = versionCourante?.lots || [];

  const calculerDates = useMemo(() => {
    const resultats = {};
    
    const calculerPourLot = (lot) => {
      if (resultats[lot.id]) return resultats[lot.id];
      
      let dateDebut;
      if (lot.typeDebut === 'fixe') {
        dateDebut = new Date(lot.dateDebut);
      } else if (lot.dependances && lot.dependances.length > 0) {
        const datesFin = lot.dependances.map(depId => {
          const lotDep = lots.find(l => l.id === depId);
          if (lotDep) {
            const datesDep = calculerPourLot(lotDep);
            return datesDep.dateFin;
          }
          return new Date();
        });
        dateDebut = new Date(Math.max(...datesFin.map(d => d.getTime())));
        dateDebut.setDate(dateDebut.getDate() + (lot.decalage || 0));
      } else {
        dateDebut = new Date();
      }
      
      if (isNaN(dateDebut.getTime())) {
        dateDebut = new Date();
      }
      
      const dateFin = new Date(dateDebut);
      dateFin.setDate(dateFin.getDate() + lot.duree);
      
      resultats[lot.id] = { dateDebut, dateFin };
      return resultats[lot.id];
    };
    
    lots.forEach(lot => calculerPourLot(lot));
    return resultats;
  }, [lots]);

  const calculerDatesComparaison = useMemo(() => {
    if (!modeComparaison || !versionComparee) return {};
    const lotsComp = versions.find(v => v.id === versionComparee)?.lots || [];
    const resultats = {};
    
    const calculerPourLot = (lot) => {
      if (resultats[lot.id]) return resultats[lot.id];
      
      let dateDebut;
      if (lot.typeDebut === 'fixe') {
        dateDebut = new Date(lot.dateDebut);
      } else if (lot.dependances && lot.dependances.length > 0) {
        const datesFin = lot.dependances.map(depId => {
          const lotDep = lotsComp.find(l => l.id === depId);
          if (lotDep) {
            const datesDep = calculerPourLot(lotDep);
            return datesDep.dateFin;
          }
          return new Date();
        });
        dateDebut = new Date(Math.max(...datesFin.map(d => d.getTime())));
        dateDebut.setDate(dateDebut.getDate() + (lot.decalage || 0));
      } else {
        dateDebut = new Date();
      }
      
      if (isNaN(dateDebut.getTime())) dateDebut = new Date();
      
      const dateFin = new Date(dateDebut);
      dateFin.setDate(dateFin.getDate() + lot.duree);
      
      resultats[lot.id] = { dateDebut, dateFin };
      return resultats[lot.id];
    };
    
    lotsComp.forEach(lot => calculerPourLot(lot));
    return resultats;
  }, [modeComparaison, versionComparee, versions]);

  const { dateMinProjet, dateMaxProjet, dureeProjet } = useMemo(() => {
    const dates = Object.values(calculerDates);
    if (dates.length === 0) return { dateMinProjet: new Date(), dateMaxProjet: new Date(), dureeProjet: 1 };
    
    const min = new Date(Math.min(...dates.map(d => d.dateDebut.getTime())));
    const max = new Date(Math.max(...dates.map(d => d.dateFin.getTime())));
    
    if (modeComparaison && Object.keys(calculerDatesComparaison).length > 0) {
      const datesComp = Object.values(calculerDatesComparaison);
      const minComp = Math.min(...datesComp.map(d => d.dateDebut.getTime()));
      const maxComp = Math.max(...datesComp.map(d => d.dateFin.getTime()));
      if (minComp < min.getTime()) min.setTime(minComp);
      if (maxComp > max.getTime()) max.setTime(maxComp);
    }
    
    const duree = Math.ceil((max - min) / (1000 * 60 * 60 * 24));
    return { dateMinProjet: min, dateMaxProjet: max, dureeProjet: duree || 1 };
  }, [calculerDates, calculerDatesComparaison, modeComparaison]);

  const lotsFiltres = useMemo(() => {
    return lots.filter(lot => phasesFiltrees.includes(lot.phase));
  }, [lots, phasesFiltrees]);

  const mettreAJourLot = useCallback((id, champ, valeur) => {
    setVersions(prev => prev.map(version => {
      if (version.id === versionActive) {
        return {
          ...version,
          lots: version.lots.map(lot => {
            if (lot.id === id) {
              const nouveau = { ...lot, [champ]: valeur };
              if (champ === 'typeDebut' && valeur === 'fixe') {
                nouveau.dependances = [];
                nouveau.dateDebut = nouveau.dateDebut || new Date().toISOString().split('T')[0];
              }
              if (champ === 'typeDebut' && valeur === 'dependance') {
                nouveau.dateDebut = '';
              }
              return nouveau;
            }
            return lot;
          }),
          modifieLe: new Date().toISOString(),
          modifiePar: utilisateur.email
        };
      }
      return version;
    }));
  }, [versionActive, utilisateur.email]);

  const creerNouvelleVersion = () => {
    const nouvelleVersion = {
      id: Math.max(...versions.map(v => v.id)) + 1,
      nom: nomNouvelleVersion || `Version ${versions.length + 1}`,
      date: new Date().toISOString(),
      lots: JSON.parse(JSON.stringify(lots)),
      notes: notesNouvelleVersion || '',
      creePar: utilisateur.email
    };
    setVersions(prev => [...prev, nouvelleVersion]);
    setVersionActive(nouvelleVersion.id);
    setShowNewVersionModal(false);
    setNomNouvelleVersion('');
    setNotesNouvelleVersion('');
  };

  const supprimerVersion = (id) => {
    if (versions.length <= 1) return;
    setVersions(prev => prev.filter(v => v.id !== id));
    if (versionActive === id) {
      setVersionActive(versions.find(v => v.id !== id)?.id || 1);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateCourte = (date) => {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const genererMois = useMemo(() => {
    const mois = [];
    const current = new Date(dateMinProjet);
    current.setDate(1);
    
    while (current <= dateMaxProjet) {
      const debutMois = new Date(current);
      const finMois = new Date(current.getFullYear(), current.getMonth() + 1, 0);
      
      const debutEffectif = debutMois < dateMinProjet ? dateMinProjet : debutMois;
      const finEffective = finMois > dateMaxProjet ? dateMaxProjet : finMois;
      
      const positionDebut = ((debutEffectif - dateMinProjet) / (1000 * 60 * 60 * 24)) / dureeProjet * 100;
      const largeur = ((finEffective - debutEffectif) / (1000 * 60 * 60 * 24) + 1) / dureeProjet * 100;
      
      mois.push({
        nom: current.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        position: positionDebut,
        largeur: largeur,
        annee: current.getFullYear()
      });
      
      current.setMonth(current.getMonth() + 1);
    }
    return mois;
  }, [dateMinProjet, dateMaxProjet, dureeProjet]);

  const genererAnnees = useMemo(() => {
    const annees = [];
    const anneesUniques = [...new Set(genererMois.map(m => m.annee))];
    
    anneesUniques.forEach(annee => {
      const moisAnnee = genererMois.filter(m => m.annee === annee);
      const debut = Math.min(...moisAnnee.map(m => m.position));
      const fin = Math.max(...moisAnnee.map(m => m.position + m.largeur));
      annees.push({ annee, position: debut, largeur: fin - debut });
    });
    
    return annees;
  }, [genererMois]);

  const jalons = useMemo(() => {
    return lots.filter(l => l.jalon && phasesFiltrees.includes(l.phase));
  }, [lots, phasesFiltrees]);

  const calculerCheminCritique = useMemo(() => {
    const dateLivraison = calculerDates[50];
    if (!dateLivraison) return new Set();
    
    const cheminCritique = new Set();
    
    const trouverChemin = (lotId) => {
      const lot = lots.find(l => l.id === lotId);
      if (!lot) return;
      
      cheminCritique.add(lotId);
      
      if (lot.dependances && lot.dependances.length > 0) {
        const datesFinDeps = lot.dependances.map(depId => ({
          id: depId,
          dateFin: calculerDates[depId]?.dateFin || new Date(0)
        }));
        
        const depCritique = datesFinDeps.reduce((max, dep) => 
          dep.dateFin > max.dateFin ? dep : max
        );
        
        trouverChemin(depCritique.id);
      }
    };
    
    trouverChemin(50);
    return cheminCritique;
  }, [lots, calculerDates]);

  const togglePhase = (phase) => {
    setPhasesFiltrees(prev => 
      prev.includes(phase) 
        ? prev.filter(p => p !== phase)
        : [...prev, phase]
    );
  };

  const getPositionEtLargeur = (dates, dateMin, dureeProjet) => {
    const position = ((dates.dateDebut - dateMin) / (1000 * 60 * 60 * 24)) / dureeProjet * 100;
    const largeur = ((dates.dateFin - dates.dateDebut) / (1000 * 60 * 60 * 24)) / dureeProjet * 100;
    return { position, largeur };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-4 shadow-lg">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🏗️ Calendrier Opération Immobilière</h1>
            <p className="text-slate-300 text-sm">Planning détaillé de promotion immobilière</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNewVersionModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <span>➕</span> Nouvelle version
            </button>
            
            {/* Menu utilisateur */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-600">
              <div className="text-right">
                <div className="text-sm font-medium">{utilisateur.nom}</div>
                <div className="text-xs text-slate-400">{utilisateur.email}</div>
              </div>
              <button
                onClick={onDeconnexion}
                className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 p-4 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
          {/* Versions */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span>📁</span> Versions du planning
            </h3>
            <div className="space-y-2">
              {versions.map(version => (
                <div 
                  key={version.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    versionActive === version.id 
                      ? 'bg-blue-50 border-2 border-blue-500' 
                      : 'bg-slate-50 border-2 border-transparent hover:border-slate-300'
                  }`}
                  onClick={() => setVersionActive(version.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-slate-800">{version.nom}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(version.date).toLocaleDateString('fr-FR', { 
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </div>
                      {version.creePar && (
                        <div className="text-xs text-slate-400 mt-0.5">par {version.creePar}</div>
                      )}
                      {version.notes && (
                        <div className="text-xs text-slate-600 mt-1 italic">{version.notes}</div>
                      )}
                    </div>
                    {versions.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); supprimerVersion(version.id); }}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparaison */}
          {versions.length > 1 && (
            <div className="mb-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={modeComparaison}
                  onChange={(e) => {
                    setModeComparaison(e.target.checked);
                    if (!e.target.checked) setVersionComparee(null);
                  }}
                  className="rounded"
                />
                <span className="font-medium text-amber-800">Mode comparaison</span>
              </label>
              {modeComparaison && (
                <select
                  value={versionComparee || ''}
                  onChange={(e) => setVersionComparee(parseInt(e.target.value) || null)}
                  className="mt-2 w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Sélectionner une version...</option>
                  {versions.filter(v => v.id !== versionActive).map(v => (
                    <option key={v.id} value={v.id}>{v.nom}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Filtres par phase */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span>🎯</span> Filtrer par phase
            </h3>
            <div className="space-y-1">
              {Object.entries(PHASES).map(([key, phase]) => (
                <label 
                  key={key}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={phasesFiltrees.includes(key)}
                    onChange={() => togglePhase(key)}
                    className="rounded"
                  />
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: phase.couleur }}
                  />
                  <span className="text-sm text-slate-700">{phase.nom}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setPhasesFiltrees(Object.keys(PHASES))}
                className="text-xs text-blue-600 hover:underline"
              >
                Tout afficher
              </button>
              <button
                onClick={() => setPhasesFiltrees([])}
                className="text-xs text-slate-500 hover:underline"
              >
                Tout masquer
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span>⚙️</span> Options
            </h3>
            <label className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={afficherJalons}
                onChange={(e) => setAfficherJalons(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-700">Afficher les jalons</span>
            </label>
            <div className="mt-3">
              <label className="text-sm text-slate-600 block mb-1">Zoom: {Math.round(zoom * 100)}%</label>
              <input
                type="range"
                min="0.3"
                max="1.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-slate-100 rounded-lg p-4">
            <h3 className="font-semibold text-slate-700 mb-3">📊 Résumé</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Début:</span>
                <span className="font-medium">{formatDate(dateMinProjet)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Fin:</span>
                <span className="font-medium">{formatDate(dateMaxProjet)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Durée totale:</span>
                <span className="font-medium">{dureeProjet} jours ({Math.round(dureeProjet/30)} mois)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Nb lots:</span>
                <span className="font-medium">{lots.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Jalons:</span>
                <span className="font-medium">{lots.filter(l => l.jalon).length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 p-4 overflow-auto" style={{ height: 'calc(100vh - 80px)' }}>
          {/* Jalons */}
          {afficherJalons && jalons.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span>🚩</span> Jalons clés
              </h3>
              <div className="flex flex-wrap gap-2">
                {jalons.map(jalon => {
                  const dates = calculerDates[jalon.id];
                  if (!dates) return null;
                  return (
                    <div 
                      key={jalon.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                      style={{ 
                        backgroundColor: PHASES[jalon.phase]?.couleur + '20',
                        color: PHASES[jalon.phase]?.couleur
                      }}
                    >
                      <span className="font-medium">{jalon.nom}</span>
                      <span className="text-xs opacity-75">({formatDateCourte(dates.dateDebut)})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Diagramme de Gantt */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="overflow-x-auto">
              <div style={{ minWidth: `${1200 * zoom}px` }}>
                {/* En-tête années */}
                <div className="relative h-6 border-b border-slate-200">
                  {genererAnnees.map((annee, idx) => (
                    <div
                      key={idx}
                      className="absolute top-0 h-full flex items-center justify-center text-xs font-bold text-slate-700 bg-slate-100"
                      style={{
                        left: `calc(200px + ${annee.position}% * (100% - 200px) / 100)`,
                        width: `calc(${annee.largeur}% * (100% - 200px) / 100)`,
                      }}
                    >
                      {annee.annee}
                    </div>
                  ))}
                </div>

                {/* En-tête mois */}
                <div className="relative h-8 border-b border-slate-300 ml-[200px]">
                  {genererMois.map((mois, idx) => (
                    <div
                      key={idx}
                      className="absolute top-0 h-full flex items-center justify-center text-xs text-slate-600 border-l border-slate-200"
                      style={{
                        left: `${mois.position}%`,
                        width: `${mois.largeur}%`,
                      }}
                    >
                      {mois.nom}
                    </div>
                  ))}
                </div>

                {/* Lots */}
                <div className="space-y-0.5 mt-2">
                  {Object.entries(PHASES).map(([phaseKey, phase]) => {
                    if (!phasesFiltrees.includes(phaseKey)) return null;
                    const lotsPhase = lotsFiltres.filter(l => l.phase === phaseKey);
                    if (lotsPhase.length === 0) return null;

                    return (
                      <div key={phaseKey}>
                        {/* En-tête de phase */}
                        <div 
                          className="flex items-center h-7 text-white text-sm font-semibold px-3 rounded-t mt-2"
                          style={{ backgroundColor: phase.couleur }}
                        >
                          {phase.nom}
                        </div>

                        {/* Lots de la phase */}
                        {lotsPhase.map(lot => {
                          const dates = calculerDates[lot.id];
                          if (!dates) return null;
                          
                          const { position, largeur } = getPositionEtLargeur(dates, dateMinProjet, dureeProjet);
                          const estCritique = calculerCheminCritique.has(lot.id);
                          
                          let datesComp = null;
                          let positionComp = null;
                          let largeurComp = null;
                          if (modeComparaison && versionComparee && calculerDatesComparaison[lot.id]) {
                            datesComp = calculerDatesComparaison[lot.id];
                            const compPosLarg = getPositionEtLargeur(datesComp, dateMinProjet, dureeProjet);
                            positionComp = compPosLarg.position;
                            largeurComp = compPosLarg.largeur;
                          }

                          const ecart = datesComp 
                            ? Math.round((dates.dateFin - datesComp.dateFin) / (1000 * 60 * 60 * 24))
                            : 0;

                          return (
                            <div 
                              key={lot.id} 
                              className={`flex items-center h-9 hover:bg-slate-50 cursor-pointer transition-colors ${
                                lotSelectionne === lot.id ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => setLotSelectionne(lotSelectionne === lot.id ? null : lot.id)}
                            >
                              <div className="w-[200px] flex-shrink-0 px-3 text-sm text-slate-700 truncate flex items-center gap-2">
                                {lot.jalon && <span className="text-amber-500">◆</span>}
                                {estCritique && <span className="w-2 h-2 rounded-full bg-red-500" title="Chemin critique" />}
                                <span className={lot.jalon ? 'font-medium' : ''}>{lot.nom}</span>
                              </div>
                              <div className="flex-1 relative h-full">
                                {/* Barre de comparaison */}
                                {datesComp && (
                                  <div
                                    className="absolute top-1 h-3 rounded opacity-40 border-2 border-dashed"
                                    style={{
                                      left: `${positionComp}%`,
                                      width: `${Math.max(largeurComp, 0.5)}%`,
                                      backgroundColor: phase.couleur,
                                      borderColor: phase.couleur,
                                    }}
                                  />
                                )}
                                
                                {/* Barre principale */}
                                <div
                                  className={`absolute h-6 rounded shadow-sm flex items-center justify-center text-white text-xs font-medium transition-all hover:scale-y-110 ${
                                    lot.jalon ? 'top-1.5' : 'top-1.5'
                                  } ${estCritique ? 'ring-2 ring-red-400 ring-offset-1' : ''}`}
                                  style={{
                                    left: `${position}%`,
                                    width: lot.jalon ? '8px' : `${Math.max(largeur, 0.5)}%`,
                                    backgroundColor: phase.couleur,
                                    borderRadius: lot.jalon ? '2px' : '4px',
                                    transform: lot.jalon ? 'rotate(45deg)' : 'none',
                                  }}
                                  title={`${lot.nom}\n${formatDate(dates.dateDebut)} → ${formatDate(dates.dateFin)}\nDurée: ${lot.duree} jours`}
                                >
                                  {!lot.jalon && largeur > 4 && `${lot.duree}j`}
                                </div>

                                {/* Indicateur d'écart */}
                                {ecart !== 0 && (
                                  <div
                                    className={`absolute top-0 text-xs font-bold ${ecart > 0 ? 'text-red-500' : 'text-green-500'}`}
                                    style={{ left: `${position + largeur + 0.5}%` }}
                                  >
                                    {ecart > 0 ? `+${ecart}j` : `${ecart}j`}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Panneau d'édition du lot sélectionné */}
          {lotSelectionne && (
            <div className="fixed bottom-0 left-80 right-0 bg-white border-t border-slate-200 shadow-lg p-4 z-10">
              {(() => {
                const lot = lots.find(l => l.id === lotSelectionne);
                if (!lot) return null;
                const dates = calculerDates[lot.id];

                return (
                  <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{lot.nom}</h3>
                        <p className="text-sm text-slate-500">
                          {dates && `${formatDate(dates.dateDebut)} → ${formatDate(dates.dateFin)}`}
                        </p>
                      </div>
                      <button
                        onClick={() => setLotSelectionne(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">Nom du lot</label>
                        <input
                          type="text"
                          value={lot.nom}
                          onChange={(e) => mettreAJourLot(lot.id, 'nom', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">Durée (jours)</label>
                        <input
                          type="number"
                          min="1"
                          value={lot.duree}
                          onChange={(e) => mettreAJourLot(lot.id, 'duree', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">Type de début</label>
                        <select
                          value={lot.typeDebut}
                          onChange={(e) => mettreAJourLot(lot.id, 'typeDebut', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="fixe">Date fixe</option>
                          <option value="dependance">Après autre(s) lot(s)</option>
                        </select>
                      </div>
                      
                      {lot.typeDebut === 'fixe' ? (
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Date de début</label>
                          <input
                            type="date"
                            value={lot.dateDebut}
                            onChange={(e) => mettreAJourLot(lot.id, 'dateDebut', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ) : (
                        <>
                          <div>
                            <label className="text-xs text-slate-500 block mb-1">Décalage (jours)</label>
                            <input
                              type="number"
                              min="0"
                              value={lot.decalage || 0}
                              onChange={(e) => mettreAJourLot(lot.id, 'decalage', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </>
                      )}
                      
                      <div className="col-span-2">
                        <label className="text-xs text-slate-500 block mb-1">
                          Dépendances (après fin de...)
                        </label>
                        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-2 border rounded-lg bg-slate-50">
                          {lots.filter(l => l.id !== lot.id).map(l => (
                            <label 
                              key={l.id}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
                                lot.dependances?.includes(l.id) 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-white hover:bg-slate-100'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={lot.dependances?.includes(l.id) || false}
                                onChange={(e) => {
                                  const newDeps = e.target.checked
                                    ? [...(lot.dependances || []), l.id]
                                    : (lot.dependances || []).filter(d => d !== l.id);
                                  mettreAJourLot(lot.id, 'dependances', newDeps);
                                  if (newDeps.length > 0 && lot.typeDebut === 'fixe') {
                                    mettreAJourLot(lot.id, 'typeDebut', 'dependance');
                                  }
                                }}
                                className="sr-only"
                              />
                              {l.nom}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lot.jalon}
                            onChange={(e) => mettreAJourLot(lot.id, 'jalon', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-slate-700">Jalon clé</span>
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Modal nouvelle version */}
      {showNewVersionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              ➕ Créer une nouvelle version
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Une copie du planning actuel sera créée. Vous pourrez la modifier indépendamment.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600 block mb-1">Nom de la version</label>
                <input
                  type="text"
                  value={nomNouvelleVersion}
                  onChange={(e) => setNomNouvelleVersion(e.target.value)}
                  placeholder={`Version ${versions.length + 1}`}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">Notes (optionnel)</label>
                <textarea
                  value={notesNouvelleVersion}
                  onChange={(e) => setNotesNouvelleVersion(e.target.value)}
                  placeholder="Ex: Ajustement suite réunion MOA..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewVersionModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={creerNouvelleVersion}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                Créer la version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPOSANT RACINE AVEC GESTION AUTH
// ============================================
export default function App() {
  const [utilisateur, setUtilisateur] = useState(() => {
    // Vérifier si une session existe
    const session = localStorage.getItem('session_calendrier');
    if (session) {
      try {
        const data = JSON.parse(session);
        const user = UTILISATEURS_AUTORISES.find(u => u.email === data.email);
        if (user) return user;
      } catch (e) {
        console.error('Session invalide');
      }
    }
    return null;
  });

  const handleDeconnexion = () => {
    localStorage.removeItem('session_calendrier');
    setUtilisateur(null);
  };

  if (!utilisateur) {
    return <PageConnexion onConnexion={setUtilisateur} />;
  }

  return <CalendrierApp utilisateur={utilisateur} onDeconnexion={handleDeconnexion} />;
}
