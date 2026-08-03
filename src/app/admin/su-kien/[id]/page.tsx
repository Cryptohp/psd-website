"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, GripVertical, Save, ExternalLink, Users, Upload, X, ImageIcon } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
type PartnerLogo = { id: string; name: string; logo: string };
type ScheduleItem = { id: string; startTime: string; endTime: string; title: string; description: string; itemType: string };
type Question = {
  id: string; text: string; type: "single" | "multiple";
  required: boolean; showFor: "ALL" | "ATTENDING" | "DECLINED"; options: string[];
};

/* ─── Image upload field ────────────────────────────────────────────────────── */
function ImageUploadField({ label, value, onChange, hint }: {
  label: string; value: string; onChange: (url: string) => void; hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(file: File) {
    setErr(""); setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setErr(data.error ?? "Upload thất bại"); return; }
    onChange(data.url);
  }

  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (file) handleFile(file); e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0]; if (file) handleFile(file);
  }

  const inputCls = "w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e82127] transition-colors";

  return (
    <div>
      <label className="block text-sm font-medium text-[#333] mb-1">{label}</label>
      {hint && <p className="text-xs text-[#888] mb-2">{hint}</p>}

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-[#eee] group">
          <img src={value} alt="preview" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => fileRef.current?.click()}
              className="bg-white text-[#333] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow">
              <Upload size={12} /> Thay ảnh
            </button>
            <button type="button" onClick={() => onChange("")}
              className="bg-white text-red-500 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow">
              <X size={12} /> Xóa
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={onDrop} onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[#ddd] hover:border-[#e82127]/50 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors bg-[#fafafa] hover:bg-[#fff8f8]"
        >
          <ImageIcon size={28} className="text-[#ccc]" />
          <p className="text-sm font-medium text-[#888]">
            {uploading ? "Đang tải lên..." : "Kéo thả hoặc click để chọn ảnh"}
          </p>
          <p className="text-xs text-[#bbb]">JPG, PNG, WEBP · Tối đa 5MB</p>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onInput} />

      {/* URL fallback */}
      <div className="mt-2 flex gap-2 items-center">
        <input value={value} onChange={e => onChange(e.target.value)}
          placeholder="hoặc dán URL ảnh..." className={inputCls + " flex-1 text-xs"} />
      </div>

      {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
    </div>
  );
}

const HERO_THEMES = [
  { id: "dark-navy", label: "Navy tối", bg: "#0C1422", accent: "#C4913A" },
  { id: "dark-forest", label: "Xanh rừng", bg: "#0A1A12", accent: "#7CB87A" },
  { id: "dark-wine", label: "Đỏ rượu", bg: "#1A0A0E", accent: "#C4836A" },
  { id: "dark-slate", label: "Xám đá", bg: "#111318", accent: "#A0A8B8" },
  { id: "dark-earth", label: "Nâu đất", bg: "#120D08", accent: "#C4A06A" },
];

/* ─── Schedule item types ────────────────────────────────────────────────────── */
const ITEM_TYPES = [
  { id: "general",   label: "Chung",      emoji: "📋", color: "#C4913A", bg: "#FDF6EC" },
  { id: "ceremony",  label: "Nghi lễ",    emoji: "🏛️", color: "#B8382B", bg: "#FEF2F2" },
  { id: "speech",    label: "Phát biểu",  emoji: "🎤", color: "#1D5FA8", bg: "#EFF6FF" },
  { id: "meal",      label: "Tiệc / Ăn",  emoji: "🍽️", color: "#2E7D52", bg: "#F0FDF4" },
  { id: "break",     label: "Nghỉ giải lao", emoji: "☕", color: "#6B7280", bg: "#F9FAFB" },
  { id: "photo",     label: "Chụp ảnh",   emoji: "📸", color: "#7C3AED", bg: "#F5F3FF" },
  { id: "music",     label: "Văn nghệ",   emoji: "🎵", color: "#BE185D", bg: "#FDF2F8" },
  { id: "transport", label: "Di chuyển",  emoji: "🚌", color: "#C2610C", bg: "#FFF7ED" },
] as const;

