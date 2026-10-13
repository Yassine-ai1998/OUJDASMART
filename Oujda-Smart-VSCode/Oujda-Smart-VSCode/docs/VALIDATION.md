# Vérifications de livraison

Dernière mise à jour : 13 octobre 2026.

Les parcours généraux ont été vérifiés les 30 septembre et 1er octobre. La suite API complète et les contrôles du nouveau suivi Flightradar24 ont été exécutés le 4 octobre ; les résultats correspondants figurent en fin de document.

## Automatisées

- Compilation Vite du frontend réussie : 1 651 modules transformés, sans erreur.
- Trois tests Node réussis : parcours API et contrôles d’accès, adaptateur LLM simulé et repli local, limite bcrypt en octets UTF-8.
- Base de tests PGlite temporaire et isolée de la démonstration.
- Vérification d’inscription et connexion, refus d’élévation du rôle, refus d’accès administrateur pour un passager, refus de sessions étrangères, requêtes SQL paramétrées, validation des formulaires et contrôle de l’origine.
- Favoris idempotents, confidentialité du suivi des réclamations, transitions de traitement, création/modification/suppression de vol et connaissance.
- Messages conservés dans l’ordre utilisateur puis assistant, réponses locales FR/AR et recherche d’un vol fictif.
- Déconnexion invalidant un JWT déjà utilisé.
- Fournisseur LLM testé avec un serveur HTTP local contrôlé : réponse compatible, clé transmise uniquement côté serveur, réponse de secours en cas d’échec.

## Navigateur Chrome

- Accueil desktop et mobile, filtre de vols, assistant local et changement de langue.
- Connexion administrateur et ouverture de toutes les pages d’administration.
- Création et modification d’un vol via formulaire.
- Suppression de vols de test après correction du corps JSON des requêtes DELETE Axios.
- Réponse à une réclamation.
- Inscription passager, ajout/retrait d’un favori, dépôt et suivi privé d’une réclamation, espace utilisateur et déconnexion.
- Aucun message d’erreur JavaScript dans les parcours vérifiés.
- Aucun débordement de page à 390 px en français, anglais ou arabe, ni dans le dashboard administrateur mobile. Les vols utilisent désormais des cartes sur mobile ; les tableaux administratifs restent défilables dans leur propre conteneur.
- Inspection visuelle des captures accueil, assistant, administration et mobile RTL.

## Non vérifié

- Aucun fournisseur LLM réel, aucune clé API payante utilisée.
- Aucun serveur PostgreSQL externe démarré dans cet environnement. Les tests SQL ont utilisé le moteur PostgreSQL embarqué PGlite.
- Aucune connexion aux systèmes de l’aéroport ou de l’ONDA.
- Aucun test de charge, audit de sécurité indépendant ou certification d’accessibilité.
- Les commandes npm sont déclarées et standard ; l’environnement de développement fourni utilisait pnpm pour l’installation, et les CLI Node correspondantes pour l’exécution.

Les captures montrent des données de démonstration et peuvent précéder quelques interactions de test. Elles ne constituent pas des statistiques aéroportuaires.

## Refonte internationale : contrôles du 1er octobre 2026

- Compilation finale réussie : JavaScript 403,71 ko (gzip 127,35 ko), CSS 68,09 ko (gzip 15,26 ko).
- Recherche depuis l’accueil : AT700 ouvre le filtre correspondant, une seule ligne de résultat ; maintien du texte lors du changement départ/arrivée.
- Tous les filtres de vols conservés dans l’URL, recharge et retour arrière cohérents. La frappe conserve le focus et la position de défilement.
- Checklist : cases persistantes après recharge, remise à zéro fonctionnelle.
- Question suggérée préremplie, envoi effectif à l’API et réponse locale de l’assistant vérifiés.
- Cartes mobiles : statut et heure visibles, ouverture effective de la fiche de vol.
- Accueil FR/EN/AR sans débordement horizontal à 320, 360, 390, 768, 1024 et 1440 px.
- 21 combinaisons supplémentaires : connexion, inscription, assistant, réclamations, FAQ, services et vols, dans les trois langues à 390 × 844. Aucun débordement ni erreur JavaScript.
- Navigation mobile : menu accessible au clavier, focus sur le premier lien, Échap restitue le focus au bouton ; barre inférieure fonctionnelle.
- Détection navigateur FR/EN/AR, préférence mémorisée et synchronisée entre onglets ; fonctionnement même si localStorage est indisponible.
- Métadonnées localisées, pages privées/404 noindex, changement de langue sans vol de focus.
- Connexion administrateur réelle et chargement des sept pages de gestion vérifiés avec l’API locale.
- Captures finales inspectées sur ordinateur et mobile RTL.

