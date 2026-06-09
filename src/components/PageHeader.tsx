interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <div className="scripture-header">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <p
          className="text-[#9D7A2C] text-xs tracking-[0.2em] uppercase mb-3 font-serif"
          style={{ fontVariant: "small-caps" }}
        >
          {eyebrow}
        </p>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-10 bg-[#9D7A2C]/30" />
          <span className="text-[#9D7A2C]/60 text-sm">✦</span>
          <div className="h-px w-10 bg-[#9D7A2C]/30" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif text-[#F5EDD5] leading-snug mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#C8B888]/70 font-serif italic text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
