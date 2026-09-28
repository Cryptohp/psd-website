/**
 * Tiện ích upload ảnh (chạy phía trình duyệt).
 *
 * Vì Vercel Serverless giới hạn body request ~4.5MB, ta thu nhỏ ảnh ngay trên
 * trình duyệt trước khi gửi để request luôn nhỏ, tránh lỗi upload với ảnh lớn.
 * Server vẫn nén lại (sharp) nên kết quả cuối cùng nhẹ.
 */

const MAX_DIM = 1920; // cạnh dài tối đa (px) trước khi upload

export async function prepareImageForUpload(file: File): Promise<File> {
  // GIF (có thể là ảnh động) hoặc file không phải ảnh: giữ nguyên
  if (file.type === "image/gif" || !file.type.startsWith("image/")) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file; // trình duyệt không đọc được → để server xử lý
  }

  const { width, height } = bitmap;
  const longest = Math.max(width, height);

  // Đã nhỏ sẵn thì không cần xử lý
  if (longest <= MAX_DIM && file.size <= 3_000_000) {
    bitmap.close();
    return file;
  }

  const scale = Math.min(1, MAX_DIM / longest);
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85)
  );
  if (!blob) return file;

  const base = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${base}.webp`, { type: "image/webp" });
}

/** Thu nhỏ (nếu cần) rồi upload, trả về URL ảnh. Ném lỗi có thông báo nếu thất bại. */
export async function uploadImage(file: File): Promise<string> {
  const prepared = await prepareImageForUpload(file);
  const fd = new FormData();
  fd.append("file", prepared);

  let res: Response;
  try {
    res = await fetch("/api/upload", { method: "POST", body: fd });
  } catch {
    throw new Error("Lỗi kết nối khi tải ảnh");
  }

  let data: { url?: string; error?: string } = {};
  try {
    data = await res.json();
  } catch {
    /* body rỗng (vd 413 quá lớn) */
  }

  if (!res.ok || !data.url) {
    if (res.status === 413) throw new Error("Ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn");
    throw new Error(data.error || "Tải ảnh thất bại");
  }
  return data.url;
}
