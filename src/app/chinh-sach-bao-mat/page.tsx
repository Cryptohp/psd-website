import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "Chính sách bảo mật — PSD Group" };

export default function ChinhSachBaoMatPage() {
  return (
    <div className="pt-[72px]">
      <div className="bg-[#0f0f12] py-16 text-center">
        <h1 className="text-[32px] font-bold text-white">Chính sách bảo mật</h1>
        <p className="text-white/50 mt-2 text-[14px]">Cập nhật lần cuối: tháng 7 năm 2025</p>
      </div>
      <Breadcrumb items={[{ label: "Chính sách bảo mật" }]} />
      <div className="bg-white">
        <div className="container-psd py-16 max-w-3xl">
          <div className="prose prose-lg text-[#3f3f44] space-y-8">
            <section>
              <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-3">1. Thông tin chúng tôi thu thập</h2>
              <p className="text-[15px] leading-relaxed">Chúng tôi có thể thu thập các thông tin cá nhân như họ tên, địa chỉ email, số điện thoại khi bạn liên hệ hoặc đăng ký nhận thông tin từ PSD Group.</p>
            </section>
            <section>
              <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-3">2. Mục đích sử dụng thông tin</h2>
              <p className="text-[15px] leading-relaxed">Thông tin thu thập được sử dụng để phản hồi yêu cầu của bạn, cung cấp thông tin về dịch vụ và cải thiện trải nghiệm người dùng trên website.</p>
            </section>
            <section>
              <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-3">3. Bảo mật thông tin</h2>
              <p className="text-[15px] leading-relaxed">PSD Group cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phù hợp để ngăn chặn truy cập trái phép.</p>
            </section>
            <section>
              <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-3">4. Chia sẻ thông tin</h2>
              <p className="text-[15px] leading-relaxed">Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba mà không có sự đồng ý của bạn, trừ khi được yêu cầu bởi pháp luật.</p>
            </section>
            <section>
              <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-3">5. Liên hệ</h2>
              <p className="text-[15px] leading-relaxed">Nếu có câu hỏi về chính sách bảo mật, vui lòng liên hệ: <a href="mailto:psdgroup.vn@gmail.com" className="text-[#e82127] hover:underline">psdgroup.vn@gmail.com</a></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
