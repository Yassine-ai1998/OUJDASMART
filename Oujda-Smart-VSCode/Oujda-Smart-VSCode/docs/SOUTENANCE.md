# Présentation courte pour la soutenance

## Introduction proposée

« Mon projet s’intitule Oujda Smart, un assistant numérique destiné à améliorer l’accès à l’information et la communication avec les passagers de l’Aéroport Oujda-Angads.

Dans le cadre de mon Master en Communication et Transformation Numérique, j’ai conçu un prototype qui regroupe les informations utiles dans une interface accessible en français, en anglais et en arabe. Le passager peut consulter un tableau de vols, découvrir les services, poser une question et déposer une réclamation.

Le chatbot recherche d’abord une réponse dans une base de connaissances locale. Quand cette base ne suffit pas, l’architecture permet d’appeler un fournisseur d’intelligence artificielle. Cette distinction rend l’origine de la réponse visible et limite la confusion entre une information validée et une suggestion à vérifier.

Du côté de l’administration, le tableau de bord permet de gérer les contenus, de traiter les demandes et d’observer les thèmes les plus fréquents. L’analyse actuelle du sentiment repose sur des règles lexicales simples, que je présente comme une première approche à évaluer.

Il s’agit d’un prototype académique, non affilié officiellement à l’ONDA. Les vols et données initiales sont fictifs. L’étape suivante serait de valider la connaissance avec les professionnels, puis de mesurer l’utilité de la plateforme auprès de passagers. »

## Démonstration en 6 minutes

1. **Accueil, 45 secondes** : présenter l’identité, le caractère académique et les raccourcis.
2. **Vols, 45 secondes** : rechercher AT700, expliquer qu’il est fictif, ouvrir la fiche.
3. **Assistant, 1 minute** : demander « Où se trouve le parking ? », montrer la source locale, passer en arabe.
4. **Réclamation, 1 minute** : saisir une demande fictive et conserver la référence/code privé.
5. **Administration, 1 minute 30** : se connecter avec le compte de test, traiter une demande et modifier une information.
6. **Analyses et limites, 1 minute** : expliquer les graphiques, les règles lexicales et les perspectives.

## Contributions du projet

- Centralisation d’informations dispersées dans un parcours passager cohérent.
- Modèle de communication bidirectionnelle : information et remontée de demandes.
- Interface multilingue, avec prise en charge effective du sens de lecture arabe.
- Séparation entre connaissance locale, données fictives et fournisseur IA.
- Administration et données exploitables pour un futur protocole d’évaluation.

## Évaluation à mener

Comparer la recherche d’informations avec et sans le prototype sur des tâches équivalentes : temps de résolution, taux de réponse correcte, facilité perçue et satisfaction. Constituer un ensemble de questions FR/EN/AR et faire relire les réponses par des personnes compétentes. Ne présenter aucun gain chiffré avant cette expérimentation.

## Questions possibles du jury

**La plateforme est-elle officielle ?** Non. Le prototype reste académique et utilise des données de démonstration.

**Pourquoi rechercher localement avant d’appeler une IA ?** Pour maîtriser les informations disponibles, faciliter leur mise à jour et rendre visible la source de la réponse.

**Où intervient l’IA aujourd’hui ?** Un adaptateur permet un appel LLM lorsqu’une question n’a pas de réponse locale. Sans clé configurée, l’assistant fonctionne avec la base locale et une réponse de limite. Le sentiment utilise actuellement des règles, pas un modèle entraîné.

**Comment protéger les réclamations ?** Le compte propriétaire dispose de son historique. Une personne non connectée doit fournir la référence, l’email et le code privé. Le code est hashé en base.

**Quelle serait la prochaine étape ?** Valider la connaissance avec les professionnels et évaluer le prototype avec des utilisateurs avant toute intégration officielle.
