export const LEVEL_NAMES = [
  'Fondations',
  'Praticien',
  'Confirmé',
  'Aguerri',
  'Senior',
  'Dirigeant',
  'Dirigeant aguerri',
  'Stratège',
  'Référence',
  'Maître',
]

// Transforme une liste compacte [titre, contenu] en modules identifiés m1…m6.
export const defineLevels = (levels) =>
  levels.map((level, index) => ({
    level: index + 1,
    name: LEVEL_NAMES[index],
    title: level.title,
    standard: level.standard,
    modules: level.modules.map(([title, focus], moduleIndex) => ({
      id: `m${moduleIndex + 1}`,
      title,
      focus,
    })),
  }))
