import PageHero from "@/components/ui/PageHero";
import { BookOpen, Lightbulb, Target, TrendingUp } from "lucide-react";

const chapters = [
  {
    year: "Khởi nguồn",
    icon: BookOpen,
    title: "Từ niềm tin đến hành trình",
    body: "PSD Group được hình thành từ một niềm tin giản dị nhưng bền bỉ của Chủ tịch Hội đồng sáng lập Lê Trung Tuấn: doanh nghiệp lớn phải là doanh nghiệp tạo ra giá trị lâu dài cho xã hội. Niềm tin ấy đã trở thành kim chỉ nam cho cả hành trình. Khởi nguồn năm 2013, PSD Group bắt đầu từ những lĩnh vực kinh tế nền tảng, rồi từng bước mở rộng thành một hệ sinh thái đa ngành vận hành cộng hưởng.",
  },
  {
    year: "Triết lý",
    icon: Lightbulb,
    title: "Văn hóa Việt là gốc rễ",
    body: "Điều không thay đổi suốt hành trình là triết lý đặt văn hóa Việt làm gốc rễ — một định hướng được Chủ tịch Lê Trung Tuấn kiên định theo đuổi ngay từ những ngày đầu. Chúng tôi tin rằng một quốc gia thịnh vượng phải đi cùng với một nền văn hóa đư���c gìn giữ và phát huy.",
  },
  {
    year: "Vòng tuần hoàn",
    icon: Target,
    title: "Kinh tế nuôi văn hóa — Văn hóa dẫn dắt kinh tế",
    body: "PSD Group vận hành theo một vòng tuần hoàn giá trị: các lĩnh vực kinh tế tạo ra nguồn lực, nguồn lực được tái đầu tư cho văn hóa – xã hội, và chính chiều sâu văn hóa lại trở thành lợi thế cạnh tranh, định hướng dài hạn cho mọi hoạt động kinh doanh.",
  },
  {
    year: "Cam kết",
    icon: TrendingUp,
    title: "Hướng tới tầm vóc quốc gia",
    body: "PSD Group đặt mục tiêu phát triển thành một hệ sinh thái kinh tế đa ngành có hiệu quả vận hành cao, năng lực mở rộng lớn và khả năng đóng góp thực chất cho văn hóa, cộng đồng và quốc gia. Hướng tới mô hình tập đoàn đại chúng, minh bạch, bền vững, tầm vóc quốc gia.",
  },
];

const brandPillars = [
  {
    label: "Tên thương hiệu",
    value: "PSD Group",
    desc: "Viết tắt của Phát triển – Sáng tạo – Đột phá. Ba giá trị cốt lõi định hướng mọi quyết định kinh doanh.",
  },
  {
    label: "Màu sắc",
    value: "Đỏ & Trắng",
    desc: "Đỏ tượng trưng cho năng lượng, khát vọng và tinh thần tiên phong. Trắng biểu đạt sự minh bạch, chính trực và bền vững.",
  },
  {
    label: "Phông chữ",
    value: "Be Vietnam Pro",
    desc: "Phông chữ Việt hiện đại, thể hiện sự tự hào dân tộc kết hợp với tư duy quốc tế.",
  },
  {
    label: "Slogan",
    value: "Kiến tạo thịnh vượng – Phụng sự xã hội",
    desc: "Không chỉ là khẩu hiệu — đây là cam kết hai chiều: tạo ra giá trị kinh tế và đóng góp cho cộng đồng.",
  },
];

export default function BrandStoryPage() {
  return (
    <>
      <PageHero
        tag="Câu chuyện thương hiệu"
        title="Từ khát vọng đến"
        highlight="thương hiệu"
        desc="Mỗi thương hiệu lớn đều bắt đầu từ một câu chuyện chân thật. Đây là hành trình PSD Group xây dựng bản sắc từ đất và người."
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Về PSD Group", href: "/ve-psd-group" },
          { label: "Câu chuyện thương hiệu" },
        ]}
      />

      {/* Brand narrative */}
      <section className="section-padding bg-white">
        <div className="container-psd">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-[#111114] mb-4">
              Thương hiệu là <span className="text-[#e82127]">lời hứa</span> được giữ mỗi ngày
            </h2>
            <p className="text-[#6e6e74] text-lg leading-relaxed">
                PSD Group được hình thành từ một niềm tin: doanh nghiệp lớn phải tạo ra giá trị lâu dài cho xã hội. Thương hiệu của chúng tôi không được xây dựng từ một chiến dịch, mà hình thành qua từng quyết định, từng dự án và từng cam kết được giữ trọn.
            </p>
          </div>

          {/* Chapter timeline */}
          <div className="space-y-12">
            {chapters.map((ch, i) => (
              <div
                key={i}
                className={`flex flex-col md:flex-row gap-8 items-start ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Year + Icon */}
                <div className="flex-shrink-0 w-full md:w-48 flex md:flex-col items-center md:items-end gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#e82127]/10 flex items-center justify-center">
                    <ch.icon size={24} className="text-[#e82127]" />
                  </div>
                  <div className={`text-2xl font-bold text-[#111114] ${i % 2 === 1 ? "md:text-left" : "md:text-right"}`}>
                    {ch.year}
                  </div>
                </div>

                {/* Connector */}
                <div className="hidden md:flex items-center">
                  <div className="w-12 h-px bg-[#e82127]/30" />
                  <div className="w-3 h-3 rounded-full bg-[#e82127]" />
                  <div className="w-12 h-px bg-[#e82127]/30" />
                </div>

                {/* Content */}
                <div className="card-psd p-8 flex-1">
                  <h3 className="text-xl font-bold text-[#111114] mb-3">{ch.title}</h3>
                  <p className="text-[#6e6e74] leading-relaxed">{ch.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand pillars */}
      <section className="section-padding bg-gray-50">
        <div className="container-psd">
          <h2 className="text-3xl font-bold text-[#111114] text-center mb-12">
            Các yếu tố <span className="text-[#e82127]">nhận diện thương hiệu</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brandPillars.map((p, i) => (
              <div key={i} className="card-psd p-8">
                <div className="text-xs font-semibold text-[#e82127] uppercase tracking-widest mb-1">
                  {p.label}
                </div>
                <div className="text-xl font-bold text-[#111114] mb-3">{p.value}</div>
                <p className="text-[#6e6e74] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="section-padding bg-[#111114]">
        <div className="container-psd max-w-3xl mx-auto text-center">
          <div className="text-5xl text-[#e82127] font-serif mb-6">"</div>
          <blockquote className="text-2xl font-medium text-white leading-relaxed mb-8">
            Một thương hiệu mạnh không phải là thương hiệu được nhiều người biết đến,
            mà là thương hiệu được nhiều người tin tưởng.
          </blockquote>
          <div className="text-[#6e6e74]">— Ban lãnh đạo PSD Group</div>
        </div>
      </section>
    </>
  );
}
