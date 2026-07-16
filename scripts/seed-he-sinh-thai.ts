import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

const data = [
  {
    name: "Bất động sản & Hạ tầng",
    slug: "bat-dong-san-ha-tang",
    description: "Phát triển bất động sản và hạ tầng gắn với giá trị dài hạn, tiếp cận như một tài sản chiến lược tạo nền tảng cho cộng đồng và hệ sinh thái.",
    order: 1,
    companies: [
      { name: "Công ty TNHH Đầu tư và Phát triển Bất động sản PSD", website: "psdgroup.vn", order: 1 },
      { name: "Công ty CP Tập đoàn Đầu tư Golden Palace", website: "psdgroup.vn", order: 2 },
      { name: "Công ty CP Phát triển Hạ tầng và Giáo dục PSD", website: "psdgroup.vn", order: 3 },
      { name: "Công ty CP Đầu tư PSD Lai Châu", website: "psdgroup.vn", order: 4 },
    ],
  },
  {
    name: "Sản xuất & Công nghiệp",
    slug: "san-xuat-cong-nghiep",
    description: "Mảng sản xuất là nơi PSD Group tạo ra giá trị thực, hữu hình - trải rộng từ chế biến thực phẩm - công nghiệp (sorbitol, tinh bột, cồn), năng lượng sinh khối (dăm gỗ, viên nén) đến thép và dầu thực vật.",
    order: 2,
    companies: [
      { name: "Công ty CP PSD STEEL", website: "psdgroup.vn", order: 1 },
      { name: "Công ty TNHH Sản xuất và Đầu tư Thương mại Tiên Phong", website: "psdgroup.vn", order: 2 },
      { name: "Công ty TNHH DPC Group Việt Nam", website: "psdgroup.vn", order: 3 },
      { name: "Công ty TNHH Công thương Nam Anh", website: "psdgroup.vn", order: 4 },
      { name: "Công ty TNHH Đầu tư và Thương mại Việt An Hà Nội (Công ty cổ phần Sorbitol Pháp - Việt)", website: "psdgroup.vn", order: 5 },
    ],
  },
  {
    name: "Khoáng sản",
    slug: "khoang-san",
    description: "PSD Group phát triển lĩnh vực khoáng sản theo định hướng bền vững, tuân thủ pháp luật, cân bằng giữa giá trị kinh tế với bảo vệ môi trường, lợi ích cộng đồng địa phương và khu vực quốc tế tại Campuchia.",
    order: 3,
    companies: [
      { name: "Công ty CP Xây dựng cầu đường hạ tầng và khoáng sản Thăng Long (Cốc Chặng)", order: 1 },
      { name: "Công ty CP Cao Lanh Như Xuân", order: 2 },
      { name: "Công ty TNHH Khoáng sản PSG Bắc Việt", order: 3 },
      { name: "Công ty CP Đầu tư Xây dựng và Khoáng sản PSD", order: 4 },
      { name: "Công ty TNHH Việt Thanh – Stone", order: 5 },
      { name: "Công ty TNHH Đầu tư PHGC Angkor", order: 6 },
    ],
  },
  {
    name: "Logistics & Cảng biển",
    slug: "logistics-cang-bien",
    description: "Logistics là mạch máu kết nối toàn hệ sinh thái, mở rộng tới hạ tầng cảng biển và trung tâm logistics quy mô lớn.",
    order: 4,
    companies: [
      { name: "Công ty CP Đầu tư Thương mại và Dịch vụ Tấn Sang Logistics", order: 1 },
    ],
  },
  {
    name: "Nông nghiệp & Thủy sản",
    slug: "nong-nghiep-thuy-san",
    description: "Trụ cột gắn với an ninh lương thực và phát triển nông nghiệp – thủy sản bền vững, khép kín từ nuôi trồng đến chế biến.",
    order: 5,
    companies: [
      { name: "Công ty CP Đầu tư và Phát triển Nông nghiệp PSD", order: 1 },
      { name: "Công ty CP Thủy sản PSD", order: 2 },
    ],
  },
  {
    name: "Du lịch & Sinh thái",
    slug: "du-lich-dich-vu-sinh-thai",
    description: "PSD Group phát triển du lịch gắn với di sản và văn hóa Việt, cùng các mô hình nghỉ dưỡng và không gian sinh thái bền vững.",
    order: 6,
    companies: [
      { name: "Công ty CP Du lịch Long Việt", order: 1 },
      { name: "Công ty TNHH Tâm Linh Bách Việt", order: 2 },
    ],
  },
  {
    name: "Đầu tư & Dịch vụ",
    slug: "dau-tu-dich-vu",
    description: "Đầu tư - M&A, thương mại - xuất nhập khẩu và các dịch vụ chuyên nghiệp hỗ trợ toàn hệ sinh thái. Đây cũng là nơi PSD Group thực hiện năng lực mua bán – sáp nhập, tìm kiếm và tái cấu trúc những doanh nghiệp có nền tảng tốt (như SOFAVI) để đưa vào quỹ đạo phát triển chung.",
    order: 7,
    companies: [
      { name: "Công ty TNHH Quản lý và Đầu tư PSD Holdings", order: 1 },
      { name: "Công ty CP Đầu tư Thương mại và Xuất nhập khẩu PSD", order: 2 },
      { name: "Công ty TNHH XNK Homey", order: 3 },
      { name: "Công ty TNHH Đầu tư và Thương mại Thanh Thái", order: 4 },
      { name: "Công ty Luật TNHH PSD", order: 5 },
      { name: "Công ty TNHH Dịch vụ và Thiết bị Ostech Việt Nam", order: 6 },
    ],
  },
  {
    name: "Trách nhiệm xã hội",
    slug: "trach-nhiem-xa-hoi",
    description: "Viện Nghiên cứu và Ứng dụng Phòng chống ma túy PSD (Viện PSD) hiện thân cho trách nhiệm cộng đồng. Viện hoạt động theo định hướng nghiên cứu khoa học và ứng dụng thực tiễn nhằm phòng, chống ma túy, hỗ trợ người sau cai nghiện tái hòa nhập cộng đồng và lan tỏa những giá trị nhân văn tới xã hội.",
    order: 8,
    companies: [
      { name: "Viện Nghiên cứu và Ứng dụng Phòng chống ma túy PSD (Viện PSD)", order: 1 },
    ],
  },
];

async function main() {
  console.log("Bắt đầu seed hệ sinh thái...");

  for (const sector of data) {
    const { companies, ...sectorData } = sector;

    // Upsert sector by slug
    const s = await prisma.sector.upsert({
      where: { slug: sectorData.slug },
      update: { name: sectorData.name, description: sectorData.description, order: sectorData.order },
      create: { ...sectorData, isActive: true },
    });
    console.log(`✔ Lĩnh vực: ${s.name}`);

    for (const company of companies) {
      const slug = company.name
        .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").trim()
        .replace(/\s+/g, "-")
        .slice(0, 60) + `-${s.id.slice(0, 6)}-${company.order}`;

      await prisma.company.upsert({
        where: { slug },
        update: { name: company.name, order: company.order, sectorId: s.id },
        create: {
          name: company.name,
          slug,
          website: (company as { website?: string }).website ?? null,
          order: company.order,
          isActive: true,
          sectorId: s.id,
        },
      });
      console.log(`  · ${company.name}`);
    }
  }

  console.log("\n✅ Seed hoàn tất!");
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
