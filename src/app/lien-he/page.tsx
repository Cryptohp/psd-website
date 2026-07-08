import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Kết nối với PSD Group — hợp tác đầu tư, truyền thông, tuyển dụng hoặc liên hệ chung.",
};

export default function ContactPage() {
  return (
    <>
      <div style={{ paddingTop: 68 }} />
      <Breadcrumb items={[{ label: "Liên hệ" }]} />

      <section className="section-padding bg-white">
        <div className="container-psd">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-4">
              <h2 className="text-[22px] font-bold text-[#1a1a1a] mb-6">Thông tin liên hệ</h2>

              <div className="space-y-5 mb-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#e82127]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-[#e82127]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[14px] text-[#1a1a1a] mb-1">Trụ sở chính</div>
                    <p className="text-[14px] text-[#6e6e74] leading-relaxed">235–237 Khuất Duy Tiến,<br />Phường Đại Mỗ, Hà Nội</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#e82127]/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-[#e82127]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[14px] text-[#1a1a1a] mb-1">Điện thoại</div>
                    <a href="tel:09782741534" className="text-[14px] text-[#6e6e74] hover:text-[#e82127] transition-colors">09782 741 534</a><br />
                    <a href="tel:0898558669" className="text-[14px] text-[#6e6e74] hover:text-[#e82127] transition-colors">(+84) 89 8558 669</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#e82127]/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-[#e82127]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[14px] text-[#1a1a1a] mb-1">Email</div>
                    <a href="mailto:psdgroup.hotmail@gmail.com" className="text-[14px] text-[#6e6e74] hover:text-[#e82127] transition-colors">psdgroup.hotmail@gmail.com</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#e82127]/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-[#e82127]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[14px] text-[#1a1a1a] mb-1">Giờ làm việc</div>
                    <p className="text-[14px] text-[#6e6e74]">Thứ 2 – Thứ 6: 8:00 – 17:30<br />Thứ 7: 8:00 – 12:00</p>
                  </div>
                </div>
              </div>

              {/* Google Maps */}
              <div className="rounded-2xl overflow-hidden border border-[#e5e5e7]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.793245392636!2d105.79267887587183!3d21.000923388732843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acbaca908203%3A0x1ca03345fc8e3cfe!2zMjM1IEtodeG6pXQgRHV5IFRp4bq_biwgxJDhuqFpIE3hu5csIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1783425697518!5m2!1svi!2s"
                  width="100%"
                  height="220"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-8">
              <div className="card-psd p-8 bg-white">
                <h2 className="text-[22px] font-bold text-[#1a1a1a] mb-2">Gửi tin nhắn</h2>
                <p className="text-[14px] text-[#6e6e74] mb-8">Điền thông tin bên dưới — chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</p>

                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[13px] font-medium text-[#1a1a1a] mb-2">Họ và tên <span className="text-[#e82127]">*</span></label>
                      <input type="text" placeholder="Nguyễn Văn A" className="w-full px-4 py-3 rounded-lg border border-[#e5e5e7] text-[14px] text-[#1a1a1a] placeholder:text-[#6e6e74]/50 focus:outline-none focus:border-[#e82127] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#1a1a1a] mb-2">Email <span className="text-[#e82127]">*</span></label>
                      <input type="email" placeholder="email@example.com" className="w-full px-4 py-3 rounded-lg border border-[#e5e5e7] text-[14px] text-[#1a1a1a] placeholder:text-[#6e6e74]/50 focus:outline-none focus:border-[#e82127] transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[13px] font-medium text-[#1a1a1a] mb-2">Số điện thoại</label>
                      <input type="tel" placeholder="0912 345 678" className="w-full px-4 py-3 rounded-lg border border-[#e5e5e7] text-[14px] text-[#1a1a1a] placeholder:text-[#6e6e74]/50 focus:outline-none focus:border-[#e82127] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#1a1a1a] mb-2">Chủ đề <span className="text-[#e82127]">*</span></label>
                      <select className="w-full px-4 py-3 rounded-lg border border-[#e5e5e7] text-[14px] text-[#6e6e74] focus:outline-none focus:border-[#e82127] transition-colors bg-white">
                        <option value="">Chọn chủ đề</option>
                        <option>Hợp tác đầu tư</option>
                        <option>Truyền thông & Báo chí</option>
                        <option>Tuyển dụng</option>
                        <option>Dự án</option>
                        <option>Liên hệ chung</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#1a1a1a] mb-2">Nội dung <span className="text-[#e82127]">*</span></label>
                    <textarea
                      rows={6}
                      placeholder="Mô tả chi tiết nhu cầu hoặc câu hỏi của bạn..."
                      className="w-full px-4 py-3 rounded-lg border border-[#e5e5e7] text-[14px] text-[#1a1a1a] placeholder:text-[#6e6e74]/50 focus:outline-none focus:border-[#e82127] transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full justify-center gap-2 py-3.5 text-[15px]"
                  >
                    <Send size={17} />
                    Gửi tin nhắn
                  </button>
                  <p className="text-[12px] text-[#6e6e74] text-center">
                    Bằng cách gửi form, bạn đồng ý với{" "}
                    <a href="/chinh-sach-bao-mat" className="text-[#e82127] hover:underline">Chính sách bảo mật</a>{" "}
                    của PSD Group.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
