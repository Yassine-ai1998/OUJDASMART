# Flightradar24 — intégration du suivi

OpenSky est désormais le fournisseur par défaut. Ce guide concerne uniquement l’option FR24. Voir [FLIGHT-TRACKING.md](FLIGHT-TRACKING.md) pour le suivi gratuit.

## العربية — تفعيل الربط

صفحة التتبع: http://localhost:3102/tracking

تم تجهيز الربط، لكنه غير مفعّل افتراضيًا. لم تُستخدم أي بيانات حية أو مفاتيح مدفوعة أثناء الاختبار.

1. أنشئ حسابًا في https://fr24api.flightradar24.com وأنشئ مفتاح Sandbox للتجربة.
2. افتح ملف backend/.env في نسختك المحلية. أضف المتغيرات التالية، ثم أكمل قيمة المفتاح محليًا:

```dotenv
TRACKING_PROVIDER=flightradar24
FR24_MODE=sandbox
FR24_API_TOKEN=
FR24_REFRESH_SECONDS=60
FR24_LIMIT=20
```

3. أعد تشغيل الخادم. وضع Sandbox يعرض بيانات ثابتة من Flightradar24 وقد تكون لرحلات خارج وجدة، ولا يمثل حركة حقيقية.
4. للتتبّع الفعلي، استخدم مفتاح الإنتاج الخاص باشتراك API وغيّر FR24_MODE إلى live، ثم أعد تشغيل الخادم.

لا ترسل المفتاح في المحادثة، ولا تضعه في frontend أو في متغير يبدأ بـ VITE_. اشتراك API مستقل عن اشتراك التطبيق. هذه الخدمة تتتبع الطائرات المتاحة ولا توفر جدول المواعيد المستقبلية. صفحة /flights تبقى صفحة تجريبية منفصلة.

## Configuration serveur

### Pourquoi aucun vol ne s’affiche ?

Si la page indique « Suivi non activé », le connecteur est désactivé ou sa clé serveur manque. Cela ne signifie pas qu’aucun avion ne vole à Oujda. La carte seule ne fournit pas les positions des avions.

Pour recevoir des données réelles, renseigner `FR24_API_TOKEN` avec votre clé de production et `FR24_MODE=live` dans `backend/.env`, puis redémarrer le backend. Pour un essai statique, utiliser une clé sandbox avec `FR24_MODE=sandbox`. Ne pas envoyer la clé dans une conversation ni la placer dans le frontend.

Le lien « Consulter les vols de démonstration » ouvre `/flights`, dont les exemples restent fictifs et séparés. Si le service est configuré mais renvoie une liste vide, l’interface affiche « Aucune position reçue ». Une panne et une recherche sans résultat ont également leur propre message.

Le connecteur utilise Node fetch et une URL FR24 fixe, sans scraping. Les clés restent dans le backend. Ne remplacez pas votre fichier .env existant : conservez les secrets JWT et les autres réglages, ajoutez seulement les quatre variables ci-dessus.

| Variable | Valeurs / comportement |
|---|---|
| FR24_MODE | disabled par défaut ; sandbox avec une clé sandbox ; live avec une clé de production |
| FR24_API_TOKEN | Jeton Bearer FR24, lu uniquement par le serveur au démarrage |
| FR24_REFRESH_SECONDS | Cache de 60 secondes par défaut, borné entre 60 et 300 secondes |
| FR24_LIMIT | 20 résultats par défaut, paramètre borné entre 1 et 300 ; ne pas dépasser le plafond de votre plan |

Une valeur de mode invalide, une clé manquante ou le mode disabled ne déclenche aucun appel FR24. Le mode doit correspondre au type de clé : le serveur ne peut pas identifier lui-même une clé sandbox.

Endpoint fournisseur : GET https://fr24api.flightradar24.com/api/live/flight-positions/full?airports=both:GMFO&limit=20

En-têtes : Accept: application/json ; Accept-Version: v1 ; Authorization: Bearer [clé serveur]. Les redirections sont refusées, le délai maximal est de 10 secondes. Le modèle de données n’invente ni porte, ni horaire programmé, ni statut d’embarquement.

## API de la plateforme

