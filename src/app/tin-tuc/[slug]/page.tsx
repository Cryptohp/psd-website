import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Tag, ArrowLeft, Clock } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { readFileSync } from "fs";
import { join } from "path";

type Post = {
  id: string;
  slug: string;
  title: string;
  category: string;
  label: string;
  date: string;
  imageAlign?: string;
  image: string;
  excerpt: string;
  content: string;
  status: string;
  visible: boolean;
};

function getAllPosts(): Post[] {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "data", "tin-tuc.json"), "utf-8"));
  } catch {
    return [];
  }
}

function getPost(slug: string): Post | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

const catColor: Record<string, string> = {
  "Tin PSD Group": "bg-[#e82127]/10 text-[#e82127]",
  "Tin dự án": "bg-blue-100 text-blue-700",
  "Hoạt động cộng đồng": "bg-green-100 text-green-700",
  "Truyền thông & Báo chí": "bg-purple-100 text-purple-700",
  "Góc nhìn & Chia sẻ": "bg-orange-100 text-orange-700",
  "Tin tức": "bg-gray-100 text-gray-700",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post ? post.title : "Bài viết" };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.status !== "published" || !post.visible) notFound();

  const allPosts = getAllPosts().filter((p) => p.slug !== slug && p.status === "published" && p.visible);
  const related = allPosts.filter((p) => p.category === post.category).slice(0, 2);
  const relatedFinal = related.length > 0 ? related : allPosts.slice(0, 2);

  return (
    <div className="pt-[72px]">
      {/* Hero image */}
      <div className="relative h-[420px] lg:h-[520px] bg-[#0f0f12] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url('${post.image}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-[#0f0f12]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-psd pb-10">
            <nav className="flex items-center gap-2 text-[12px] text-white/40 mb-4">
              <Link href="/" className="hover:text-white/70">Trang chủ</Link>
              <span>/</span>
              <Link href="/tin-tuc" className="hover:text-white/70">Tin tức</Link>
              <span>/</span>
              <span className="text-white/60 line-clamp-1">{post.title}</span>
            </nav>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium mb-4 ${catColor[post.category] ?? "bg-gray-100 text-gray-700"}`}>
              <Tag size={11} />{post.category}
            </span>
            <h1 className="text-[26px] lg:text-[36px] font-bold text-white leading-snug max-w-[800px]">{post.title}</h1>
          </div>
        </div>
      </div>

      <Breadcrumb items={[{ label: "Tin tức", href: "/tin-tuc" }, { label: post.title }]} />

      {/* Content */}
      <div className="bg-white">
        <div className="container-psd py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Article */}
            <article className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#6e6e74] pb-6 mb-8 border-b border-[#e5e5e7]">
                <span className="flex items-center gap-1.5"><Calendar size={14} />{post.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} />3 phút đọc</span>
              </div>

              {/* Featured image with alignment */}
              {post.image && (() => {
                const align = post.imageAlign ?? "full";
                const imgStyle: React.CSSProperties =
                  align === "center" ? { display: "block", width: "65%", margin: "0 auto 28px", borderRadius: 8 } :
                  align === "left"   ? { float: "left",  width: "45%", marginRight: 28, marginBottom: 16, borderRadius: 8 } :
                  align === "right"  ? { float: "right", width: "45%", marginLeft:  28, marginBottom: 16, borderRadius: 8 } :
                                       { width: "100%", marginBottom: 28, borderRadius: 8 };
                return <img src={post.image} alt={post.title} style={imgStyle} />;
              })()}

              <div
                className="prose prose-lg max-w-none text-[#3f3f44] [&_h2]:text-[22px] [&_h2]:font-bold [&_h2]:text-[#1a1a1a] [&_h2]:mt-8 [&_h2]:mb-4 [&_p]:leading-relaxed [&_p]:mb-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#e82127] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-[#6e6e74] [&_blockquote]:my-6"
                dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt}</p>` }}
              />
              <div style={{ clear: "both" }} />

              <div className="mt-12 pt-6 border-t border-[#e5e5e7]">
                <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-[14px] font-medium text-[#6e6e74] hover:text-[#e82127] transition-colors">
                  <ArrowLeft size={16} /> Quay lại Tin tức
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-[88px]">
                {relatedFinal.length > 0 && (
                  <>
                    <h3 className="font-bold text-[16px] text-[#1a1a1a] mb-5">Bài viết liên quan</h3>
                    <div className="flex flex-col gap-4 mb-8">
                      {relatedFinal.map((r) => (
                        <Link key={r.id} href={`/tin-tuc/${r.slug}`} className="group flex gap-3 card-psd p-4 bg-white">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#f4f4f5] flex-shrink-0">
                            <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundImage: `url('${r.image}')` }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[13px] font-semibold text-[#1a1a1a] leading-snug line-clamp-2 group-hover:text-[#e82127] transition-colors">{r.title}</h4>
                            <span className="text-[11px] text-[#6e6e74] mt-1 flex items-center gap-1"><Calendar size={10} />{r.date}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                <div className="p-5 bg-[#e82127] rounded-2xl text-white">
                  <h4 className="font-bold text-[15px] mb-2">Nhận tin mới nhất</h4>
                  <p className="text-[13px] text-white/80 mb-4">Cập nhật hoạt động PSD Group qua email.</p>
                  <input type="email" placeholder="Email của bạn" className="w-full px-3 py-2.5 rounded-lg text-[13px] text-[#1a1a1a] mb-3 outline-none" />
                  <button className="w-full py-2.5 bg-white text-[#e82127] font-semibold text-[13px] rounded-lg hover:bg-white/90 transition-colors">
                    Đăng ký
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
