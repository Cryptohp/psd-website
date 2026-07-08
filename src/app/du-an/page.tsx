import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";
import DuAnMobileNav from "./MobileNav";

export const metadata: Metadata = {
  title: "Dự án tiêu biểu – PSD Group",
  description: "Danh mục dự án và công ty thành viên của PSD Group theo từng lĩnh vực hoạt động.",
};

const SIDE_PAD = "max(24px, calc((100vw - 1300px) / 2 + 60px))";

const sectors = [
  {
    id: "bat-dong-san",
    num: "01",
    title: "Bất động sản & Hạ tầng",
    subtitle: "Phát triển dự án & hạ tầng",
    companies: [
      "Công ty TNHH Đầu tư và Phát triển Bất động sản PSD",
      "Công ty CP Tập đoàn Đầu tư Golden Palace",
      "Công ty CP Phát triển Hạ tầng và Giáo dục PSD",
      "Công ty CP Đầu tư PSD Lai Châu",
    ],
    projects: [
      "Khu nhà ở thông minh Yên Mỹ",
      "Khu nhà ở Ngọc Lâm (Long Biên, Hà Nội)",
      "Nhà ở xã hội Sơn Đồng – Hải An (Hà Nội)",
      "Nhà ở xã hội Tây Tựu – Hải An (Hà Nội)",
      "Nhà ở xã hội Nam Hồ Linh Đàm (các lô HH11, HH12, CX-09)",
      "Nhà ở xã hội Ngọc Hồi (Hà Nội)",
      "Khu nhà ở thấp tầng An Thượng – Vị trí X2 (Hoài Đức, Hà Nội)",
      "Dự án đấu giá đất lô X2A Yên Sở (Hoàng Mai, Hà Nội)",
      "Dự án Trần Phú – Đông Phú, Cụm Công nghiệp (Công ty DPI)",
      "Dự án Đào Trí",
      "Dự án Nguyễn Duy Trinh",
      "Khu nhà ở cao tầng Long Trường",
      "Dự án Traco 1 (Hà Nội)",
      "Bất động sản Thanh Hóa",
    ],
  },
  {
    id: "san-xuat-cong-nghiep",
    num: "02",
    title: "Sản xuất & Công nghiệp",
    subtitle: "Nhà máy & công nghiệp chế biến",
    companies: [
      "Công ty CP PSD STEEL",
      "Công ty TNHH Sản xuất và Đầu tư Thương mại Tiên Phong",
      "Công ty TNHH DPC Group Việt Nam",
      "Công ty TNHH Công thương Nam Anh",
      "Công ty TNHH Đầu tư và Thương mại Việt An Hà Nội (Công ty cổ phần Sorbitol Pháp - Việt)",
    ],
    projects: [
      "Nhà máy dầu Quang Minh (Lương Bằng, Hưng Yên) & Dự án Quang Minh (KCN Quang Minh)",
      "Nhà máy tinh bột Nước Trong; Sầm Nhứt; Bình Định",
      "Nhà máy Cồn Quảng Nam",
      "Dự án Sắt và Cụm công nghiệp Yên Bái",
      "Nhà máy dăm gỗ & viên nén Vinafor (Lệ Thủy, Quảng Trị – 4,5ha) và Năng lượng Xanh La Sơn (2,7ha)",
    ],
  },
  {
    id: "khoang-san",
    num: "03",
    title: "Khoáng sản",
    subtitle: "Tài nguyên có trách nhiệm",
    companies: [
      "Công ty CP Xây dựng cầu đường hạ tầng và khoáng sản Thăng Long (và địa điểm Cốc Chặng)",
      "Công ty CP Cao Lanh Như Xuân",
      "Công ty TNHH Khoáng sản PSG Bắc Việt",
      "Công ty CP Đầu tư Xây dựng và Khoáng sản PSD",
      "Công ty TNHH Việt Thanh – Stone",
      "Công ty tại Campuchia: PCG Mining, Dalip Mining, Công ty TNHH Đầu tư PHGC Angkor",
    ],
    projects: [],
  },
  {
    id: "logistics",
    num: "04",
    title: "Logistics & Cảng biển",
    subtitle: "Vận hành & chuỗi cung ứng",
    companies: [
      "Công ty CP Đầu tư Thương mại và Dịch vụ Tấn Sang Logistics",
    ],
    projects: [
      "Trung tâm Logistics Chân Mây (cảng Chân Mây, Phú Lộc, Huế)",
      "Cảng Tổng hợp Thị Vải và kho bãi tại cảng Phú Mỹ (TP. Hồ Chí Minh)",
    ],
    projectsNote: "Hợp tác hệ sinh thái: LEC Group",
  },
  {
    id: "nong-nghiep",
    num: "05",
    title: "Nông nghiệp & Thủy sản",
    subtitle: "Phát triển bền vững",
    companies: [
      "Công ty CP Đầu tư và Phát triển Nông nghiệp PSD",
      "Công ty CP Thủy sản PSD",
    ],
    projects: [
      "Dự án Nông nghiệp",
    ],
  },
  {
    id: "du-lich",
    num: "06",
    title: "Du lịch & Dịch vụ sinh thái",
    subtitle: "Nghỉ dưỡng & không gian sinh thái",
    companies: [
      "Công ty CP Du lịch Long Việt",
      "Công ty TNHH Tâm Linh Bách Việt",
    ],
    projects: [
      "Khu du lịch sinh thái văn hóa Long Việt – điểm đến hội tụ giá trị sinh thái, bản sắc văn hóa Việt và trải nghiệm nghỉ dưỡng bền vững",
      "Khách sạn Sunrise (Đông Gia Nghĩa, Lâm Đồng)",
      "Công viên nghĩa trang sinh thái: Tâm Điền (Đông Phú, Bắc Ninh), Đắk Lắk, Quảng Bình",
    ],
  },
  {
    id: "dau-tu-dich-vu",
    num: "07",
    title: "Đầu tư & Dịch vụ",
    subtitle: "Tài chính, thương mại & dịch vụ chuyên nghiệp",
    companies: [
      "Công ty TNHH Quản lý và Đầu tư PSD Holdings",
      "Công ty CP Đầu tư Thương mại và Xuất nhập khẩu PSD",
      "Công ty TNHH XNK Homey",
      "Công ty TNHH Đầu tư và Thương mại Thanh Thái",
      "Công ty Luật TNHH PSD",
      "Công ty TNHH Dịch vụ và Thiết bị Ostech Việt Nam",
    ],
    projects: [],
  },
  {
    id: "trach-nhiem-xa-hoi",
    num: "08",
    title: "Trách nhiệm xã hội",
    subtitle: "Trụ cột trách nhiệm xã hội",
    companies: [],
    projects: [],
  },
];