GET /api/tracking/flights

Paramètre facultatif direction : all, arrival ou departure. Les paramètres non reconnus sont refusés. Les filtres ne contournent pas le cache commun.

Réponse : provider, status, mode, reason, airport, fetchedAt, refreshAfterSeconds, limit, truncated, flights.

Les états sont :

- not_configured : désactivé ou clé absente, aucun appel externe ;
- live : réponse récupérée en mode production, y compris une liste vide ;
- sandbox : réponse statique de test, y compris des vols hors Oujda ;
- stale : dernier résultat conservé temporairement après un échec ;
- unavailable : aucun résultat utilisable.

Chaque vol fournit les coordonnées, l’heure de position positionAt, l’altitude en pieds, la vitesse en nœuds, le cap, les codes aéroport disponibles et, lorsqu’elle existe, l’ETA. Une position de plus de deux minutes est signalée ancienne. fetchedAt désigne l’heure de récupération, pas l’heure de mesure.

Le serveur partage un appel simultané entre visiteurs et garde un cache en mémoire par processus Node. Les pannes sont temporisées ; les refus d’accès/quota attendent au moins cinq minutes. Le dernier résultat est utilisable au maximum cinq minutes après récupération en cas de panne, puis il est retiré. Aucune donnée fournisseur n’est écrite dans PostgreSQL. Aucun message brut d’erreur fournisseur ni jeton n’est exposé au navigateur.

Un résultat atteignant la limite est signalé comme potentiellement tronqué. Une liste vide ne garantit pas l’absence de vols programmés : seuls les appareils couverts et actuellement suivis peuvent apparaître. Le mode live exclut les vols dont ni l’origine ni la destination ne correspond à OUD/GMFO.

## Carte et usage

La page utilise Leaflet et le fond OpenStreetMap avec attribution visible. Les requêtes de tuiles sont faites directement par le navigateur, uniquement pour la zone affichée, avec les règles de cache ordinaires. La liste reste disponible si le fond de carte échoue. Le point OUD utilise l’ARP publié par l’ONDA (34°47′10″N, 001°55′32″W), sans affiliation officielle.

Le navigateur renouvelle automatiquement les données au plus une fois par minute après réception, selon le délai retourné par le serveur ; les onglets masqués et la pause arrêtent le renouvellement automatique. Le bouton Actualiser respecte le cache serveur. Après une panne réseau, le navigateur marque également les dernières positions comme anciennes et les retire au terme de cinq minutes depuis leur récupération, même en pause. L’âge des positions est réévalué immédiatement au retour dans un onglet.

Pour un déploiement fréquenté : prévoir un cache/verrou distribué partagé entre instances, un budget de crédits et la supervision, ainsi qu’un fournisseur de cartographie adapté au trafic. Le cache actuel n’est partagé qu’à l’intérieur d’un seul processus Node. Vérifier les conditions du plan FR24 pour la diffusion prévue. Les contrats externes ne sont ni souscrits ni activés par ce projet.

## Validation et limites

Les tests backend utilisent des réponses simulées conformes au schéma officiel. Ils vérifient notamment l’absence d’appel sans clé, les en-têtes, la requête aéroport, le cache concurrent, la temporisation, les erreurs, la fraîcheur et la distinction sandbox/live. Aucun appel authentifié FR24 n’a été testé faute de clé. Les tests navigateur interceptent les tuiles pour ne pas solliciter OpenStreetMap automatiquement.

## Sources officielles

- FR24 démarrage : https://fr24api.flightradar24.com/docs/getting-started
- Sandbox statique : https://fr24api.flightradar24.com/docs/sandbox-environment
- Limites et absence de données de planification : https://fr24api.flightradar24.com/docs/faq
- Plans et plafonds : https://fr24api.flightradar24.com/subscriptions-and-credits
- Attribution et conditions : https://www.flightradar24.com/terms-of-service
- Contrat SDK : https://github.com/Flightradar24/fr24api-sdk-python
- Carte : https://leafletjs.com/reference
- Tuiles : https://operations.osmfoundation.org/policies/tiles/
- AIP Oujda : https://siamaroc.onda.ma/eaip/AD/AD2GMFO.pdf
