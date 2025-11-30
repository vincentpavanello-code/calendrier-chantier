# 🏗️ Calendrier Chantier - Promotion Immobilière

Outil de suivi de calendrier d'opération de promotion immobilière avec authentification.

---

## 🚀 Déploiement sur GitHub (5 étapes)

### Étape 1 : Créer un compte GitHub (si pas déjà fait)
1. Va sur [github.com](https://github.com)
2. Clique **"Sign up"**
3. Suis les instructions pour créer ton compte

---

### Étape 2 : Créer un nouveau repository
1. Connecte-toi sur GitHub
2. Clique sur le **"+"** en haut à droite → **"New repository"**
3. Remplis :
   - **Repository name** : `calendrier-chantier`
   - Laisse **"Public"** coché
   - ⚠️ **Ne coche RIEN d'autre** (pas de README, pas de .gitignore)
4. Clique **"Create repository"**

---

### Étape 3 : Uploader les fichiers
1. **Dézippe** le fichier téléchargé sur ton ordinateur
2. Sur la page GitHub de ton nouveau repo, clique sur **"uploading an existing file"**
3. **Glisse-dépose TOUT le contenu** du dossier dézippé :
   - Le dossier `.github`
   - Le dossier `public`
   - Le dossier `src`
   - Tous les fichiers à la racine (`index.html`, `package.json`, etc.)
4. En bas, clique **"Commit changes"**

---

### Étape 4 : Activer GitHub Pages
1. Dans ton repository, clique sur **"Settings"** (onglet en haut)
2. Dans le menu de gauche, clique sur **"Pages"**
3. Dans **"Source"**, sélectionne **"GitHub Actions"**
4. C'est tout ! Le déploiement démarre automatiquement

---

### Étape 5 : Attendre et accéder au site
1. Clique sur l'onglet **"Actions"** de ton repository
2. Tu verras un workflow en cours (point orange) ou terminé (coche verte ✅)
3. Attends que ce soit vert (2-3 minutes)
4. Retourne dans **"Settings"** → **"Pages"**
5. 🎉 **Ton URL est affichée !** Elle ressemble à :
   ```
   https://ton-username.github.io/calendrier-chantier/
   ```

---

## 🔐 Comptes utilisateurs configurés

| Email | Mot de passe |
|-------|--------------|
| `vincent.pavanello@gmail.com` | `123456` |
| `vincent.pavanello@realestech.eu` | `654321` |

---

## ➕ Ajouter un nouvel utilisateur

1. Sur GitHub, ouvre le fichier `src/App.jsx`
2. Clique sur le crayon ✏️ (Edit)
3. Trouve ces lignes (vers le début) :
   ```javascript
   const UTILISATEURS_AUTORISES = [
     { email: 'vincent.pavanello@gmail.com', motDePasse: '123456', nom: 'Vincent P. (Gmail)' },
     { email: 'vincent.pavanello@realestech.eu', motDePasse: '654321', nom: 'Vincent P. (Realestech)' },
   ];
   ```
4. Ajoute une nouvelle ligne :
   ```javascript
   const UTILISATEURS_AUTORISES = [
     { email: 'vincent.pavanello@gmail.com', motDePasse: '123456', nom: 'Vincent P. (Gmail)' },
     { email: 'vincent.pavanello@realestech.eu', motDePasse: '654321', nom: 'Vincent P. (Realestech)' },
     { email: 'nouveau@email.com', motDePasse: 'sonmotdepasse', nom: 'Nouveau Utilisateur' },
   ];
   ```
5. Clique **"Commit changes"**
6. Le site se redéploie automatiquement (2-3 min)

---

## ⚠️ Si tu changes le nom du repository

Si tu nommes ton repository autrement que `calendrier-chantier`, tu dois modifier le fichier `vite.config.js` :

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/nom-de-ton-repo/',  // ← Mettre le nom exact de ton repo
})
```

---

## 📋 Fonctionnalités

- ✅ 52 lots répartis en 9 phases (de la faisabilité à la GPA)
- ✅ Gestion des dépendances multiples entre lots
- ✅ Système de versions du planning
- ✅ Mode comparaison entre versions
- ✅ Chemin critique automatique
- ✅ Jalons clés visuels
- ✅ Filtrage par phase
- ✅ Sauvegarde locale automatique

---

## 🔄 Mettre à jour le site

Pour modifier le site après déploiement :
1. Modifie les fichiers directement sur GitHub (crayon ✏️)
2. Ou re-uploade des fichiers modifiés
3. Chaque **"Commit"** redéploie automatiquement le site

---

## ❓ Problèmes courants

**Le site affiche une page blanche ?**
→ Vérifie que le nom dans `vite.config.js` correspond exactement au nom de ton repository

**Le workflow échoue (croix rouge ❌) ?**
→ Clique dessus pour voir l'erreur. Souvent c'est un fichier manquant.

**Je ne trouve pas l'URL du site ?**
→ Va dans Settings → Pages. L'URL s'affiche en haut une fois le déploiement terminé.

---

## 📞 Besoin d'aide ?

N'hésite pas à demander !
