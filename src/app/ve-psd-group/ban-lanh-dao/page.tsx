"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

// ── DỮ LIỆU ──────────────────────────────────────────────────────────────────

const founders = [
  {
    role: "Chủ tịch Hội đồng Sáng lập",
    badge: "Tiến sĩ danh dự",
    name: "Ông Lê Trung Tuấn",
    image: "/Ban-lanh-dao/Le-trung-tuan.webp",
    bio: [
      "Chủ tịch Hội đồng quản lý Viện Nghiên cứu và Ứng dụng phòng chống ma túy PSD.",
      "Thành viên sáng lập Liên Hiệp Các Tổ chức Điều Trị Nghiện Thế giới ICARO với 48 quốc gia thành viên.",
      "Nhận bằng tiến sĩ danh dự và xác lập kỷ lục thế giới — người từng nghiện ma túy đầu tiên trên thế giới bảo vệ thành công đề tài nghiên cứu khoa học \"Chống tái nghiện ma túy bằng liệu pháp tâm lý\".",
    ],
  },
];

const boardMembers = [
  {
    role: "Chủ tịch Hội đồng Quản trị",
    name: "Ông Nguyễn Thanh Tuyên",
    image: "/Ban-lanh-dao/nguyen-thanh-tuyen.webp",
    edu: ["Chủ tịch HĐQT Công ty Cổ phần Đầu tư và Xây dựng Vina2 (VC2) và đứng đầu hệ sinh thái Trainco Group.", "Kinh nghiệm hơn 20 năm trong các lĩnh vực tài chính, doanh nghiệp xây dựng và hạ tầng."],
  },
  {
    role: "PCT Thường trực",
    name: "Bà Nguyễn Thị Lan Phương",
    image: "/Ban-lanh-dao/nguyen-thi-lan-phuong.webp",
    edu: ["Cử nhân kinh tế – Đại học Quốc gia Hà Nội", "Cử nhân kinh tế – Học viện Tài chính Kế toán", "Kinh nghiệm trên 20 năm quản lý, quản trị doanh nghiệp"],
  },
  {
    role: "Thành viên HĐQT",
    name: "Ông Phan Mạnh Hùng",
    image: "/Ban-lanh-dao/phan-manh-hung.webp",
    edu: ["Cử nhân Đại học Tài chính Kế toán", "Hơn 20 năm kinh nghiệm tài chính, kế toán, quản trị"],
  },
  {
    role: "Thành viên HĐQT",
    name: "Bà Lê Thúy Hiền",
    image: "/Ban-lanh-dao/le-thuy-hien.webp",
    edu: ["Cử nhân Quản trị & Marketing — Bachelor of Business tại RMIT và Singapore Institute of Management (SIM)"],
  },
  {
    role: "Thành viên HĐQT",
    name: "Ông Nguyễn Văn Dũng",
    image: "/Ban-lanh-dao/nguyen-van-dung.webp",
    edu: ["Nhiều năm kinh nghiệm trong lĩnh vực đầu tư và quản trị doanh nghiệp với tầm nhìn chiến lược và tinh thần đổi mới."],
  },
];

