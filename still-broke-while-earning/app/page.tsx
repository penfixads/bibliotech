"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

/* ─── Gold CTA Button ─────────────────────────────────────── */
function BuyButton({ size = "default" }: { size?: "default" | "large" }) {
  const sizes = size === "large" ? "px-12 py-5" : "px-7 py-3";
  return (
    <Link href="/checkout" className={`btn-gold ${sizes} inline-block`}>
      Buy Now — ₱950
    </Link>
  );
}

/* ─── Navbar ──────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? "bg-[#04100a]/95 backdrop-blur-md border-b border-[#c8a84b]/30 shadow-2xl shadow-black/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="flex flex-col leading-tight">
          <span className="font-brand text-[#c8a84b]" style={{ fontSize: "20px", letterSpacing: "4px", textTransform: "uppercase" }}>
            BrilliantLabsPh Bibliotech
          </span>
          <span className="eyebrow text-[#c8a84b]/60" style={{ fontSize: "10px", letterSpacing: "4px" }}>
            New Release
          </span>
        </span>
        <span className="hidden lg:inline-block"><BuyButton /></span>
      </div>
    </nav>
  );
}

/* ─── Hero ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_shine.png"
          alt="Warm reading scene"
          fill
          className="object-cover object-[55%_65%] lg:object-center"
          priority
        />
        {/* Mobile/tablet overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#04100a]/98 via-[#08190f]/92 to-[#04100a]/68 lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04100a]/85 via-transparent to-[#04100a]/45 lg:hidden" />
        {/* Desktop overlay */}
        <div className="absolute inset-0 hidden lg:block"
          style={{ background: "linear-gradient(to right, rgba(4,16,10,0.55) 0%, rgba(4,16,10,0.45) 35%, rgba(8,25,15,0.25) 58%, transparent 75%)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04100a]/80 via-transparent to-[#04100a]/30 hidden lg:block" />
      </div>

      {/* Gold radial glow */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(200,168,75,0.08) 0%, transparent 60%)" }} />

      {/* ── Mobile / Tablet — book over glow, text below ── */}
      <div className="relative z-20 w-full flex flex-col items-center justify-start px-6 pt-20 h-screen text-center lg:hidden">
        {/* Book positioned to align with the glowing open book in background */}
        <div className="h-[42%] md:h-[58%] flex flex-col items-center justify-end w-full pb-2">
          <Image
            src="/images/stillbroke.png"
            alt="Still Broke While Earning — book"
            width={220}
            height={286}
            className="book-float object-contain w-[150px] md:w-[300px] mx-auto"
            priority
          />
        </div>
        {/* Text beneath the open book — all centered */}
        <div className="flex flex-col items-center w-full max-w-lg md:max-w-2xl mx-auto pb-10">
          <h1 className="font-display font-light text-[#e8dfc0] mb-4 text-[38px] md:text-[52px] w-full text-center"
            style={{ lineHeight: 1.2, textShadow: "0 2px 12px rgba(0,0,0,0.95), 0 4px 32px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,1)" }}>
            You work hard.<br />
            <em>You earn.</em>{" "}And yet…<br />
            you&apos;re still broke.
          </h1>
          <p className="text-[#e8dfc0]/70 mb-2 text-center w-full"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1)" }}>
            The answer isn&apos;t more income.
          </p>
          <p className="mb-6 font-normal text-center w-full" style={{ color: "#c8a84b", textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1)" }}>
            It&apos;s the system you&apos;ve never been taught.
          </p>
          <div className="flex flex-col gap-2 items-center w-full">
            <BuyButton size="large" />
            <p className="text-center" style={{ color: "var(--text-muted)" }}>Digital copy · Instant access</p>
          </div>
        </div>
      </div>

      {/* ── Desktop — text left, floating book right ── */}
      <div className="relative z-20 hidden lg:flex w-full h-screen items-center">
        <div className="max-w-6xl mx-auto w-full px-6 flex items-center">
        {/* Text block */}
        <div className="flex flex-col items-start max-w-xl">
          <h1 className="font-display font-light text-[#e8dfc0] mb-5"
            style={{ fontSize: "45px", lineHeight: 1.2, textShadow: "0 2px 16px rgba(4,16,10,0.9), 0 1px 4px rgba(4,16,10,0.8)" }}>
            You work hard.<br />
            <em>You earn.</em>{" "}And yet…<br />
            you&apos;re still broke.
          </h1>
          <p className="text-[#e8dfc0]/70 mb-2">
            The answer isn&apos;t more income.
          </p>
          <p className="mb-8 font-normal" style={{ color: "#c8a84b" }}>
            It&apos;s the system you&apos;ve never been taught.
          </p>
          <div className="inline-flex flex-col gap-2">
            <BuyButton size="large" />
            <p className="text-center" style={{ color: "var(--text-muted)" }}>Digital copy · Instant access</p>
          </div>
        </div>

        </div>{/* end max-w-6xl wrapper */}

        {/* Floating book */}
        <div className="absolute top-1/2 -translate-y-[55%]"
          style={{ left: "calc(50% - 55px)", transform: "translateX(-15%) translateY(-55%)" }}>
          <Image
            src="/images/stillbroke.png"
            alt="Still Broke While Earning — book"
            width={260}
            height={338}
            className="book-float object-contain"
            priority
          />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04100a] to-transparent z-10" />

    </section>
  );
}

