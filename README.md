# EduManage — Gestion des étudiants

Application pédagogique React + Vite permettant de gérer les étudiants d'un établissement de formation.

## Fonctionnalités
- Page d'accueil
- Authentification de démonstration
- Tableau de bord avec statistiques
- Liste des étudiants et recherche
- Détails d'un étudiant
- Ajout, modification et suppression
- Navigation avec React Router
- Sauvegarde locale des données avec `localStorage`

## Installation

Prérequis : Node.js (version 18 ou plus récente) et npm.

```bash
npm install
npm run dev
```

Ouvrez ensuite l'adresse affichée par Vite (généralement http://localhost:5173).

## Connexion de démonstration
L'e-mail et le mot de passe sont préremplis sur la page de connexion :
- E-mail : `admin@edumanage.ma`
- Mot de passe : `admin123`

Pour cette version pédagogique, l'authentification est simulée côté navigateur. N'importe quels champs non vides permettent de se connecter. Les données sont stockées dans le navigateur, pas dans une base de données.

## Générer la version de production

```bash
npm run build
npm run preview
```

Le dossier `dist/` contient le site prêt à être déployé.

## Déploiement sur Internet (Vercel)
1. Créez un compte sur https://vercel.com.
2. Importez le dossier du projet dans un dépôt GitHub, puis connectez ce dépôt à Vercel.
3. Vercel détecte Vite automatiquement. Utilisez `npm run build` comme commande de build et `dist` comme dossier de sortie.
4. Dans les paramètres du projet, ajoutez une règle de réécriture pour les routes React Router si nécessaire : toutes les routes doivent servir `index.html`.
5. Cliquez sur Deploy.

Vous pouvez aussi déployer le dossier `dist` sur Netlify ou un hébergement statique compatible avec les applications SPA.

## Structure

```text
src/
  App.jsx       # Pages, routes et logique CRUD
  data.js       # Données de démonstration
  main.jsx      # Point d'entrée React
  styles.css    # Styles responsive
```

## Remarque
Ceci est une version frontend destinée à un projet scolaire. Pour une application réelle, ajoutez une API backend, une base de données et une authentification sécurisée.