Ces contrôles ne constituent pas une certification d’accessibilité, un test de charge, un audit de sécurité ou une validation de déploiement international.

## Suivi Flightradar24 : contrôles du 4 octobre 2026

- Suite backend complète : **9 tests réussis sur 9**, incluant les parcours existants. Commande depuis backend : `node --test tests/*.test.js`. La base temporaire est isolée de la base de démonstration.
- Connecteur testé avec des réponses fournisseur simulées : absence d’appel sans configuration, URL et en-têtes officiels, sélection OUD/GMFO, distinction sandbox/live, déduplication, normalisation, cache et regroupement des appels simultanés.
- Erreurs simulées : refus de clé, quota, délai dépassé et réponse invalide ; temporisation des nouvelles tentatives et retrait du cache expiré. Aucune clé n’apparaît dans les réponses publiques.
- Compilation finale Vite réussie : **1 660 modules**, aucune erreur. Le module de suivi est chargé à la demande (JavaScript 180,12 ko, gzip 54,05 ko ; CSS 27,50 ko, gzip 9,31 ko).
- Chrome avec l’API locale réelle : accueil, lien vers /tracking, état not_configured, aucune carte de vol ni avion fictif ajouté à la carte. La page /flights conserve ses données de démonstration distinctes.
- Page /tracking FR/EN/AR sans débordement horizontal à 320, 390, 768, 1024 et 1440 px ; captures desktop et mobile arabe inspectées. Aucune erreur JavaScript dans ces parcours.
- Chrome avec réponses de suivi simulées : cinq états API, recherche, filtres départ/arrivée, sélection carte/liste, détails, attribution et absence de recentrage intempestif lors du renouvellement.
- Une chaîne contenant du HTML dans une donnée simulée reste du texte inerte dans la carte.
- Horloge de navigateur contrôlée : renouvellement automatique espacé d’au moins 60 secondes après réponse, arrêt pendant la pause et dans un onglet masqué, mise à jour immédiate de l’âge au retour de visibilité.
- Après panne réseau, les positions sont signalées anciennes et retirées au terme de cinq minutes depuis leur récupération, même en pause. Le mode sandbox reste explicitement indiqué pendant une panne.

Les réponses simulées servent uniquement à tester le comportement. **Aucun appel authentifié à Flightradar24 n’a été exécuté et aucune donnée réelle fournisseur n’a été validée.** La configuration locale reste désactivée faute de clé.

Toutes les tuiles OpenStreetMap ont été interceptées pendant les tests automatisés pour éviter de solliciter le service. Les captures `captures/suivi-non-active-desktop.jpg` et `captures/suivi-non-active-arabe.jpg` montrent donc le fond de carte indisponible avec son message de repli. Elles ne prouvent pas le chargement externe des tuiles.


## OpenSky et suivi régional : contrôles du 8 octobre 2026

- 23 tests backend réussis : parcours existants, FR24, ADSB.lol optionnel, OpenSky et sélection des fournisseurs. Aucun appel fournisseur réel n’est effectué par ces tests, et leur base PGlite reste isolée.
- Contrôles OpenSky : requête anonyme fixe, fenêtre de 25 degrés carrés, conversion mètres/pieds et m/s/nœuds, absence d’itinéraire inventé, validation de l’âge et des coordonnées, déduplication, cache partagé de 300 secondes, temporisation quota/accès refusé, timeout et réponses incorrectes.
- Compilation Vite réussie : 1 660 modules, aucune erreur. Le suivi reste chargé à la demande.
- Vérification réelle séparée : OpenSky HTTP 200 ; API locale provider=opensky, status=live, radiusNm=120, refreshAfterSeconds=300. Deux positions étaient présentes au premier contrôle, puis une lors du contrôle suivant. Ces nombres sont des observations ponctuelles, pas une garantie de trafic.
- Les 12 vols fictifs de la base sont conservés sur /flights.
- Chrome réel : cartes et marqueurs visibles, sélection et détails, zone de couverture, source OpenSky, absence de faux filtres arrivée/départ ; français, anglais et arabe sans débordement de 320 à 1440 px. Les bulles déjà ouvertes changent désormais de langue correctement.
- Chrome avec réponses simulées : liste vide, quota, contact ADSB manquant, sandbox FR24, recherche/remise à zéro, sélection, cadence de 300 secondes, pause et retrait des positions anciennes. Aucune erreur JavaScript.
- Toutes les tuiles OpenStreetMap ont été interceptées pendant l’automatisation. Les captures opensky-desktop.jpg et opensky-arabe.jpg montrent donc les marqueurs réels sur un fond neutralisé avec message de repli ; elles ne vérifient pas le chargement externe des tuiles.
- ADSB.lol réel : refus HTTP 403 demandant un User-Agent avec contact valide. Aucun contournement ni contact inventé. FR24 réel : non testé faute de clé.

