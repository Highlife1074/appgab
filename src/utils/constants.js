// Programme et règles de progression : source unique partagée avec les Cloud Functions.
export * from '../../functions/curriculum/index.js'

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
