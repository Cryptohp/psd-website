# PSD Website — Tài liệu kỹ thuật cho Developer

> Website doanh nghiệp đa trang + trang quản trị (admin) có phân quyền. Cập nhật: 11/2026.
> Hướng dẫn chuyển hạ tầng về server riêng: xem `DEPLOY.md`.

---

## 1. Tổng quan & Công nghệ

| Thành phần | Công nghệ | Phiên bản |
|---|---|---|
| Framework | **Next.js (App Router)** | 16.2.10 |
| UI | **React** | 19.2.4 |
| Ngôn ngữ | **TypeScript** | 5 |
| CSS | **Tailwind CSS** | 4 |
| ORM / DB | **Prisma** + PostgreSQL | Prisma 7.8 |
| Animation | framer-motion | 12 |
| Rich text (admin) | TipTap | 3 |
| Auth | JWT tự ký (jose) | 6 |
| Lưu ảnh | **Vercel Blob** (`@vercel/blob`) | 2.6 |
| Xử lý ảnh | sharp (nén WebP khi upload) | 0.34 |
| Khác | qrcode (QR sự kiện), xlsx (xuất khách mời) | — |

> ⚠️ **Next.js 16 có thay đổi so với các bản cũ.** Tài liệu API nằm sẵn trong
> `node_modules/next/dist/docs/`. Đọc trước khi sửa các phần middleware, route handler, caching.

---

## 2. Yêu cầu môi trường
- Node.js **20+** (khuyến nghị 20/22)
- PostgreSQL (Neon hoặc tự host)
- Vercel Blob (token `BLOB_READ_WRITE_TOKEN`) để lưu ảnh upload

---

## 3. Cấu trúc thư mục

```
src/
├─ app/
│  ├─ (các trang public)   ve-psd-group, linh-vuc-hoat-dong, du-an,
│  │                        tin-tuc, tuyen-dung, phung-su-xa-hoi, su-kien,
│  │                        lien-he, cong-ty-thanh-vien, check-in ...
│  ├─ admin/               Trang quản trị (bảo vệ bằng middleware theo vai trò)
│  │  ├─ layout.tsx        Lấy session, render sidebar/header theo vai trò
│  │  ├─ login/            Đăng nhập
│  │  ├─ tai-khoan/        Quản lý tài khoản (chỉ SUPER_ADMIN)
│  │  └─ (tin-tuc, du-an, he-sinh-thai, phung-su, lanh-dao, su-kien,
│  │      tuyen-dung, lien-he, cai-dat)
│  ├─ api/                 Route handlers (REST)
│  ├─ layout.tsx           Root layout (font, PublicLayout)
│  └─ page.tsx             Trang chủ
├─ components/
│  ├─ home/                Các section trang chủ (Hero, Ecosystem, Partners...)
│  ├─ layout/              Header, Footer, PublicLayout, PageTransition
│  ├─ admin/               AdminSidebar, AdminHeader
│  └─ ui/                  Thành phần dùng chung
├─ lib/
│  ├─ prisma.ts            Khởi tạo Prisma (Neon adapter)
│  ├─ auth.ts              Ký/verify JWT, getAdminSession
│  ├─ permissions.ts       Định nghĩa vai trò + ma trận truy cập
│  ├─ password.ts          Băm mật khẩu (scrypt)
│  ├─ clientUpload.ts      Thu nhỏ ảnh phía trình duyệt rồi gọi /api/upload
│  └─ r2.ts                (Chưa dùng) helper upload Cloudflare R2, giữ làm phương án
├─ middleware.ts           Chặn /admin, /check-in theo vai trò
prisma/
├─ schema.prisma           Mô hình dữ liệu
└─ migrations/             Lịch sử migration
scripts/                   seed-*.ts, compress-images.mjs
public/                    Ảnh tĩnh, logo
```

---

## 4. Biến môi trường

Copy `.env.example` → `.env`. Các biến:

| Biến | Ý nghĩa |
|---|---|
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL (Neon) |
| `NEXTAUTH_SECRET` | Khoá ký JWT (chuỗi ngẫu nhiên dài) |
| `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BASE_URL` | URL site (dùng cho link tuyệt đối, QR sự kiện) |
| `NEXT_PUBLIC_SITE_NAME` | Tên site |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Tài khoản admin dự phòng (luôn là SUPER_ADMIN) |
| `ADMIN_EMAIL_2..10`, `ADMIN_PASSWORD_2..10` | Tài khoản dự phòng bổ sung (tuỳ chọn) |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob (lưu ảnh upload) |
| `R2_*` | (Tuỳ chọn, chưa dùng) cấu hình Cloudflare R2 |

