# L'Éminence

Simulateur d'entraînement pour cadres et dirigeants : 3 domaines, 10 paliers, 6 modules par palier.
Chaque module : une masterclass détaillée, puis des mises en situation notées par Claude.

Stack : React + Vite · Tailwind CSS v4 · Firebase (Auth, Firestore, Cloud Functions) · Claude (Anthropic) · GitHub Pages.

## Progression

- Un module est validé par 2 épreuves réussies, obtenues sur des jours différents.
- Seuil : 8/10 aux paliers 1 à 5, 9/10 aux paliers 6 à 10. L'évaluateur est calibré sur le niveau du palier.
- L'examen de passage s'ouvre quand les 6 modules sont validés et après une durée minimale sur le palier
  (7 jours au palier 1, jusqu'à 90 jours au palier 9). Un examen raté se retente après 24 h.
- Règles : `functions/curriculum/rules.js`. Programme : `functions/curriculum/*.js`.

## Architecture

- `functions/` : Cloud Functions (`getCourse`, `startChallenge`, `submitResponse`). Elles seules appellent Claude
  et écrivent la progression ; le navigateur ne fait que lire (`firestore.rules`).
- Les cours sont générés une fois par module puis partagés (collection `courses`).
- `functions/curriculum/` est importé aussi par le client : une seule source pour le programme et les règles.
- `src/services` → `src/hooks` (`useAuth`, `useProgress`, `useSimulation`) → vues. État global : Zustand.

## Déploiement

- Site : GitHub Actions publie sur GitHub Pages à chaque push sur `main`.
- Clé Anthropic : console Firestore, document `config/anthropic`, champ `apiKey` (illisible côté navigateur).
- Serveur (Node 22) :

```bash
cd functions && npm install && cd ..
npx firebase-tools login --no-localhost
npx firebase-tools deploy --only functions,firestore
```

## Développement local

```bash
npx firebase-tools emulators:start --only auth,firestore,functions
VITE_USE_EMULATORS=true npm run dev
```
