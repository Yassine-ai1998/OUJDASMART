# Tableau de l’aéroport — 11 octobre 2026

Ouvrir **http://localhost:3102/flights**. La présentation s’inspire d’un tableau aéroportuaire : en-tête sombre, code OUD / GMFO, heure locale du Maroc, lignes de vols et navigation Arrivées / Départs / Carte.

## Utilisation

- Choisir Arrivées ou Départs dans les onglets en bas du tableau.
- Ouvrir « Rechercher et filtrer » pour filtrer par numéro, compagnie, ville, statut ou heure. Les critères sont conservés dans l’URL.
- Cliquer sur une ligne, ou utiliser Entrée / Espace au clavier, pour afficher sa porte, son terminal et le lien vers sa fiche.
- Choisir « Carte des avions » pour consulter les positions régionales reçues d’OpenSky.
- Changer la langue dans l’en-tête du site : français, anglais ou arabe avec disposition RTL.

## Provenance des données

**Le tableau utilise les vols fictifs de la base locale, via `GET /api/flights`. Il n’est pas relié aux horaires réels de l’aéroport.** L’indication « Horaires de démonstration » reste visible. Les vols sont groupés selon leur date programmée réelle dans la base, dans le fuseau `Africa/Casablanca` ; ils ne sont pas artificiellement datés du jour.

L’horloge de l’en-tête indique l’heure actuelle du Maroc. Elle n’indique pas l’heure de mise à jour des horaires. Les types d’avion et codes d’aéroport de destination absents des données ne sont pas inventés.

Le bouton « Site officiel ONDA » ouvre la [page ONDA d’Oujda-Angads](https://www.onda.ma/fr/Nos-A%C3%A9roports/A%C3%A9roport-Oujda-Angads) pour consultation externe. Aucune extraction automatique ni intégration de ses horaires n’a été réalisée.

OpenSky fournit des positions d’avions dans la région, pas le planning commercial d’Oujda. Le module `/tracking` reste indépendant. Voir [FLIGHT-TRACKING.md](FLIGHT-TRACKING.md) pour sa couverture, ses limites et sa configuration. Une future source d’horaires autorisée devra être intégrée côté serveur, avec provenance, fraîcheur et erreurs explicites, avant de remplacer les données de démonstration.

## Fichiers

Les chemins suivants sont relatifs au dossier du projet :

- `frontend/src/components/AirportBoard.jsx` : groupement par date, horloge, lignes dépliables, états de chargement et d’erreur, onglets.
- `frontend/src/airport-board.css` : présentation responsive du tableau.
- `frontend/src/contexts/airportBoardCopy.js` : textes français, anglais et arabes.
- `frontend/src/components/FlightViews.jsx` : navigation entre tableau et carte.
- `frontend/src/airport-navigation.css` : styles des vues et filtres.
- `frontend/src/pages/Travel.jsx` : page des vols et raccordement aux filtres existants.
- `frontend/src/pages/Tracking.jsx` : accès au tableau depuis la carte.
- `frontend/src/contexts/translations.js` : libellés de navigation partagés.

Le schéma de données, les comptes et la configuration du suivi sont conservés. Le filtre horaire de l’API et l’affichage des heures dans l’assistant utilisent aussi backend/src/utils/moroccoTime.js.

## Compatibilité des fuseaux horaires

Le navigateur Chrome utilisé pour la validation dispose de données de fuseau plus récentes que le runtime Node/PostgreSQL local. La [base IANA](https://data.iana.org/time-zones/tzdb/africa) indique le passage de Casablanca à UTC le 20 septembre 2026 à 01:00 UTC. L’utilitaire serveur applique cette transition aux horaires et conserve les règles historiques antérieures, dont celles du Ramadan. Les tests figurent dans backend/tests/moroccoTime.test.js.

Lors d’une mise à jour réglementaire ultérieure, actualiser les données de fuseaux des navigateurs et serveurs ainsi que cette règle de compatibilité. Aucun horaire de vol en base n’a été réécrit.
