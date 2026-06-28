"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookData } from "@/lib/supabase";

export default function NavbarClient({ book }: { book: BookData }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
      scrolled ? "bg-[#04100a]/95 backdrop-blur-md border-b border-[#c8a84b]/30 shadow-2xl shadow-black/50" : "bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-brand text-[#c8a84b]" style={{ fontSize: "20px", letterSpacing: "4px", textTransform: "uppercase" }}>
            BrilliantLabsPh Bibliotech
          </span>
          <span className="eyebrow text-[#c8a84b]/60" style={{ fontSize: "10px", letterSpacing: "4px" }}>
            New Release
          </span>
        </Link>
        <Link href={`/${book.slug}/checkout`} className="hidden lg:inline-block btn-gold px-7 py-3">
          Buy Now — ₱{book.price.toLocaleString()}
        </Link>
      </div>
    </nav>
  );
}
