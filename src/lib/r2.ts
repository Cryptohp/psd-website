import { AwsClient } from "aws4fetch";

/**
 * Lưu ảnh lên Cloudflare R2 (S3-compatible) và trả về URL công khai.
 * Cần các biến môi trường:
 *   R2_ACCOUNT_ID          - Account ID của Cloudflare
 *   R2_ACCESS_KEY_ID       - Access Key ID (R2 API token)
 *   R2_SECRET_ACCESS_KEY   - Secret Access Key
 *   R2_BUCKET              - Tên bucket
 *   R2_PUBLIC_BASE_URL     - URL công khai của bucket (custom domain hoặc r2.dev), không có "/" cuối
 */

let client: AwsClient | null = null;

function getClient(): AwsClient {
  if (!client) {
    client = new AwsClient({
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      region: "auto",
      service: "s3",
    });
  }
  return client;
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_BASE_URL
  );
}

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const accountId = process.env.R2_ACCOUNT_ID!;
  const bucket = process.env.R2_BUCKET!;
  const publicBase = process.env.R2_PUBLIC_BASE_URL!.replace(/\/$/, "");

  const endpoint = `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`;

  const res = await getClient().fetch(endpoint, {
    method: "PUT",
    body: new Uint8Array(body),
    headers: { "Content-Type": contentType },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`R2 upload failed: ${res.status} ${text.slice(0, 200)}`);
  }

  return `${publicBase}/${key}`;
}
