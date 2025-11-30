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
