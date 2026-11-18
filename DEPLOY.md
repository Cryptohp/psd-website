# PSD Website — Yêu cầu chuyển hạ tầng về server riêng

> Tài liệu bàn giao cho đội dev. Cập nhật: 18/11/2026.
> Mã nguồn: GitHub `Cryptohp/psd-website`, nhánh `main`. Tên miền: **psdgroup.vn**.
> Kiến trúc chi tiết của code xem thêm `TECHNICAL.md`.

---

## 1. Hiện trạng

| Thành phần | Đang chạy ở đâu | Ghi chú |
|---|---|---|
| Ứng dụng web + trang quản trị | **Vercel** (gói Pro) | Next.js 16.2.10, React 19, tự deploy khi push `main` |
| Cơ sở dữ liệu | **Neon** (PostgreSQL 18, cloud) | ~10 MB; 45 công ty, 61 tin tức, 47 dự án, 5 dự án phụng sự, 1 sự kiện, 1 user |
| Ảnh upload từ admin | **Vercel Blob** | 384 file, ~438 MB. Gói Hobby từng bị khoá do vượt hạn mức → hiện phải giữ Vercel Pro |
| Ảnh tĩnh của giao diện | Thư mục `public/` trong repo | ~38 MB, đi kèm mã nguồn |
| Tên miền | psdgroup.vn trỏ về Vercel | |

Ứng dụng là **một khối Next.js duy nhất** (trang công khai + `/admin` + API `/api/*`), không có service phụ, không có cron.

## 2. Mục tiêu

1. Chạy toàn bộ website trên server của PSD, **không còn phụ thuộc Vercel** (kể cả Vercel Blob).
2. Không mất dữ liệu: toàn bộ nội dung, ảnh, tài khoản admin giữ nguyên.
3. Thời gian gián đoạn khi chuyển tên miền ≈ 0 (chạy song song, chỉ đổi DNS khi đã nghiệm thu).
4. Có backup tự động và quy trình cập nhật code rõ ràng.

---

## 3. Quyết định cần chốt với chủ dự án trước khi làm

| # | Hạng mục | Phương án khuyến nghị | Phương án thay thế |
|---|---|---|---|
| Q1 | Database | **Giữ Neon** (ổn định, ~0đ ở mức dữ liệu hiện tại, không sửa code) | Tự host PostgreSQL trên server → phải sửa code (mục 5.2) và tự lo backup |
| Q2 | Lưu ảnh | **Lưu trên ổ đĩa server**, Nginx phục vụ trực tiếp | Cloudflare R2 (code mẫu có sẵn `src/lib/r2.ts`) — hợp nếu muốn CDN/không lo dung lượng ổ |
| Q3 | DNS | Trỏ A record `@` và `www` về IP server | Đặt Cloudflare (proxy) phía trước để có CDN + chống DDoS |

Phần còn lại của tài liệu viết theo các phương án **khuyến nghị**; chỗ nào phụ thuộc lựa chọn đều được ghi rõ.

---

## 4. Yêu cầu server

