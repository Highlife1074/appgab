# L'Éminence

Simulateur d'entraînement pour cadres et dirigeants : masterclass, épreuve sous pression, évaluation impitoyable sur 10. Seuil de validation : 8/10.

Stack : React + Vite · Tailwind CSS v4 · Firebase (Auth + Firestore) · Zustand · GitHub Pages.

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner la config Firebase
npm run dev
```

`VITE_LLM_PROVIDER=mock` fait tourner un moteur d'évaluation local, sans clé API.
`proxy` appelle `VITE_LLM_PROXY_URL` (`/course`, `/challenge`, `/evaluate`), un backend qui détient la clé Claude/OpenAI.

## Architecture

- `src/services` : seuls fichiers qui parlent à Firebase et au LLM.
- `src/hooks` : `useAuth`, `useProgress`, `useSimulation`, consommés par les vues.
- `src/store` : état global Zustand (session, progression, simulation en cours).
- `firestore.rules` : accès limité au propriétaire, palier qui ne peut monter que d'un cran.

## Déploiement

Le workflow `.github/workflows/deploy.yml` construit et publie sur GitHub Pages à chaque push sur `main`
(Settings → Pages → Source : GitHub Actions ; config Firebase dans les secrets du dépôt).
Ajouter `<user>.github.io` aux domaines autorisés de Firebase Auth.
