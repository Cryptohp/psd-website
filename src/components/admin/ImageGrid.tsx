"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, GripVertical } from "lucide-react";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageGrid({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const dragIndex = useRef<number | null>(null);

  async function handleFiles(files: FileList) {
    setError("");
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload thất bại");
        uploaded.push(data.url);
      }
      onChange([...value, ...uploaded]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload thất bại");
    } finally {
      setUploading(false);
    }
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  /* Drag-to-reorder */
  function onDragStart(i: number) { dragIndex.current = i; }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === i) return;
    const reordered = [...value];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(i, 0, moved);
    dragIndex.current = i;
    onChange(reordered);
  }
  function onDragEnd() { dragIndex.current = null; }

  return (
    <div className="space-y-4">
      {/* Upload button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 bg-white rounded-xl hover:bg-gray-50 text-[#6e6e74] transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Đang tải lên..." : "Thêm ảnh"}
        </button>
        <span className="text-xs text-[#6e6e74]">{value.length} ảnh · kéo để sắp xếp lại</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Drop zone (when empty) */}
      {value.length === 0 && !uploading && (
        <div
          onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#e82127] transition-colors cursor-pointer"
        >
          <Upload size={22} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm font-medium text-[#111114]">Kéo thả hoặc nhấn để chọn nhiều ảnh</p>
          <p className="text-xs text-[#6e6e74] mt-1">JPG, PNG, WEBP — tối đa 5MB mỗi ảnh</p>
        </div>
      )}

      {/* Image grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {value.map((url, i) => (
            <div
              key={url + i}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => onDragOver(e, i)}
              onDragEnd={onDragEnd}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-grab active:cursor-grabbing"
            >
              <img src={url} alt={`Ảnh ${i + 1}`} className="w-full h-full object-cover" />
              {/* Drag handle hint */}
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={14} className="text-white drop-shadow" />
              </div>
              {/* Remove button */}
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 text-[#6e6e74]"
              >
                <X size={11} />
              </button>
              {/* Index badge */}
              <span className="absolute bottom-1 left-1 text-[10px] font-bold text-white bg-black/40 rounded px-1 leading-4">
                {i + 1}
              </span>
            </div>
          ))}

          {/* Add more tile */}
          <div
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#e82127] transition-colors text-gray-300 hover:text-[#e82127]"
          >
            <Upload size={18} />
            <span className="text-[10px] font-medium">Thêm</span>
          </div>
        </div>
      )}
    </div>
  );
}
