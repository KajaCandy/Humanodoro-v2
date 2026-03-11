import sharp from "sharp";
import { statSync, unlinkSync } from "fs";
import { join } from "path";

const SRC = "E:\\Projects\\Humanodoro\\Website\\Animation";

await sharp(join(SRC, "0002.png"))
  .webp({ quality: 100, effort: 3 })
  .toFile("public/animations/pad-landing/test.webp");

const s = statSync("public/animations/pad-landing/test.webp").size;
console.log(`quality 100 full res: ${Math.round(s / 1024)}KB → ~${Math.round(s * 249 / 1024 / 1024)}MB total`);
unlinkSync("public/animations/pad-landing/test.webp");