- Ubuntu 22.04/24.04 LTS, tối thiểu **2 vCPU / 4 GB RAM / 40 GB SSD** (build Next.js cần ~2 GB RAM).
- **Node.js 22 LTS** (tối thiểu 20.9), npm.
- **Nginx** (reverse proxy + phục vụ ảnh), **Certbot** (SSL Let's Encrypt), **PM2** (giữ tiến trình).
- Nếu chọn tự host DB (Q1): PostgreSQL **16+** (Neon đang chạy bản 18; `pg_dump` phải cùng bản hoặc mới hơn nguồn).
- Mở cổng 80/443; cổng 3000 chỉ cho localhost.

---

## 5. Các hạng mục công việc

### 5.1 Dựng ứng dụng

```bash
git clone https://github.com/Cryptohp/psd-website.git /var/www/psd-website
cd /var/www/psd-website
cp .env.example .env        # điền giá trị thật (mục 5.5)
npm ci
npm run build               # = prisma migrate deploy && prisma generate && next build
```

- `npm run build` **chạy migration lên DB thật** → cần `DATABASE_URL` đúng ngay lúc build.
- `next.config.ts` bật `output: "standalone"`. Hai cách chạy, chọn một:
  - Đơn giản: `npm run start` (cổng 3000).
  - Gọn nhẹ: chạy `.next/standalone/server.js`, **nhớ copy** `.next/static` → `.next/standalone/.next/static` và `public` → `.next/standalone/public`.
- Quản lý bằng PM2, ví dụ `ecosystem.config.cjs`:

```js
module.exports = { apps: [{
  name: "psd-website",
  cwd: "/var/www/psd-website",
  script: "node_modules/next/dist/bin/next",
  args: "start -p 3000",
  env: { NODE_ENV: "production" },
  max_memory_restart: "1G",
}]};
```

```bash
pm2 start ecosystem.config.cjs && pm2 save && pm2 startup
```

> ⚠️ Không copy `node_modules` từ máy Windows sang server: thư viện `sharp` (xử lý ảnh) có binary riêng theo hệ điều hành. Luôn `npm ci` trên server.

### 5.2 Database

**Nếu giữ Neon (khuyến nghị):** chỉ cần đặt `DATABASE_URL` như hiện tại. Không sửa code.

**Nếu tự host PostgreSQL:**

1. Chuyển dữ liệu:
   ```bash
   pg_dump "<DATABASE_URL Neon>" -Fc --no-owner --no-acl -f psd.dump
   createdb psd_website
   pg_restore -d psd_website --no-owner --no-acl psd.dump
   ```
2. **Sửa code bắt buộc**: `src/lib/prisma.ts` đang dùng `@prisma/adapter-neon` (driver WebSocket của Neon, không chạy với Postgres thường). Đổi sang `@prisma/adapter-pg`:
   ```ts
   import { PrismaPg } from "@prisma/adapter-pg";
   const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
   ```
   (`npm i @prisma/adapter-pg pg`, gỡ `@prisma/adapter-neon`, `@neondatabase/serverless`.)
3. Thiết lập backup hằng ngày (mục 5.8).

### 5.3 Chuyển ảnh khỏi Vercel Blob (bắt buộc để rời Vercel)

Ảnh hiện có URL dạng `https://dvydphvy93rzftwi.public.blob.vercel-storage.com/uploads/<tên-file>`. Các cột DB đang chứa URL này:

| Bảng.cột | Số dòng | Kiểu |
|---|---|---|
| `companies.logo` | 45 | URL |
| `companies.description` | 2 | HTML (ảnh chèn trong nội dung) |
| `news_posts.thumbnail` | 60 | URL |
| `news_posts.content` | 48 | HTML |
| `projects.thumbnail` | 43 | URL |
| `projects.description` | 6 | HTML |
| `social_projects.thumbnail` | 5 | URL |
| `social_projects.description` | 5 | HTML |
| `events.coverImage` | 1 | URL |

Lưu ý: các cột JSON (`companies.images`, `events.settings`...) cũng có thể chứa URL — nên quét toàn bộ cột `text/json/jsonb` bằng `LIKE '%blob.vercel-storage.com%'` trước khi làm.

Các bước:

1. **Tải toàn bộ ảnh** về server, giữ nguyên đường dẫn `uploads/<tên-file>` (dùng `list()` của `@vercel/blob` + token `BLOB_READ_WRITE_TOKEN`, hoặc tải theo danh sách URL lấy từ DB). Lưu vào `/var/www/psd-media/uploads/`.
2. **Đổi URL trong DB** sang domain mới, ví dụ `https://psdgroup.vn/media/uploads/<tên-file>`:
   ```sql
   UPDATE companies SET logo = replace(logo,
     'https://dvydphvy93rzftwi.public.blob.vercel-storage.com/', 'https://psdgroup.vn/media/')
   WHERE logo LIKE '%blob.vercel-storage.com%';
   -- lặp lại cho từng bảng.cột trong bảng trên (cả cột HTML)
   ```
   Chạy trong transaction, **backup DB trước**, kiểm tra số dòng bị ảnh hưởng khớp bảng trên.
3. **Sửa code upload** `src/app/api/upload/route.ts`: thay `put()` của `@vercel/blob` bằng ghi file vào `MEDIA_DIR` (biến môi trường mới) và trả về `${MEDIA_PUBLIC_URL}/uploads/<tên-file>`. Giữ nguyên bước nén `sharp` (resize ≤1600px, WebP q80) và kiểm tra định dạng/dung lượng hiện có.
4. `next.config.ts`: thêm host mới vào `images.remotePatterns` (hiện có `*.public.blob.vercel-storage.com`).
5. Sau khi nghiệm thu: gỡ `@vercel/blob`, và (nếu không dùng R2) gỡ `src/lib/r2.ts` + `aws4fetch`.

> Nếu chọn R2 (Q2): tải ảnh lên bucket R2 thay vì ổ đĩa; route upload dùng sẵn `uploadToR2()` trong `src/lib/r2.ts`; URL mới là `R2_PUBLIC_BASE_URL/uploads/<tên-file>`.

### 5.4 Nginx

```nginx
server {
  server_name psdgroup.vn www.psdgroup.vn;
  client_max_body_size 10m;            # ảnh upload tối đa 5MB

  location /media/ {                    # ảnh upload (mục 5.3)
    alias /var/www/psd-media/;
    expires 30d;
    add_header Cache-Control "public, immutable";
  }

  location /_next/static/ {
    proxy_pass http://127.0.0.1:3000;
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
# + server block port 80 redirect → https; chuyển www → apex
```

SSL: `certbot --nginx -d psdgroup.vn -d www.psdgroup.vn`.

### 5.5 Biến môi trường (`.env` trên server)

| Biến | Bắt buộc | Ghi chú |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon hoặc Postgres tự host |
| `NEXTAUTH_SECRET` | ✅ | Chuỗi ngẫu nhiên dài; **đổi mới** khi lên server (mọi phiên admin sẽ phải đăng nhập lại) |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BASE_URL`, `NEXTAUTH_URL` | ✅ | `https://psdgroup.vn` (dùng tạo link QR sự kiện, export khách mời) |
| `NEXT_PUBLIC_SITE_NAME` | | `PSD Group` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | ✅ | Tài khoản SUPER_ADMIN dự phòng; đặt mật khẩu mạnh |
| `ADMIN_EMAIL_2..10`, `ADMIN_PASSWORD_2..10` | | Tài khoản dự phòng bổ sung |
| `MEDIA_DIR`, `MEDIA_PUBLIC_URL` | ✅ (mới) | Khi lưu ảnh trên ổ đĩa (mục 5.3) |
| `BLOB_READ_WRITE_TOKEN` | tạm | Chỉ cần trong lúc tải ảnh từ Vercel Blob; xoá sau khi chuyển xong |
| `R2_*` | | Chỉ khi chọn R2 |

Biến `NEXT_PUBLIC_*` được nhúng lúc **build** → đổi giá trị thì phải build lại. Giá trị thật do chủ dự án cung cấp qua kênh riêng, **không** gửi qua email/chat chung với mã nguồn.

### 5.6 Chuyển tên miền (không gián đoạn)

1. Trước 24–48h: hạ TTL bản ghi DNS của `psdgroup.vn` xuống 300s.
2. Dựng xong server, kiểm thử bằng IP hoặc tên miền tạm (ví dụ `new.psdgroup.vn`), hoặc sửa file `hosts` trên máy test.
3. **Đóng băng nội dung**: báo admin ngừng đăng/sửa trong lúc chạy chuyển ảnh lần cuối (mục 5.3) để không sót ảnh mới.
4. Đổi bản ghi A `@` và `www` sang IP server → cấp SSL → kiểm thử lại trên tên miền thật.
5. Giữ project Vercel chạy thêm ~1 tuần để dự phòng, sau đó gỡ tên miền khỏi Vercel, xoá Blob store và hạ/huỷ gói Pro.

### 5.7 Quy trình cập nhật code

Thay cho cơ chế tự deploy của Vercel, tạo script `deploy.sh` trên server (hoặc GitHub Actions SSH vào server chạy script):

```bash
cd /var/www/psd-website
git pull origin main
npm ci
npm run build
pm2 reload psd-website
```

Lưu ý `npm run build` chạy `prisma migrate deploy` — migration áp lên DB thật ngay khi build.

### 5.8 Backup & giám sát

- DB: `pg_dump -Fc` hằng ngày, giữ 14 bản, đẩy ra ngoài server (Neon có point-in-time restore riêng, vẫn nên dump định kỳ).
- Ảnh: `rsync` thư mục `/var/www/psd-media` sang nơi lưu trữ khác hằng ngày.
- Giám sát: uptime check cho `https://psdgroup.vn` và `/admin/login`; `pm2 logs`, log Nginx; cảnh báo dung lượng ổ đĩa.

---

## 6. Nghiệm thu

- [ ] Toàn bộ trang công khai trả 200: `/`, `/ve-psd-group/*`, `/linh-vuc-hoat-dong` (5 tab), trang chi tiết công ty, `/du-an`, `/tin-tuc`, `/tuyen-dung`, `/phung-su-xa-hoi`, `/lien-he`, trang sự kiện.
- [ ] Không còn request nào tới `blob.vercel-storage.com` (kiểm tra tab Network + truy vấn DB `LIKE` trả 0 dòng).
- [ ] Ảnh cũ hiển thị đủ: logo công ty, ảnh bìa tin tức/dự án, ảnh chèn trong nội dung bài.
- [ ] Admin: đăng nhập; tạo/sửa/xoá tin tức có **ảnh bìa + ảnh chèn trong nội dung** (thử ảnh >5MB phải được nén/báo lỗi rõ); phân quyền 4 vai trò (EDITOR không vào được Tuyển dụng/Quản lý tài khoản).
- [ ] Sự kiện: QR/link thư mời trỏ đúng `https://psdgroup.vn`; import/export danh sách khách (xlsx).
- [ ] HTTPS hợp lệ, `www` và `http` chuyển hướng về `https://psdgroup.vn`; redirect `/he-sinh-thai` → `/linh-vuc-hoat-dong` còn hoạt động.
- [ ] Backup DB + ảnh chạy được và **đã thử khôi phục** ít nhất 1 lần.
- [ ] Đổi toàn bộ mật khẩu/secret mặc định.

## 7. Phương án quay lui

Giữ nguyên Vercel + Blob + Neon cho tới khi nghiệm thu xong. Nếu có sự cố sau khi đổi DNS: trỏ DNS ngược về Vercel. Vì DNS TTL đã hạ, quay lui có hiệu lực trong ~5 phút. Lưu ý mọi nội dung admin tạo trên server mới **sau** thời điểm đổi DNS sẽ không có ở bản Vercel (nếu đã tách DB).

---

## 8. Lưu ý kỹ thuật

- **Next.js 16 có nhiều thay đổi** so với bản cũ. Tài liệu chuẩn nằm trong `node_modules/next/dist/docs/` — đọc trước khi sửa middleware, route handler, caching.
- `src/middleware.ts` chạy được nhưng Next 16 báo **deprecated** (khuyến nghị đổi tên thành `proxy.ts`). Không chặn việc chuyển server.
- Route động dùng `params: Promise<...>` và phải `await params`.
- Trang chủ dùng `revalidate = 60` (ISR) — chạy bình thường với `next start`, cache nằm trong `.next/` trên server.
- Upload ảnh: trình duyệt tự thu nhỏ ảnh trước khi gửi (`src/lib/clientUpload.ts`, do giới hạn 4.5MB body của Vercel); server nén thêm bằng `sharp`. Trên server riêng giới hạn body do Nginx `client_max_body_size` quyết định.
- Đăng nhập admin: JWT trong cookie `psd_admin_token` (hạn 8h, `secure` khi production → **bắt buộc HTTPS**). Tài khoản trong bảng `users` + tài khoản dự phòng khai trong `.env` (luôn là SUPER_ADMIN).
- Một số nội dung đang **viết cứng trong code**, không quản lý qua admin: danh sách Ban lãnh đạo (`src/app/ve-psd-group/ban-lanh-dao/page.tsx`), mô tả 5 lĩnh vực (`src/app/linh-vuc-hoat-dong/page.tsx`), danh sách tuyển dụng (`src/app/tuyen-dung/JobListings.tsx`, đang rỗng), footer.
- Lĩnh vực trong DB: 5 lĩnh vực đang bật; 3 lĩnh vực (Logistics & Cảng biển, Đầu tư & Dịch vụ, Trách nhiệm xã hội) đang **tắt** (`sectors.isActive = false`), không xoá. 31 công ty đang ẩn (`companies.isActive = false`).
- `docker-compose.yml` trong repo chỉ là Postgres + pgAdmin cho môi trường dev, chưa có Dockerfile cho ứng dụng.

## 9. Thông tin bàn giao (cung cấp riêng, không kèm tài liệu này)

- Quyền truy cập GitHub repo `Cryptohp/psd-website`.
- Giá trị `.env` hiện tại (DATABASE_URL, NEXTAUTH_SECRET, BLOB_READ_WRITE_TOKEN, tài khoản admin).
- Truy cập quản lý DNS của `psdgroup.vn` (PA Việt Nam / Cloudflare).
- Truy cập Vercel (để tải ảnh và gỡ tên miền sau cùng) và Neon (nếu chuyển DB).
- Thông tin SSH server mới.
