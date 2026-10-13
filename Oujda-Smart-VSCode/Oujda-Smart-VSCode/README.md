# Oujda Smart — Airport Assistant

Prototype académique fonctionnel consacré à la communication digitale et à l’expérience passager à l’Aéroport Oujda-Angads. Projet préparé pour un mémoire de Master en Communication et Transformation Numérique.

**Prototype académique réalisé dans le cadre d’un mémoire de Master – Non affilié officiellement à l’ONDA.**

Le tableau /flights, les réclamations initiales et les statistiques de départ utilisent des données fictives. Le module /tracking utilise par défaut OpenSky pour les positions réelles d’avions autour d’Oujda, avec une actualisation toutes les cinq minutes. FR24 et ADSB.lol restent des sources optionnelles. Les services affichent des emplacements et horaires à confirmer. La nouvelle interface présente une photographie réelle du terminal Oujda-Angads, prise en 2024 par Jakub Pietrasiak (Wikimedia Commons, CC BY-SA 4.0).

Le nouveau **tableau aéroport** est accessible sur `/flights` : arrivées, départs, horaires locaux, détails dépliables et accès à la carte. Les données du tableau restent fictives et sont explicitement indiquées. Guide : [docs/AIRPORT-BOARD.md](docs/AIRPORT-BOARD.md).

## 1. Lancement rapide

Prérequis : Node.js 22 ou 24, npm et deux terminaux. Les commandes partent du dossier `oujda-airport` contenant `frontend/` et `backend/`.

Terminal backend :

```sh
cd backend
npm install
npm run dev
```

Terminal frontend :

```sh
cd frontend
npm install
npm run dev
```

Ouvrir **http://localhost:3102**. L’API écoute sur **http://localhost:4102/api**. Le proxy Vite transmet `/api` au backend et conserve les cookies d’authentification.

Au premier démarrage local, le backend crée automatiquement :

- `.env` avec un secret JWT et des mots de passe aléatoires ;
- `.data/`, la base PostgreSQL embarquée persistante via PGlite ;
- le schéma SQL et les données de démonstration ;
- `.local-accounts.txt`, les identifiants de test de cette installation.

Ne lancer qu’une instance du backend sur la même base PGlite. Les données restent après arrêt/redémarrage. `Ctrl+C` arrête chaque serveur. Ne pas supprimer `.data/` pour une simple relance.

Le dépôt contient aussi des verrous pnpm. Si vous utilisez pnpm : `pnpm install --ignore-workspace`, puis `pnpm dev`, dans chaque dossier. Pour esbuild, le frontend déclare l’autorisation de compilation dans `pnpm-workspace.yaml`. Les scripts restent compatibles avec `npm install` et `npm run dev`.

## 2. Comptes de test

| Profil | Adresse | Mot de passe |
|---|---|---|
| Administrateur | `admin@oujda-demo.test` | Consulter `backend/.local-accounts.txt` après le premier lancement |
| Passager | `passager@oujda-demo.test` | Consulter le même fichier |

Les mots de passe ne sont pas codés en dur et ne sont pas inclus dans l’archive source. La page Inscription permet de créer d’autres passagers. Elle ne permet jamais de créer un administrateur.

Les réclamations fictives initiales appartiennent au passager de démonstration. Leur code privé n’est pas récupérable : connectez-vous avec ce compte pour les consulter. Les nouvelles demandes affichent leur propre référence et code privé immédiatement après envoi.

## 3. Technologies et architecture

- Frontend : React 19, Vite 6, React Router 6, Axios, Tailwind CSS 3, Lucide.
- Backend : Node.js, Express 4, Zod, Helmet, limitation des requêtes.
- Données : SQL PostgreSQL. Deux adaptateurs : PGlite local et serveur PostgreSQL via `pg`.
- Authentification : bcrypt, JWT HS256 en cookie HttpOnly, sessions révocables côté base.
- Langues : français, anglais, arabe. Attributs `lang` et `dir`, CSS RTL et contenus métier traduits.
- IA : recherche locale par mots-clés, données de vols fictifs, puis fournisseur LLM configurable en cas d’absence de réponse.

Le mode local exécute le moteur PostgreSQL embarqué de PGlite. Il permet une soutenance sans serveur PostgreSQL installé. Le mode serveur PostgreSQL utilise le même schéma, mais nécessite sa propre configuration et des tests d’exploitation. Aucune base SQLite n’est utilisée dans ce projet.

