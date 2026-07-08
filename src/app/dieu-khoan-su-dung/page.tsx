import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "Điều khoản sử dụng — PSD Group" };

export default function DieuKhoanSuDungPage() {
  return (
    <div className="pt-[72px]">
      <div className="bg-[#0f0f12] py-16 text-center">
        <h1 className="text-[32px] font-bold text-white">Điều khoản sử dụng</h1>
        <p className="text-white/50 mt-2 text-[14px]">Cập nhật lần cuối: tháng 7 năm 2025</p>
      </div>
      <Breadcrumb items={[{ label: "Điều khoản sử dụng" }]} />
      <div className="bg-white">
        <div className="container-psd py-16 max-w-3xl">
          <div className="prose prose-lg text-[#3f3f44] space-y-8">
            <section>
              <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-3">1. Chấp nhận điều khoản</h2>
              <p className="text-[15px] leading-relaxed">Khi truy cập và sử dụng website của PSD Group, bạn đồng ý tuân thủ các điều khoản và điều kiện sử dụng được quy định tại đây.</p>
            </section>
            <section>
              <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-3">2. Quyền sở hữu trí tuệ</h2>
              <p className="text-[15px] leading-relaxed">Toàn bộ nội dung trên website bao gồm văn bản, hình ảnh, logo, biểu tượng là tài sản của PSD Group và được bảo hộ bởi luật sở hữu trí tuệ.</p>
            </section>
            <section>
              <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-3">3. Giới hạn trách nhiệm</h2>
              <p className="text-[15px] leading-relaxed">PSD Group không chịu trách nhiệm đối với bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng website này.</p>
            </section>
            <section>
              <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-3">4. Thay đổi điều khoản</h2>
              <p className="text-[15px] leading-relaxed">PSD Group có quyền thay đổi các điều khoản sử dụng bất kỳ lúc nào. Các thay đổi có hiệu lực ngay khi được đăng tải lên website.</p>
            </section>
            <section>
              <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-3">5. Liên hệ</h2>
              <p className="text-[15px] leading-relaxed">Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ: <a href="mailto:psdgroup.hotmail@gmail.com" className="text-[#e82127] hover:underline">psdgroup.hotmail@gmail.com</a></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
