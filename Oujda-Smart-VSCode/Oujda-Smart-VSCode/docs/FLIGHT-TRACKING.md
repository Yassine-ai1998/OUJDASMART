# Suivi gratuit des avions — 8 octobre 2026

## Utilisation

Ouvrir http://localhost:3102/tracking. **OpenSky Network est la source par défaut**, sans clé API ni adresse email à fournir pour ce prototype académique non commercial. La connexion réelle a été vérifiée le 8 octobre 2026. Le nombre d’appareils varie selon l’heure et la couverture.

La carte montre les positions reçues dans un rayon de **120 milles nautiques (environ 222 km)** autour d’Oujda-Angads. Cela inclut des avions en survol et ne constitue pas un tableau des arrivées et départs. Les itinéraires, immatriculations, types d’appareil et heures d’arrivée non fournis par cette source ne sont pas inventés. L’indicatif radio n’est pas présenté comme un numéro de vol commercial.

- Cliquer sur un avion ou sa carte pour voir la position, l’altitude, la vitesse et le cap.
- Rechercher un indicatif dans la liste.
- Utiliser Recentrer sur Oujda pour retrouver la zone observée.
- Les positions anciennes sont signalées ; les positions de plus de cinq minutes sont retirées lors des réévaluations.
- Une erreur fournisseur reste distincte d’une réponse valide sans position.
- `/flights` conserve les douze vols fictifs du prototype, indépendamment du suivi réel.

## Tableau des arrivées et départs

La vue `/flights` présente désormais les horaires de démonstration sous forme de tableau aéroportuaire. Les boutons « Tableau aéroport » et « Carte des avions » permettent de passer d’une vue à l’autre. La page propose aussi un lien externe vers le site officiel ONDA ; elle n’en importe pas les horaires. Voir [AIRPORT-BOARD.md](AIRPORT-BOARD.md).

## Réglages serveur

Dans `backend/.env`, conserver les autres réglages et secrets existants :

```dotenv
TRACKING_PROVIDER=opensky
OPENSKY_REFRESH_SECONDS=300
```

Redémarrer le backend après un changement de configuration. Ne jamais lancer deux backends sur la même base PGlite.

La requête serveur fixe couvre une fenêtre de 25 degrés carrés :

```text
GET https://opensky-network.org/api/states/all?lamin=32.3&lomin=-4.4&lamax=37.3&lomax=0.6
```

Les coordonnées sont ensuite filtrées à 120 NM d’Oujda. Le timestamp fournisseur et l’heure de chaque position sont validés. L’altitude OpenSky en mètres est convertie en pieds et la vitesse en m/s en nœuds.

Le cache et les appels simultanés sont partagés par processus Node. L’intervalle minimal est de 300 secondes, soit au plus 288 renouvellements sur 24 heures en fonctionnement continu. Le quota anonyme documenté est de 400 crédits par jour et par IP ; cette fenêtre coûte un crédit par appel. D’autres applications utilisant la même IP et les redémarrages peuvent consommer le quota restant. Les erreurs 429 respectent les délais fournisseur ; les clics Actualiser ne contournent pas le cache. Aucun renouvellement n’est lancé sans visiteur demandant les données.

Le navigateur suspend les mises à jour en pause ou lorsque l’onglet est masqué. Les données ne sont pas enregistrées dans la base métier. La carte Leaflet et son fond OpenStreetMap restent indépendants de la source des avions.

## Fournisseurs optionnels

| TRACKING_PROVIDER | Configuration | Périmètre |
|---|---|---|
| `opensky` | Aucun compte pour l’accès anonyme ; intervalle minimal 300 s | Positions régionales, 120 NM |
| `adsb_lol` | `ADSB_CONTACT` : email technique autorisé ; `ADSB_RADIUS_NM` : 25–250 ; `ADSB_REFRESH_SECONDS` : 60–300 | Positions régionales |
| `flightradar24` | Variables FR24 décrites dans FLIGHTRADAR24.md et clé correspondant au mode | Vols suivis à destination ou au départ d’Oujda |
| `disabled` | Aucun appel externe | Suivi non activé |

