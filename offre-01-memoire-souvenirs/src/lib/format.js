const nf = new Intl.NumberFormat('fr-FR')
const df = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export const num = (n) => nf.format(n)

export const fcfa = (n) => `${nf.format(n)} F CFA`

export function plural(n, one, many) {
  return `${nf.format(n)} ${n > 1 ? many : one}`
}

export const formatDate = (iso) => df.format(new Date(iso))

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function relDate(iso) {
  const days = Math.round((startOfDay(new Date()) - startOfDay(iso)) / 86400000)
  if (days <= 0) return 'aujourd’hui'
  if (days === 1) return 'hier'
  if (days < 7) return `il y a ${days} jours`
  return `le ${df.format(new Date(iso))}`
}

export function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export function slugify(text) {
  const slug = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'espace'
}

export function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

export function fileSize(bytes) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Go`
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Mo`
  return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString('fr-FR')} Ko`
}
