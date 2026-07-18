import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";

const DIRS = [
  "public/anh-bia-cty-thanh-vien",
  "public/Ban-lanh-dao",
];

let totalBefore = 0;
let totalAfter = 0;

for (const dir of DIRS) {
  const files = await readdir(dir);
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;

    const inputPath = join(dir, file);
    const outputPath = join(dir, basename(file, ext) + ".webp");

    const before = (await stat(inputPath)).size;

    await sharp(inputPath)
      .webp({ quality: 82 })
      .toFile(outputPath);

    const after = (await stat(outputPath)).size;
    totalBefore += before;
    totalAfter += after;

    const saved = Math.round((1 - after / before) * 100);
    console.log(`${file} → webp  ${(before/1024/1024).toFixed(1)}MB → ${(after/1024/1024).toFixed(1)}MB  (-${saved}%)`);
  }
}

console.log(`\nTổng: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB  (giảm ${(totalBefore-totalAfter)/1024/1024|0}MB)`);
