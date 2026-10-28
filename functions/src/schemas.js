import { z } from 'zod'

const exampleSchema = z.object({
  situation: z.string().describe('Situation professionnelle concrète, avec des chiffres et des noms.'),
  badResponse: z.string().describe('Ce que dirait un débutant, mot pour mot.'),
  badWhy: z.string().describe('Pourquoi cette réponse échoue.'),
  goodResponse: z.string().describe('Ce que dirait un expert, mot pour mot.'),
  goodWhy: z.string().describe('Pourquoi cette réponse fonctionne, en reliant chaque élément au principe.'),
})

export const courseSchema = z.object({
  title: z.string(),
  objective: z.string().describe("Ce que l'apprenant saura faire à la fin, en une phrase."),
  glossary: z
    .array(z.object({ term: z.string(), definition: z.string() }))
    .describe('Termes techniques utilisés dans le cours, définis simplement.'),
  concept: z.string().describe('Explication du principe, en plusieurs paragraphes séparés par une ligne vide.'),
  why: z.string().describe('Pourquoi cela fonctionne : mécanismes psychologiques, économiques ou organisationnels.'),
  steps: z.array(z.string()).describe('La méthode, étape par étape.'),
  examples: z.array(exampleSchema).describe('Trois exemples de difficulté croissante.'),
  phrases: z.array(z.string()).describe('Formulations prêtes à l’emploi.'),
  pitfalls: z.array(z.string()).describe('Erreurs fréquentes et comment les éviter.'),
  exercise: z.string().describe("Un petit exercice de réflexion à faire avant l'épreuve."),
  takeaway: z.string().describe('La règle à retenir, en une phrase.'),
})

export const challengeSchema = z.object({
  title: z.string(),
  role: z.string().describe("Le rôle de l'apprenant dans la scène."),
  context: z.string().describe('La situation, avec des faits, des chiffres, des noms et un historique.'),
  counterpart: z.string().describe("L'interlocuteur : qui il est, ce qu'il veut, ce qu'il vient de dire mot pour mot."),
  stakes: z.string().describe('Ce qui est en jeu, chiffré.'),
  constraints: z.array(z.string()).describe('Contraintes et informations cachées ou pièges.'),
  prompt: z.string().describe("Ce que l'apprenant doit rédiger exactement."),
})

const criterionSchema = z.object({
  name: z.string(),
  score: z.number().describe('Note de 0 à 10 sur ce critère.'),
  comment: z.string(),
})

export const evaluationSchema = z.object({
  criteria: z.array(criterionSchema).describe("Entre 4 et 6 critères tirés de l'objectif du module."),
  score: z.number().describe('Note globale entière de 0 à 10.'),
  verdict: z.string().describe('Verdict en une ou deux phrases, ton de L’Éminence.'),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  modelAnswer: z.string().describe('La réponse que donnerait un expert de ce palier, mot pour mot.'),
  nextFocus: z.string().describe("Ce que l'apprenant doit travailler en priorité."),
})

// Les sorties structurées n'acceptent ni bornes numériques ni contraintes de longueur.
const UNSUPPORTED_KEYS = ['$schema', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'minLength', 'maxLength', 'minItems', 'maxItems']

function stripUnsupported(node) {
  if (Array.isArray(node)) return node.map(stripUnsupported)
  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node)
        .filter(([key]) => !UNSUPPORTED_KEYS.includes(key))
        .map(([key, value]) => [key, stripUnsupported(value)]),
    )
  }
  return node
}

export const toOutputSchema = (schema) => stripUnsupported(z.toJSONSchema(schema))
