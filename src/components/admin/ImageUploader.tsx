"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload thất bại");
      onChange(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload thất bại");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      {/* URL input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... hoặc /uploads/..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 bg-white rounded-xl hover:bg-gray-50 text-[#6e6e74] transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Đang tải..." : "Tải ảnh lên"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Preview / Drop zone */}
      {value ? (
        <div className="relative">
          <img src={value} alt="preview" className="h-24 w-auto max-w-full object-contain rounded-xl border border-gray-100 bg-gray-50" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 text-[#6e6e74] transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#e82127] transition-colors cursor-pointer"
        >
          <Upload size={20} className="mx-auto mb-2 text-gray-300" />
          <p className="text-xs font-medium text-[#111114]">Kéo thả hoặc nhấn để chọn ảnh</p>
          <p className="text-xs text-[#6e6e74] mt-0.5">JPG, PNG, WEBP — tối đa 5MB</p>
        </div>
      )}
    </div>
  );
}
