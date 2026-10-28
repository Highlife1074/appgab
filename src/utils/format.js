const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })

export const formatDate = (millis) => dateFormatter.format(new Date(millis))
