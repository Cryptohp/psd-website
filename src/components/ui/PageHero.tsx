interface PageHeroProps {
  tag?: string;
  title: string;
  highlight?: string;
  desc?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function PageHero({ tag, title, highlight, desc, breadcrumbs }: PageHeroProps) {
  return (
    <section className="relative bg-[#0f0f12] pt-[72px] overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-[#e82127]/20 via-transparent to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#e82127] to-transparent opacity-50" />

      <div className="container-psd relative z-10 py-16 lg:py-20">
        {breadcrumbs && (
          <nav className="flex items-center gap-2 text-[13px] text-white/40 mb-6">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-white/70 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-white/60">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {tag && (
          <div className="inline-flex items-center gap-2 bg-[#e82127]/15 border border-[#e82127]/25 rounded-full px-4 py-1.5 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#e82127]" />
            <span className="text-[12px] text-[#e82127] font-medium tracking-wide">{tag}</span>
          </div>
        )}

        <h1 className="text-hero text-white max-w-[720px] mb-4">
          {title}{" "}
          {highlight && <span className="text-[#e82127]">{highlight}</span>}
        </h1>

        {desc && (
          <p className="text-[17px] text-white/55 max-w-[600px] leading-relaxed">{desc}</p>
        )}
      </div>
    </section>
  );
}
