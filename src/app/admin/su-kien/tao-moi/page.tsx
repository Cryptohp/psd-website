"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";

type PartnerLogo = { id: string; name: string; logo: string };

type Question = {
  id: string;
  text: string;
  type: "single" | "multiple";
  required: boolean;
  showFor: "ALL" | "ATTENDING" | "DECLINED";
  options: string[];
};

function LogoEditor({
  investorName, investorLogo, partners,
  onInvestorName, onInvestorLogo, onPartners,
}: {
  investorName: string; investorLogo: string;
  partners: PartnerLogo[];
  onInvestorName: (v: string) => void;
  onInvestorLogo: (v: string) => void;
  onPartners: (p: PartnerLogo[]) => void;
}) {
  const cls = "w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e82127] transition-colors";

  function addPartner() {
    onPartners([...partners, { id: Date.now().toString(), name: "", logo: "" }]);
  }
  function updatePartner(id: string, key: "name" | "logo", val: string) {
    onPartners(partners.map(p => p.id === id ? { ...p, [key]: val } : p));
  }
  function removePartner(id: string) {
    onPartners(partners.filter(p => p.id !== id));
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3">Chủ đầu tư</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#666] mb-1">Tên đơn vị</label>
            <input value={investorName} onChange={e => onInvestorName(e.target.value)} className={cls} placeholder="PSD Group" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666] mb-1">URL logo</label>
            <input value={investorLogo} onChange={e => onInvestorLogo(e.target.value)} className={cls} placeholder="https://..." />
          </div>
        </div>
        {investorLogo && (
          <div className="mt-2 flex items-center gap-2">
            <img src={investorLogo} alt="preview" className="h-8 object-contain border border-[#eee] rounded p-1 bg-white" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <span className="text-xs text-[#888]">Xem trước logo</span>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-[#555] uppercase tracking-wider">Đối tác / Đồng hành</p>
          <button type="button" onClick={addPartner}
            className="flex items-center gap-1 text-xs text-[#e82127] font-medium hover:text-[#c91c21]"
          >
            <Plus size={13} /> Thêm đối tác
          </button>
        </div>
        <div className="space-y-3">
          {partners.map((p, i) => (
            <div key={p.id} className="flex gap-2 items-start bg-[#fafafa] border border-[#eee] rounded-xl p-3">
              <span className="text-[#ccc] text-xs mt-3 w-4 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input value={p.name} onChange={e => updatePartner(p.id, "name", e.target.value)}
                  placeholder="Tên đối tác" className={cls} />
                <input value={p.logo} onChange={e => updatePartner(p.id, "logo", e.target.value)}
                  placeholder="URL logo" className={cls} />
              </div>
              {p.logo && (
                <img src={p.logo} alt="" className="h-8 w-8 object-contain border border-[#eee] rounded bg-white flex-shrink-0 mt-1" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              <button type="button" onClick={() => removePartner(p.id)} className="text-[#ccc] hover:text-red-400 flex-shrink-0 mt-2">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {partners.length === 0 && (
            <p className="text-xs text-[#bbb] text-center py-3">Chưa có đối tác. Bấm &quot;Thêm đối tác&quot; để thêm.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectImagesEditor({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const cls = "w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e82127] transition-colors";

  function addImage() { onChange([...images, ""]); }
  function updateImage(idx: number, val: string) {
    const next = [...images]; next[idx] = val; onChange(next);
  }
  function removeImage(idx: number) { onChange(images.filter((_, i) => i !== idx)); }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#888] -mt-2">Ảnh phối cảnh hiển thị dưới dạng gallery ngang trên trang thư mời.</p>
      {images.map((url, i) => (
        <div key={i} className="flex gap-2 items-center">
          <span className="text-[#ccc] text-xs w-5 flex-shrink-0">{i + 1}.</span>
          <input value={url} onChange={e => updateImage(i, e.target.value)}
            placeholder="https://... (URL ảnh phối cảnh)" className={cls + " flex-1"} />
          {url && (
            <img src={url} alt="" className="h-9 w-14 object-cover border border-[#eee] rounded flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
          <button type="button" onClick={() => removeImage(i)} className="text-[#ccc] hover:text-red-400 flex-shrink-0">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button type="button" onClick={addImage}
        className="flex items-center gap-2 text-sm font-medium text-[#e82127] hover:text-[#c91c21] border-2 border-dashed border-[#e82127]/30 hover:border-[#e82127]/60 rounded-xl px-4 py-3 w-full justify-center transition-colors"
      >
        <Plus size={16} /> Thêm ảnh phối cảnh
      </button>
    </div>
  );
}

function QuestionEditor({ questions, onChange }: { questions: Question[]; onChange: (qs: Question[]) => void }) {
  function addQuestion() {
    onChange([...questions, {
      id: Date.now().toString(),
      text: "",
      type: "single",
      required: true,
      showFor: "ALL",
      options: ["", ""],
    }]);
  }

  function updateQ(id: string, patch: Partial<Question>) {
    onChange(questions.map(q => q.id === id ? { ...q, ...patch } : q));
  }

  function removeQ(id: string) {
    onChange(questions.filter(q => q.id !== id));
  }

  function addOption(qId: string) {
    updateQ(qId, { options: [...(questions.find(q => q.id === qId)?.options ?? []), ""] });
  }

  function updateOption(qId: string, idx: number, val: string) {
    const q = questions.find(q => q.id === qId);
    if (!q) return;
    const opts = [...q.options];
    opts[idx] = val;
    updateQ(qId, { options: opts });
  }

  function removeOption(qId: string, idx: number) {
    const q = questions.find(q => q.id === qId);
    if (!q || q.options.length <= 2) return;
    updateQ(qId, { options: q.options.filter((_, i) => i !== idx) });
  }

  const cls = "border border-[#ddd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e82127] transition-colors";

  return (
    <div className="space-y-4">
      {questions.map((q, qi) => (
        <div key={q.id} className="bg-[#fafafa] border border-[#eee] rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-2">
            <GripVertical size={16} className="text-[#ccc] mt-2.5 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              {/* Question text */}
              <input
                value={q.text}
                onChange={e => updateQ(q.id, { text: e.target.value })}
                placeholder={`Câu hỏi ${qi + 1}`}
                className={cls + " w-full font-medium"}
              />

              {/* Settings row */}
              <div className="flex flex-wrap gap-2">
                <select value={q.type} onChange={e => updateQ(q.id, { type: e.target.value as "single" | "multiple" })}
                  className={cls + " text-xs"}>
                  <option value="single">Chọn 1 đáp án</option>
                  <option value="multiple">Chọn nhiều đáp án</option>
                </select>
                <select value={q.showFor} onChange={e => updateQ(q.id, { showFor: e.target.value as Question["showFor"] })}
                  className={cls + " text-xs"}>
                  <option value="ALL">Tất cả khách</option>
                  <option value="ATTENDING">Chỉ khách tham dự</option>
                  <option value="DECLINED">Chỉ khách từ chối</option>
                </select>
                <label className="flex items-center gap-1.5 text-xs text-[#555] cursor-pointer select-none">
                  <input type="checkbox" checked={q.required}
                    onChange={e => updateQ(q.id, { required: e.target.checked })}
                    className="rounded" />
                  Bắt buộc
                </label>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex gap-2 items-center">
                    <span className="text-[#ccc] text-xs w-4 flex-shrink-0">{oi + 1}.</span>
                    <input
                      value={opt}
                      onChange={e => updateOption(q.id, oi, e.target.value)}
                      placeholder={`Lựa chọn ${oi + 1}`}
                      className={cls + " flex-1"}
                    />
                    <button type="button" onClick={() => removeOption(q.id, oi)}
                      className="text-[#ccc] hover:text-red-400 transition-colors flex-shrink-0"
                      title="Xóa lựa chọn"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addOption(q.id)}
                  className="flex items-center gap-1 text-xs text-[#e82127] hover:text-[#c91c21] font-medium mt-1"
                >
                  <Plus size={13} /> Thêm lựa chọn
                </button>
              </div>
            </div>
            <button type="button" onClick={() => removeQ(q.id)}
              className="text-[#ccc] hover:text-red-400 transition-colors flex-shrink-0 mt-1"
              title="Xóa câu hỏi"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}

      <button type="button" onClick={addQuestion}
        className="flex items-center gap-2 text-sm font-medium text-[#e82127] hover:text-[#c91c21] border-2 border-dashed border-[#e82127]/30 hover:border-[#e82127]/60 rounded-xl px-4 py-3 w-full justify-center transition-colors"
      >
        <Plus size={16} /> Thêm câu hỏi
      </button>
    </div>
  );
}

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "LỄ KHỞI CÔNG - DỰ ÁN KHU NHÀ Ở THÔNG MINH YÊN MỸ",
    slug: "yen-my-2026",
    eventCode: "YM2026",
    description: "Dự án Khu nhà ở Thông minh Yên Mỹ, diện tích 72.262 m², gồm 240 căn liền kề và 32 căn biệt thự, dân số dự kiến khoảng 1.120 người.",
    startTime: "2026-08-09T08:00",
    checkInTime: "2026-08-09T07:00",
    rsvpDeadline: "2026-08-08T17:00",
    locationName: "Xã Yên Mỹ, tỉnh Hưng Yên",
    locationAddress: "Xã Yên Mỹ, huyện Yên Mỹ, tỉnh Hưng Yên",
    mapUrl: "",
    dressCode: "Vest hoặc trang phục lịch sự",
    hotline: "",
    coverImage: "",
    mobileCoverImage: "",
    status: "DRAFT",
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [investorName, setInvestorName] = useState("PSD Group");
  const [investorLogo, setInvestorLogo] = useState("");
  const [partners, setPartners] = useState<PartnerLogo[]>([]);
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/su-kien", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          settings: {
            questions: questions.length > 0 ? questions : undefined,
            investorName: investorName || undefined,
            investorLogo: investorLogo || undefined,
            partnerLogos: partners.filter(p => p.name || p.logo).length > 0
              ? partners.filter(p => p.name || p.logo)
              : undefined,
            projectImages: projectImages.filter(Boolean).length > 0
              ? projectImages.filter(Boolean)
              : undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Lỗi tạo sự kiện"); return; }
      router.push(`/admin/su-kien/${data.id}/khach`);
    } catch {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/su-kien" className="text-[#6e6e74] hover:text-[#111]"><ArrowLeft size={18} /></Link>
        <h1 className="text-xl font-bold text-[#111114]">Tạo sự kiện mới</h1>
      </div>

      <form onSubmit={submit} className="max-w-2xl space-y-5">
        {error && <p className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</p>}

        <Section title="Thông tin chung">
          <Field label="Tên sự kiện *" value={form.name} onChange={v => set("name", v)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug URL *" value={form.slug} onChange={v => set("slug", v)} placeholder="yen-my-2026" />
            <Field label="Mã sự kiện *" value={form.eventCode} onChange={v => set("eventCode", v)} placeholder="YM2026" />
          </div>
          <Field label="Mô tả" value={form.description} onChange={v => set("description", v)} multiline />
        </Section>

        <Section title="Thời gian">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Thời gian bắt đầu *" type="datetime-local" value={form.startTime} onChange={v => set("startTime", v)} />
            <Field label="Giờ đón khách" type="datetime-local" value={form.checkInTime} onChange={v => set("checkInTime", v)} />
            <Field label="Hạn RSVP" type="datetime-local" value={form.rsvpDeadline} onChange={v => set("rsvpDeadline", v)} />
          </div>
        </Section>

        <Section title="Địa điểm">
          <Field label="Tên địa điểm" value={form.locationName} onChange={v => set("locationName", v)} />
          <Field label="Địa chỉ đầy đủ" value={form.locationAddress} onChange={v => set("locationAddress", v)} />
          <Field label="Link Google Maps" value={form.mapUrl} onChange={v => set("mapUrl", v)} placeholder="https://maps.google.com/..." />
        </Section>

        <Section title="Thông tin khác">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Trang phục (Dress code)" value={form.dressCode} onChange={v => set("dressCode", v)} />
            <Field label="Hotline BTC" value={form.hotline} onChange={v => set("hotline", v)} />
          </div>
          <Field label="Ảnh bìa desktop (URL)" value={form.coverImage} onChange={v => set("coverImage", v)} />
          <Field label="Ảnh bìa mobile (URL)" value={form.mobileCoverImage} onChange={v => set("mobileCoverImage", v)} />
        </Section>

        <Section title="Logo chủ đầu tư & đối tác">
          <LogoEditor
            investorName={investorName} investorLogo={investorLogo} partners={partners}
            onInvestorName={setInvestorName} onInvestorLogo={setInvestorLogo} onPartners={setPartners}
          />
        </Section>

        <Section title="Ảnh phối cảnh dự án">
          <ProjectImagesEditor images={projectImages} onChange={setProjectImages} />
        </Section>

        <Section title="Câu hỏi thu thập phản hồi">
          <p className="text-xs text-[#888] -mt-2">Khách mời sẽ trả lời các câu hỏi này khi xác nhận tham dự.</p>
          <QuestionEditor questions={questions} onChange={setQuestions} />
        </Section>

        <Section title="Trạng thái">
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">Trạng thái xuất bản</label>
            <select value={form.status} onChange={e => set("status", e.target.value)}
              className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e82127]"
            >
              <option value="DRAFT">Nháp (chưa hiển thị)</option>
              <option value="PUBLISHED">Xuất bản (khách xem được)</option>
            </select>
          </div>
        </Section>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-[#e82127] hover:bg-[#c91c21] disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            {loading ? "Đang tạo..." : "Tạo sự kiện"}
          </button>
          <Link href="/admin/su-kien" className="px-6 py-3 text-sm text-[#666] hover:text-[#333] transition-colors">Hủy</Link>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#f0f0f0] p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#aaa] mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; multiline?: boolean;
}) {
  const cls = "w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e82127] transition-colors";
  return (
    <div>
      <label className="block text-sm font-medium text-[#333] mb-1">{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className={cls + " resize-none"} placeholder={placeholder} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} className={cls} placeholder={placeholder} />
      }
    </div>
  );
}
