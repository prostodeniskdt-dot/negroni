import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const [sourceArg, destinationArg] = process.argv.slice(2);
if (!sourceArg || !destinationArg) {
  throw new Error('Usage: node scripts/prepare-public-assets.mjs <source> <destination>');
}
const source = path.resolve(sourceArg);
const destination = path.resolve(destinationArg);
if (destination === source || destination.startsWith(source + path.sep)) {
  throw new Error('The destination must be outside the source directory.');
}

const files = [];
async function collect(directory, relative = '') {
  await mkdir(path.join(destination, relative), { recursive: true });
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = path.join(relative, entry.name);
    if (entry.isDirectory()) await collect(path.join(source, name), name);
    else if (entry.isFile()) files.push(name);
    else throw new Error(`Unsupported asset: ${name}`);
  }
}
await collect(source);

let cursor = 0;
let originalBytes = 0;
let outputBytes = 0;
let optimized = 0;
sharp.concurrency(2);

async function worker() {
  while (cursor < files.length) {
    const relative = files[cursor++];
    const input = path.join(source, relative);
    const output = path.join(destination, relative);
    const original = await readFile(input);
    const extension = path.extname(relative).toLowerCase();
    let result = original;
    // Keep logos, small images, video and other assets byte-for-byte intact.
    const photo = /\.(jpe?g|png)$/i.test(relative)
      && !/^images[\\/](logo|partners)[\\/]/i.test(relative);
    if (photo && original.length > 512 * 1024) {
      let image = sharp(original).rotate().resize({
        width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true,
      });
      image = extension === '.png'
        ? image.png({ compressionLevel: 9, adaptiveFiltering: true })
        : image.jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' });
      const candidate = await image.toBuffer();
      if (candidate.length < original.length * 0.95) {
        result = candidate;
        optimized++;
      }
    }
    if (result === original) await copyFile(input, output);
    else await writeFile(output, result);
    originalBytes += original.length;
    outputBytes += result.length;
  }
}
await Promise.all([worker(), worker()]);
console.log(JSON.stringify({
  files: files.length,
  optimized,
  originalBytes,
  outputBytes,
  savedBytes: originalBytes - outputBytes,
}));
