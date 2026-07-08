"use client";

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="bg-white border-b border-[#eee]">
      <div className="container-psd">
        <div className="flex items-center gap-1 py-[14px] flex-wrap">
          <Link
            href="/"
            className="flex items-center text-[#e82127] hover:text-[#c01a20] transition-colors"
          >
            <Home size={14} />
          </Link>

          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight size={13} className="text-[#bbb]" />
              {item.href && i < items.length - 1 ? (
                <Link
                  href={item.href}
                  className="text-[11px] font-semibold uppercase tracking-wider text-[#888] hover:text-[#e82127] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#e82127]">
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
