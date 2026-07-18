import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";

const DIRS = [
  "public/anh-bia-cty-thanh-vien",
  "public/Ban-lanh-dao",
  "public",
];

// Hero trang chủ — giữ nguyên PNG/JPG
const SKIP = new Set([
  "home-hero-06.png",
  "home-hero-02.jpg",
  "mobile-hero-trang-chu-03.png",
  "mobile-home-hero-02.jpg",
]);

let totalBefore = 0;
let totalAfter = 0;
let skipped = 0;

for (const dir of DIRS) {
  const files = await readdir(dir);
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;
    if (SKIP.has(file)) { skipped++; continue; }

    const inputPath = join(dir, file);
    // Skip if already converted (webp sibling exists)
    const outputPath = join(dir, basename(file, ext) + ".webp");
    try { await stat(outputPath); continue; } catch {}

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

console.log(`\nBỏ qua (hero trang chủ): ${skipped} file`);
console.log(`Tổng mới: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB  (giảm ${((totalBefore-totalAfter)/1024/1024)|0}MB)`);