const executives = [
  {
    role: "Tổng Giám đốc",
    name: "Ông Phan Mạnh Hùng",
    image: "/Ban-lanh-dao/phan-manh-hung.webp",
    edu: ["Cử nhân Đại học Tài chính Kế toán", "Hơn 20 năm kinh nghiệm tài chính, kế toán, quản trị"],
    scope: "",
  },
  {
    role: "Phó TGĐ Thường trực",
    name: "Ông Hà Trọng Điệp",
    image: "/Ban-lanh-dao/ha-trong-diep.webp",
    edu: ["Thạc sĩ Quản trị kinh doanh Quốc tế – Griggs University (Hoa Kỳ)", "Cử nhân Đại học Thương Mại – Quản trị kinh doanh", "Hơn 20 năm kinh nghiệm tài chính, đầu tư, quản lý điều hành"],
    scope: "Công tác đối ngoại; Ban Mua; Ban Quản lý Vốn và Đầu tư; Nhóm các công ty theo lĩnh vực dự án; Nhóm công ty Thương Mại",
  },
  {
    role: "PCT HĐQT kiêm PTGĐ",
    name: "Bà Nguyễn Thị Lan Phương",
    image: "/Ban-lanh-dao/nguyen-thi-lan-phuong.webp",
    edu: ["Cử nhân kinh tế – Đại học Quốc gia Hà Nội", "Cử nhân kinh tế – Học viện Tài chính Kế toán", "Kinh nghiệm trên 20 năm quản lý, quản trị doanh nghiệp"],
    scope: "Công tác đối ngoại; Ban Mua; Ban Quản lý Vốn và Đầu tư; Nhóm các công ty theo lĩnh vực dự án; Nhóm công ty Thương Mại",
  },
  {
    role: "Phó Tổng Giám đốc",
    name: "Ông Trần Quang Thọ",
    image: "/Ban-lanh-dao/tran-quang-tho.webp",
    edu: ["Thạc sĩ MBA Quốc tế – UBI (Bỉ)", "Hơn 20 năm quản lý dự án và điều hành doanh nghiệp"],
    scope: "Ban Đầu tư & QLDA; Khối sản xuất: Mỏ Cao lanh, Mỏ Vĩnh Lộc, Mỏ Cốc Chặng, Mỏ Pắc Ả",
  },
  {
    role: "Phó Tổng Giám đốc",
    name: "Ông Lê Kim Tuyến",
    image: "/Ban-lanh-dao/le-kim-tuyen.webp",
    edu: ["Trưởng ban Vốn – Tài chính dự án", "Trưởng ban Truyền thông Marketing", "Hơn 10 năm kinh nghiệm chiến lược phân bổ vốn"],
    scope: "Ban Truyền thông, MKT & CNTT; Công ty Truyền thông Xã hội; Công ty DPC Group; Công ty Bách Việt",
  },
  {
    role: "Phó Tổng Giám đốc",
    name: "Ông Nguyễn Thanh Hải",
    image: "/Ban-lanh-dao/nguyen-thanh-hai.webp",
    edu: ["Thạc sĩ Quốc tế học – Đại học Oregon (Hoa Kỳ)", "Hơn 20 năm kinh doanh, quản lý điều hành"],
    scope: "Ban Kinh doanh 1; Công ty STEEL; Công ty XNK PSD",
  },
  {
    role: "Phó Tổng Giám đốc",
    name: "Ông Lê Bá Sâm",
    image: "/Ban-lanh-dao/le-ba-sam.webp",
    edu: ["Cử nhân Luật – Đại học Mở Hà Nội", "Hơn 15 năm kinh doanh, truyền thông, marketing"],
    scope: "Mảng Truyền thông Báo chí; Viện Nghiên cứu và Ứng dụng PCMT PSD",
  },
  {
    role: "Phó Tổng Giám đốc",
    name: "Ông Phạm Trọng Du",
    image: "/Ban-lanh-dao/pham-trong-du.webp",
    edu: ["Cử nhân Tài chính – Ngân hàng – Học viện Tài chính", "Hơn 20 năm tài chính, khai thác khoáng sản, chứng khoán"],
    scope: "Công ty Vận tải Tấn Sang; Nhóm các công ty vận tải theo dự án",
  },
  {
    role: "Phó Tổng Giám đốc",
    name: "Ông Nguyễn Văn Hưởng",
    image: "/Ban-lanh-dao/nguyen-van-huong.webp",
    edu: [
      "Cử nhân kinh tế, kiểm toán – Thạc sỹ kinh tế – Đại học Quốc gia Hà Nội",
      "Kinh nghiệm 20 năm về tài chính, doanh nghiệp và đầu tư xây dựng",
    ],
    scope: "Ban Phát triển và XD Dự Án; Các dự án BĐS (Dự án Yên Mỹ, Dự án Ngọc Lâm, Dự án Vĩnh Thịnh...)",
  },
  {
    role: "Phó Tổng Giám đốc",
    name: "Ông Khương Trung Thủy",
    image: "/Ban-lanh-dao/khuong-trung-thuy.webp",
    edu: [
      "Tiến sĩ chuyên ngành Hóa học và Hóa lý Vật liệu – Đại học Montpellier 2, Cộng hòa Pháp",
      "Hơn 25 năm kinh nghiệm trong ngành hóa chất, từ nghiên cứu khoa học đến quản lý điều hành tại nhiều doanh nghiệp và tập đoàn hàng đầu trong lĩnh vực hóa chất, năng lượng và đầu tư",
    ],
    scope: "Phụ trách kỹ thuật sản xuất các nhà máy Sofavi, tinh bột sắn, cồn",
  },
  {
    role: "Phó Tổng Giám đốc",
    name: "Ông Cao Đức Anh",
    image: "/Ban-lanh-dao/cao-duc-anh.webp",
    edu: [
      "Cử nhân Kinh tế – Ngành Ngân hàng – Tài chính – Đại học Kinh tế Quốc dân; Thạc sĩ Quản trị Kinh doanh (MBA) – Học viện Ngân hàng",
      "Hơn 18 năm kinh nghiệm trong lĩnh vực tài chính – ngân hàng và quản trị doanh nghiệp; am hiểu quản trị tài chính, quản trị rủi ro, tín dụng, ngân sách, dòng tiền và chiến lược phát triển doanh nghiệp",
    ],
    scope: "Ban Tài chính; Ban Kế toán; Văn phòng Tập đoàn; Ban M&A; Ban Pháp chế",
  },
];

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function Avatar({ src, name, size = 80 }: { src?: string; name: string; size?: number }) {
  const initials = name.split(" ").slice(-2).map(w => w[0]).join("");
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#f4f4f5]">
      <span className="font-bold text-[#e82127]" style={{ fontSize: size * 0.3 }}>{initials}</span>
    </div>
  );
}

