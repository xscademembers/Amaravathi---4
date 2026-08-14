/**
 * Compresses public/ images into public/optimized/ as WebP + JPEG fallbacks.
 * Run: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OUT_DIR = path.join(PUBLIC_DIR, 'optimized');

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

/** Max width by filename pattern — keeps visual clarity while cutting file size */
function maxWidthFor(file) {
  const base = path.basename(file).toLowerCase();
  if (base.includes('dsc05370')) return 1920; // hero
  if (base.includes('dsc05341') || base.includes('dsc05343')) return 1400;
  if (base.endsWith('.png')) return 1200;
  return 960;
}

async function optimizeFile(filePath) {
  const rel = path.relative(PUBLIC_DIR, filePath);
  const base = path.basename(rel, path.extname(rel));
  const outWebp = path.join(OUT_DIR, `${base}.webp`);
  const outJpg = path.join(OUT_DIR, `${base}.jpg`);

  const maxW = maxWidthFor(filePath);
  const pipeline = sharp(filePath).rotate().resize({
    width: maxW,
    withoutEnlargement: true,
    fit: 'inside',
  });

  await pipeline.clone().webp({ quality: 85, effort: 4 }).toFile(outWebp);
  await pipeline
    .clone()
    .jpeg({ quality: 85, mozjpeg: true, progressive: true })
    .toFile(outJpg);

  const [origStat, webpStat, jpgStat] = await Promise.all([
    stat(filePath),
    stat(outWebp),
    stat(outJpg),
  ]);

  const kb = (n) => (n / 1024).toFixed(0);
  console.log(
    `${rel}: ${kb(origStat.size)}KB → webp ${kb(webpStat.size)}KB / jpg ${kb(jpgStat.size)}KB`,
  );
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'optimized') continue;
      files.push(...(await walk(full)));
    } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const files = await walk(PUBLIC_DIR);
  console.log(`Optimizing ${files.length} images...\n`);
  for (const file of files) {
    await optimizeFile(file);
  }
  console.log('\nDone. Optimized images saved to public/optimized/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
