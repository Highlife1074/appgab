// Moteur local déterministe : permet de développer l'UI sans clé API ni backend.

const COURSES = {
  management: [
    {
      title: "L'asymétrie de dépendance",
      content:
        "Celui qui a le plus besoin de l'autre a déjà perdu la moitié du rapport de force. Avant toute confrontation avec un sous-traitant critique, cartographie la dépendance réelle : qui peut remplacer qui, en combien de temps, à quel coût. Ne révèle jamais ta propre dépendance ; révèle seulement tes options. Un plan B crédible, même non activé, change la posture de ton interlocuteur avant même que tu ouvres la bouche. Règle : on ne menace pas, on informe. « Nous avons sécurisé une alternative » vaut dix ultimatums.",
    },
  ],
  influence: [
    {
      title: 'Le silence tactique',
      content:
        "Après une demande ou un refus, tais-toi. Le silence crée un vide que l'autre comble presque toujours — avec une concession, une justification ou une information qu'il comptait garder. La plupart des dirigeants perdent leur position dans les trois secondes qui suivent leur propre phrase, en l'adoucissant. Formule, puis attends. Sept secondes. Le premier qui justifie sa position l'affaiblit.",
    },
  ],
  negotiation: [
    {
      title: "L'ancrage asymétrique",
      content:
        "Le premier chiffre posé sur la table structure toute la négociation. Ancre tôt, ancre fort, et justifie ton ancrage par un critère objectif (benchmark, coût de remplacement, historique). Si l'adversaire ancre en premier, ne contre-propose pas immédiatement : désamorce son chiffre (« Ce n'est pas une base de discussion ») puis repositionne sur tes propres critères. Une contre-offre immédiate valide son ancre.",
    },
  ],
}

const CHALLENGES = {
  management: {
    title: 'Le chantier en otage',
    context:
      "Ton sous-traitant gros œuvre, seul capable de tenir le planning, t'annonce un arrêt du chantier sous 72 h si son avenant de +18 % n'est pas signé. Pénalités de retard client : 40 000 € par jour.",
    stakes: "Planning, marge du projet, crédibilité face au maître d'ouvrage.",
    prompt: 'Rédige mot pour mot ce que tu lui dis lors de la réunion de demain matin.',
  },
  influence: {
    title: 'Le talent toxique',
    context:
      "Ton meilleur commercial (35 % du CA) humilie publiquement deux juniors. L'un vient de démissionner. L'équipe attend de voir si tu vas agir.",
    stakes: "Autorité, rétention de l'équipe, chiffre d'affaires du trimestre.",
    prompt: "Rédige l'entretien que tu as avec lui, tes premières phrases incluses.",
  },
  negotiation: {
    title: 'Le passage en force',
    context:
      "Un acheteur grand compte t'annonce par email, la veille de la signature, une remise supplémentaire de 12 % « sans quoi le dossier part chez le concurrent ». Le contrat représente 2,4 M€.",
    stakes: 'Marge, précédent tarifaire, relation long terme.',
    prompt: "Rédige ta réponse (email ou appel) exactement comme tu l'enverrais.",
  },
}

const pick = (list, level) => list[(level - 1) % list.length]
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const WEAK_MARKERS = ['désolé', 'je comprends tout à fait', "s'il vous plaît", 'peut-être', 'j’espère', "j'espère", 'excusez']
const FIRM_MARKERS = ['alternative', 'option', 'délai', 'conditions', 'contrepartie', 'en échange', 'critère', 'décision']

function scoreResponse(text) {
  const normalized = text.toLowerCase()
  const weak = WEAK_MARKERS.filter((marker) => normalized.includes(marker))
  const firm = FIRM_MARKERS.filter((marker) => normalized.includes(marker))
  const lengthBonus = text.length > 600 ? 2 : text.length > 300 ? 1 : 0
  const score = Math.min(10, Math.max(0, 4 + firm.length + lengthBonus - weak.length * 2))
  return { score, weak, firm }
}

export const mockProvider = {
  name: 'mock',

  async generateCourse({ domain, level }) {
    await delay(500)
    return pick(COURSES[domain], level)
  },

  async generateChallenge({ domain }) {
    await delay(500)
    return CHALLENGES[domain]
  },

  async evaluate({ response }) {
    await delay(1200)
    const { score, weak, firm } = scoreResponse(response)
    return {
      score,
      verdict: score >= 8 ? 'Palier validé. Ne te repose pas dessus.' : 'Insuffisant. Tu viens de te faire dévorer.',
      strengths: firm.length ? [`Leviers mobilisés : ${firm.join(', ')}.`] : [],
      weaknesses: [
        ...(weak.length ? [`Marqueurs de faiblesse : ${weak.join(', ')}.`] : []),
        ...(firm.length < 2 ? ['Aucune alternative ni contrepartie posée : tu subis le cadre adverse.'] : []),
      ],
    }
  },
}