```mermaid
flowchart LR
  P[Passager / administrateur] --> WEB[React + Router + Tailwind]
  WEB -->|Axios /api + cookie HttpOnly| API[Express / validation / rôles]
  API --> DB[(PostgreSQL ou PGlite local)]
  API --> CHAT[Service assistant]
  CHAT --> KB[Base de connaissances locale]
  CHAT --> DEMO[Table des vols fictifs]
  CHAT -->|Seulement si aucune réponse locale| LLM[Fournisseur LLM configurable]
  API --> ANALYSE[Comptages et analyse par mots-clés]
```

Le diagramme détaillé et le schéma relationnel figurent dans `docs/ARCHITECTURE.md`.

## 4. Arborescence et fichiers

```text
oujda-airport/
  frontend/
    public/                 Illustration locale, favicon
    src/
      components/UI.jsx     Composants partagés, tableau des vols, modales
      contexts/             Authentification, langue, traductions
      hooks/useData.js      Chargement des données, erreurs et rechargement
      layouts/              Navigation publique et administration
      pages/Home.jsx        Accueil international, recherche, checklist voyage
      pages/Travel.jsx      Flights, FlightDetails, Services, FAQ
      pages/Tracking.jsx    Suivi régional OpenSky et fournisseurs optionnels
      components/AirportBoard.jsx Tableau aéroport, dates et détails dépliables
      components/FlightViews.jsx Navigation tableau / carte
      components/TrackingMap.jsx Carte Leaflet et sélection d’un appareil
      pages/Passenger.jsx   Assistant, Complaint, Login, Register, UserDashboard
      pages/Admin.jsx       Dashboard, gestion métier, analyses, conversations
      services/api.js       Client Axios
      main.jsx              Routes et protection des écrans
      styles.css            Styles des composants et écrans métier
      international.css     Identité internationale, mobile et RTL
    vite.config.js          Port et proxy /api
    tailwind.config.js
  backend/
    src/
      config/env.js         Configuration et secrets locaux
      config/db.js          Adaptateurs PostgreSQL / PGlite, transactions
      controllers/          API passager et administrateur
      middleware/auth.js    JWT, cookie, contrôles utilisateur / admin
      models/validation.js  Schémas Zod
      routes/index.js       Routes REST et limites de requêtes
      services/assistant.js Réponses locales puis adaptateur LLM
      services/tracking.js  Connecteur FR24, cache et gestion des pannes
      services/seed.js      Initialisation des données fictives traduites
      utils/helpers.js      UUID, erreurs, normalisation, sentiment indicatif
      app.js                Express, CORS, sécurité, erreurs
      server.js             Démarrage et arrêt de l’API
    sql/schema.sql          Schéma PostgreSQL complet
    sql/seed.sql            Données d’exemple SQL générées
    scripts/init.js         Initialisation explicite
    tests/                  Tests d’intégration isolés
    .env.example            Variables disponibles, aucune clé privée
  docs/                     Architecture, API, soutenance, limites et validation
```

Le code complet se trouve directement dans ces fichiers. `docs/CODE-SOURCE.md` regroupe également les sources textuelles avec leur chemin pour lecture ou copie dans VS Code. Ne pas copier ce document par-dessus le projet : ouvrir les fichiers source pour développer.

## 5. PostgreSQL externe

Créer un utilisateur et une base avec un compte administrateur PostgreSQL :

```sh
psql -U postgres
```

```sql
CREATE USER airport WITH PASSWORD 'REMPLACER_PAR_UN_MOT_DE_PASSE_LOCAL';
CREATE DATABASE oujda_airport OWNER airport;
\q
```

Dans `backend/.env`, conserver le secret JWT généré et configurer :

```dotenv
DB_MODE=postgres
DATABASE_URL=postgresql://airport:MOT_DE_PASSE_ENCODE_URL@localhost:5432/oujda_airport
APP_ORIGIN=http://localhost:3102
PORT=4102
SEED_DEMO=true
```

Puis, après avoir arrêté le serveur :

```sh
cd backend
npm run db:init
npm run dev
```

`db:init` applique `sql/schema.sql` et utilise `services/seed.js` pour créer les données et des comptes correspondant aux mots de passe de `.env`. Il ne supprime pas les données existantes. Les valeurs `ADMIN_PASSWORD` et `DEMO_PASSWORD` sont nécessaires au premier peuplement. Modifier ces variables plus tard ne change pas un compte existant.

Application manuelle du schéma, si souhaitée :

```sh
psql -U airport -d oujda_airport -h localhost -f sql/schema.sql
```