function FounderCard({ person, i, inView }: { person: typeof founders[0]; i: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.15 }}
      className="flex flex-col lg:flex-row gap-8 border border-[#e8e8e8] bg-white overflow-hidden"
    >
      {/* Photo */}
      <div className="lg:w-[280px] flex-shrink-0 bg-[#f4f4f5] overflow-hidden" style={{ minHeight: 300 }}>
        <div className="w-full h-full" style={{ minHeight: 300, position: "relative" }}>
          <Avatar src={person.image} name={person.name} size={120} />
        </div>
      </div>
      {/* Content */}
      <div className="flex flex-col justify-center p-8 lg:pl-0">
        {person.badge && (
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#e82127] border border-[#e82127]/30 px-3 py-1 mb-3 w-fit">
            {person.badge}
          </span>
        )}
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#e82127] mb-2">{person.role}</div>
        <h3 className="text-[24px] font-bold text-[#1a1a1a] mb-5">{person.name}</h3>
        <div className="w-8 h-[2px] bg-[#e82127] mb-5" />
        <ul className="space-y-3">
          {person.bio.map((line, j) => (
            <li key={j} className="flex gap-3 text-[14px] text-[#555] leading-relaxed">
              <span className="text-[#e82127] mt-1 flex-shrink-0">▸</span>
              {line}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ── MODAL ─────────────────────────────────────────────────────────────────────

type ModalPerson = { role: string; name: string; image?: string; edu: string[]; scope?: string };

function BioModal({ person, onClose }: { person: ModalPerson; onClose: () => void }) {
  const scopeItems = person.scope ? person.scope.split(";").map(s => s.trim()).filter(Boolean) : [];
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[680px] flex flex-col sm:flex-row overflow-hidden relative"
        style={{ maxHeight: "90vh", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center bg-[#f0f0f0] hover:bg-[#e82127] hover:text-white text-[#555] text-[14px] font-bold transition-colors"
        >×</button>

        {/* Photo */}
        <div className="sm:w-[220px] flex-shrink-0 bg-[#f2f2f2]" style={{ minHeight: 260 }}>
          {person.image ? (
            <img src={person.image} alt={person.name} className="w-full h-full object-cover object-top" style={{ minHeight: 260 }} />
          ) : (
            <div className="w-full flex items-center justify-center" style={{ minHeight: 260 }}>
              <span className="font-bold text-[#e82127] text-[48px]">
                {person.name.split(" ").slice(-2).map(w => w[0]).join("")}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-7 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#e82127] mb-1">{person.role}</div>
          <h3 className="text-[20px] font-bold text-[#1a1a1a] mb-4 uppercase">{person.name}</h3>

          <ul className="space-y-2 mb-5">
            {person.edu.map((line, i) => (
              <li key={i} className="flex gap-2 text-[13px] text-[#555] leading-relaxed">
                <span className="text-[#e82127] flex-shrink-0 mt-0.5">◆</span>{line}
              </li>
            ))}
          </ul>

          {scopeItems.length > 0 && (
            <>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#e82127] mb-3 border-t border-[#f0f0f0] pt-4">Mảng quản lý chính</div>
              <ul className="space-y-2">
                {scopeItems.map((s, i) => (
                  <li key={i} className="flex gap-2 text-[13px] text-[#555] leading-relaxed">
                    <span className="text-[#e82127] flex-shrink-0 mt-0.5">◆</span>{s}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function BoardCard({ person, i, inView }: { person: { role: string; name: string; image?: string; edu: string[]; scope?: string }; i: number; inView: boolean }) {
  const [modal, setModal] = useState(false);
  return (
    <>
      {modal && <BioModal person={person as ModalPerson} onClose={() => setModal(false)} />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: i * 0.1 }}
        className="border border-[#e8e8e8] bg-white overflow-hidden group cursor-pointer"
        style={{ transition: "box-shadow 0.25s, transform 0.25s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ""; (e.currentTarget as HTMLElement).style.transform = ""; }}
      >
        {/* Photo */}
        <div className="h-[260px] bg-[#f2f2f2] overflow-hidden relative flex items-center justify-center">
          {person.image ? (
            <img src={person.image} alt={person.name} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-bold text-[#e82127] text-[40px]">
                {person.name.split(" ").slice(-2).map((w: string) => w[0]).join("")}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {/* Info */}
        <div className="p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#e82127] mb-1">{person.role}</div>
          <h3 className="font-bold text-[15px] text-[#1a1a1a] mb-3">{person.name}</h3>
          <button onClick={() => setModal(true)} className="text-[11px] font-semibold text-[#e82127] uppercase tracking-wider hover:underline">
            Xem tiểu sử →
          </button>
        </div>
      </motion.div>
    </>
  );
}

function ExecCard({ person, i, inView }: { person: { role: string; name: string; image?: string; edu: string[]; scope?: string }; i: number; inView: boolean }) {
  const [modal, setModal] = useState(false);
  return (
    <div>
      {modal && <BioModal person={person as ModalPerson} onClose={() => setModal(false)} />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: i * 0.07 }}
        className="flex gap-4 border border-[#e8e8e8] bg-white p-5 group"
        style={{ transition: "box-shadow 0.25s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
      >
        <div className="w-[64px] h-[64px] flex-shrink-0 overflow-hidden bg-[#f4f4f5]">
          <Avatar src={person.image} name={person.name} size={64} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#e82127] mb-0.5">{person.role}</div>
          <h3 className="font-bold text-[14px] text-[#1a1a1a] mb-1">{person.name}</h3>
          <button
            onClick={() => setModal(true)}
            className="text-[11px] font-semibold text-[#e82127] mt-1 hover:underline"
          >
            Chi tiết &#x2192;
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-8 h-[3px] bg-[#e82127]" />
      <span className="text-[11px] font-bold uppercase tracking-widest text-[#e82127]">{text}</span>
    </div>
  );
}

function FounderSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  return (
    <section className="bg-[#f7f7f7] py-16" ref={ref}>
      <div className="container-psd">
        <SectionLabel text="Hội đồng Sáng lập" />
        <div className="space-y-6">
          {founders.map((p, i) => <FounderCard key={i} person={p} i={i} inView={inView} />)}
        </div>
      </div>
    </section>
  );
}

function BoardSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const [chairman, ...rest] = boardMembers;
  return (
    <section className="bg-white py-16" ref={ref}>
      <div className="container-psd">
        <SectionLabel text="Hội đồng Quản trị" />
        <div className="mb-6">
          <FounderCard person={{ role: chairman.role, badge: "", name: chairman.name, image: chairman.image, bio: chairman.edu }} i={0} inView={inView} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rest.map((p, i) => <BoardCard key={i} person={p} i={i + 1} inView={inView} />)}
        </div>
      </div>
    </section>
  );
}

function ExecSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const [ceo, ...rest] = executives;
  return (
    <section className="bg-[#f7f7f7] py-16" ref={ref}>
      <div className="container-psd">
        <SectionLabel text="Ban Giám đốc" />
        {/* TGĐ — layout lớn ngang như founder */}
        <div className="mb-6">
          <FounderCard person={{ role: ceo.role, badge: "", name: ceo.name, image: ceo.image, bio: ceo.edu }} i={0} inView={inView} />
        </div>
        {/* Phó TGĐ — card grid như HĐQT */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rest.map((p, i) => (
            <BoardCard key={i} person={{ role: p.role, name: p.name, image: p.image, edu: p.edu, scope: p.scope }} i={i + 1} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LeadersPage() {
  return (
    <>
      {/* Hero */}
      <div style={{ paddingTop: 68, position: "relative" }}>
        {/* Mobile hero */}
        <img src="/mobile-hero-ban-lanh-dao.webp" alt="Ban lãnh đạo PSD Group" className="w-full h-auto block md:hidden" style={{ objectFit: "cover", width: "100%" }} />
        {/* Desktop hero */}
        <img src="/hero-ban-lanh-dao.webp" alt="Ban lãnh đạo PSD Group" className="w-full h-auto hidden md:block" style={{ maxHeight: 520, objectFit: "cover", width: "100%" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.1) 100%)",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          paddingLeft: "clamp(20px, 5vw, 80px)", paddingRight: "clamp(20px, 5vw, 80px)", paddingBottom: 64,
        }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", marginBottom: 14 }}
          >
            Dẫn dắt bằng tầm nhìn, kiến tạo bằng hành động
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            style={{ fontSize: "clamp(32px, 4.2vw, 64px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 20, maxWidth: 820 }}
          >
            Đội ngũ & Ban lãnh đạo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", maxWidth: 640, lineHeight: 1.75, borderLeft: "3px solid #e82127", paddingLeft: 16 }}
          >
            Những con người dẫn dắt PSD Group bằng tầm nhìn chiến lược, năng lực quản trị và tinh thần phụng sự xã hội.
          </motion.p>
        </div>
      </div>
      <Breadcrumb items={[
        { label: "Về PSD Group", href: "/ve-psd-group" },
        { label: "Ban lãnh đạo & Đội ngũ" },
      ]} />
      <FounderSection />
      <BoardSection />
      <ExecSection />
    </>
  );
}

