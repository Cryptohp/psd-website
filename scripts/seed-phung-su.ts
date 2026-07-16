import { prisma } from "../src/lib/prisma";

const items = [
  {
    order: 1,
    label: "VĂN HÓA",
    title: "Dự án Nghiên cứu và Phát triển Văn hóa",
    shortDesc: "Hệ thống 236 đề tài nghiên cứu là nền tảng tri thức cho các dự án văn hóa – xã hội của PSD Group.",
  },
  {
    order: 2,
    label: "DI SẢN",
    title: "Dự án Đình Làng",
    shortDesc: "Phục dựng và phát huy không gian đình làng — biểu tượng văn hóa cộng đồng Việt, hướng tới khôi phục giá trị gắn kết cộng đồng bền lâu.",
  },
  {
    order: 3,
    label: "CÔNG NGHỆ",
    title: "Dự án Văn Minh Số",
    shortDesc: "Số hóa và lan tỏa tri thức, di sản văn hóa Việt trên nền tảng công nghệ — đưa văn hóa truyền thống đến gần hơn với thế hệ trẻ.",
  },
  {
    order: 4,
    label: "TÂM LINH",
    title: "Dự án Tâm Linh Bách Việt",
    shortDesc: "Bảo tồn và phát huy các giá trị tâm linh, tín ngưỡng truyền thống của người Việt — kết nối cộng đồng qua các không gian văn hóa tâm linh.",
  },
  {
    order: 5,
    label: "CỘNG ĐỒNG",
    title: "Dự án Cuốn Sách Trao Đi Cuộc Đời Ở Lại",
    shortDesc: "Lan tỏa tri thức và nhân văn thông qua những cuốn sách được trao đi — mỗi cuốn sách là một hạt giống yêu thương gửi đến cộng đồng.",
  },
];

async function main() {
  for (const item of items) {
    await prisma.socialProject.upsert({
      where: { id: `seed-phung-su-${item.order}` },
      update: { title: item.title, label: item.label, shortDesc: item.shortDesc, order: item.order },
      create: { id: `seed-phung-su-${item.order}`, ...item, isActive: true },
    });
    console.log(`✅ ${item.title}`);
  }
  console.log("✅ Seed phụng sự xã hội hoàn tất!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