`sql/seed.sql` montre les données complètes de l’installation source, avec des mots de passe hashés. Pour obtenir des comptes utilisables sur une nouvelle installation, privilégier `npm run db:init` au lieu d’importer ce fichier. Ne pas importer le seed SQL dans une base déjà peuplée.

Sauvegarde d’un serveur PostgreSQL :

```sh
pg_dump -U airport -h localhost -Fc oujda_airport > oujda_airport.dump
```

Pour le mode PGlite, arrêter le backend avant de copier intégralement `backend/.data/`.

## 6. Configuration de l’assistant IA

L’application fonctionne sans clé API. Le traitement suit cet ordre :

1. Si le message contient un numéro de vol, recherche dans les vols fictifs.
2. Recherche lexicale multilingue dans `knowledge_base`.
3. Si aucune réponse locale ne correspond, appel facultatif au fournisseur LLM.
4. En cas d’absence de configuration ou d’échec du fournisseur, réponse locale expliquant la limite.

Variables serveur, dans `backend/.env` uniquement :

```dotenv
AI_ENDPOINT=https://FOURNISSEUR/ENDPOINT_COMPLET
AI_API_KEY=VOTRE_CLE
AI_MODEL=MODELE_DISPONIBLE_DANS_VOTRE_COMPTE
```

Le contrat de l’adaptateur est celui d’une requête JSON contenant `model`, `messages`, `temperature` et `max_tokens`, avec réponse textuelle dans `choices[0].message.content`. Renseigner l’URL complète d’un fournisseur compatible, puis redémarrer le backend. Pour un autre format, remplacer le bloc de transport dans `src/services/assistant.js` en conservant le résultat `{ text, source, topic }`.

Les clés ne sont jamais envoyées au navigateur. L’appel utilise HTTPS, sauf un fournisseur de test sur localhost. Le délai maximal est de 20 secondes. Les réponses sont étiquetées par origine. Les conversations sont enregistrées localement. Un appel externe transmet la question et la base de connaissances pertinente au fournisseur : rester sur des données fictives lors de la soutenance.

La recherche locale n’est pas une recherche vectorielle et ne comprend pas toutes les formulations. Les réponses LLM peuvent être erronées. L’assistant ne réserve aucun vol, ne dépose aucune demande auprès de l’ONDA et ne connaît aucun statut réel.

## 7. Parcours et routes

| Écran | URL |
|---|---|
| Accueil | `/` |
| Départs et arrivées | `/flights` |
| Positions aériennes — OpenSky par défaut | `/tracking` |
| Détail d’un vol | `/flights/:id` |
| Services | `/services` |
| FAQ | `/faq` |
| Assistant | `/assistant` |
| Réclamation et suivi privé | `/complaints` |
| Connexion / inscription | `/login`, `/register` |
| Espace passager | `/account` |
| Tableau de bord administrateur | `/admin` |
| Administration des vols | `/admin/flights` |
| Services, FAQ et connaissances | `/admin/services`, `/admin/faq`, `/admin/knowledge` |
| Réclamations | `/admin/complaints` |
| Conversations | `/admin/conversations` |
| Analyses | `/admin/analytics` |

Les routes inconnues affichent une page 404. Les contrôles des rôles existent dans le frontend **et** dans le backend. Le serveur reste l’autorité.

Les FAQ et connaissances sont deux ensembles éditoriaux distincts : modifier une FAQ ne modifie pas automatiquement une réponse du chatbot. Pour changer sa réponse, ouvrir Administration → Connaissances et modifier les contenus FR, EN, AR ainsi que les mots-clés.

## 8. Sécurité mise en œuvre

- Hash bcrypt avec coût 12, mots de passe de 12 caractères minimum à l’inscription.
- JWT en cookie HttpOnly et SameSite=Lax, Secure lorsque `APP_ORIGIN` utilise HTTPS.
- Session en base : la déconnexion révoque le JWT déjà émis.
- Rôle relu depuis la base, aucune élévation de rôle depuis le formulaire public.
- Requêtes SQL paramétrées, validations Zod, ressources administratives sur liste autorisée.
- Limites de requêtes sur authentification, chat, suivi et soumission des réclamations.
- Vérification Origin et Content-Type pour les mutations, CORS limité au frontend.
- Contrôle de propriété des favoris, conversations et réclamations.
- Code de suivi privé hashé pour les demandes sans compte.
- Journalisation des modifications administratives sans enregistrer les mots de passe.
- Affichage React textuel : les messages ne sont pas injectés comme HTML.

Ce prototype n’est pas certifié ni audité pour une exploitation aéroportuaire. Il ne dispose pas encore de MFA, réinitialisation de mot de passe, politique automatique d’effacement ni journal de sécurité distribué.

