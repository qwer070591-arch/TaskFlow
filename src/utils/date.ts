const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/

export function getValidIsoDate(value?: string) {
  if (!value) return undefined

  const match = value.match(isoDatePattern)
  if (!match) return undefined

  const date = match[0].slice(0, 10)
  const parsed = new Date(`${date}T00:00:00Z`)

  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date
    ? undefined
    : date
}
