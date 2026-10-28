import { defineLevels } from './define.js'

export default defineLevels([
  {
    title: 'Les fondamentaux du manager',
    standard: "Débutant. Ne suppose aucune connaissance préalable : l'apprenant découvre le rôle de manager.",
    modules: [
      ['Fixer un cap que personne ne peut mal comprendre', 'Formuler un objectif avec livrable, critère mesurable, date et responsable unique ; faire reformuler.'],
      ['Animer une réunion qui produit des décisions', "Ordre du jour, objectif de la réunion, gestion du temps, décisions et actions notées, compte rendu."],
      ['Donner une consigne et vérifier la compréhension', 'Consigne précise, contexte, reformulation, points de contrôle, éviter le « tu as compris ? ».'],
      ['Le feedback qui fait progresser', 'Feedback positif et correctif sur des faits observables (fait, impact, attente), à chaud et en privé.'],
      ['Prioriser son temps sous pression', 'Distinguer urgent et important (matrice d\'Eisenhower), dire non en faisant arbitrer.'],
      ["Suivre l'avancement sans harceler", 'Points d\'étape planifiés, tableau de suivi simple, relance factuelle, alerte précoce.'],
    ],
  },
  {
    title: 'Piloter une équipe',
    standard: 'Manager de proximité qui maîtrise les fondamentaux et doit faire travailler une équipe ensemble.',
    modules: [
      ['Déléguer sans abdiquer', "Niveaux d'autonomie explicites, jalons annoncés, déclencheurs d'alerte, garder la responsabilité du résultat."],
      ['Le recadrage factuel', 'Recadrer un comportement inacceptable : faits, impact, attente, engagement, sans excuse ni jugement de la personne.'],
      ['Adapter son management à chaque personne', 'Management situationnel : diriger, entraîner, soutenir ou déléguer selon compétence et motivation.'],
      ["Conduire l'entretien individuel", "Préparer l'entretien annuel, bilan factuel, objectifs, développement, gérer le désaccord sur l'évaluation."],
      ['Organiser la charge et le planning', 'Capacité réelle de l\'équipe, goulots d\'étranglement, répartition équitable, absences et imprévus.'],
      ['Gérer un conflit entre deux collaborateurs', 'Entendre séparément puis ensemble, revenir aux faits et à l\'objectif commun, fixer des règles de fonctionnement.'],
    ],
  },
  {
    title: 'La performance opérationnelle',
    standard: 'Manager confirmé, responsable de résultats chiffrés.',
    modules: [
      ['Piloter par les indicateurs', 'Indicateurs de résultat et indicateurs avancés, cibles, seuils d\'alerte, rituel hebdomadaire, une action par indicateur rouge.'],
      ['Résoudre un problème à la racine', 'Distinguer symptôme et cause : méthode des 5 pourquoi, diagramme d\'Ishikawa, vérification par les données.'],
      ['Améliorer un processus', 'Cartographier un processus, repérer les gaspillages (lean), mesurer avant et après, impliquer le terrain.'],
      ['Traiter la sous-performance', "Diagnostic (compétence, moyens, motivation), plan d'amélioration écrit, suivi, conséquences annoncées et appliquées."],
      ['Recruter les bons profils', 'Définir le besoin, entretien structuré, mises en situation, éviter les biais, vérifier les références.'],
      ['Réussir l\'intégration d\'un nouveau collaborateur', 'Plan des 90 premiers jours, objectifs progressifs, parrain, points de contrôle, période d\'essai assumée.'],
    ],
  },
  {
    title: 'Projets et sous-traitants',
    standard: 'Responsable de projets à enjeux impliquant prestataires et sous-traitants (chantiers, industrie, services).',
    modules: [
      ['Cadrer un projet', 'Périmètre, livrables, jalons, budget, risques, matrice RACI, validation écrite du cadrage.'],
      ['Anticiper les risques et préparer les plans B', 'Registre des risques (probabilité, impact), mesures préventives, plans de repli, déclencheurs.'],
      ['Piloter un sous-traitant', 'Contrat, cahier des charges, réunions de chantier, comptes rendus, pénalités, preuves écrites.'],
      ["L'asymétrie de dépendance", 'Cartographier ses dépendances, construire des alternatives crédibles, ne jamais révéler son urgence.'],
      ['Maîtriser les dérives de délai et de budget', 'Alerte précoce, triangle coût-délai-qualité, arbitrage explicite, avenants maîtrisés.'],
      ['Tenir les engagements par l\'écrit', 'Traçabilité, comptes rendus opposables, réserves, mise en demeure, préparer un éventuel contentieux.'],
    ],
  },
  {
    title: 'Manager de managers',
    standard: "Directeur d'un service ou d'un site, qui dirige d'autres managers.",
    modules: [
      ['Lâcher l\'opérationnel', 'Passer de faiseur à dirigeant : travailler par ses managers, ne pas court-circuiter la ligne hiérarchique.'],
      ['Arbitrer entre deux managers', 'Refuser les versions séparées, critère de décision supérieur, trancher, répartir les rôles de mise en œuvre.'],
      ["Concevoir l'organisation", 'Rôles, interfaces, nombre de collaborateurs par manager, éviter les doublons et les zones grises.'],
      ['Le talent toxique mais indispensable', 'Cadre comportemental non négociable, réduction de la dépendance, conséquences appliquées.'],
      ['Développer les talents et préparer la relève', 'Revue des talents, plans de développement, plan de succession pour les postes clés.'],
      ['Installer les rituels de direction', 'Comité de direction de service, revues de performance, circulation de l\'information, discipline des décisions.'],
    ],
  },
  {
    title: "La stratégie d'une unité",
    standard: "Dirigeant d'une business unit ou d'une PME, responsable de sa stratégie.",
    modules: [
      ['Analyser son environnement concurrentiel', 'Forces concurrentielles, clients, substituts, tendances ; SWOT utilisé pour décider, pas pour décorer.'],
      ['Choisir une stratégie', 'Où jouer et comment gagner : différenciation, coûts, niche ; renoncer explicitement à certains marchés.'],
      ['Traduire la stratégie en actions', 'Objectifs en cascade (OKR), feuille de route, responsables, indicateurs de suivi.'],
      ['Allouer les ressources', 'Budget, priorités, arbitrages entre projets, arrêter des projets qui ne servent pas la stratégie.'],
      ['Construire un business case', 'Coûts, gains, hypothèses explicites, scénarios, retour sur investissement, points de sensibilité.'],
      ['Défendre son plan devant la direction générale', 'Message clé, chiffres, anticipation des objections, demande claire de décision.'],
    ],
  },
  {
    title: 'La transformation',
    standard: 'Membre de comité de direction conduisant une transformation profonde.',
    modules: [
      ['Conduire le changement face aux résistances', 'Pourquoi avant comment, alliés visibles, victoires rapides, point de non-retour, gestion des opposants.'],
      ['Mener une réorganisation', 'Préparer en confidentialité, annoncer, traiter les perdants avec respect, calendrier, maintien de l\'activité.'],
      ['Réduire les coûts sans détruire la valeur', 'Diagnostic des coûts, coupes ciblées plutôt qu\'uniformes, protéger les capacités clés, communication.'],
      ['Intégrer une entreprise rachetée', 'Plan des 100 jours, synergies réalistes, chocs culturels, rétention des talents clés.'],
      ['Faire adopter de nouveaux outils et méthodes', 'Adoption réelle plutôt que déploiement, utilisateurs pilotes, formation, abandon de l\'ancien système.'],
      ['Tenir la performance pendant la transformation', 'Fatigue du changement, séquencement, protéger le cœur de métier, célébrer les étapes.'],
    ],
  },
  {
    title: 'Gouvernance et pouvoir',
    standard: 'Dirigeant exécutif (directeur général, membre de comité exécutif) exposé aux jeux de pouvoir.',
    modules: [
      ['Lire les jeux de pouvoir au comité exécutif', 'Intérêts cachés, alliances, territoires, décisions prises avant les réunions.'],
      ['Gérer la relation avec le conseil et les actionnaires', 'Transparence maîtrisée, pas de surprise, préparation des séances, gestion d\'un administrateur hostile.'],
      ["Décider dans l'incertitude", 'Scénarios, décisions réversibles et irréversibles, valeur de l\'information, assumer le risque.'],
      ["Les conflits d'intérêts et l'éthique du dirigeant", 'Identifier, déclarer, trancher ; la tentation du raccourci ; protéger l\'entreprise et soi-même.'],
      ['Faire face à un pair hostile au comité', 'Neutraliser sans guerre ouverte, alliances, faits, recours à l\'arbitrage du président.'],
      ['Façonner une culture de performance', 'Valeurs vécues plutôt qu\'affichées, exemplarité, rituels, sanctions et reconnaissances cohérentes.'],
    ],
  },
  {
    title: 'Diriger dans la crise',
    standard: 'Dirigeant de référence capable de tenir une organisation dans une crise majeure.',
    modules: [
      ['Prendre le commandement de la crise', 'Cellule de crise, rôles, faits contre hypothèses, trois priorités, communication à heure fixe.'],
      ['La crise médiatique et réputationnelle', 'Premières heures, message de reconnaissance, porte-parole unique, réseaux sociaux, éviter le « pas de commentaire ».'],
      ['La crise sociale', 'Grève, blocage, dialogue avec les représentants du personnel, sortie de conflit sans humiliation.'],
      ['La crise financière', 'Trésorerie à 13 semaines, banques, créanciers, plan de survie, procédures de sauvegarde.'],
      ['L\'accident grave', 'Priorité aux personnes, autorités, familles, enquête, responsabilité juridique et morale.'],
      ['Sortir de la crise et en tirer les leçons', 'Fin de crise, retour d\'expérience sans chasse aux coupables, mesures durables.'],
    ],
  },
  {
    title: 'La maîtrise',
    standard: "Expert international du management de grandes organisations. Exigence maximale : rien d'approximatif n'est acceptable.",
    modules: [
      ['Redresser une entreprise en difficulté', 'Diagnostic en 30 jours, trésorerie, décisions dures, reconstruction de la confiance, nouvelle trajectoire.'],
      ['Diriger une organisation internationale', 'Siège et filiales, différences culturelles de management, centralisation contre autonomie locale.'],
      ['Gouverner un mégaprojet', 'Multiples parties prenantes, contrats complexes, gouvernance, gestion des dérives systémiques.'],
      ['Porter une vision à long terme', 'Horizon de 10 ans, paris stratégiques, cohérence des décisions courantes avec la vision.'],
      ['Organiser la succession et la transmission', 'Préparer son successeur, transmettre le pouvoir sans déstabiliser l\'organisation.'],
      ['Les décisions impossibles', 'Arbitrer entre valeurs contradictoires (emplois, survie, éthique, actionnaires) et assumer seul.'],
    ],
  },
])
