#!/usr/bin/env node
// Post-build image optimizer for CAALR.
//
// Runs automatically after `astro build` (see the "build" script in
// package.json). It resizes and recompresses every image the CMS dropped into
// dist/uploads so the DEPLOYED copies are small and fast to load, while the
// full-size originals stay untouched in git.
//
// It is idempotent: each Netlify build starts from a fresh checkout of the
// originals, so re-running it never compounds quality loss. Your mom keeps
// uploading normal full-size photos through the CMS — this just makes the
// published versions lightweight.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = 'dist/uploads';
const MAX_WIDTH = 1600; // plenty for full-screen viewing of a photo
const JPEG_QUALITY = 80;
const PROCESS = new Set(['.jpg', '.jpeg', '.png']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const mb = (n) => (n / 1048576).toFixed(1);

let before = 0;
let after = 0;
let count = 0;

try {
  for await (const file of walk(ROOT)) {
    if (!PROCESS.has(extname(file).toLowerCase())) continue;

    const input = await readFile(file);
    const ext = extname(file).toLowerCase();

    let output;
    try {
      const meta = await sharp(input).metadata();
      let pipeline = sharp(input).rotate(); // bake in EXIF orientation
      if (meta.width && meta.width > MAX_WIDTH) {
        pipeline = pipeline.resize({ width: MAX_WIDTH });
      }
      pipeline =
        ext === '.png'
          ? pipeline.png({ compressionLevel: 9, palette: true })
          : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true });
      output = await pipeline.toBuffer();
    } catch {
      // Not a real/supported image (e.g. a misnamed file) — leave it as-is.
      console.warn(`[optimize-images] skipped unreadable image: ${file}`);
      continue;
    }

    before += input.length;
    // Only overwrite when we actually shaved off bytes.
    if (output.length < input.length) {
      await writeFile(file, output);
      after += output.length;
    } else {
      after += input.length;
    }
    count += 1;
  }

  const saved = before ? Math.round((1 - after / before) * 100) : 0;
  console.log(
    `[optimize-images] ${count} images: ${mb(before)} MB -> ${mb(after)} MB (${saved}% smaller)`,
  );
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log('[optimize-images] no dist/uploads directory — nothing to do');
  } else {
    throw err;
  }
}
