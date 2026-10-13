# Périmètre et limites du prototype

## Fonctionnalités terminées

- Interface passager responsive, navigation mobile, trois langues et arabe RTL.
- Accueil avec accès aux départs, arrivées, services, assistant et réclamations.
- Tableau des vols avec recherche, compagnie, destination, statut et heure minimale.
- Détail d’un vol et favoris propres à chaque utilisateur.
- Services traduits avec fiches, emplacement, horaires indicatifs et compteur d’ouvertures.
- FAQ recherchable, filtrable par catégorie et administrable.
- Chatbot utilisant la connaissance locale en priorité, avec suggestions et indicateur d’écriture.
- Réponses spécifiques aux numéros de vols fictifs.
- Historique de chat privé, pour visiteur identifié par cookie ou utilisateur connecté.
- Adaptateur LLM configurable côté serveur et réponse de secours sans fournisseur.
- Réclamations avec référence et code de suivi privé, ou consultation depuis le compte.
- Réponse administrateur et transitions de statut contrôlées.
- Inscription, connexion et déconnexion avec bcrypt, JWT et session révocable.
- CRUD administrateur des vols, services, FAQ et connaissances FR/EN/AR.
- Consultation protégée des conversations.
- Indicateurs, graphiques journaliers/mensuels, sujets, services consultés, questions fréquentes.
- Analyse lexicale indicative du sentiment et recommandations basées sur les thèmes fréquents.
- Schéma SQL complet, données fictives, tests automatisés et documentation.
- Page de suivi FR24 FR/EN/AR, carte et filtres, connecteur serveur optionnel avec cache et états de panne.

## Ce qui n’est pas connecté

- Aucun système officiel de l’aéroport, de l’ONDA ou d’une compagnie aérienne.
- Aucune donnée Flightradar24 réelle tant qu’une clé FR24 API et le mode approprié ne sont pas configurés ; la connexion authentifiée n’a pas été testée.
- Aucun statut d’embarquement, porte ou horaire programmé de vol en temps réel.
- Aucun tarif réel de parking ou transport validé.
- Aucun envoi des réclamations à une autorité extérieure.
- Aucun email/SMS ni notification push.
- Aucun fournisseur LLM réel tant que les variables serveur ne sont pas renseignées.
- Aucun déploiement public.

## Limites méthodologiques

L’analyse des mots-clés n’est pas un modèle entraîné de sentiment et peut mal interpréter une négation, l’ironie ou une formulation inhabituelle. Les recommandations reflètent les fréquences observées. Elles ne démontrent pas un besoin prioritaire sans étude complémentaire.

Les statistiques mélangent des événements fictifs initiaux et les interactions effectuées dans le prototype. L’étiquette de démonstration est conservée dans l’administration. Les données ne doivent pas être utilisées comme statistiques réelles de l’aéroport.

Le chatbot ne produit pas de réponse locale lorsqu’aucun mot-clé ne correspond. Un fournisseur configuré peut alors être utilisé, mais ses réponses restent à vérifier. L’historique de conversation est conservé pour consultation, mais l’adaptateur LLM actuel n’envoie pas tout cet historique au fournisseur : les questions de suivi très implicites peuvent nécessiter une reformulation.

Les connaissances sont rédigées pour démonstration et invitent à confirmer les détails auprès de la compagnie ou du personnel. Aucune amélioration mesurée de l’expérience passager n’est affirmée.

## Limites techniques

- Démonstration locale sur une instance Express et une base PGlite persistante.
- PostgreSQL serveur prévu par adaptateur et schéma SQL, à tester dans l’environnement cible.
- Limitation de débit en mémoire, non partagée entre plusieurs instances.
- Recherche lexicale et plafond des listes, sans recherche vectorielle ni pagination avancée.
- Pas de réinitialisation de mot de passe, MFA ou vérification email.
- Pas de politique automatisée de conservation/suppression des conversations.
- L’administration peut consulter les conversations du prototype. Éviter les données réelles sensibles.
- Tests de navigateur automatisés sur Chrome, sans certification d’accessibilité ni matrice exhaustive Safari/Firefox.
- Les erreurs serveur sont principalement en français, même quand l’interface utilise EN/AR.

## Évolutions proposées

1. Faire valider les informations et leur provenance par l’équipe aéroportuaire.
2. Activer et valider la connexion FR24 avec un compte autorisé ; choisir un fournisseur distinct pour les horaires futurs programmés.
3. Évaluer un fournisseur IA sur des questions multilingues représentatives.
4. Ajouter recherche sémantique et citations vers des documents validés.
5. Mesurer temps d’accès à l’information, pertinence et satisfaction sur un protocole défini.
6. Préparer une exploitation sécurisée avec sauvegardes, supervision, accès fins et règles de conservation.


## État du suivi gratuit — 8 octobre 2026

OpenSky anonyme a été testé avec des positions réelles. Cette réception ne garantit ni couverture exhaustive ni disponibilité continue. Le quota est partagé par IP ; l’intervalle minimal de cinq minutes et le cache s’appliquent par processus Node. Cet accès est utilisé pour le prototype académique non commercial, avec la citation du fournisseur ; un usage commercial nécessite un accord adapté. Les appareils survolant la zone ne doivent pas être présentés comme des départs ou arrivées d’Oujda. Les systèmes de l’aéroport ne sont toujours pas connectés.

ADSB.lol a renvoyé un refus demandant un contact technique ; aucun contact n’a été inventé. Le code de cet adaptateur est couvert par des tests simulés et reste optionnel. FR24 n’a pas été testé avec une clé authentifiée.
