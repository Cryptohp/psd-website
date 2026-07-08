// layout
import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import PublicLayout from "@/components/layout/PublicLayout";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PSD Group – Kiến tạo thịnh vượng, Phụng sự xã hội",
    template: "%s | PSD Group",
  },
  description:
    "PSD Group là hệ sinh thái doanh nghiệp đa ngành phát triển bền vững, lấy hiệu quả kinh tế và chiều sâu văn hóa Việt làm nền tảng cho sự trường tồn.",
  keywords: ["PSD Group", "tập đoàn đa ngành", "bất động sản", "logistics", "sản xuất", "Việt Nam"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "PSD Group",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`h-full antialiased ${beVietnamPro.variable}`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-be-vietnam), sans-serif", overflowX: "hidden" }}>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
