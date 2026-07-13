"use client";

import { useEditor, EditorContent, Editor, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Extension } from "@tiptap/core";
import { useState, useCallback, useRef } from "react";
import {
  Bold, Italic, UnderlineIcon, Strikethrough, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, Link2, Image as ImageIcon, List, ListOrdered,
  Quote, Undo, Redo, Highlighter, Palette, ChevronDown, Minus,
} from "lucide-react";

// Custom Image node with alignment support
function ImageNodeView({ node, updateAttributes, selected }: any) {
  const align = node.attrs.align ?? "full";
  const styleMap: Record<string, React.CSSProperties> = {
    full:   { display: "block", width: "100%", margin: "16px 0", borderRadius: 8 },
    center: { display: "block", width: "65%", margin: "16px auto", borderRadius: 8 },
    left:   { float: "left", width: "45%", marginRight: 20, marginBottom: 12, borderRadius: 8 },
    right:  { float: "right", width: "45%", marginLeft: 20, marginBottom: 12, borderRadius: 8 },
  };
  return (
    <NodeViewWrapper style={{ display: align === "left" || align === "right" ? "inline" : "block" }}>
      <div style={{ position: "relative", display: align === "full" || align === "center" ? "block" : "inline-block" }}>
        <img src={node.attrs.src} alt={node.attrs.alt ?? ""} style={styleMap[align]} />
        {selected && (
          <div style={{ position: "absolute", top: align === "full" || align === "center" ? 8 : 4, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, background: "#1a1a1a", borderRadius: 8, padding: "4px 6px", zIndex: 10 }}>
            {([
              { v: "full",   icon: "⬛", label: "Full width" },
              { v: "left",   icon: "⬅", label: "Trái" },
              { v: "center", icon: "⬜", label: "Giữa" },
              { v: "right",  icon: "➡", label: "Phải" },
            ] as const).map(({ v, icon, label }) => (
              <button
                key={v}
                type="button"
                title={label}
                onMouseDown={(e) => { e.preventDefault(); updateAttributes({ align: v }); }}
                style={{ background: align === v ? "#e82127" : "transparent", border: "none", color: "#fff", borderRadius: 5, padding: "2px 7px", fontSize: 12, cursor: "pointer", fontWeight: align === v ? 700 : 400 }}
              >
                {icon}
              </button>
            ))}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}

const CustomImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: { default: "full", parseHTML: (el) => el.getAttribute("data-align") ?? "full", renderHTML: (attrs) => ({ "data-align": attrs.align }) },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

// Custom FontSize extension
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize || null,
            renderHTML: (attrs) => {
              if (!attrs.fontSize) return {};
              return { style: `font-size: ${attrs.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: { chain: () => any }) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: { chain: () => any }) =>
          chain().setMark("textStyle", { fontSize: null }).run(),
    } as any;
  },
});

const FONT_FAMILIES = [
  { label: "Mặc định", value: "" },
  { label: "Be Vietnam Pro", value: "Be Vietnam Pro, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: "Courier New, monospace" },
];

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px", "64px"];

const HEADING_OPTIONS = [
  { label: "Đoạn văn", value: "paragraph" },
  { label: "Tiêu đề 1", value: "h1" },
  { label: "Tiêu đề 2", value: "h2" },
  { label: "Tiêu đề 3", value: "h3" },
  { label: "Tiêu đề 4", value: "h4" },
];

function ToolbarButton({
  onClick, active = false, disabled = false, title, children,
}: {
  onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors flex-shrink-0
        ${active ? "bg-[#e82127] text-white" : "text-[#444] hover:bg-gray-100"}
        ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0" />;
}

function Dropdown({
  value, options, onChange, width = "w-40",
}: {
  value: string; options: { label: string; value: string }[]; onChange: (v: string) => void; width?: string;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value) || options[0];
  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${width} flex items-center justify-between gap-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-[#333] hover:bg-gray-50 bg-white`}
      >
        <span className="truncate">{current.label}</span>
        <ChevronDown size={12} className="flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-full">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${o.value === value ? "text-[#e82127] font-semibold" : "text-[#333]"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

export default function RichEditor({ content = "", onChange, placeholder = "Nhập nội dung bài viết..." }: Props) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [fontColor, setFontColor] = useState("#111114");
  const colorInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-[#e82127] underline cursor-pointer" } }),
      CustomImage.configure({ HTMLAttributes: { class: "max-w-full" } }),
      TextStyle,
      FontSize,
      FontFamily,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[360px] px-5 py-4 focus:outline-none",
      },
    },
  });

  const getHeadingValue = useCallback(() => {
    if (!editor) return "paragraph";
    for (let i = 1; i <= 4; i++) {
      if (editor.isActive("heading", { level: i })) return `h${i}`;
    }
    return "paragraph";
  }, [editor]);

  const setHeading = useCallback((value: string) => {
    if (!editor) return;
    if (value === "paragraph") editor.chain().focus().setParagraph().run();
    else editor.chain().focus().setHeading({ level: parseInt(value[1]) as 1 | 2 | 3 | 4 }).run();
  }, [editor]);

  const getFontFamily = useCallback(() => {
    if (!editor) return "";
    const attrs = editor.getAttributes("textStyle");
    return attrs.fontFamily || "";
  }, [editor]);

  const getFontSize = useCallback(() => {
    if (!editor) return "16px";
    const attrs = editor.getAttributes("textStyle");
    return attrs.fontSize || "16px";
  }, [editor]);

  const insertLink = useCallback(() => {
    if (!editor || !linkUrl) return;
    if (editor.state.selection.empty) {
      editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkUrl}</a>`).run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkUrl("");
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const insertImage = useCallback(() => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl("");
    setShowImageInput(false);
  }, [editor, imageUrl]);

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-2xl overflow-visible bg-white focus-within:border-[#e82127] transition-colors">
      {/* Toolbar */}
      <div className="border-b border-gray-100 px-3 py-2 flex flex-wrap items-center gap-1 bg-gray-50/50 rounded-t-2xl sticky top-0 z-10">
        {/* Heading */}
        <Dropdown
          value={getHeadingValue()}
          options={HEADING_OPTIONS}
          onChange={setHeading}
          width="w-32"
        />

        <Divider />

        {/* Font family */}
        <Dropdown
          value={getFontFamily()}
          options={FONT_FAMILIES}
          onChange={(v) => {
            if (v) editor.chain().focus().setFontFamily(v).run();
            else editor.chain().focus().unsetMark("textStyle").run();
          }}
          width="w-36"
        />

        {/* Font size */}
        <Dropdown
          value={getFontSize()}
          options={FONT_SIZES.map((s) => ({ label: s, value: s }))}
          onChange={(v) => (editor.commands as any).setFontSize(v)}
          width="w-20"
        />

        <Divider />

        {/* Text style */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="In đậm (Ctrl+B)">
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="In nghiêng (Ctrl+I)">
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Gạch chân (Ctrl+U)">
          <UnderlineIcon size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Gạch ngang">
          <Strikethrough size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight({ color: "#FFF176" }).run()} active={editor.isActive("highlight")} title="Đánh dấu">
          <Highlighter size={14} />
        </ToolbarButton>

        {/* Font color */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            title="Màu chữ"
            onClick={() => colorInputRef.current?.click()}
            className="w-8 h-8 flex flex-col items-center justify-center rounded-lg hover:bg-gray-100 gap-0.5"
          >
            <Palette size={13} className="text-[#444]" />
            <div className="w-5 h-1 rounded-full" style={{ background: fontColor }} />
          </button>
          <input
            ref={colorInputRef}
            type="color"
            value={fontColor}
            onChange={(e) => {
              setFontColor(e.target.value);
              editor.chain().focus().setColor(e.target.value).run();
            }}
            className="absolute opacity-0 w-0 h-0"
          />
        </div>

        <Divider />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Căn trái">
          <AlignLeft size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Căn giữa">
          <AlignCenter size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Căn phải">
          <AlignRight size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Căn đều">
          <AlignJustify size={14} />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Danh sách">
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Danh sách số">
          <ListOrdered size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Trích dẫn">
          <Quote size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Đường kẻ ngang">
          <Minus size={14} />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton onClick={() => { setShowLinkInput(!showLinkInput); setShowImageInput(false); }} active={editor.isActive("link") || showLinkInput} title="Chèn liên kết">
          <Link2 size={14} />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton onClick={() => { setShowImageInput(!showImageInput); setShowLinkInput(false); }} active={showImageInput} title="Chèn ảnh">
          <ImageIcon size={14} />
        </ToolbarButton>

        <Divider />

        {/* History */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Hoàn tác (Ctrl+Z)">
          <Undo size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Làm lại (Ctrl+Y)">
          <Redo size={14} />
        </ToolbarButton>
      </div>

      {/* Link input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border-b border-blue-100">
          <Link2 size={14} className="text-blue-500 flex-shrink-0" />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && insertLink()}
            placeholder="https://..."
            className="flex-1 text-sm bg-transparent focus:outline-none placeholder-blue-300 text-[#111114]"
            autoFocus
          />
          <button type="button" onClick={insertLink} className="text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg">
            Chèn
          </button>
          <button type="button" onClick={() => { setShowLinkInput(false); editor.chain().focus().unsetLink().run(); }} className="text-xs text-blue-400 hover:text-blue-600 px-2">
            Bỏ link
          </button>
        </div>
      )}

      {/* Image URL input */}
      {showImageInput && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border-b border-green-100">
          <ImageIcon size={14} className="text-green-500 flex-shrink-0" />
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && insertImage()}
            placeholder="URL ảnh: https://..."
            className="flex-1 text-sm bg-transparent focus:outline-none placeholder-green-300 text-[#111114]"
            autoFocus
          />
          <button type="button" onClick={insertImage} className="text-xs font-semibold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg">
            Chèn ảnh
          </button>
          <span className="text-xs text-green-400">hoặc</span>
          <label className="text-xs font-semibold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg cursor-pointer">
            Tải lên
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("file", file);
                try {
                  const res = await fetch("/api/upload", { method: "POST", body: formData });
                  const data = await res.json();
                  if (data.url) {
                    editor.chain().focus().setImage({ src: data.url }).run();
                    setShowImageInput(false);
                  }
                } catch {}
              }}
            />
          </label>
        </div>
      )}

      {/* Editor content */}
      <EditorContent editor={editor} className="[&_.ProseMirror]:min-h-[360px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_h4]:text-lg [&_.ProseMirror_h4]:font-bold [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-[#e82127] [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-[#6e6e74] [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_hr]:border-gray-200 [&_.ProseMirror_hr]:my-4" />

      {/* Word count */}
      <div className="px-5 py-2 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-end">
        <span className="text-xs text-[#6e6e74]">
          {editor.storage.characterCount?.words?.() ?? editor.getText().trim().split(/\s+/).filter(Boolean).length} từ
        </span>
      </div>
    </div>
  );
}
