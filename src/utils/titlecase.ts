// Accounts for small words that are not capitalized unless they are the first or last word in the string.
export const toTitleCase = (str: string | undefined) => {
  if (str === undefined) {
    return ''
  }

  const smallWords = new Set([
    'a',
    'an',
    'and',
    'as',
    'at',
    'but',
    'by',
    'for',
    'in',
    'of',
    'on',
    'or',
    'the',
    'to',
    'with',
  ])

  return str
    .toLowerCase()
    .split(' ')
    .map((word, index, array) => {
      if (index === 0 || index === array.length - 1 || !smallWords.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      return word
    })
    .join(' ')
}
