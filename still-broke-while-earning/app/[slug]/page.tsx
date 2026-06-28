import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBookBySlug } from "@/app/admin/actions";
import { BookData } from "@/lib/supabase";
import NavbarClient from "./NavbarClient";

/* ─── Image URL helper ──────────────────────────────────────── */
function imgUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/books/${path}`;
}

/* ─── Gold divider ─────────────────────────────────────────── */
function Divider() {
  return <hr className="gold-divider" />;
}

/* ─── Eyebrow row ──────────────────────────────────────────── */
function Eyebrow({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-5">
      <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c8a84b]" />
      <span className="eyebrow text-[#c8a84b]">{text}</span>
      <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c8a84b]" />
    </div>
  );
}

/* ─── BuyButton ─────────────────────────────────────────────── */
function BuyButton({ slug, price, size = "default" }: { slug: string; price: number; size?: "default" | "large" }) {
  const sizes = size === "large" ? "px-12 py-5" : "px-7 py-3";
  return (
    <Link href={`/${slug}/checkout`} className={`btn-gold ${sizes} inline-block`}>
      Buy Now — ₱{price.toLocaleString()}
    </Link>
  );
}

/* ─── Hero ──────────────────────────────────────────────────── */
function Hero({ book }: { book: BookData }) {
  const heroBg = imgUrl(book.hero_bg_url);
  const book3d = imgUrl(book.book_3d_url);
  const lines = book.hero_headline.split("\\n");

  return (
    <section className="relative overflow-hidden" style={{ height: "100svh" }}>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {heroBg ? (
          <Image src={heroBg} alt={book.title} fill className="object-cover object-[55%_65%] lg:object-center" priority />
        ) : (
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #04100a 0%, #0a2114 50%, #04100a 100%)" }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#04100a]/98 via-[#08190f]/92 to-[#04100a]/68 lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04100a]/85 via-transparent to-[#04100a]/45 lg:hidden" />
        <div className="absolute inset-0 hidden lg:block"
          style={{ background: "linear-gradient(to right, rgba(4,16,10,0.55) 0%, rgba(4,16,10,0.45) 35%, rgba(8,25,15,0.25) 58%, transparent 75%)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04100a]/80 via-transparent to-[#04100a]/30 hidden lg:block" />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(200,168,75,0.08) 0%, transparent 60%)" }} />

      {/* Mobile / Tablet */}
      <div className="relative z-20 w-full flex flex-col items-center justify-start px-6 pt-20 text-center lg:hidden" style={{ height: "100svh" }}>
        <div className="h-[42%] md:h-[58%] flex flex-col items-center justify-end w-full pb-2">
          {book3d ? (
            <Image src={book3d} alt={book.title} width={220} height={286}
              className="book-float object-contain w-[40vw] min-w-[120px] max-w-[320px] mx-auto" priority />
          ) : (
            <div className="w-[40vw] min-w-[120px] max-w-[320px] aspect-[3/4] rounded-lg"
              style={{ background: "rgba(200,168,75,0.1)", border: "1px solid rgba(200,168,75,0.2)" }} />
          )}
        </div>
        <div className="flex flex-col items-center w-full max-w-lg md:max-w-2xl mx-auto pb-10">
          <h1 className="font-display font-light text-[#e8dfc0] mb-4 text-[38px] md:text-[52px] w-full text-center"
            style={{ lineHeight: 1.2, textShadow: "0 2px 12px rgba(0,0,0,0.95), 0 4px 32px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,1)" }}>
            {lines.map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </h1>
          {book.hero_subline_1 && (
            <p className="text-[#e8dfc0]/70 mb-2 text-center w-full"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1)" }}>
              {book.hero_subline_1}
            </p>
          )}
          {book.hero_subline_2 && (
            <p className="mb-6 font-normal text-center w-full" style={{ color: "#c8a84b", textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1)" }}>
              {book.hero_subline_2}
            </p>
          )}
          <div className="flex flex-col gap-2 items-center w-full">
            <BuyButton slug={book.slug} price={book.price} size="large" />
            <p className="text-center" style={{ color: "var(--text-muted)" }}>Digital copy · Instant access</p>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="relative z-20 hidden lg:flex w-full h-screen items-center">
        <div className="max-w-6xl mx-auto w-full px-6 flex items-center">
          <div className="flex flex-col items-start max-w-xl">
            <h1 className="font-display font-light text-[#e8dfc0] mb-5"
              style={{ fontSize: "45px", lineHeight: 1.2, textShadow: "0 2px 16px rgba(4,16,10,0.9), 0 1px 4px rgba(4,16,10,0.8)" }}>
              {lines.map((line, i) => (
                <span key={i}>{i > 0 && <br />}{line}</span>
              ))}
            </h1>
            {book.hero_subline_1 && <p className="text-[#e8dfc0]/70 mb-2">{book.hero_subline_1}</p>}
            {book.hero_subline_2 && <p className="mb-8 font-normal" style={{ color: "#c8a84b" }}>{book.hero_subline_2}</p>}
            <div className="inline-flex flex-col gap-2">
              <BuyButton slug={book.slug} price={book.price} size="large" />
              <p className="text-center" style={{ color: "var(--text-muted)" }}>Digital copy · Instant access</p>
            </div>
          </div>
        </div>
        {book3d && (
          <div className="absolute top-1/2 -translate-y-[55%]"
            style={{ left: "calc(50% - 55px)", transform: "translateX(-15%) translateY(-55%)" }}>
            <Image src={book3d} alt={book.title} width={260} height={338} className="book-float object-contain" priority />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04100a] to-transparent z-10" />
    </section>
  );
}

/* ─── The Problem ───────────────────────────────────────────── */
function TheProblem({ book }: { book: BookData }) {
  const s = book.problem_section;
  if (!s?.pains?.length) return null;
  return (
    <section id="problem" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          {s.eyebrow && <Eyebrow text={s.eyebrow} />}
          {s.headline && (
            <h2 className="font-display font-light text-[#e8dfc0] mb-6" style={{ fontSize: "34px", lineHeight: 1.3 }}>
              {s.headline}
            </h2>
          )}
          {s.subtext && <p className="text-[#e8dfc0]/60 max-w-2xl mx-auto">{s.subtext}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {s.pains.map((p) => (
            <div key={p.title} className="emerald-card rounded-xl p-8">
              <div className="mb-5 text-4xl text-[#c8a84b]">●</div>
              <h3 className="font-display font-normal mb-3" style={{ fontSize: "26px", color: "#f5e642" }}>{p.title}</h3>
              <p className="text-[#e8dfc0]/60">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── What You'll Learn ─────────────────────────────────────── */
function WhatYoullLearn({ book }: { book: BookData }) {
  const s = book.learn_section;
  if (!s?.promises?.length) return null;
  return (
    <section id="learn" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #08190f 0%, #04100a 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          {s.eyebrow && <Eyebrow text={s.eyebrow} />}
          {s.headline && (
            <h2 className="font-display font-light text-[#e8dfc0] mb-6" style={{ fontSize: "34px", lineHeight: 1.3 }}>
              {s.headline}
            </h2>
          )}
          {s.subtext && <p className="text-[#e8dfc0]/60 max-w-2xl mx-auto">{s.subtext}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {s.promises.map((p) => (
            <div key={p.number} className="group relative pl-8" style={{ borderLeft: "2px solid rgba(200,168,75,0.4)" }}>
              <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#c8a84b] to-[#f5e642] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute -left-px top-0 font-black text-7xl leading-none select-none font-display"
                style={{ color: "rgba(200,168,75,0.08)" }}>
                {p.number}
              </span>
              <h3 className="font-display font-normal text-[#e8dfc0] mb-3 mt-1 group-hover:text-[#f5e642] transition-colors duration-300"
                style={{ fontSize: "26px" }}>
                {p.title}
              </h3>
              <p className="text-[#e8dfc0]/55">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── What's Inside ─────────────────────────────────────────── */
function WhatsInside({ book }: { book: BookData }) {
  const items = book.includes_section;
  if (!items?.length) return null;
  return (
    <section id="inside" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Eyebrow text="Inside the Book" />
          <h2 className="font-display font-light text-[#e8dfc0]" style={{ fontSize: "34px", lineHeight: 1.3 }}>
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
              Break the Cycle
            </span>
          </h2>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${items.length >= 4 ? "lg:grid-cols-4" : items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
          {items.map((f) => (
            <div key={f.label} className="emerald-card rounded-2xl p-8 text-center">
              <div className="flex justify-center mb-5 text-4xl">📖</div>
              <h3 className="font-display font-normal mb-3 text-transparent bg-clip-text"
                style={{ fontSize: "26px", backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
                {f.label}
              </h3>
              <p className="text-[#e8dfc0]/55">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Core Method ───────────────────────────────────────────── */
function CoreMethod({ book }: { book: BookData }) {
  const s = book.method_section;
  if (!s?.steps?.length) return null;
  return (
    <section id="method" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #08190f 0%, #04100a 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          {s.eyebrow && <Eyebrow text={s.eyebrow} />}
          {(s.headline || s.name) && (
            <h2 className="font-display font-light text-[#e8dfc0] mb-4" style={{ fontSize: "34px", lineHeight: 1.3 }}>
              {s.headline || s.name}
            </h2>
          )}
          {s.subtext && <p className="text-[#e8dfc0]/60 max-w-2xl mx-auto">{s.subtext}</p>}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {s.steps.map((step) => (
            <div key={step.step} className="flex gap-5 items-start group">
              <div className="flex-shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center font-brand text-[#04100a] shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ background: "#c8a84b", boxShadow: "0 4px 20px rgba(200,168,75,0.35)", fontSize: "21px", letterSpacing: "1px" }}>
                {step.step}
              </div>
              <div className="emerald-card rounded-xl p-6 flex-1">
                <h3 className="font-display font-normal text-[#e8dfc0] mb-2 group-hover:text-[#f5e642] transition-colors duration-300"
                  style={{ fontSize: "25px" }}>
                  {step.title}
                </h3>
                <p className="text-[#e8dfc0]/55">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── About Author ──────────────────────────────────────────── */
function AboutAuthor({ book }: { book: BookData }) {
  const backCover = imgUrl(book.book_back_url);
  return (
    <section id="author" className="py-28 px-6 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,168,75,0.06) 0%, transparent 70%)" }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <Eyebrow text="Meet the Author" />
        </div>
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {backCover && (
            <div className="flex-shrink-0">
              <div className="relative group">
                <div className="absolute -inset-4 rounded-2xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse, rgba(200,168,75,0.2) 0%, transparent 70%)" }} />
                <div className="absolute -inset-[3px] rounded-xl"
                  style={{ background: "linear-gradient(135deg, #c8a84b, #f5e642, #c8a84b)" }} />
                <Image src={backCover} alt={`${book.author} — back cover`} width={300} height={400}
                  className="relative rounded-xl shadow-2xl shadow-black/60 group-hover:scale-[1.03] transition-transform duration-500" />
              </div>
            </div>
          )}
          <div className="flex-1">
            <h2 className="font-brand text-[#e8dfc0] mb-2" style={{ fontSize: "39px", letterSpacing: "2px" }}>
              {book.author}
              {book.author_credentials && <span className="text-xl ml-2" style={{ color: "#c8a84b" }}>{book.author_credentials}</span>}
            </h2>
            {book.author_title && (
              <p className="font-brand mb-8" style={{ color: "#c8a84b", fontSize: "20px", letterSpacing: "2px", textTransform: "uppercase" }}>
                {book.author_title}
              </p>
            )}
            {book.author_bio && <p className="text-[#e8dfc0]/70 mb-10">{book.author_bio}</p>}
            {book.author_tags && book.author_tags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {book.author_tags.map((tag) => (
                  <span key={tag} className="eyebrow px-4 py-2 rounded-full border hover:border-[#f5e642] transition-colors duration-200"
                    style={{ borderColor: "rgba(200,168,75,0.45)", background: "rgba(200,168,75,0.06)", color: "#c8a84b", letterSpacing: "3px" }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ──────────────────────────────────────────── */
function Testimonials({ book }: { book: BookData }) {
  const reviews = book.testimonials;
  if (!reviews?.length) return null;
  return (
    <section id="testimonials" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #08190f 0%, #04100a 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Eyebrow text="What Readers Are Saying" />
          <h2 className="font-display font-light text-[#e8dfc0]" style={{ fontSize: "34px", lineHeight: 1.3 }}>
            Real Results,{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
              Real People
            </span>
          </h2>
        </div>
        <div className={`grid grid-cols-1 gap-6 ${reviews.length >= 3 ? "md:grid-cols-3" : reviews.length === 2 ? "md:grid-cols-2" : ""}`}>
          {reviews.map((r, i) => (
            <div key={i} className="emerald-card rounded-2xl p-8 relative overflow-hidden">
              <span className="absolute top-3 right-5 font-display text-9xl leading-none select-none pointer-events-none"
                style={{ color: "rgba(200,168,75,0.06)" }}>&ldquo;</span>
              <div className="flex gap-1 mb-5">
                {Array.from({ length: r.stars }).map((_, si) => (
                  <span key={si} className="text-[#f5e642] text-lg">★</span>
                ))}
              </div>
              <p className="text-[#e8dfc0]/65 mb-6 relative z-10 italic font-display" style={{ fontSize: "20px", lineHeight: 1.7 }}>
                &ldquo;{r.quote}&rdquo;
              </p>
              <div style={{ borderTop: "1px solid rgba(200,168,75,0.2)" }} className="pt-4">
                <p className="text-[#e8dfc0] font-normal font-display" style={{ fontSize: "21px" }}>{r.name}</p>
                <p className="eyebrow mt-1" style={{ color: "rgba(200,168,75,0.7)" }}>{r.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ───────────────────────────────────────────────── */
function Pricing({ book }: { book: BookData }) {
  const frontCover = imgUrl(book.book_front_url);
  const includeItems = book.includes_section ?? [];
  return (
    <section id="pricing" className="py-28 px-6 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(200,168,75,0.1) 0%, transparent 70%)" }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Eyebrow text="Get the Book" />
          <h2 className="font-display font-light text-[#e8dfc0] mb-4" style={{ fontSize: "34px", lineHeight: 1.3 }}>
            Start Your Journey for{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
              ₱{book.price.toLocaleString()}
            </span>
          </h2>
          <p className="text-[#e8dfc0]/50">One investment. A lifetime of financial clarity.</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-14 items-center justify-center">
          {frontCover && (
            <div className="flex-shrink-0">
              <div className="relative group">
                <div className="absolute -inset-5 rounded-2xl blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse, rgba(200,168,75,0.2) 0%, transparent 70%)" }} />
                <div className="absolute -inset-[3px] rounded-xl"
                  style={{ background: "linear-gradient(135deg, #c8a84b, #f5e642, #c8a84b)" }} />
                <Image src={frontCover} alt={`${book.title} — book cover`} width={280} height={380}
                  className="relative rounded-xl shadow-2xl shadow-black/80 group-hover:scale-[1.04] transition-transform duration-500" />
              </div>
            </div>
          )}
          <div className="max-w-md w-full relative">
            <div className="absolute -inset-[2px] rounded-2xl"
              style={{ background: "linear-gradient(135deg, #c8a84b, #f5e642, #c8a84b)" }} />
            <div className="relative rounded-2xl px-12 py-10 shadow-2xl text-center" style={{ background: "#0a2114" }}>
              <div className="mb-8">
                {book.original_price && (
                  <p className="text-[#e8dfc0]/35 mb-2 line-through">Regular Price ₱{book.original_price.toLocaleString()}</p>
                )}
                <div className="flex items-baseline gap-3 justify-center">
                  <span className="font-display font-light text-transparent bg-clip-text"
                    style={{ fontSize: "59px", backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
                    ₱{book.price.toLocaleString()}
                  </span>
                  {book.price_label && <span className="text-[#e8dfc0]/35">{book.price_label}</span>}
                </div>
              </div>
              {includeItems.length > 0 && (
                <ul className="space-y-4 mb-10 inline-block text-left">
                  {includeItems.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <span className="text-[#f5e642] font-normal text-lg leading-none mt-0.5">✓</span>
                      <span className="text-[#e8dfc0]/75">{item.label}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-center">
                <BuyButton slug={book.slug} price={book.price} size="large" />
              </div>
              <p className="text-center mt-4" style={{ color: "var(--text-muted)" }}>
                Secure checkout · Digital delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────────── */
function Footer({ book }: { book: BookData }) {
  return (
    <footer style={{ background: "#020a05", borderTop: "1px solid rgba(200,168,75,0.2)" }} className="py-14 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="font-brand text-transparent bg-clip-text mb-1"
            style={{ backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)", fontSize: "14px", letterSpacing: "3px", textTransform: "uppercase" }}>
            BrilliantLabsPh Bibliotech
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>A division of BrilliantLabsPh Solutions</p>
        </div>
        <nav className="flex flex-wrap gap-4 justify-center">
          {[["problem","Problem"],["learn","Learn"],["inside","Inside"],["method","Method"],["author","Author"],["testimonials","Testimonials"],["pricing","Pricing"]].map(([id, label]) => (
            <a key={id} href={`#${id}`}
              className="hover:text-[#c8a84b] transition-colors duration-200"
              style={{ color: "rgba(232,223,192,0.4)", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 300 }}>
              {label}
            </a>
          ))}
        </nav>
        <p className="text-center md:text-right" style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          © 2026 {book.author}. All rights reserved.
          <br />BrilliantLabsPh Bibliotech
        </p>
      </div>
    </footer>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book || !book.active) notFound();

  return (
    <>
      <NavbarClient book={book} />
      <main>
        <Hero book={book} />
        <Divider />
        <TheProblem book={book} />
        {book.problem_section?.pains?.length ? <Divider /> : null}
        <WhatYoullLearn book={book} />
        {book.learn_section?.promises?.length ? <Divider /> : null}
        <WhatsInside book={book} />
        {book.includes_section?.length ? <Divider /> : null}
        <CoreMethod book={book} />
        {book.method_section?.steps?.length ? <Divider /> : null}
        <AboutAuthor book={book} />
        <Divider />
        <Testimonials book={book} />
        {book.testimonials?.length ? <Divider /> : null}
        <Pricing book={book} />
      </main>
      <Footer book={book} />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return {};
  return {
    title: `${book.title} — BrilliantLabsPh Bibliotech`,
    description: book.hero_subline_1 ?? undefined,
  };
}