/* ─── The Problem ─────────────────────────────────────────── */
function TheProblem() {
  const pains = [
    { icon: "/images/icons/money.png",        isEmoji: false, title: "Paycheck to Paycheck",      text: "You earn a decent income, but the money vanishes before the month is over — and you can't explain where it went." },
    { icon: "/images/icons/chart.png",        isEmoji: false, title: "Budgets That Always Fail",  text: "You've tried spreadsheets, apps, envelopes. Every system collapses within weeks. You blame yourself, not the system." },
    { icon: "/images/icons/emotions.png", isEmoji: false, title: "Emotional Spending Spirals", text: "Stress, sadness, celebration — emotions lead you to spend. Then comes the guilt, and you spend again to cope." },
    { icon: "/images/icons/not allowed.png",  isEmoji: false, title: "Income Isn't the Answer",   text: "You told yourself a raise would fix it. It didn't. More money just means bigger versions of the same old problems." },
  ];

  return (
    <section id="problem" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c8a84b]" />
            <span className="eyebrow text-[#c8a84b]">Sound Familiar?</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c8a84b]" />
          </div>
          <h2 className="font-display font-light text-[#e8dfc0] mb-6"
            style={{ fontSize: "34px", lineHeight: 1.3 }}>
            The Struggle Is Real —{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
              And It&apos;s Not Your Fault
            </span>
          </h2>
          <p className="text-[#e8dfc0]/60 max-w-2xl mx-auto">
            Millions of people earn a living wage and still feel financially trapped. The problem was never your income — it was the broken money narrative you were handed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pains.map((p) => (
            <div key={p.title} className="emerald-card rounded-xl p-8">
              <div className="mb-5">
                {p.isEmoji
                  ? <span className="text-4xl">{p.icon}</span>
                  : <Image src={p.icon} alt={p.title} width={61} height={61} className="object-contain icon-glow" />}
              </div>
              <h3 className="font-display font-normal mb-3" style={{ fontSize: "26px", color: "#f5e642" }}>{p.title}</h3>
              <p className="text-[#e8dfc0]/60">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── What You'll Learn ───────────────────────────────────── */
function WhatYoullLearn() {
  const promises = [
    { number: "01", title: "Identify Your Emotional Spending Triggers", text: "Uncover the hidden emotions and beliefs driving your spending so you can finally break free from cycles that drain your wallet." },
    { number: "02", title: "Rebuild Your Self-Worth Around Money", text: "Your relationship with money is rooted in your sense of self. Learn how to heal it so finances no longer feel like a source of shame." },
    { number: "03", title: "Use the FlowPath Budget Method™", text: "A revolutionary, emotion-aware budgeting system that works with your psychology — not against it — so you actually stick to it." },
    { number: "04", title: "Reclaim Control Without Guilt", text: "Build a money life that feels empowering, not punishing. Spend with intention. Save with confidence. Live without financial dread." },
  ];

  return (
    <section id="learn" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #08190f 0%, #04100a 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c8a84b]" />
            <span className="eyebrow text-[#c8a84b]">4 Transformative Promises</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c8a84b]" />
          </div>
          <h2 className="font-display font-light text-[#e8dfc0] mb-6"
            style={{ fontSize: "34px", lineHeight: 1.3 }}>
            What You&apos;ll{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
              Take Away
            </span>
          </h2>
          <p className="text-[#e8dfc0]/60 max-w-2xl mx-auto">
            This isn&apos;t another budgeting book. It&apos;s a complete reimagining of your relationship with money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {promises.map((p) => (
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

/* ─── What's Inside ───────────────────────────────────────── */
function WhatsInside() {
  const features = [
    { icon: "/images/icons/book.png",      label: "11 Parts",        desc: "A complete journey from emotional diagnosis to sustainable financial freedom" },
    { icon: "/images/icons/note.png",      label: "13 Worksheets",   desc: "Hands-on exercises that move you from insight to real action, step by step" },
    { icon: "/images/icons/award.png",     label: "21-Day Challenge", desc: "A structured program to build lasting money habits that actually stick" },
    { icon: "/images/icons/ai.png",        label: "AI Assessment",   desc: "A personalized AI-powered tool to assess and guide your financial journey" },
  ];

  return (
    <section id="inside" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c8a84b]" />
            <span className="eyebrow text-[#c8a84b]">Inside the Book</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c8a84b]" />
          </div>
          <h2 className="font-display font-light text-[#e8dfc0]"
            style={{ fontSize: "34px", lineHeight: 1.3 }}>
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
              Break the Cycle
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.label} className="emerald-card rounded-2xl p-8 text-center">
              <div className="flex justify-center mb-5">
                <Image src={f.icon} alt={f.label} width={61} height={61} className="object-contain icon-glow" />
              </div>
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

/* ─── FlowPath Budget ─────────────────────────────────────── */
function FlowPath() {
  const steps = [
    { step: 1, title: "Know Your Emotional Triggers", text: "Map the feelings — stress, boredom, celebration — that consistently lead you to spend impulsively." },
    { step: 2, title: "Define Guilt-Free Zones", text: "Designate spending categories where you allow yourself joy without shame, removing the feast-or-famine cycle." },
    { step: 3, title: "Build Your Guardrails", text: "Set intelligent boundaries that protect your priorities without making you feel restricted or punished." },
    { step: 4, title: "Set Emotional Percentages", text: "Allocate your income using percentages tied to your emotional values, not generic rules that don't fit your life." },
    { step: 5, title: "Reflect Without Guilt", text: "Regular, compassionate check-ins replace judgment with curiosity — turning financial reviews into growth moments." },
    { step: 6, title: "Reset, Don't Restart", text: "When you slip (and you will), FlowPath gives you a simple reset process so you never have to start from zero again." },
  ];

  return (
    <section id="flowpath" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #08190f 0%, #04100a 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c8a84b]" />
            <span className="eyebrow text-[#c8a84b]">The Core Method</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c8a84b]" />
          </div>
          <h2 className="font-display font-light text-[#e8dfc0] mb-4"
            style={{ fontSize: "34px", lineHeight: 1.3 }}>
            The{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
              FlowPath Budget
            </span>{" "}
            Method™
          </h2>
          <p className="text-[#e8dfc0]/60 max-w-2xl mx-auto">
            6 steps designed around how you actually think and feel about money — not how a finance textbook thinks you should.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="flex gap-5 items-start group">
              <div className="flex-shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center font-brand text-[#04100a] shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ background: "#c8a84b", boxShadow: "0 4px 20px rgba(200,168,75,0.35)", fontSize: "21px", letterSpacing: "1px" }}>
                {s.step}
              </div>
              <div className="emerald-card rounded-xl p-6 flex-1">
                <h3 className="font-display font-normal text-[#e8dfc0] mb-2 group-hover:text-[#f5e642] transition-colors duration-300"
                  style={{ fontSize: "25px" }}>
                  {s.title}
                </h3>
                <p className="text-[#e8dfc0]/55">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── About the Author ────────────────────────────────────── */
function AboutAuthor() {
  return (
    <section id="author" className="py-28 px-6 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,168,75,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c8a84b]" />
            <span className="eyebrow text-[#c8a84b]">Meet the Author</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c8a84b]" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Back cover */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-2xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                style={{ background: "radial-gradient(ellipse, rgba(200,168,75,0.2) 0%, transparent 70%)" }} />
              <div className="absolute -inset-[3px] rounded-xl"
                style={{ background: "linear-gradient(135deg, #c8a84b, #f5e642, #c8a84b)" }} />
              <Image
                src="/images/back_cover.jpg"
                alt="Back cover — Still Broke While Earning"
                width={300}
                height={400}
                className="relative rounded-xl shadow-2xl shadow-black/60 group-hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1">
            <h2 className="font-brand text-[#e8dfc0] mb-2"
              style={{ fontSize: "39px", letterSpacing: "2px" }}>
              M.A. Jacinto
            </h2>
            <p className="font-brand mb-8"
              style={{ color: "#c8a84b", fontSize: "20px", letterSpacing: "2px", textTransform: "uppercase" }}>
              Author · Founder · Entrepreneur
            </p>

            <p className="text-[#e8dfc0]/70 mb-6">
              M.A. Jacinto is a single mother of three, entrepreneur, and founder of the FlowPath Budget method. She is the CEO of{" "}
              <strong className="text-[#e8dfc0] font-normal">Penfix Advertising and Business Solutions</strong> and the founder of{" "}
              <strong className="text-[#e8dfc0] font-normal">BrilliantLabsPh Solutions</strong> — a growing ecosystem of AI-powered business and knowledge solutions built in the heart of San Fernando, Pampanga.
            </p>

            <p className="text-[#e8dfc0]/70 mb-10">
              <em>Still Broke While Earning</em> is her first book and the flagship publication of{" "}
              <strong className="text-[#e8dfc0] font-normal">BrilliantLabsPh Bibliotech</strong>.
            </p>

            <div className="flex flex-wrap gap-3">
              {["CSFP Certified", "FlowPath Founder", "AI Business Builder", "San Fernando, Pampanga"].map((tag) => (
                <span key={tag}
                  className="eyebrow px-4 py-2 rounded-full border hover:border-[#f5e642] transition-colors duration-200"
                  style={{ borderColor: "rgba(200,168,75,0.45)", background: "rgba(200,168,75,0.06)", color: "#c8a84b", letterSpacing: "3px" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ────────────────────────────────────────── */
function Testimonials() {
  const reviews = [
    { quote: "I've read dozens of finance books and none of them addressed the emotional side the way this one does. The FlowPath method completely changed how I think about my paycheck. I'm saving more now than I ever have.", name: "Maria C.", title: "Marketing Professional, Manila", stars: 5 },
    { quote: "I used to feel like I was broken when it came to money. This book made me realize I just had the wrong system. The 21-Day Challenge alone was worth the price. I'm finally in control.", name: "Jerome T.", title: "Freelance Designer, Cebu", stars: 5 },
    { quote: "As a solo parent, every peso matters. M.A. Jacinto writes like she understands exactly what it feels like to be financially stretched. The worksheets are practical and the AI assessment is incredibly eye-opening.", name: "Rowena M.", title: "Business Owner, Pampanga", stars: 5 },
  ];

  return (
    <section id="testimonials" className="py-28 px-6" style={{ background: "linear-gradient(180deg, #08190f 0%, #04100a 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c8a84b]" />
            <span className="eyebrow text-[#c8a84b]">What Readers Are Saying</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c8a84b]" />
          </div>
          <h2 className="font-display font-light text-[#e8dfc0]"
            style={{ fontSize: "34px", lineHeight: 1.3 }}>
            Real Results,{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
              Real People
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="emerald-card rounded-2xl p-8 relative overflow-hidden">
              <span className="absolute top-3 right-5 font-display text-9xl leading-none select-none pointer-events-none"
                style={{ color: "rgba(200,168,75,0.06)" }}>
                &ldquo;
              </span>
              <div className="flex gap-1 mb-5">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <span key={i} className="text-[#f5e642] text-lg">★</span>
                ))}
              </div>
              <p className="text-[#e8dfc0]/65 mb-6 relative z-10 italic font-display"
                style={{ fontSize: "20px", lineHeight: 1.7 }}>
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

/* ─── Pricing / Final CTA ─────────────────────────────────── */
function Pricing() {
  const includes = [
    "Digital copy of the full book",
    "13 printable worksheets",
    "21-Day Financial Challenge",
    "AI Financial Assessment tool",
  ];

  return (
    <section id="pricing" className="py-28 px-6 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(200,168,75,0.1) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c8a84b]" />
            <span className="eyebrow text-[#c8a84b]">Get the Book</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c8a84b]" />
          </div>
          <h2 className="font-display font-light text-[#e8dfc0] mb-4"
            style={{ fontSize: "34px", lineHeight: 1.3 }}>
            Start Your Journey for{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
              ₱950
            </span>
          </h2>
          <p className="text-[#e8dfc0]/50">One investment. A lifetime of financial clarity.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-14 items-center justify-center">
          {/* Cover */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-5 rounded-2xl blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                style={{ background: "radial-gradient(ellipse, rgba(200,168,75,0.2) 0%, transparent 70%)" }} />
              <div className="absolute -inset-[3px] rounded-xl"
                style={{ background: "linear-gradient(135deg, #c8a84b, #f5e642, #c8a84b)" }} />
              <Image
                src="/images/front_cover.jpg"
                alt="Still Broke While Earning — book cover"
                width={280}
                height={380}
                className="relative rounded-xl shadow-2xl shadow-black/80 group-hover:scale-[1.04] transition-transform duration-500"
              />
            </div>
          </div>

          {/* Pricing card */}
          <div className="max-w-md w-full relative">
            <div className="absolute -inset-[2px] rounded-2xl"
              style={{ background: "linear-gradient(135deg, #c8a84b, #f5e642, #c8a84b)" }} />
            <div className="relative rounded-2xl px-12 py-10 shadow-2xl text-center" style={{ background: "#0a2114" }}>
              <div className="mb-8">
                <p className="text-[#e8dfc0]/35 mb-2 line-through">Regular Price ₱1,200</p>
                <div className="flex items-baseline gap-3 justify-center">
                  <span className="font-display font-light text-transparent bg-clip-text"
                    style={{ fontSize: "59px", backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
                    ₱950
                  </span>
                  <span className="text-[#e8dfc0]/35">launch price</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 inline-block text-left">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[#f5e642] font-normal text-lg leading-none mt-0.5">✓</span>
                    <span className="text-[#e8dfc0]/75">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-center">
                <BuyButton size="large" />
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

/* ─── Footer ──────────────────────────────────────────────── */
function Footer() {
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
          {[["problem","Problem"],["learn","Learn"],["inside","Inside"],["flowpath","FlowPath"],["author","Author"],["testimonials","Testimonials"],["pricing","Pricing"]].map(([id, label]) => (
            <a key={id} href={`#${id}`}
              className="hover:text-[#c8a84b] transition-colors duration-200"
              style={{ color: "rgba(232,223,192,0.4)", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 300 }}>
              {label}
            </a>
          ))}
        </nav>

        <p className="text-center md:text-right" style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          © 2026 M.A. Jacinto. All rights reserved.
          <br />BrilliantLabsPh Bibliotech
        </p>
      </div>
    </footer>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <hr className="gold-divider" />
        <TheProblem />
        <hr className="gold-divider" />
        <WhatYoullLearn />
        <hr className="gold-divider" />
        <WhatsInside />
        <hr className="gold-divider" />
        <FlowPath />
        <hr className="gold-divider" />
        <AboutAuthor />
        <hr className="gold-divider" />
        <Testimonials />
        <hr className="gold-divider" />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