## 9. Tests et construction

Backend :

```sh
cd backend
npm test
```

Les tests créent une base PGlite temporaire isolée et vérifient les parcours, les rôles, la confidentialité, la protection Origin, l’ordre des conversations, les CRUD et la révocation de session. Ils ne changent pas les comptes de démonstration locaux.

Frontend :

```sh
cd frontend
npm run build
npm run preview
```

Le frontend compilé est dans `frontend/dist/`. Le serveur d’aperçu utilise également le port 3102 : arrêter `npm run dev` avant de lancer l’aperçu. Le backend doit rester actif. L’aperçu sert à la vérification locale.

Pour héberger le prototype ultérieurement : servir `dist/` avec repli des URLs vers `index.html`, relayer `/api` vers Express, utiliser HTTPS, définir `APP_ORIGIN`, conserver un secret JWT stable, configurer PostgreSQL et des sauvegardes, puis tester les accès et cookies derrière le proxy. Aucun déploiement public n’est effectué dans cette livraison.

## 10. Fonctions réalisées et évolutions

Réalisées : accueil responsive, vols fictifs recherchables et filtrables, favoris, détails de vol, dix services, FAQ multilingue, chat local avec historique et adaptateur LLM, demandes avec suivi privé, comptes, administration des vols/services/FAQ/connaissances, traitement des réclamations, consultation des conversations et graphiques d’analyse.

L’analyse du sentiment et les recommandations utilisent des règles lexicales transparentes. Elles ne doivent pas être présentées comme les résultats d’un modèle IA entraîné ni comme des conclusions scientifiques validées. Les données initiales incluent 12 vols, 10 FAQ, 10 services, 10 connaissances, 5 réclamations et 14 événements analytiques fictifs.

Évolutions : activation et validation du connecteur FR24 avec un compte autorisé, fournisseur distinct pour les horaires programmés, validation de la connaissance par l’aéroport, fournisseur LLM testé, recherche sémantique, gestion éditoriale avancée, notifications email/SMS, accessibilité auditée et protocole d’évaluation auprès des passagers.

Voir `docs/LIMITES.md`, `docs/VALIDATION.md` et `docs/SOUTENANCE.md`.

## 11. Captures et soutenance

Les captures de démonstration disponibles dans `docs/captures/` présentent l’accueil desktop/mobile, l’assistant et le dashboard administrateur. Elles utilisent uniquement les données fictives.

Scénario court : consulter les départs, rechercher AT700, interroger l’assistant sur les bagages, passer en arabe, déposer une réclamation, se connecter comme administrateur, traiter la demande, puis expliquer les graphiques et les limites.

