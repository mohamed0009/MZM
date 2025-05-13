// Fonction pour déterminer si un prénom est masculin ou féminin
// Cette fonction est simplifiée et basée sur des terminaisons communes en français
export function isMaleName(firstName: string): boolean {
  // Convertir en minuscules pour la comparaison
  const name = firstName.toLowerCase().trim()

  // Liste de prénoms féminins courants qui pourraient être ambigus
  const femaleNames = [
    "marie",
    "sophie",
    "julie",
    "anne",
    "claire",
    "laure",
    "camille",
    "fatima",
    "amina",
    "leila",
    "nadia",
    "samira",
    "karima",
    "yasmine",
    "aïcha",
    "khadija",
    "salma",
    "sara",
    "meryem",
    "naima",
  ]

  // Si le prénom est dans la liste des prénoms féminins
  if (femaleNames.includes(name)) {
    return false
  }

  // Terminaisons typiquement féminines en français
  const femaleEndings = ["a", "e", "ie", "ée", "ine", "ette", "elle", "enne"]

  // Vérifier les terminaisons
  for (const ending of femaleEndings) {
    if (name.endsWith(ending)) {
      // Exceptions pour certains prénoms masculins qui se terminent par ces lettres
      if (
        name === "mohamed" ||
        name === "andre" ||
        name === "pierre" ||
        name === "philippe" ||
        name === "stephane" ||
        name === "hervé" ||
        name === "rené" ||
        name === "amine" ||
        name === "youssef"
      ) {
        return true
      }
      return false
    }
  }

  // Par défaut, considérer comme masculin
  return true
}

// Fonction pour obtenir l'URL de l'avatar en fonction du genre
export function getAvatarUrl(firstName: string): string {
  if (isMaleName(firstName)) {
    return "/avatars/male-avatar.png"
  } else {
    return "/avatars/female-avatar.png"
  }
}

// Fonction pour obtenir les initiales à partir du nom complet
export function getInitials(fullName: string): string {
  if (!fullName) return "U"

  const names = fullName.split(" ")
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase()
  }

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}