> `.env` chứa bí mật — KHÔNG commit, KHÔNG đóng gói. Prisma tự nạp `.env`.

---

## 5. Database (Prisma)

**Models:** User, Sector, Company, Project, NewsCategory, NewsPost, Leader, Job,
Application, Lead, Partner, SocialProject, Event, Guest, Rsvp, CheckIn,
EventSchedule, SiteSetting. **Enums:** UserRole, ProjectStatus, JobType,
EventStatus, AttendanceStatus, CheckInStatus.

**Lệnh:**
```bash
npx prisma generate          # sinh Prisma Client
npx prisma migrate deploy    # áp dụng migration lên DB (production)
npx prisma migrate dev       # tạo + áp migration khi phát triển
npx prisma studio            # GUI xem/sửa dữ liệu
```
Seed dữ liệu mẫu: các script trong `scripts/` (chạy bằng `tsx`/`ts-node` nếu cần).

> `prisma.ts` dùng **Neon adapter** (`@prisma/adapter-neon`). Nếu chuyển sang Postgres
> tự host thường, cần đổi adapter (ví dụ `@prisma/adapter-pg`) trong `src/lib/prisma.ts`.

---

## 6. Xác thực & Phân quyền (RBAC)

- Đăng nhập tại `/admin/login` → gọi `POST /api/admin/login`.
- Xác thực: (1) tìm user trong bảng `users` (mật khẩu băm scrypt); (2) nếu không có,
  đối chiếu tài khoản trong `.env` → cấp vai trò **SUPER_ADMIN** (dự phòng, tránh khoá ngoài).
- Phiên: **JWT** (jose) lưu trong cookie `psd_admin_token`, hạn **8 giờ**, `httpOnly`.
- `middleware.ts` bảo vệ `/admin/*` và `/check-in/*`, kiểm tra vai trò theo `lib/permissions.ts`.

**4 vai trò** (enum `UserRole`): `SUPER_ADMIN`, `ADMIN`, `EDITOR`, `HR`.

| Mục admin | SUPER_ADMIN | ADMIN | EDITOR | HR |
|---|:-:|:-:|:-:|:-:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Tin tức / Dự án / Hệ sinh thái / Phụng sự / Lãnh đạo / Sự kiện | ✅ | ✅ | ✅ | ❌ |
| Tuyển dụng | ✅ | ✅ | ❌ | ✅ |
| Liên hệ & Leads | ✅ | ✅ | ❌ | ❌ |
| Cài đặt | ✅ | ✅ | ❌ | ❌ |
| Quản lý tài khoản | ✅ | ❌ | ❌ | ❌ |

- Sidebar tự ẩn mục ngoài quyền; vào URL không đủ quyền → chuyển về `/admin`.
- Quản lý người dùng: `/admin/tai-khoan` (UI) + `POST/PATCH/DELETE /api/admin/users`.

> **Lưu ý bảo mật:** middleware chặn ở cấp **trang** `/admin/*` (kể cả server action).
> Các endpoint dưới `/api/admin/*` KHÔNG nằm sau middleware — chỉ `users` được kiểm tra
> vai trò trong code. Nếu cần khoá chặt API theo vai trò, thêm `getAdminSession()` +
> kiểm tra role vào từng route (khuyến nghị khi mở rộng).

---

## 7. Lưu trữ ảnh (Vercel Blob)

- Phía trình duyệt: `src/lib/clientUpload.ts` thu nhỏ ảnh (≤1920px, WebP) trước khi gửi,
  để request không vượt giới hạn ~4.5MB body của Vercel. Dùng chung cho ảnh bìa, grid ảnh,
  ảnh chèn trong trình soạn thảo, ảnh sự kiện.
- Server: `POST /api/upload` (multipart, field `file`) → kiểm tra định dạng (jpg/png/webp/gif
  ≤5MB) → **sharp: resize ≤1600px + WebP q80** → `put()` lên Vercel Blob → trả `{ url }`.
  GIF giữ nguyên (bảo toàn animation).
- URL ảnh lưu trong DB: `companies.logo`, `news_posts.thumbnail`, `projects.thumbnail`,
  `social_projects.thumbnail`, `events.coverImage` và nhúng trong HTML nội dung
  (`news_posts.content`, `projects.description`...). Hiển thị qua `next/image` `unoptimized`.
