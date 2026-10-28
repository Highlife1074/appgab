export const MAX_LEVEL = 10
export const PASS_THRESHOLD = 8

export const DOMAINS = {
  management: {
    id: 'management',
    index: 'I',
    label: 'Management Stratégique & Opérationnel',
    short: 'Management',
  },
  influence: {
    id: 'influence',
    index: 'II',
    label: "Communication d'Influence & Leadership",
    short: 'Influence',
  },
  negotiation: {
    id: 'negotiation',
    index: 'III',
    label: 'Négociation Commerciale (B2B)',
    short: 'Négociation',
  },
}

export const DOMAIN_IDS = Object.keys(DOMAINS)

export const isValidDomain = (domainId) => DOMAIN_IDS.includes(domainId)

export const SIMULATION_PHASE = {
  IDLE: 'idle',
  LOADING_COURSE: 'loading_course',
  COURSE: 'course',
  LOADING_CHALLENGE: 'loading_challenge',
  CHALLENGE: 'challenge',
  EVALUATING: 'evaluating',
  EVALUATED: 'evaluated',
  ERROR: 'error',
}

export const MIN_RESPONSE_LENGTH = 80