Crédit visuel actuel : [Jakub Pietrasiak — Aéroport Oujda-Angads, 2024](https://commons.wikimedia.org/wiki/File:Aeroport_Oujda_Angads_2024.jpg), sous [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Les détails sont conservés dans frontend/public/IMAGE-CREDITS.md. L’ancienne illustration de Zurich par Jairph / Unsplash reste archivée dans les fichiers mais n’est plus utilisée par l’interface.

## Dépannage

- **`npm` non reconnu** : installer Node.js avec npm et rouvrir le terminal.
- **Port occupé** : arrêter l’ancienne instance du projet avant de relancer. Ne pas ouvrir deux backends PGlite sur `.data/`.
- **Impossible de contacter l’API** : vérifier le backend sur 4102 et le proxy Vite, puis utiliser `http://localhost:3102`.
- **JWT_SECRET invalide** : renseigner un secret aléatoire d’au moins 32 caractères dans `.env`. Exemple de génération : `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
- **Identifiants refusés** : consulter le fichier `.local-accounts.txt` de cette installation. Les mots de passe d’une autre copie ne conviennent pas.
- **Données anciennes** : les vols fictifs gardent la date d’initialisation. Modifier leurs horaires dans l’administration pour une nouvelle soutenance.
- **Traductions manquantes lors d’un enregistrement** : compléter les trois onglets FR, EN et AR du formulaire administrateur.


## 13. Interface internationale — 1er octobre 2026

Identité visuelle pétrole, ivoire et sauge, parcours mobile avec navigation inférieure et cartes de vols lisibles sans défilement horizontal. Le frontend, l’authentification et les espaces métier conservent leurs API existantes.

- La recherche d’accueil ouvre les résultats avec le numéro de vol, la ville ou la compagnie et le sens de trajet choisis.
- Les filtres de vols se conservent dans le lien pour le partage et le rechargement.
- Une checklist personnelle est enregistrée sur le navigateur et peut être réinitialisée. Elle ne constitue pas une liste exhaustive de formalités.
- Les suggestions de l’accueil préremplissent un message modifiable dans l’assistant. L’utilisateur choisit ensuite de l’envoyer.
- La langue suit les préférences FR/EN/AR du navigateur, sauf choix explicite. Le choix est synchronisé entre les onglets du même navigateur. L’arabe utilise RTL.
- Les titres, descriptions et métadonnées Open Graph sont localisés côté client. Pour des aperçus sociaux et un référencement complets en production, prévoir un rendu serveur ou un pré-rendu.
- Liens d’évitement, focus de navigation et menu utilisable au clavier. Cela ne remplace pas un audit complet d’accessibilité.

Le tableau de vols reste une démonstration. Cette refonte ne connecte aucun système aéroportuaire réel, ne configure aucun fournisseur LLM externe et ne déploie pas la plateforme en production.


## 14. Suivi Flightradar24 — 4 octobre 2026

La page http://localhost:3102/tracking est accessible depuis l’accueil et les menus. Elle présente une carte Leaflet, une liste filtrable, des détails d’appareil, les heures de mesure et de récupération, ainsi que les commandes de pause et d’actualisation. La carte est chargée à la demande pour préserver le chargement initial.

Le connecteur officiel est implémenté côté serveur. Aucun scraping n’est utilisé. Les réponses sont mises en cache, les appels simultanés sont regroupés et les erreurs sont temporisées. Le tableau fictif existant est conservé séparément.

**Aucun jeton FR24 n’est livré et aucune donnée réelle FR24 n’a été validée.** Pour configurer une clé sandbox, puis une clé de production selon votre abonnement API, suivre [docs/FLIGHTRADAR24.md](docs/FLIGHTRADAR24.md), qui comprend les étapes en arabe. Les variables disponibles sont dans backend/.env.example. La clé est ajoutée uniquement à backend/.env ; redémarrer ensuite le backend.

Fichiers principaux :

- backend/src/services/tracking.js : fournisseur, normalisation, cache, limites et gestion des pannes ;
- backend/src/controllers/tracking.js : endpoint public GET /api/tracking/flights ;
- backend/tests/tracking.test.js : contrôles du contrat et des erreurs sans requêtes externes ;
- frontend/src/pages/Tracking.jsx : page, filtres et actualisation ;
- frontend/src/components/TrackingMap.jsx : carte, sélection et attribution ;
- frontend/src/contexts/trackingCopy.js et frontend/src/tracking.css : textes FR/EN/AR et présentation.


## 15. Suivi gratuit OpenSky — 8 octobre 2026

Ouvrir http://localhost:3102/tracking. Le fournisseur gratuit OpenSky est activé par défaut pour ce prototype académique non commercial, sans clé API ni contact personnel. Le connecteur a reçu des positions réelles lors des vérifications. Les avions sont recherchés dans un rayon de 120 NM (environ 222 km), survols compris ; aucun départ, arrivée, horaire, type d’avion ou immatriculation absent de la source n’est inventé.

Configuration : TRACKING_PROVIDER=opensky et OPENSKY_REFRESH_SECONDS=300. Les requêtes sont regroupées et mises en cache pour respecter le quota anonyme. Le nombre d’appareils varie avec la couverture et le trafic ; une liste vide ne constitue pas un horaire officiel.

Le guide [docs/FLIGHT-TRACKING.md](docs/FLIGHT-TRACKING.md) décrit les réglages, quotas, sources, attribution, usages autorisés et fournisseurs optionnels. ADSB.lol exige désormais un contact technique dans ses requêtes ; il reste désactivé sans contact fourni. Flightradar24 exige toujours une clé serveur adaptée. Les sources ne basculent pas automatiquement.

## 16. Identité Oujda-Angads — 13 octobre 2026

L’accueil, le tableau des vols et le suivi utilisent une bannière commune avec la photographie locale du terminal. Palette bleu nuit, blanc et doré, services sous forme de cartes, navigation et tableau harmonisés. Sur mobile, la photo est placée au-dessus du contenu pour garder la coupole visible.

Fichiers : frontend/src/components/AirportHero.jsx, frontend/src/contexts/airportIdentityCopy.js et frontend/src/airport-identity.css. Les textes sont disponibles en français, anglais et arabe avec RTL. La photo est servie localement, sans requête Wikimedia nécessaire pendant la visite.

La refonte visuelle conserve les fonctionnalités et le mode démonstration des horaires. Elle ne modifie ni la base de données ni les sources du suivi.