/* ─── Sub-editors ───────────────────────────────────────────────────────────── */
function ScheduleEditor({ items, onChange }: { items: ScheduleItem[]; onChange: (s: ScheduleItem[]) => void }) {
  const cls = "border border-[#ddd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e82127] transition-colors";
  const dragId = useRef<string | null>(null);
  const dragOverId = useRef<string | null>(null);

  function add() {
    onChange([...items, { id: Date.now().toString(), startTime: "", endTime: "", title: "", description: "", itemType: "general" }]);
  }
  function update(id: string, key: keyof ScheduleItem, val: string) {
    onChange(items.map(s => s.id === id ? { ...s, [key]: val } : s));
  }
  function remove(id: string) { onChange(items.filter(s => s.id !== id)); }

  function handleDragStart(id: string) { dragId.current = id; }
  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    dragOverId.current = id;
  }
  function handleDrop() {
    if (!dragId.current || !dragOverId.current || dragId.current === dragOverId.current) return;
    const from = items.findIndex(s => s.id === dragId.current);
    const to   = items.findIndex(s => s.id === dragOverId.current);
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
    dragId.current = null;
    dragOverId.current = null;
  }

  return (
    <div className="space-y-2">
      {items.map((s, i) => {
        const typeInfo = ITEM_TYPES.find(t => t.id === s.itemType) ?? ITEM_TYPES[0];
        return (
          <div key={s.id}
            draggable
            onDragStart={() => handleDragStart(s.id)}
            onDragOver={e => handleDragOver(e, s.id)}
            onDrop={handleDrop}
            className="bg-white border border-[#eee] rounded-xl overflow-hidden transition-shadow hover:shadow-sm"
            style={{ borderLeft: `3px solid ${typeInfo.color}` }}
          >
            {/* Header row */}
            <div className="flex items-center gap-2 px-3 pt-3 pb-2">
              <GripVertical size={15} className="text-[#ccc] flex-shrink-0 cursor-grab active:cursor-grabbing" />
              <span className="text-base leading-none select-none">{typeInfo.emoji}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider flex-1"
                style={{ color: typeInfo.color }}>
                {typeInfo.label}
              </span>
              <span className="text-[10px] text-[#bbb]">#{i + 1}</span>
              <button type="button" onClick={() => remove(s.id)} className="text-[#ccc] hover:text-red-400 ml-1">
                <Trash2 size={13} />
              </button>
            </div>

            {/* Type selector */}
            <div className="px-3 pb-2">
              <div className="flex flex-wrap gap-1">
                {ITEM_TYPES.map(t => (
                  <button key={t.id} type="button" onClick={() => update(s.id, "itemType", t.id)}
                    title={t.label}
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      s.itemType === t.id
                        ? "border-transparent font-semibold"
                        : "border-[#eee] text-[#999] hover:border-[#ddd]"
                    }`}
                    style={s.itemType === t.id ? { background: t.bg, color: t.color, borderColor: t.color + "40" } : {}}
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="px-3 pb-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-[#999] mb-1 uppercase tracking-wider">Giờ bắt đầu</label>
                  <input value={s.startTime} onChange={e => update(s.id, "startTime", e.target.value)}
                    placeholder="08:00" className={cls + " w-full"} />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#999] mb-1 uppercase tracking-wider">Giờ kết thúc</label>
                  <input value={s.endTime} onChange={e => update(s.id, "endTime", e.target.value)}
                    placeholder="08:30" className={cls + " w-full"} />
                </div>
              </div>
              <input value={s.title} onChange={e => update(s.id, "title", e.target.value)}
                placeholder="Tên hoạt động *" className={cls + " w-full font-medium"} />
              <input value={s.description} onChange={e => update(s.id, "description", e.target.value)}
                placeholder="Mô tả chi tiết (tùy chọn)" className={cls + " w-full text-[#666]"} />
            </div>
          </div>
        );
      })}
      <button type="button" onClick={add}
        className="flex items-center gap-2 text-sm font-medium text-[#e82127] hover:text-[#c91c21] border-2 border-dashed border-[#e82127]/30 hover:border-[#e82127]/60 rounded-xl px-4 py-3 w-full justify-center transition-colors mt-1"
      >
        <Plus size={16} /> Thêm mục chương trình
      </button>
    </div>
  );
}

function LogoEditor({ investorName, investorLogo, partners, onInvestorName, onInvestorLogo, onPartners }: {
  investorName: string; investorLogo: string; partners: PartnerLogo[];
  onInvestorName: (v: string) => void; onInvestorLogo: (v: string) => void; onPartners: (p: PartnerLogo[]) => void;
}) {
  const cls = "w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e82127] transition-colors";
  function addPartner() { onPartners([...partners, { id: Date.now().toString(), name: "", logo: "" }]); }
  function upd(id: string, key: "name" | "logo", val: string) {
    onPartners(partners.map(p => p.id === id ? { ...p, [key]: val } : p));
  }
  function rem(id: string) { onPartners(partners.filter(p => p.id !== id)); }

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
            <img src={investorLogo} alt="preview" className="h-8 object-contain border border-[#eee] rounded p-1 bg-white"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <span className="text-xs text-[#888]">Xem trước logo</span>
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-[#555] uppercase tracking-wider">Đối tác / Đồng hành</p>
          <button type="button" onClick={addPartner} className="flex items-center gap-1 text-xs text-[#e82127] font-medium hover:text-[#c91c21]">
            <Plus size={13} /> Thêm đối tác
          </button>
        </div>
        <div className="space-y-3">
          {partners.map((p, i) => (
            <div key={p.id} className="flex gap-2 items-start bg-[#fafafa] border border-[#eee] rounded-xl p-3">
              <span className="text-[#ccc] text-xs mt-3 w-4 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input value={p.name} onChange={e => upd(p.id, "name", e.target.value)} placeholder="Tên đối tác" className={cls} />
                <input value={p.logo} onChange={e => upd(p.id, "logo", e.target.value)} placeholder="URL logo" className={cls} />
              </div>
              {p.logo && <img src={p.logo} alt="" className="h-8 w-8 object-contain border border-[#eee] rounded bg-white flex-shrink-0 mt-1"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
              <button type="button" onClick={() => rem(p.id)} className="text-[#ccc] hover:text-red-400 flex-shrink-0 mt-2"><Trash2 size={15} /></button>
            </div>
          ))}
          {partners.length === 0 && <p className="text-xs text-[#bbb] text-center py-3">Chưa có đối tác nào.</p>}
        </div>
      </div>
    </div>
  );
}

function ProjectImagesEditor({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const cls = "w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e82127] transition-colors";
  function add() { onChange([...images, ""]); }
  function upd(idx: number, val: string) { const n = [...images]; n[idx] = val; onChange(n); }
  function rem(idx: number) { onChange(images.filter((_, i) => i !== idx)); }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#888] -mt-2">Hiển thị dưới dạng gallery cuộn ngang trên trang thư mời.</p>
      {images.map((url, i) => (
        <div key={i} className="flex gap-2 items-center">
          <span className="text-[#ccc] text-xs w-5 flex-shrink-0">{i + 1}.</span>
          <input value={url} onChange={e => upd(i, e.target.value)} placeholder="https://... (URL ảnh phối cảnh)" className={cls + " flex-1"} />
          {url && <img src={url} alt="" className="h-9 w-14 object-cover border border-[#eee] rounded flex-shrink-0"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
          <button type="button" onClick={() => rem(i)} className="text-[#ccc] hover:text-red-400 flex-shrink-0"><Trash2 size={15} /></button>
        </div>
      ))}
      <button type="button" onClick={add}
        className="flex items-center gap-2 text-sm font-medium text-[#e82127] hover:text-[#c91c21] border-2 border-dashed border-[#e82127]/30 hover:border-[#e82127]/60 rounded-xl px-4 py-3 w-full justify-center transition-colors"
      >
        <Plus size={16} /> Thêm ảnh phối cảnh
      </button>
    </div>
  );
}

function QuestionEditor({ questions, onChange }: { questions: Question[]; onChange: (qs: Question[]) => void }) {
  const cls = "border border-[#ddd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e82127] transition-colors";
  function add() {
    onChange([...questions, { id: Date.now().toString(), text: "", type: "single", required: true, showFor: "ALL", options: ["", ""] }]);
  }
  function upd(id: string, patch: Partial<Question>) { onChange(questions.map(q => q.id === id ? { ...q, ...patch } : q)); }
  function rem(id: string) { onChange(questions.filter(q => q.id !== id)); }
  function addOpt(qId: string) { upd(qId, { options: [...(questions.find(q => q.id === qId)?.options ?? []), ""] }); }
  function updOpt(qId: string, idx: number, val: string) {
    const q = questions.find(q => q.id === qId); if (!q) return;
    const opts = [...q.options]; opts[idx] = val; upd(qId, { options: opts });
  }
  function remOpt(qId: string, idx: number) {
    const q = questions.find(q => q.id === qId);
    if (!q || q.options.length <= 2) return;
    upd(qId, { options: q.options.filter((_, i) => i !== idx) });
  }
  return (
    <div className="space-y-4">
      <p className="text-xs text-[#888] -mt-2">Khách mời trả lời khi xác nhận tham dự.</p>
      {questions.map((q, qi) => (
        <div key={q.id} className="bg-[#fafafa] border border-[#eee] rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-2">
            <GripVertical size={16} className="text-[#ccc] mt-2.5 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <input value={q.text} onChange={e => upd(q.id, { text: e.target.value })} placeholder={`Câu hỏi ${qi + 1}`} className={cls + " w-full font-medium"} />
              <div className="flex flex-wrap gap-2">
                <select value={q.type} onChange={e => upd(q.id, { type: e.target.value as "single" | "multiple" })} className={cls + " text-xs"}>
                  <option value="single">Chọn 1 đáp án</option>
                  <option value="multiple">Chọn nhiều đáp án</option>
                </select>
                <select value={q.showFor} onChange={e => upd(q.id, { showFor: e.target.value as Question["showFor"] })} className={cls + " text-xs"}>
                  <option value="ALL">Tất cả khách</option>
                  <option value="ATTENDING">Chỉ khách tham dự</option>
                  <option value="DECLINED">Chỉ khách từ chối</option>
                </select>
                <label className="flex items-center gap-1.5 text-xs text-[#555] cursor-pointer select-none">
                  <input type="checkbox" checked={q.required} onChange={e => upd(q.id, { required: e.target.checked })} className="rounded" />
                  Bắt buộc
                </label>
              </div>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex gap-2 items-center">
                    <span className="text-[#ccc] text-xs w-4 flex-shrink-0">{oi + 1}.</span>
                    <input value={opt} onChange={e => updOpt(q.id, oi, e.target.value)} placeholder={`Lựa chọn ${oi + 1}`} className={cls + " flex-1"} />
                    <button type="button" onClick={() => remOpt(q.id, oi)} className="text-[#ccc] hover:text-red-400 flex-shrink-0"><Trash2 size={14} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addOpt(q.id)} className="flex items-center gap-1 text-xs text-[#e82127] font-medium mt-1">
                  <Plus size={13} /> Thêm lựa chọn
                </button>
              </div>
            </div>
            <button type="button" onClick={() => rem(q.id)} className="text-[#ccc] hover:text-red-400 flex-shrink-0 mt-1"><Trash2 size={16} /></button>
          </div>
        </div>
      ))}
      <button type="button" onClick={add}
        className="flex items-center gap-2 text-sm font-medium text-[#e82127] hover:text-[#c91c21] border-2 border-dashed border-[#e82127]/30 hover:border-[#e82127]/60 rounded-xl px-4 py-3 w-full justify-center transition-colors"
      >
        <Plus size={16} /> Thêm câu hỏi
      </button>
    </div>
  );
}

/* ─── Section / Field helpers ───────────────────────────────────────────────── */
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
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} className={cls} placeholder={placeholder} />}
    </div>
  );
}

/* ─── Main edit page ────────────────────────────────────────────────────────── */
export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [slug, setSlugState] = useState("");
  const [guestCount, setGuestCount] = useState(0);

  const [form, setForm] = useState({
    name: "", slug: "", eventCode: "", description: "",
    startTime: "", checkInTime: "", rsvpDeadline: "",
    locationName: "", locationAddress: "", mapUrl: "",
    dressCode: "", hotline: "", coverImage: "", mobileCoverImage: "", status: "DRAFT",
  });

  const [heroTheme, setHeroTheme] = useState("dark-navy");
  const [heroBgImage, setHeroBgImage] = useState("");
  const [heroGuestFont, setHeroGuestFont] = useState("be-vietnam");
  const [heroTitleFont, setHeroTitleFont] = useState("be-vietnam");
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [investorName, setInvestorName] = useState("");
  const [investorLogo, setInvestorLogo] = useState("");
  const [partners, setPartners] = useState<PartnerLogo[]>([]);
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  // Load event data
  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/su-kien/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(ev => {
        setSlugState(ev.slug);
        setGuestCount(ev._count?.guests ?? 0);
        setForm({
          name: ev.name ?? "",
          slug: ev.slug ?? "",
          eventCode: ev.eventCode ?? "",
          description: ev.description ?? "",
          startTime: ev.startTime ? ev.startTime.slice(0, 16) : "",
          checkInTime: ev.checkInTime ? ev.checkInTime.slice(0, 16) : "",
          rsvpDeadline: ev.rsvpDeadline ? ev.rsvpDeadline.slice(0, 16) : "",
          locationName: ev.locationName ?? "",
          locationAddress: ev.locationAddress ?? "",
          mapUrl: ev.mapUrl ?? "",
          dressCode: ev.dressCode ?? "",
          hotline: ev.hotline ?? "",
          coverImage: ev.coverImage ?? "",
          mobileCoverImage: ev.mobileCoverImage ?? "",
          status: ev.status ?? "DRAFT",
        });

        const s = ev.settings ?? {};
        setHeroTheme(s.heroTheme ?? "dark-navy");
        setHeroBgImage(s.heroBgImage ?? "");
        setHeroGuestFont(s.heroGuestFont ?? "georgia");
        setHeroTitleFont(s.heroTitleFont ?? "system");
        setInvestorName(s.investorName ?? "");
        setInvestorLogo(s.investorLogo ?? "");
        setPartners((s.partnerLogos ?? []).map((p: { name: string; logo: string }, i: number) => ({
          id: String(i), name: p.name ?? "", logo: p.logo ?? "",
        })));
        setProjectImages(s.projectImages ?? []);
        setQuestions((s.questions ?? []).map((q: Question) => ({
          ...q,
          options: q.options ?? [],
        })));

        setSchedules((ev.schedules ?? []).map((s: { id: string; startTime: string; endTime: string | null; title: string; description: string | null; itemType: string | null }) => ({
          id: s.id,
          startTime: s.startTime ?? "",
          endTime: s.endTime ?? "",
          title: s.title ?? "",
          description: s.description ?? "",
          itemType: s.itemType ?? "general",
        })));
      })
      .catch(() => setError("Không tải được dữ liệu sự kiện"))
      .finally(() => setLoading(false));
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch(`/api/admin/su-kien/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          settings: {
            heroTheme,
            heroBgImage: heroBgImage || undefined,
            heroGuestFont: heroGuestFont || undefined,
            heroTitleFont: heroTitleFont || undefined,
            investorName: investorName || undefined,
            investorLogo: investorLogo || undefined,
            partnerLogos: partners.filter(p => p.name || p.logo).length > 0
              ? partners.filter(p => p.name || p.logo) : undefined,
            projectImages: projectImages.filter(Boolean).length > 0
              ? projectImages.filter(Boolean) : undefined,
            questions: questions.length > 0 ? questions : undefined,
          },
          schedules: schedules.filter(s => s.title).map((s, i) => ({
            startTime: s.startTime, endTime: s.endTime || undefined,
            title: s.title, description: s.description || undefined,
            itemType: s.itemType || "general", sortOrder: i,
          })),
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Lỗi lưu"); return; }
      setSaved(true);
      setSlugState(form.slug);
      setTimeout(() => setSaved(false), 3000);
    } catch { setError("Lỗi kết nối"); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="text-center py-16 text-[#aaa]">Đang tải...</div>;

  const currentTheme = HERO_THEMES.find(t => t.id === heroTheme) ?? HERO_THEMES[0];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/su-kien" className="text-[#6e6e74] hover:text-[#111]"><ArrowLeft size={18} /></Link>
          <div>
            <h1 className="text-xl font-bold text-[#111114]">Chỉnh sửa sự kiện</h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-sm text-[#6e6e74]">{form.name || "—"}</span>
              <span className="flex items-center gap-1 text-xs text-[#aaa]">
                <Users size={12} /> {guestCount} khách
              </span>
              <Link href={`/admin/su-kien/${id}/khach`} className="text-xs text-[#e82127] hover:underline">Quản lý khách</Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {form.status === "PUBLISHED" && slug && (
            <a href={`/su-kien/${slug}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#666] border border-[#ddd] px-3 py-2 rounded-lg hover:bg-[#f5f5f5] transition-colors"
            >
              <ExternalLink size={13} /> Xem trang
            </a>
          )}
          <button form="edit-form" type="submit" disabled={saving}
            className="flex items-center gap-2 bg-[#e82127] hover:bg-[#c91c21] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
          >
            <Save size={15} /> {saving ? "Đang lưu..." : saved ? "Đã lưu ✓" : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      {error && <p className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">{error}</p>}

      <form id="edit-form" onSubmit={save} className="max-w-2xl space-y-5">

        {/* ── Thông tin chung ── */}
        <Section title="Thông tin chung">
          <Field label="Tên sự kiện *" value={form.name} onChange={v => set("name", v)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug URL *" value={form.slug} onChange={v => set("slug", v)} placeholder="yen-my-2026" />
            <Field label="Mã sự kiện *" value={form.eventCode} onChange={v => set("eventCode", v)} placeholder="YM2026" />
          </div>
          <Field label="Mô tả / Giới thiệu dự án" value={form.description} onChange={v => set("description", v)} multiline />
        </Section>

        {/* ── Thời gian ── */}
        <Section title="Thời gian">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Giờ bắt đầu *" type="datetime-local" value={form.startTime} onChange={v => set("startTime", v)} />
            <Field label="Giờ đón khách" type="datetime-local" value={form.checkInTime} onChange={v => set("checkInTime", v)} />
            <Field label="Hạn RSVP" type="datetime-local" value={form.rsvpDeadline} onChange={v => set("rsvpDeadline", v)} />
          </div>
        </Section>

        {/* ── Địa điểm ── */}
        <Section title="Địa điểm">
          <Field label="Tên địa điểm" value={form.locationName} onChange={v => set("locationName", v)} />
          <Field label="Địa chỉ đầy đủ" value={form.locationAddress} onChange={v => set("locationAddress", v)} />
          <Field label="Link Google Maps" value={form.mapUrl} onChange={v => set("mapUrl", v)} placeholder="https://maps.google.com/..." />
        </Section>

        {/* ── Chương trình ── */}
        <Section title="Chương trình sự kiện (timeline)">
          <ScheduleEditor items={schedules} onChange={setSchedules} />
        </Section>

        {/* ── Thiết kế nền thư mời ── */}
        <Section title="Thiết kế nền thư mời">
          <div>
            <label className="block text-sm font-medium text-[#333] mb-3">Màu nền hero</label>
            <div className="grid grid-cols-5 gap-2">
              {HERO_THEMES.map(t => (
                <button key={t.id} type="button" onClick={() => setHeroTheme(t.id)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                    heroTheme === t.id ? "border-[#e82127]" : "border-[#f0f0f0] hover:border-[#ddd]"
                  }`}
                >
                  <div className="w-full h-10 rounded-lg flex items-center justify-center" style={{ background: t.bg }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: t.accent }} />
                  </div>
                  <span className="text-[10px] text-[#666] text-center leading-tight">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hero background image */}
          <ImageUploadField
            label="Ảnh nền hero"
            value={heroBgImage}
            onChange={setHeroBgImage}
            hint="Nếu có ảnh, màu nền ở trên sẽ bị ẩn. Để trống để dùng màu đặc."
          />

          {/* Font pickers */}
          {(() => {
            const FONTS = [
              { id: "be-vietnam", label: "Be Vietnam Pro ★", sample: "Nguyễn Văn A" },
              { id: "georgia", label: "Georgia", sample: "Nguyễn Văn A" },
              { id: "playfair", label: "Playfair Display", sample: "Nguyễn Văn A" },
              { id: "times", label: "Times New Roman", sample: "Nguyễn Văn A" },
              { id: "garamond", label: "Garamond", sample: "Nguyễn Văn A" },
              { id: "system", label: "Sans-serif", sample: "Nguyễn Văn A" },
              { id: "arial", label: "Arial", sample: "Nguyễn Văn A" },
            ];
            const FONT_CSS: Record<string, string> = {
              "be-vietnam": "var(--font-be-vietnam),'Be Vietnam Pro',sans-serif",
              georgia: "Georgia,'Times New Roman',serif",
              playfair: "'Playfair Display',Georgia,serif",
              times: "'Times New Roman',Times,serif",
              garamond: "Garamond,'Times New Roman',serif",
              system: "system-ui,sans-serif",
              arial: "Arial,Helvetica,sans-serif",
            };
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">Font tên khách mời</label>
                  <div className="space-y-1.5">
                    {FONTS.map(f => (
                      <button key={f.id} type="button" onClick={() => setHeroGuestFont(f.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                          heroGuestFont === f.id ? "border-[#e82127] bg-red-50" : "border-[#f0f0f0] hover:border-[#ddd]"
                        }`}
                      >
                        <span className="text-xs text-[#888] w-20 flex-shrink-0">{f.label}</span>
                        <span className="text-sm text-[#222]" style={{ fontFamily: FONT_CSS[f.id] }}>{f.sample}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">Font tên sự kiện</label>
                  <div className="space-y-1.5">
                    {FONTS.map(f => (
                      <button key={f.id} type="button" onClick={() => setHeroTitleFont(f.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                          heroTitleFont === f.id ? "border-[#e82127] bg-red-50" : "border-[#f0f0f0] hover:border-[#ddd]"
                        }`}
                      >
                        <span className="text-xs text-[#888] w-20 flex-shrink-0">{f.label}</span>
                        <span className="text-xs text-[#222] uppercase tracking-widest" style={{ fontFamily: FONT_CSS[f.id] }}>LỄ KHỞI CÔNG</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Live preview strip */}
          {(() => {
            const FONT_CSS: Record<string, string> = {
              "be-vietnam": "var(--font-be-vietnam),'Be Vietnam Pro',sans-serif",
              georgia: "Georgia,'Times New Roman',serif",
              playfair: "'Playfair Display',Georgia,serif",
              times: "'Times New Roman',Times,serif",
              garamond: "Garamond,'Times New Roman',serif",
              system: "system-ui,sans-serif",
              arial: "Arial,Helvetica,sans-serif",
            };
            return (
              <div className="rounded-xl overflow-hidden border border-[#f0f0f0] relative"
                style={{ background: heroBgImage ? undefined : currentTheme.bg }}
              >
                {heroBgImage && (
                  <img src={heroBgImage} alt="" className="absolute inset-0 w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
                {heroBgImage && <div className="absolute inset-0 bg-black/60" />}
                <div className="relative z-10">
                  <div className="h-1 w-full" style={{ background: currentTheme.accent, opacity: 0.5 }} />
                  <div className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-2 mb-3">
                      <div className="h-px w-8" style={{ background: currentTheme.accent, opacity: 0.5 }} />
                      <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: currentTheme.accent, opacity: 0.7 }}>Trân trọng kính mời</span>
                      <div className="h-px w-8" style={{ background: currentTheme.accent, opacity: 0.5 }} />
                    </div>
                    <p className="text-base font-semibold mb-1" style={{ color: "#F5EFE2", fontFamily: FONT_CSS[heroGuestFont] }}>Nguyễn Văn Minh</p>
                    <div className="flex items-center gap-2 justify-center my-2">
                      <div className="h-px w-10" style={{ background: currentTheme.accent, opacity: 0.4 }} />
                      <div className="w-1.5 h-1.5 rotate-45" style={{ background: currentTheme.accent, opacity: 0.7 }} />
                      <div className="h-px w-10" style={{ background: currentTheme.accent, opacity: 0.4 }} />
                    </div>
                    <p className="text-xs uppercase tracking-widest font-bold" style={{ color: "#F5EFE2", opacity: 0.8, fontFamily: FONT_CSS[heroTitleFont] }}>
                      {form.name || "Tên sự kiện"}
                    </p>
                  </div>
                  <div className="h-1 w-full" style={{ background: currentTheme.accent, opacity: 0.3 }} />
                </div>
              </div>
            );
          })()}

          <ImageUploadField
            label="Ảnh bìa (hiển thị phần thông tin bên dưới)"
            value={form.coverImage}
            onChange={v => set("coverImage", v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Trang phục" value={form.dressCode} onChange={v => set("dressCode", v)} />
            <Field label="Hotline BTC" value={form.hotline} onChange={v => set("hotline", v)} />
          </div>
        </Section>

        {/* ── Logo ── */}
        <Section title="Logo chủ đầu tư & đối tác">
          <LogoEditor
            investorName={investorName} investorLogo={investorLogo} partners={partners}
            onInvestorName={setInvestorName} onInvestorLogo={setInvestorLogo} onPartners={setPartners}
          />
        </Section>

        {/* ── Ảnh phối cảnh ── */}
        <Section title="Ảnh phối cảnh dự án">
          <ProjectImagesEditor images={projectImages} onChange={setProjectImages} />
        </Section>

        {/* ── Câu hỏi ── */}
        <Section title="Câu hỏi thu thập phản hồi">
          <QuestionEditor questions={questions} onChange={setQuestions} />
        </Section>

        {/* ── Trạng thái ── */}
        <Section title="Trạng thái xuất bản">
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">Trạng thái</label>
            <select value={form.status} onChange={e => set("status", e.target.value)}
              className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e82127]"
            >
              <option value="DRAFT">Nháp (chưa hiển thị công khai)</option>
              <option value="PUBLISHED">Xuất bản (khách mời xem được)</option>
              <option value="CLOSED">Đóng RSVP (vẫn xem được, không nhận xác nhận)</option>
              <option value="COMPLETED">Hoàn thành</option>
            </select>
          </div>
        </Section>

        <div className="flex gap-3 pt-2 pb-10">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-[#e82127] hover:bg-[#c91c21] disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            <Save size={15} /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <Link href="/admin/su-kien" className="px-6 py-3 text-sm text-[#666] hover:text-[#333] transition-colors">Hủy</Link>
        </div>
      </form>
    </div>
  );
}