ADSB.lol a refusé le premier essai réel avec HTTP 403 et le motif « User-Agent too generic; include valid contact info. ». Ce connecteur reste disponible mais n’est pas activé : aucun email n’a été inventé ni transmis. Il exige un contact autorisé dans l’en-tête serveur User-Agent, sans l’afficher au public. Ses données relèvent d’ODbL ; le crédit correspondant s’affiche lorsque ce fournisseur est choisi. Aucun appel ADSB.lol réussi n’a été validé. Aucun appel FR24 authentifié n’a été effectué.

Les sources sont choisies explicitement, sans bascule automatique silencieuse. Une configuration inconnue désactive les appels externes.

## API et fichiers

`GET /api/tracking/flights` renvoie `provider`, `scope`, `radiusNm`, `status`, `mode`, `reason`, `airport`, `fetchedAt`, `refreshAfterSeconds`, `limit`, `truncated`, `flights`.

Les filtres `direction=arrival` et `direction=departure` ne sont disponibles qu’avec le périmètre des routes aéroportuaires. Ils renvoient HTTP 400 pour les sources régionales, qui ne fournissent pas cette information.

- `backend/src/services/trackingProvider.js` : sélection explicite du fournisseur.
- `backend/src/services/openSkyTracking.js` : OpenSky anonyme, unités, validation, cache et temporisation.
- `backend/src/services/adsbTracking.js` : source optionnelle ADSB.lol.
- `backend/src/services/tracking.js` : source optionnelle FR24.
- `frontend/src/pages/Tracking.jsx` : états, recherche et renouvellement.
- `frontend/src/components/TrackingMap.jsx` : carte, rayon et bulles localisées.
- `backend/tests/` : tests automatisés sans requêtes aux fournisseurs réels.

## Conditions et sources officielles

OpenSky réserve cet accès à la recherche et aux usages non commerciaux. Pour un usage commercial ou une exploitation aéroportuaire, obtenir un accord adapté auprès du fournisseur. Le cache et la limitation de débit actuels restent locaux à un processus : un déploiement avec plusieurs instances nécessiterait un cache et un verrou partagés.

La page affiche la source et la référence demandée : Matthias Schäfer, Martin Strohmeier, Vincent Lenders, Ivan Martinovic et Matthias Wilhelm, « Bringing Up OpenSky: A Large-scale ADS-B Sensor Network for Research », IPSN, pages 83–94, avril 2014.

- [OpenSky : périmètre et citation](https://openskynetwork.github.io/opensky-api/)
- [OpenSky : API, champs et quotas](https://openskynetwork.github.io/opensky-api/rest.html)
- [ADSB.lol : documentation](https://api.adsb.lol/docs)
- [ADSB.lol : spécification](https://api.adsb.lol/api/openapi.json)

## العربية

تم تفعيل OpenSky لعرض مواقع فعلية للطائرات حول وجدة دون مفتاح API أو بريد إلكتروني في هذا النموذج الأكاديمي غير التجاري. افتح http://localhost:3102/tracking. التحديث كل خمس دقائق على الأقل، ضمن نصف قطر نحو 222 كم. قد تكون الطائرات عابرة للأجواء ولا تصل إلى وجدة أو تغادر منها. صفحة `/flights` منفصلة وتحتوي على رحلات تجريبية. أعد تشغيل الخادم بعد تعديل الإعدادات.

## English

OpenSky is the default source for this non-commercial academic prototype. No API key or email is required for anonymous access. Open `/tracking` for reported aircraft positions within 120 NM of Oujda, refreshed at least five minutes apart. Overflights are included; arrivals, departures and schedules cannot be inferred. `/flights` remains the separate fictional demonstration board.