export default function ProjectsPage() {
  return (
    <main style={{ paddingTop: 68 }}>

      {/* Hero */}
      <div className="relative w-full" style={{ height: "clamp(260px, 28.6vw, 670px)", background: "#111" }}>
        <Image
          src="/mobile-he-ro-du-an.png"
          alt="Dự án PSD Group"
          fill className="object-cover opacity-40" priority unoptimized
        />
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column" as const, justifyContent: "flex-end",
          paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingBottom: 48,
        }}>
          <h1 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, textTransform: "uppercase" as const, letterSpacing: "0.02em" }}>
            Dự án & Công ty thành viên
          </h1>
          <p style={{ marginTop: 14, fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 560, lineHeight: 1.7 }}>
            Danh mục dự án tiêu biểu và các công ty thành viên theo từng lĩnh vực hoạt động chiến lược của PSD Group.
          </p>
        </div>
      </div>

      <Breadcrumb items={[{ label: "Dự án & Công ty thành viên" }]} />

      {/* Sector nav — mobile dropdown */}
      <div className="sectors-mobile-nav" style={{ position: "sticky", top: 68, zIndex: 10 }}>
        <DuAnMobileNav sectors={sectors.map(s => ({ id: s.id, title: s.title }))} />
      </div>

      {/* Sector nav — desktop horizontal */}
      <nav className="sectors-desktop-nav" style={{ background: "#f2f2f2", position: "sticky", top: 68, zIndex: 10, overflowX: "auto", scrollbarWidth: "none" as const }}>
        <div style={{ display: "flex", width: "100%" }}>
          {sectors.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="du-an-nav-link"
            >
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Sectors list */}
      <div style={{ background: "#fff" }}>
        {sectors.map((s, idx) => (
          <div
            key={s.id}
            id={s.id}
            style={{
              paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD,
              paddingTop: 56, paddingBottom: 56,
              borderBottom: idx < sectors.length - 1 ? "2px solid #e82127" : "none",
            }}
          >
            {/* Sector header */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
              <h2 style={{
                fontSize: 22, fontWeight: 700,
                color: "#e82127", textTransform: "uppercase" as const,
                letterSpacing: "0.03em", lineHeight: 1.2, margin: 0,
              }}>
                {s.title} - {s.subtitle}
              </h2>
            </div>

            {/* Stacked content */}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 40 }}>

              {/* Companies */}
              {s.companies.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: 22, fontWeight: 700,
                    color: "#888",
                    marginBottom: 16, paddingBottom: 10,
                  }}>
                    Công ty thành viên tiêu biểu
                  </h3>
                  <div>
                    {s.companies.map((c, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "flex-start", gap: 12,
                        padding: "11px 0",
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#e82127", flexShrink: 0, marginTop: 7 }} />
                        <span style={{ fontSize: 14, color: "#444", lineHeight: 1.6 }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {s.projects.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: 22, fontWeight: 700,
                    color: "#888",
                    marginBottom: 16, paddingBottom: 10,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    Dự án tiêu biểu
                    {(s as any).projectsNote && (
                      <span style={{ fontSize: 10, fontWeight: 500, color: "#bbb", textTransform: "none" as const, letterSpacing: 0 }}>
                        — {(s as any).projectsNote}
                      </span>
                    )}
                  </h3>
                  <div>
                    {s.projects.map((p, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "flex-start", gap: 12,
                        padding: "11px 0",
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#e82127", flexShrink: 0, marginTop: 7 }} />
                        <span style={{ fontSize: 14, color: "#444", lineHeight: 1.6 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special case: only companies, no projects */}
              {s.companies.length > 0 && s.projects.length === 0 && (
                <p style={{ fontSize: 13, color: "#bbb", fontStyle: "italic" }}>Đang cập nhật dự án tiêu biểu.</p>
              )}

              {/* Special case: no companies (sector 08) */}
              {s.companies.length === 0 && s.projects.length === 0 && (
                <p style={{ fontSize: 15, color: "#666", lineHeight: 1.85, maxWidth: 680 }}>
                  Viện nghiên cứu hoạt động theo sứ mệnh trách nhiệm xã hội của PSD Group — nghiên cứu khoa học, hỗ trợ tái hòa nhập và lan tỏa giá trị nhân văn trong cộng đồng.
                </p>
              )}

            </div>

          </div>
        ))}
      </div>

    </main>
  );
}
