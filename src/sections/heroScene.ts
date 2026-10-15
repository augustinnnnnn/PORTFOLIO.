/** Générateurs de silhouettes pour le décor du hero (viewBox 1600 × 1000). */

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Ligne de crête : bruit doux + pics, fermée vers le bas. */
export function ridgePath(seed: number, base: number, amp: number, step = 40, peaks = 3) {
  const rnd = seeded(seed)
  const phase = rnd() * Math.PI * 2
  const pts: string[] = []
  let drift = 0
  for (let x = -40; x <= 1640; x += step) {
    drift += (rnd() - 0.5) * 0.35
    drift *= 0.85
    const wave = Math.abs(Math.sin((x / 1600) * Math.PI * peaks + phase))
    const y = base - wave * amp - drift * amp * 0.4 - rnd() * amp * 0.12
    pts.push(`${x},${y.toFixed(1)}`)
  }
  return `M-40,1000 L${pts.join(' L')} L1640,1000 Z`
}

type Column = { x: number; w: number; top: number; bottom: number; broken: number }

/** Colonnades de part et d'autre de la porte, en perspective. */
export const columns: Column[] = (() => {
  const rnd = seeded(7)
  const out: Column[] = []
  const xs = [70, 215, 345, 460, 545]
  xs.forEach((x, i) => {
    const t = i / (xs.length - 1)
    const w = 64 - t * 36
    const top = 250 + t * 220
    const bottom = 905 - t * 45
    const broken = rnd() < 0.45 ? top + (bottom - top) * (0.2 + rnd() * 0.35) : 0
    out.push({ x, w, top, bottom, broken })
    out.push({ x: 1600 - x, w, top, bottom, broken: rnd() < 0.45 ? top + (bottom - top) * (0.15 + rnd() * 0.3) : 0 })
  })
  return out
})()

export function columnPath(c: Column) {
  const l = c.x - c.w / 2
  const r = c.x + c.w / 2
  if (c.broken) {
    const t = c.broken
    return `M${l},${c.bottom} L${l},${t + 18} L${l + c.w * 0.3},${t} L${l + c.w * 0.55},${t + 26} L${l + c.w * 0.8},${t + 8} L${r},${t + 30} L${r},${c.bottom} Z`
  }
  const cap = c.w * 0.32
  return `M${l},${c.bottom} L${l},${c.top + 22} L${l - cap},${c.top + 10} L${l - cap},${c.top} L${r + cap},${c.top} L${r + cap},${c.top + 10} L${r},${c.top + 22} L${r},${c.bottom} Z`
}

/** Porte monumentale (forme pleine avec ouverture en arc, fill-rule evenodd). */
export const gatePath = [
  'M560,1000 L560,372 L585,352 L585,336 L640,336 L640,262 L700,262 L712,244 L888,244 L900,262 L960,262 L960,336 L1015,336 L1015,352 L1040,372 L1040,1000 Z',
  'M700,1000 L700,560 A100,100 0 0 1 900,560 L900,1000 Z',
].join(' ')

export const gateOpening = 'M700,1000 L700,560 A100,100 0 0 1 900,560 L900,1000'

/** Centre de l'ouverture : point de fuite de la plongée au scroll. */
export const GATE_FOCUS = { x: 800, y: 640 }
