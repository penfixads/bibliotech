import Image from "next/image";
import Link from "next/link";
import { getAllBooks } from "./admin/actions";
import { BookData } from "@/lib/supabase";

function imgUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/books/${path}`;
}

function BookCard({ book }: { book: BookData }) {
  const cover = imgUrl(book.book_front_url ?? book.book_3d_url);
  return (
    <Link href={`/${book.slug}`} className="group block">
      <div className="emerald-card rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-[#c8a84b]/10">
        <div className="relative aspect-[3/4] overflow-hidden"
          style={{ background: "linear-gradient(180deg, #0a2114 0%, #04100a 100%)" }}>
          {cover ? (
            <Image src={cover} alt={book.title} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-8xl font-black text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, rgba(200,168,75,0.2), rgba(245,230,66,0.1))" }}>
                {book.title[0]}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="btn-gold px-6 py-2.5 text-sm">View Book →</span>
          </div>
        </div>
        <div className="p-6">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "#c8a84b" }}>{book.author}</p>
          <h3 className="font-display font-light text-[#e8dfc0] mb-3" style={{ fontSize: "22px", lineHeight: 1.3 }}>{book.title}</h3>
          <div className="flex items-baseline gap-2">
            {book.original_price && (
              <span className="text-xs text-[#e8dfc0]/30 line-through">₱{book.original_price.toLocaleString()}</span>
            )}
            <span className="font-bold text-transparent bg-clip-text"
              style={{ fontSize: "20px", backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
              ₱{book.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function LibraryPage() {
  const books = (await getAllBooks()).filter((b) => b.active);

  // If only one book, redirect to it (common case during early launch)
  // Keeping catalog page visible so we show branding

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      {/* Header */}
      <header className="px-6 py-6" style={{ borderBottom: "1px solid rgba(200,168,75,0.15)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-brand text-[#c8a84b]" style={{ fontSize: "22px", letterSpacing: "4px", textTransform: "uppercase" }}>
              BrilliantLabsPh Bibliotech
            </p>
            <p className="mt-0.5" style={{ color: "rgba(232,223,192,0.35)", fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase" }}>
              Digital Library
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c8a84b]" />
            <span className="eyebrow text-[#c8a84b]">Our Collection</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c8a84b]" />
          </div>
          <h1 className="font-display font-light text-[#e8dfc0] mb-6" style={{ fontSize: "48px", lineHeight: 1.2 }}>
            Books That{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
              Transform
            </span>
          </h1>
          <p className="text-[#e8dfc0]/50 max-w-xl mx-auto">
            Practical knowledge for building the life you deserve — one book at a time.
          </p>
        </div>

        {/* Book grid */}
        {books.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#e8dfc0]/30 text-lg">New titles coming soon.</p>
          </div>
        ) : (
          <div className={`grid gap-8 ${books.length === 1 ? "grid-cols-1 max-w-sm mx-auto" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>

      <footer className="py-12 px-6 text-center mt-20" style={{ borderTop: "1px solid rgba(200,168,75,0.15)" }}>
        <p className="font-brand text-transparent bg-clip-text mb-2 inline-block"
          style={{ backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase" }}>
          BrilliantLabsPh Bibliotech
        </p>
        <p style={{ color: "rgba(232,223,192,0.25)", fontSize: "12px" }}>© 2026 BrilliantLabsPh Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}
