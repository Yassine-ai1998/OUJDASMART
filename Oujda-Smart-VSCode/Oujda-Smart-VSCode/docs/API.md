# API REST

Base locale : `http://localhost:4102/api`. Utiliser `/api` depuis le frontend avec `withCredentials: true`. Les mutations exigent `Content-Type: application/json` et un en-tête `Origin` correspondant à `APP_ORIGIN`.

| Méthode | Route | Accès / effet |
|---|---|---|
| GET | `/health` | Vérification du processus API |
| POST | `/auth/register` | Public, nom/email/mot de passe ; rôle USER imposé |
| POST | `/auth/login` | Public, crée un JWT HttpOnly et une session |
| GET | `/auth/me` | Utilisateur connecté |
| POST | `/auth/logout` | Révoque la session et efface le cookie |
| GET | `/flights` | Public, paramètres q, direction, airline, city, status, after |
| GET | `/flights/:id` | Public, détail d’un vol fictif |
| GET | `/tracking/flights` | Public, suivi FR24 ; direction facultative all/arrival/departure, cache partagé |
| GET | `/services` | Public, contenu FR/EN/AR |
| POST | `/services/:id/view` | Public, compte une ouverture de fiche |
| GET | `/faq` | Public, paramètres q et category |
| GET | `/favorites` | Favoris du compte courant |
| POST / DELETE | `/favorites/:id` | Ajout / suppression pour ce compte |
| POST | `/complaints` | Public, nom/email/catégorie/sujet/message/priorité ; retourne référence et code |
| POST | `/complaints/track` | Référence + email + code privé |
| GET | `/complaints/mine` | Demandes du compte courant |
| POST | `/chat` | message, language, sessionId facultatif |
| GET | `/chat` | Sessions appartenant au compte ou visiteur courant |
| GET | `/chat/:id` | Historique privé et ordonné |
| GET | `/admin/dashboard` | ADMIN, indicateurs et agrégats |
| GET | `/analytics` | ADMIN, même jeu d’analyses |
| GET / POST | `/admin/flights` | ADMIN, liste / création |
| PUT / DELETE | `/admin/flights/:id` | ADMIN, modification / suppression |
| GET / POST | `/admin/services` | ADMIN, liste / création |
| PUT / DELETE | `/admin/services/:id` | ADMIN, modification / suppression |
| GET / POST | `/admin/faq` | ADMIN, liste / création |
| PUT / DELETE | `/admin/faq/:id` | ADMIN, modification / suppression |
| GET / POST | `/admin/knowledge` | ADMIN, liste / création |
| PUT / DELETE | `/admin/knowledge/:id` | ADMIN, modification / suppression |
| GET | `/admin/complaints` | ADMIN, demandes et coordonnées |
| PUT | `/admin/complaints/:id` | ADMIN, statut et réponse |
| GET | `/admin/conversations` | ADMIN, conversations du prototype |
| GET | `/admin/conversations/:id` | ADMIN, messages d’une conversation |

Exemple de question :

```json
{"message":"Où se trouve le parking ?","language":"fr"}
```

Réponse : texte, `source`, `topic`, `sessionId`. Les sources sont `knowledge_base`, `demo_flight`, `local`, `llm` ou `fallback`.

Exemple de réclamation :

```json
{
  "name":"Voyageur fictif",
  "email":"voyageur@example.test",
  "phone":"",
  "category":"parking",
  "subject":"Signalétique du parking",
  "message":"Je propose de rendre les indications du parking plus visibles.",
  "priority":"NORMAL",
  "flight_number":"AT700"
}
```

Erreurs : 400 validation, 401 connexion requise, 403 rôle ou origine refusée, 404 ressource absente ou privée, 409 doublon, 413 taille maximale, 429 limite de débit, 500 erreur interne. Les requêtes ne renvoient jamais le hash de mot de passe, le secret JWT ni le hash du code privé.

Les listes administratives ont un plafond de 500 éléments, les conversations de 200 et les vols publics de 200. Le prototype n’implémente pas encore de pagination complète.


## Suivi aérien externe

GET /api/tracking/flights retourne une enveloppe avec provider, status (not_configured, live, sandbox, stale, unavailable), mode, reason, airport, fetchedAt, refreshAfterSeconds, limit, truncated et flights. Les données manquantes ne sont pas remplacées par les vols fictifs. Les états du fournisseur sont représentés dans cette réponse HTTP 200 ; les erreurs de paramètre restent HTTP 400 et les limitations locales HTTP 429. Aucune clé ne figure dans la réponse. Voir [FLIGHTRADAR24.md](FLIGHTRADAR24.md) pour le contrat, les unités, les dates et le guide d’activation.


## Fournisseurs de suivi — 8 octobre 2026

La même route GET /api/tracking/flights choisit le fournisseur configuré : OpenSky par défaut, ADSB.lol ou FR24 en option, ou disabled. Les champs provider, scope et radiusNm précisent la source et le périmètre. scope=area signifie positions régionales (survols compris), scope=airport_routes désigne les routes FR24 liées à l’aéroport. Les paramètres direction=arrival et direction=departure sont refusés avec HTTP 400 pour scope=area. OpenSky ne fournit pas d’itinéraires ni d’horaires programmés ; aucun champ absent n’est inventé. Détails : [FLIGHT-TRACKING.md](FLIGHT-TRACKING.md).
