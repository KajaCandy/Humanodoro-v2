import sharp from "sharp";
import { mkdirSync } from "fs";
import { join } from "path";

const SRC   = "E:\\Projects\\Humanodoro\\Website\\Animation";
const DEST  = "public/animations/pad-landing";
const FIRST = 1;
const LAST  = 40;
const BATCH = 6;

mkdirSync(DEST, { recursive: true });

let done = 0;

async function convertFrame(i) {
  const num  = String(i).padStart(4, "0");
  const src  = join(SRC, `${num}.png`);
  const dest = join(DEST, `${num}.webp`);

  await sharp(src)
    .webp({ quality: 100, effort: 3 })
    .toFile(dest);

  done++;
  process.stdout.write(`\r  ${done}/${LAST - FIRST + 1} converted...`);
}

for (let i = FIRST; i <= LAST; i += BATCH) {
  const batch = [];
  for (let j = i; j < Math.min(i + BATCH, LAST + 1); j++) batch.push(convertFrame(j));
  await Promise.all(batch);
}

console.log(`\n  Done — frames ${FIRST}–${LAST} converted`);
