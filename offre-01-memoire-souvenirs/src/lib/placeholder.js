// Emplacements photo de la simulation : un dégradé « tirage » propre à chaque photo,
// calculé à partir de son identifiant. Les vraies photos remplaceront ces emplacements.
const PALETTES = [
  ['#203f8c', '#86a6e3'],
  ['#2f4c6b', '#a1c3d8'],
  ['#55436b', '#c7aacb'],
  ['#7d521f', '#eec680'],
  ['#265d51', '#97cfc1'],
  ['#41445f', '#cdb1aa'],
  ['#68463d', '#e2ae93'],
  ['#284f63', '#efd0ad'],
]

export function hashString(value) {
  let h = 2166136261
  const s = String(value)
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function random(seed) {
  let s = seed || 1
  return () => {
    s ^= s << 13
    s >>>= 0
    s ^= s >>> 17
    s ^= s << 5
    s >>>= 0
    return (s % 10000) / 10000
  }
}

export function placeholderStyle(seed) {
  const h = hashString(seed)
  const [from, to] = PALETTES[h % PALETTES.length]
  const r = random(h)
  const lights = Array.from({ length: 4 }, () => {
    const x = Math.round(r() * 100)
    const y = Math.round(r() * 100)
    const size = Math.round(16 + r() * 34)
    const alpha = (0.08 + r() * 0.2).toFixed(2)
    return `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,${alpha}) 0, rgba(255,255,255,0) ${size}%)`
  })
  const angle = Math.round(r() * 360)
  return { backgroundImage: `${lights.join(', ')}, linear-gradient(${angle}deg, ${from}, ${to})` }
}
