import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const footerLinks = {
  "Về PSD Group": [
    { label: "Hành trình phát triển", href: "/ve-psd-group/hanh-trinh-phat-trien" },
    { label: "Tầm nhìn & Sứ mệnh", href: "/ve-psd-group/tam-nhin-su-menh" },
    { label: "Giá trị cốt lõi", href: "/ve-psd-group/gia-tri-cot-loi" },
    { label: "Ban lãnh đạo", href: "/ve-psd-group/ban-lanh-dao" },
    { label: "Văn hóa doanh nghiệp", href: "/ve-psd-group/van-hoa-doanh-nghiep" },
  ],
  "Lĩnh vực": [
    { label: "Bất động sản & Hạ tầng", href: "/linh-vuc-hoat-dong/bat-dong-san-ha-tang" },
    { label: "Sản xuất & Công nghiệp", href: "/linh-vuc-hoat-dong/san-xuat-cong-nghiep" },
    { label: "Logistics & Cảng biển", href: "/linh-vuc-hoat-dong/logistics-cang-bien" },
    { label: "Du lịch & Sinh thái", href: "/linh-vuc-hoat-dong/du-lich-dich-vu-sinh-thai" },
    { label: "Phát triển bền vững", href: "/phat-trien-ben-vung" },
  ],
  "Khám phá": [
    { label: "Hệ sinh thái", href: "/he-sinh-thai" },
    { label: "Dự án tiêu biểu", href: "/du-an" },
    { label: "Tin tức", href: "/tin-tuc" },
    { label: "Tuyển dụng", href: "/tuyen-dung" },
    { label: "Liên hệ", href: "/lien-he" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#f2f2f2] text-[#1a1a1a]">
      {/* Main footer */}
      <div className="container-psd py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center mb-6">
              <img src="/logo-horizontal.png" alt="PSD Group" style={{ height: 42, width: "auto", objectFit: "contain" }} />
            </Link>

            <p className="text-[14px] text-[#6e6e74] leading-relaxed mb-6 max-w-[300px]">
              Hệ sinh thái doanh nghiệp đa ngành phát triển bền vững, lấy hiệu quả kinh tế và
              chiều sâu văn hóa Việt làm nền tảng cho sự trường tồn.
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <MapPin size={16} className="text-[#e82127] flex-shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#6e6e74] leading-snug">
                  235–237 Khuất Duy Tiến, Đại Mỗ, Hà Nội
                </span>
              </div>
              <div className="flex gap-3">
                <Phone size={16} className="text-[#e82127] flex-shrink-0" />
                <a href="tel:0782741534" className="text-[13px] text-[#6e6e74] hover:text-[#e82127] transition-colors">
                  078.274.1534
                </a>
              </div>
              <div className="flex gap-3">
                <Mail size={16} className="text-[#e82127] flex-shrink-0" />
                <a href="mailto:psdgroup.vn@gmail.com" className="text-[13px] text-[#6e6e74] hover:text-[#e82127] transition-colors">
                  psdgroup.vn@gmail.com
                </a>
              </div>
              <div className="flex gap-3">
                <Clock size={16} className="text-[#e82127] flex-shrink-0" />
                <span className="text-[13px] text-[#6e6e74]">
                  Thứ 2 – Thứ 6: 8:00 – 17:30
                </span>
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <h4 className="font-semibold text-[14px] text-[#1a1a1a] mb-4 uppercase tracking-wider">
                  {group}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[13px] text-[#6e6e74] hover:text-[#e82127] transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#e5e5e7] border-b-2 border-b-[#e82127]">
        <div className="container-psd py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-[#999]">
            © {new Date().getFullYear()} Công ty CP Tập Đoàn PSD Group. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/chinh-sach-bao-mat" className="text-[12px] text-[#999] hover:text-[#e82127] transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/dieu-khoan-su-dung" className="text-[12px] text-[#999] hover:text-[#e82127] transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
