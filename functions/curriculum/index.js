import management from './management.js'
import influence from './influence.js'
import negotiation from './negotiation.js'

export * from './rules.js'
export { LEVEL_NAMES } from './define.js'

export const DOMAINS = {
  management: {
    id: 'management',
    index: 'I',
    label: 'Management Stratégique & Opérationnel',
    short: 'Management',
    levels: management,
  },
  influence: {
    id: 'influence',
    index: 'II',
    label: "Communication d'Influence & Leadership",
    short: 'Influence',
    levels: influence,
  },
  negotiation: {
    id: 'negotiation',
    index: 'III',
    label: 'Négociation Commerciale (B2B)',
    short: 'Négociation',
    levels: negotiation,
  },
}

export const DOMAIN_IDS = Object.keys(DOMAINS)

export const isValidDomain = (domainId) => DOMAIN_IDS.includes(domainId)

export const getLevel = (domainId, level) => DOMAINS[domainId]?.levels[level - 1] ?? null

export const getModule = (domainId, level, moduleId) =>
  getLevel(domainId, level)?.modules.find((module) => module.id === moduleId) ?? null
