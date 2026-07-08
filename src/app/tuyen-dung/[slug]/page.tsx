import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Clock, Briefcase, Calendar, ArrowLeft, Upload, Send } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

const jobs: Record<string, {
  title: string; dept: string; location: string; type: string;
  deadline: string; salary: string;
  description: string; requirements: string[]; benefits: string[];
}> = {
  "giam-doc-du-an-bat-dong-san": {
    title: "Giám đốc Dự án Bất động sản", dept: "Bất động sản & Hạ tầng",
    location: "Hà Nội", type: "Toàn thời gian", deadline: "31/07/2026", salary: "Thương lượng",
    description: "PSD Group tìm kiếm Giám đốc Dự án có kinh nghiệm để dẫn dắt các dự án bất động sản quy mô lớn, từ giai đoạn lên kế hoạch đến triển khai và bàn giao. Đây là vị trí cấp cao với nhiều cơ hội phát triển và đóng góp vào sứ mệnh kiến tạo giá trị bền vững của tập đoàn.",
    requirements: [
      "Tốt nghiệp đại học chuyên ngành Kiến trúc, Xây dựng, Kinh tế hoặc liên quan",
      "Tối thiểu 8 năm kinh nghiệm quản lý dự án bất động sản quy mô lớn",
      "Hiểu biết sâu về pháp lý đất đai, xây dựng và quy hoạch tại Việt Nam",
      "Kỹ năng lãnh đạo, quản lý đội nhóm và giao tiếp xuất sắc",
      "Tiếng Anh giao tiếp tốt; biết thêm ngôn ngữ khác là lợi thế",
      "Có khả năng chịu áp lực và làm việc trong môi trường năng động",
    ],
    benefits: [
      "Mức lương cạnh tranh, thưởng hiệu suất hấp dẫn",
      "Bảo hiểm sức khỏe cao cấp cho bản thân và gia đình",
      "Xe công vụ và phụ cấp di chuyển",
      "Cơ hội phát triển trong hệ sinh thái đa ngành quy mô lớn",
      "Du lịch team building hàng năm",
      "Môi trường làm việc chuyên nghiệp, minh bạch",
    ],
  },
  "ke-toan-truong": {
    title: "Kế toán trưởng", dept: "Tài chính – Kế toán",
    location: "Hà Nội", type: "Toàn thời gian", deadline: "31/07/2026", salary: "25–40 triệu VNĐ",
    description: "PSD Group cần tuyển Kế toán trưởng có kinh nghiệm để phụ trách toàn bộ công tác kế toán – tài chính của tập đoàn và các công ty thành viên. Đây là vị trí then chốt, đòi hỏi chuyên môn vững và tư duy chiến lược.",
    requirements: [
      "Tốt nghiệp đại học chuyên ngành Kế toán, Tài chính hoặc liên quan",
      "Có chứng chỉ CPA Việt Nam hoặc ACCA là lợi thế",
      "Tối thiểu 7 năm kinh nghiệm kế toán, trong đó 3 năm ở vị trí kế toán trưởng",
      "Hiểu biết sâu về chuẩn mực kế toán Việt Nam (VAS) và IFRS",
      "Thành thạo các phần mềm kế toán (MISA, SAP hoặc tương đương)",
      "Kỹ năng phân tích tài chính và lập báo cáo quản trị",
    ],
    benefits: [
      "Mức lương 25–40 triệu + thưởng quý/năm",
      "Bảo hiểm sức khỏe đầy đủ",
      "Đào tạo chuyên môn và nâng cao kỹ năng",
      "Lộ trình phát triển lên CFO rõ ràng",
      "Môi trường làm việc ổn định, minh bạch",
    ],
  },
  "truong-phong-marketing": {
    title: "Trưởng phòng Marketing", dept: "Marketing & Truyền thông",
    location: "Hà Nội", type: "Toàn thời gian", deadline: "25/07/2026", salary: "20–35 triệu VNĐ",
    description: "PSD Group tìm kiếm Trưởng phòng Marketing sáng tạo và chiến lược để xây dựng và phát triển thương hiệu tập đoàn, quản lý truyền thông và thực hiện các chiến dịch marketing hiệu quả.",
    requirements: [
      "Tốt nghiệp đại học chuyên ngành Marketing, Truyền thông hoặc liên quan",
      "Tối thiểu 5 năm kinh nghiệm marketing, trong đó 2 năm ở vị trí quản lý",
      "Kinh nghiệm xây dựng thương hiệu doanh nghiệp (B2B và B2C)",
      "Thành thạo digital marketing, content strategy và PR",
      "Kỹ năng lãnh đạo đội nhóm sáng tạo",
      "Tiếng Anh thành thạo",
    ],
    benefits: [
      "Mức lương 20–35 triệu + thưởng dự án",
      "Budget marketing đủ để thực hiện chiến dịch lớn",
      "Cơ hội làm việc với thương hiệu tập đoàn đa ngành",
      "Bảo hiểm đầy đủ theo quy định",
      "Môi trường sáng tạo và năng động",
    ],
  },
  "chuyen-vien-logistics": {
    title: "Chuyên viên Logistics", dept: "Logistics & Vận hành",
    location: "Hà Nội / TP.HCM", type: "Toàn thời gian", deadline: "20/07/2026", salary: "12–18 triệu VNĐ",
    description: "Tấn Sang Logistics (thành viên PSD Group) tuyển Chuyên viên Logistics để phụ trách điều phối vận chuyển, quản lý kho bãi và tối ưu chuỗi cung ứng cho khách hàng doanh nghiệp.",
    requirements: [
      "Tốt nghiệp đại học chuyên ngành Logistics, Quản trị chuỗi cung ứng hoặc liên quan",
      "Tối thiểu 2 năm kinh nghiệm logistics hoặc vận tải",
      "Hiểu biết về nghiệp vụ xuất nhập khẩu và hải quan",
      "Kỹ năng đàm phán và giao tiếp tốt",
      "Thành thạo Excel và các công cụ quản lý vận tải",
    ],
    benefits: [
      "Mức lương 12–18 triệu + thưởng KPI",
      "Phụ cấp ăn trưa và đi lại",
      "Đào tạo nghiệp vụ logistics quốc tế",
      "Bảo hiểm đầy đủ",
      "Cơ hội thăng tiến trong công ty phát triển nhanh",
    ],
  },
  "lap-trinh-vien-fullstack": {
    title: "Lập trình viên Fullstack", dept: "Công nghệ thông tin",
    location: "Hà Nội", type: "Toàn thời gian", deadline: "15/07/2026", salary: "20–40 triệu VNĐ",
    description: "PSD Group cần Lập trình viên Fullstack để phát triển và duy trì các hệ thống phần mềm nội bộ và sản phẩm công nghệ của tập đoàn, bao gồm nền tảng Văn Minh Việt và hệ thống quản trị doanh nghiệp.",
    requirements: [
      "Tốt nghiệp đại học chuyên ngành CNTT hoặc liên quan",
      "Thành thạo React/Next.js, Node.js/TypeScript",
      "Kinh nghiệm với PostgreSQL, REST API và GraphQL",
      "Hiểu biết về Docker, CI/CD và cloud services (AWS/GCP)",
      "Tối thiểu 3 năm kinh nghiệm phát triển web fullstack",
      "Khả năng làm việc độc lập và trong team Agile",
    ],
    benefits: [
      "Mức lương 20–40 triệu tùy năng lực",
      "Làm việc với stack công nghệ hiện đại",
      "Remote hybrid linh hoạt",
      "Budget học tập và tham dự conference",
      "Laptop và thiết bị làm việc cao cấp",
    ],
  },
  "chuyen-vien-truyen-thong": {
    title: "Chuyên viên Truyền thông", dept: "Marketing & Truyền thông",
    location: "Hà Nội", type: "Toàn thời gian", deadline: "10/07/2026", salary: "10–16 triệu VNĐ",
    description: "PSD Group tuyển Chuyên viên Truyền thông để thực hiện các hoạt động PR, quản lý mạng xã hội, viết nội dung và phối hợp với báo chí, truyền thông cho tập đoàn.",
    requirements: [
      "Tốt nghiệp đại học chuyên ngành Báo chí, Truyền thông hoặc liên quan",
      "Tối thiểu 1–3 năm kinh nghiệm PR hoặc truyền thông doanh nghiệp",
      "Kỹ năng viết nội dung chuẩn báo chí, sáng tạo và thuyết phục",
      "Kinh nghiệm quản lý mạng xã hội doanh nghiệp",
      "Mạng lưới quan hệ báo chí là lợi thế",
    ],
    benefits: [
      "Mức lương 10–16 triệu + thưởng dự án",
      "Môi trường truyền thông chuyên nghiệp",
      "Cơ hội tham dự sự kiện và lễ ký kết lớn",
      "Bảo hiểm đầy đủ",
      "Phát triển mạng lưới quan hệ truyền thông rộng",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(jobs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = jobs[slug];
  return { title: job ? `${job.title} – Tuyển dụng PSD Group` : "Vị trí tuyển dụng" };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = jobs[slug];
  if (!job) notFound();

  return (
    <div className="pt-[72px] bg-[#f4f4f5] min-h-screen">
      {/* Header bar */}
      <div className="bg-[#0f0f12] py-12">
        <div className="container-psd">
          <nav className="flex items-center gap-2 text-[12px] text-white/40 mb-5">
            <Link href="/" className="hover:text-white/70">Trang chủ</Link>
            <span>/</span>
            <Link href="/tuyen-dung" className="hover:text-white/70">Tuyển dụng</Link>
            <span>/</span>
            <span className="text-white/60">{job.title}</span>
          </nav>
          <h1 className="text-[28px] lg:text-[36px] font-bold text-white mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-4 text-[14px] text-white/60">
            <span className="flex items-center gap-1.5"><Briefcase size={14} />{job.dept}</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} />{job.location}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} />{job.type}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} />Hạn nộp: {job.deadline}</span>
          </div>
        </div>
      </div>

      <Breadcrumb items={[{ label: "Tuyển dụng", href: "/tuyen-dung" }, { label: job.title }]} />

      <div className="container-psd py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Job detail */}
          <div className="lg:col-span-7 space-y-6">
            {/* Description */}
            <div className="card-psd p-7 bg-white">
              <h2 className="text-[18px] font-bold text-[#1a1a1a] mb-4">Mô tả công việc</h2>
              <p className="text-[15px] text-[#6e6e74] leading-relaxed">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="card-psd p-7 bg-white">
              <h2 className="text-[18px] font-bold text-[#1a1a1a] mb-4">Yêu cầu ứng viên</h2>
              <ul className="space-y-3">
                {job.requirements.map((req) => (
                  <li key={req} className="flex gap-3 text-[14px] text-[#6e6e74]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e82127] flex-shrink-0 mt-2" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="card-psd p-7 bg-white">
              <h2 className="text-[18px] font-bold text-[#1a1a1a] mb-4">Quyền lợi</h2>
              <ul className="space-y-3">
                {job.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-[14px] text-[#6e6e74]">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/tuyen-dung" className="inline-flex items-center gap-2 text-[14px] font-medium text-[#6e6e74] hover:text-[#e82127] transition-colors">
              <ArrowLeft size={16} /> Xem tất cả vị trí
            </Link>
          </div>

          {/* Right: Application form */}
          <div className="lg:col-span-5">
            <div className="sticky top-[88px] card-psd p-7 bg-white">
              <div className="mb-2">
                <span className="text-[12px] font-semibold text-[#6e6e74] uppercase tracking-wider">Mức lương</span>
                <div className="text-[20px] font-bold text-[#e82127]">{job.salary}</div>
              </div>
              <div className="w-full h-[1px] bg-[#e5e5e7] my-5" />

              <h3 className="font-bold text-[17px] text-[#1a1a1a] mb-5">Nộp hồ sơ ứng tuyển</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Họ và tên <span className="text-[#e82127]">*</span></label>
                  <input type="text" placeholder="Nguyễn Văn A" className="w-full px-3.5 py-3 rounded-lg border border-[#e5e5e7] text-[14px] focus:outline-none focus:border-[#e82127] transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Email <span className="text-[#e82127]">*</span></label>
                  <input type="email" placeholder="email@example.com" className="w-full px-3.5 py-3 rounded-lg border border-[#e5e5e7] text-[14px] focus:outline-none focus:border-[#e82127] transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Số điện thoại <span className="text-[#e82127]">*</span></label>
                  <input type="tel" placeholder="0912 345 678" className="w-full px-3.5 py-3 rounded-lg border border-[#e5e5e7] text-[14px] focus:outline-none focus:border-[#e82127] transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Thư ngỏ</label>
                  <textarea rows={3} placeholder="Giới thiệu ngắn về bản thân và lý do ứng tuyển..." className="w-full px-3.5 py-3 rounded-lg border border-[#e5e5e7] text-[14px] focus:outline-none focus:border-[#e82127] transition-colors resize-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">CV / Hồ sơ <span className="text-[#e82127]">*</span></label>
                  <div className="border-2 border-dashed border-[#e5e5e7] rounded-lg p-5 text-center hover:border-[#e82127]/40 transition-colors cursor-pointer">
                    <Upload size={22} className="text-[#6e6e74] mx-auto mb-2" />
                    <p className="text-[13px] text-[#6e6e74]">Kéo thả hoặc <span className="text-[#e82127] font-medium">chọn file</span></p>
                    <p className="text-[11px] text-[#6e6e74]/60 mt-1">PDF, DOC, DOCX — Tối đa 5MB</p>
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full justify-center gap-2 py-3.5">
                  <Send size={16} /> Gửi hồ sơ ứng tuyển
                </button>
                <p className="text-[11px] text-[#6e6e74] text-center">
                  Hồ sơ sẽ được xem xét trong vòng 5–7 ngày làm việc
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