- Hiện có ~384 file (~438MB). Vercel Blob tính phí theo gói Vercel — gói Hobby từng bị khoá
  do vượt hạn mức, hiện đang dùng gói Pro.

---

## 8. Danh sách Route

**Trang public:** `/`, `/ve-psd-group/*`, `/linh-vuc-hoat-dong` (+`?tab=<slug>`),
`/linh-vuc-hoat-dong/[slug]` (công ty), `/du-an`, `/tin-tuc`, `/tuyen-dung`,
`/phung-su-xa-hoi`, `/su-kien/*`, `/lien-he`, `/cong-ty-thanh-vien/[id]`,
`/check-in/[slug]`, `/chinh-sach-bao-mat`, `/dieu-khoan-su-dung`.

**API chính:**
- Nội dung: `/api/tin-tuc`, `/api/du-an`, `/api/sectors`, `/api/cong-ty`,
  `/api/lanh-dao`, `/api/phung-su` (+ `/[id]`).
- Sự kiện: `/api/admin/su-kien/*` (gồm import/export khách mời qua xlsx),
  `/api/public/su-kien/[slug]` + `/rsvp` (RSVP công khai), `/api/check-in`.
- Hệ thống: `/api/admin/login`, `/api/admin/logout`, `/api/admin/users(+/[id])`,
  `/api/upload`.

Route động dùng `params: Promise<{...}>` và phải `await params` (chuẩn Next 16).

---

## 9. Chạy & Build

```bash
npm install
# điền .env
npx prisma generate && npx prisma migrate deploy
npm run dev            # phát triển: http://localhost:3000
npm run build          # build production (chạy migrate deploy + generate + next build)
npm run start          # chạy production, cổng 3000
```

`next.config.ts` bật `output: "standalone"` → có thể chạy `node .next/standalone/server.js`
(nhớ copy kèm `.next/static` và `public`). `images.remotePatterns` đã cho phép Unsplash và
`*.public.blob.vercel-storage.com`; nếu đổi nơi lưu ảnh, thêm host mới vào `remotePatterns`.

---

## 10. Triển khai lên server

Hiện đang chạy trên **Vercel** (tự deploy khi push `main`). Kế hoạch chuyển về server riêng
(Node + PM2 + Nginx, chuyển ảnh khỏi Vercel Blob, đổi DNS, backup, nghiệm thu) xem chi tiết
trong **`DEPLOY.md`**.

---

## 11. Vận hành & Bảo mật (bắt buộc kiểm trước khi go-live)
- Đổi **tất cả** secret/mật khẩu mặc định: `NEXTAUTH_SECRET`, `ADMIN_PASSWORD`, token Blob, DB.
- Đảm bảo cookie chạy trên **HTTPS** (`secure` bật khi `NODE_ENV=production`).
- Theo dõi hạn mức lưu trữ/băng thông của nơi lưu ảnh.
- Cảnh báo build: `middleware` bị Next 16 báo deprecated (khuyến nghị đổi tên thành
  `proxy`) — hiện vẫn chạy, chỉ là cảnh báo.

---

## 12. Sự cố đã biết / Lịch sử
- Vercel Blob store từng bị **đình chỉ do vượt hạn mức gói Hobby** (ảnh gốc 3–4MB/ảnh).
  Đã nâng Vercel Pro để mở lại, và thêm nén ảnh ở cả trình duyệt lẫn server khi upload.
- Ảnh chèn trong nội dung bài từng upload "im lặng" thất bại với ảnh lớn (giới hạn body
  4.5MB của Vercel) → đã sửa bằng `clientUpload.ts` + hiển thị lỗi rõ ràng.
- Lĩnh vực: còn 5 lĩnh vực hoạt động (BĐS & Hạ tầng, Thương mại, Khoáng sản, Nông nghiệp &
  Thủy sản, Du lịch & Sinh thái); 3 lĩnh vực cũ đang tắt (`sectors.isActive = false`).
  31 công ty đang ẩn (`companies.isActive = false`).
- Trang **Tuyển dụng công khai** hiện đọc dữ liệu tĩnh trong code (mảng `jobs` đang rỗng),
  chưa nối với bảng `Job` trong DB — nếu cần hiển thị vị trí quản lý từ admin, phải nối API.
