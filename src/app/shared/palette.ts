/**
 * Generates a PrimeNG-style 50-950 color scale from a single admin-picked
 * hex color. The input color is used exactly as the "500" shade; the rest
 * of the ladder is derived by holding hue/saturation and stepping lightness,
 * so any hex an admin picks produces a usable, consistent palette without
 * needing a design tool.
 */

const LIGHTNESS_STEPS: Record<string, number> = {
  '50': 97,
  '100': 93,
  '200': 85,
  '300': 74,
  '400': 60,
  '600': 32,
  '700': 26,
  '800': 20,
  '900': 15,
  '950': 8
};

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  const toHex = (v: number) => {
    const n = Math.round((v + m) * 255);
    return n.toString(16).padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generatePalette(baseHex: string): Record<string, string> {
  const { h, s, l } = hexToHsl(baseHex);
  const palette: Record<string, string> = { '500': baseHex };

  for (const [step, targetL] of Object.entries(LIGHTNESS_STEPS)) {
    palette[step] = hslToHex(h, s, targetL);
  }

  return palette;
}
