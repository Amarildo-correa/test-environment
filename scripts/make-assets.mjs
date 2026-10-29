// Gera o banner e os ícones do app (Android TV e Vega) e as imagens da loja
// a partir de SVG. Uso: cd scripts && node make-assets.mjs
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORANGE = '#FF6A00';
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const FONT = 'DejaVu Sans';

// Logotipo em uma linha: "Hello" laranja + "World" branco, com "TV" abaixo.
// A largura do texto fica em ~65% da imagem, dentro da área segura do ícone
// de Fire TV (882×448 em 1280×720).
function wideSvg(width, height, { tagline = true } = {}) {
  const size = Math.round(width * 0.1);
  const tv = Math.round(size * 0.45);
  const base = Math.round(height * (tagline ? 0.52 : 0.58));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="${BLACK}"/>
  <text x="50%" y="${base}" text-anchor="middle" font-family="${FONT}" font-weight="bold" font-size="${size}" xml:space="preserve"><tspan fill="${ORANGE}">Hello </tspan><tspan fill="${WHITE}">World</tspan></text>
  ${tagline ? `<text x="50%" y="${base + tv * 1.8}" text-anchor="middle" font-family="${FONT}" font-weight="bold" font-size="${tv}" fill="${ORANGE}" letter-spacing="${tv * 0.3}">TV</text>` : ''}
</svg>`;
}

// Ícone quadrado: "Hello" sobre "World" e "TV" embaixo.
function squareSvg(size) {
  const word = Math.round(size * 0.22);
  const tv = Math.round(size * 0.13);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="100%" height="100%" fill="${BLACK}"/>
  <text x="50%" y="${size * 0.38}" text-anchor="middle" font-family="${FONT}" font-weight="bold" font-size="${word}" fill="${ORANGE}">Hello</text>
  <text x="50%" y="${size * 0.62}" text-anchor="middle" font-family="${FONT}" font-weight="bold" font-size="${word}" fill="${WHITE}">World</text>
  <text x="50%" y="${size * 0.84}" text-anchor="middle" font-family="${FONT}" font-weight="bold" font-size="${tv}" fill="${ORANGE}" letter-spacing="${tv * 0.3}">TV</text>
</svg>`;
}

// Saída sempre opaca (sem canal alfa): a loja recusa transparência em vários assets.
async function render(svg, file) {
  const out = join(root, file);
  mkdirSync(dirname(out), { recursive: true });
  await sharp(Buffer.from(svg)).flatten({ background: BLACK }).png().toFile(out);
  console.log('ok', file);
}

const res = 'androidtv/android/app/src/main/res';

// Banner do Android TV: 320×180 em xhdpi.
await render(wideSvg(320, 180), `${res}/drawable-xhdpi/tv_banner.png`);

// Ícones de launcher.
const densities = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
for (const [density, size] of Object.entries(densities)) {
  await render(squareSvg(size), `${res}/mipmap-${density}/ic_launcher.png`);
  await render(squareSvg(size), `${res}/mipmap-${density}/ic_launcher_round.png`);
}

// Imagens da Amazon Appstore.
await render(squareSvg(512), 'release/assets/icon-512x512.png');
await render(squareSvg(114), 'release/assets/icon-114x114.png');
await render(wideSvg(1280, 720), 'release/assets/firetv-icon-1280x720.png');
await render(wideSvg(1920, 1080, { tagline: false }), 'release/assets/firetv-background-1920x1080.png');

// Ícone do app Vega (manifest.toml → assets/image/app_icon.png), se o projeto já existir.
if (existsSync(join(root, 'vega'))) {
  await render(squareSvg(512), 'vega/assets/image/app_icon.png');
}
