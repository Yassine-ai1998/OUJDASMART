# Architecture et schéma relationnel

Les sources sont indépendantes des autres projets du workspace. Le nom public est **Oujda Smart**, sous-titre **Airport Assistant**. Le périmètre reste celui d’un prototype académique sans lien officiel avec l’ONDA.

## Architecture

```mermaid
flowchart TB
  subgraph Client
    UI[Pages passager FR / EN / AR]
    ADMIN[Pages administrateur protégées]
    CTX[Contexte utilisateur et langue]
    HTTP[Axios avec cookies]
    UI --> CTX
    ADMIN --> CTX
    CTX --> HTTP
  end
  subgraph Serveur Express
    M[Helmet / Origin / limite de débit]
    AUTH[JWT et session en base]
    R[Routes REST]
    V[Validation Zod]
    C[Contrôleurs]
    CHAT[Service assistant]
    ANALYZE[Statistiques et règles lexicales]
    M --> AUTH --> R --> V --> C
    C --> CHAT
    C --> ANALYZE
  end
  HTTP --> M
  C --> SQL[(PostgreSQL / PGlite)]
  CHAT --> SQL
  CHAT -->|Absence de réponse locale| API[Adaptateur LLM externe]
```

Les scripts SQL utilisent des clés UUID, des contraintes de statut, des clés étrangères et des index. La couche `config/db.js` fournit `query`, `rows`, `one` et `tx`. Les contrôleurs ne dépendent pas du choix entre PostgreSQL serveur et PostgreSQL embarqué.

## Schéma de la base

```mermaid
erDiagram
  users ||--o{ auth_sessions : possede
  users ||--o{ favorites : enregistre
  flights ||--o{ favorites : concerne
  users o|--o{ complaints : depose
  users o|--o{ chat_sessions : ouvre
  chat_sessions ||--o{ chat_messages : contient
  users o|--o{ audit_log : effectue
  users {
    uuid id PK
    string name
    string email UK
    string password_hash
    string role
    timestamp created_at
  }
  auth_sessions {
    uuid id PK
    uuid user_id FK
    timestamp expires_at
  }
  flights {
    uuid id PK
    string number UK
    string airline
    string city
    string direction
    timestamp scheduled_at
    timestamp estimated_at
    string gate
    string status
    boolean is_demo
  }
  favorites {
    uuid user_id PK,FK
    uuid flight_id PK,FK
  }
  complaints {
    uuid id PK
    string reference UK
    string access_hash
    uuid user_id FK
    string email
    string category
    string subject
    text message
    string priority
    string status
    text response
    string sentiment
  }
  chat_sessions {
    uuid id PK
    uuid user_id FK
    string guest_hash
    string language
  }
  chat_messages {
    uuid id PK
    uuid session_id FK
    bigint sequence
    string role
    text content
    string source
    string topic
  }
  services {
    uuid id PK
    string slug UK
    string icon
    jsonb title
    jsonb description
    jsonb location
    jsonb hours
    int views
  }
  faq {
    uuid id PK
    string category
    jsonb question
    jsonb answer
    text keywords
  }
  knowledge_base {
    uuid id PK
    string topic
    jsonb title
    jsonb content
    text keywords
    string source
  }
  analytics {
    uuid id PK
    string event
    string topic
    timestamp created_at
  }
  audit_log {
    uuid id PK
    uuid user_id FK
    string action
    timestamp created_at
  }
```

`services`, `faq` et `knowledge_base` sont des ressources éditoriales autonomes. Le champ `topic` des événements est une dimension analytique, pas une clé étrangère : les événements de consultation utilisent un identifiant de service et ceux du chatbot utilisent un code thématique.

Les contenus JSONB ont la forme `{ "fr": "…", "en": "…", "ar": "…" }`. Les messages conservent la langue et le texte réellement utilisés. Le changement de langue de l’interface ne traduit pas rétroactivement l’historique.

## États d’une réclamation

```mermaid
stateDiagram-v2
  [*] --> RECEIVED
  RECEIVED --> IN_PROGRESS
  IN_PROGRESS --> RESOLVED
  RESOLVED --> CLOSED
  RESOLVED --> IN_PROGRESS
  CLOSED --> IN_PROGRESS
```

La transition est contrôlée dans une transaction avec verrouillage de la ligne. Les modifications administratives sont journalisées. La réponse s’affiche dans le compte propriétaire et dans le suivi par code privé. Elle n’est pas envoyée par email.

## Flux du chatbot

```mermaid
flowchart TD
  Q[Question + langue] --> F{Numéro de vol ?}
  F -->|Oui| D[Réponse issue des vols fictifs ou numéro absent]
  F -->|Non| K[Recherche lexicale dans les connaissances]
  K --> R{Correspondance ?}
  R -->|Oui| L[Réponse locale traduite]
  R -->|Non| C{LLM configuré ?}
  C -->|Oui| A[Appel serveur avec délai maximal]
  A -->|Succès| V[Réponse IA étiquetée à vérifier]
  A -->|Échec| E[Message de limite et orientation]
  C -->|Non| E
  D --> H[Historique privé et événement analytique]
  L --> H
  V --> H
  E --> H
```


## Suivi Flightradar24 optionnel

La route /tracking charge son propre module cartographique à la demande. Le navigateur appelle GET /api/tracking/flights. Express utilise un cache et un verrou de requête en mémoire par processus, puis le REST officiel FR24 avec une clé serveur. Les positions reçues ne sont pas insérées dans le catalogue PostgreSQL des vols fictifs. Les couches de carte OpenStreetMap sont chargées séparément par le navigateur, sans clé FR24. Voir FLIGHTRADAR24.md pour le cycle de vie et les limites multi-instance.


## Sources régionales gratuites — 8 octobre 2026

Le contrôleur appelle trackingProvider.js, qui sélectionne explicitement openSkyTracking.js, adsbTracking.js ou tracking.js (FR24). OpenSky est la source par défaut. Chaque adaptateur conserve une enveloppe identique et un cache avec regroupement des requêtes concurrentes. La base des vols fictifs reste séparée des positions réelles. L’interface distingue une zone géographique de routes liées à l’aéroport ; elle n’infère aucun itinéraire à partir des coordonnées. Voir FLIGHT-TRACKING.md.