Les preuves de suivi concernent les positions publiques régionales, et non les systèmes de l’aéroport. Aucun déploiement public, audit indépendant ou test de charge n’a été effectué.

## Tableau aéroport : contrôles du 11 octobre 2026

- Compilation frontend réussie : 1 665 modules, JavaScript principal 419,24 ko (gzip 132,11 ko), sans erreur.
- Navigateur Chrome : source locale des douze vols de démonstration, ordre chronologique, dates stockées inchangées, distinction horloge courante / date des vols.
- Arrivées et départs : changement des résultats et de l’URL ; activation au clavier ; conservation du focus sur l’onglet pendant le chargement.
- Ligne dépliable au clavier, porte et terminal, lien vers la fiche du vol vérifiés.
- Recherche par numéro, filtre compagnie, aucun résultat, erreur API simulée et bouton Réessayer vérifiés.
- Français, anglais et arabe : dates/heures localisées, RTL et absence de débordement de page à 320, 390, 768 et 1440 px.
- Contraste des petits textes du tableau renforcé ; captures desktop et mobile arabe inspectées. Ces contrôles ne constituent pas un audit complet d’accessibilité.
- Aucune erreur JavaScript pendant les parcours finaux. La carte a été testée avec une réponse contrôlée et les hôtes externes bloqués, sans appel de suivi réel ni chargement de tuiles.
- Cinq tests backend réussis : trois tests d’intégration existants et deux tests de régression horaire. Bases temporaires isolées et PGlite en mémoire ; aucune donnée de la base active modifiée.
- Correction de compatibilité Casablanca pour les anciens jeux de fuseaux de Node/PostgreSQL : filtre horaire et assistant cohérents avec la transition IANA du 20 septembre 2026. Borne de transition, période historique de Ramadan et filtre inclusif à 08:30 vérifiés.

Les horaires restent fictifs. Le lien ONDA est une consultation externe, sans récupération de planning. Les contrôles ne valident ni des horaires réels d’aéroport ni un déploiement public.

## Photo Oujda-Angads et identité visuelle : 13 octobre 2026

- Photographie réelle du terminal (2024) stockée localement ; auteur Jakub Pietrasiak, licence CC BY-SA 4.0, fichier original intact et crédits visibles avec liens.
- Bannière partagée entre accueil, vols et suivi ; palette bleu nuit, blanc et doré ; navigation, recherche, services et tableau harmonisés. Le cadrage mobile place la photo au-dessus du texte.
- 36 combinaisons Chrome vérifiées : accueil, vols et suivi, chacune en FR/EN/AR et aux largeurs 320, 390, 768 et 1440 px. Image décodée dans chaque cas, aucun débordement horizontal ni erreur JavaScript.
- Six parcours réussis : recherche de vol depuis l’accueil, conservation du sens et du texte après navigation/recharge, onglets et expansion au clavier, dans chacune des trois langues. Les dates et l’indication de démonstration sont conservées.
- Suivi testé avec réponses contrôlées ; toutes les requêtes externes et tuiles ont été bloquées. Les contrôles de design ne constituent pas une nouvelle vérification des fournisseurs réels.
- Aucun changement du backend ni de la base de données pour cette refonte.

Compilation finale de la refonte : 1 668 modules transformés, JavaScript principal 421,71 ko (gzip 132,94 ko), CSS principal 94,34 ko (gzip 19,70 ko). Contrôle visuel final : logo du pied de page lisible, crédit photo non recouvert par la recherche, captures finales conservées dans docs/captures/design-oujda-*.jpg.
