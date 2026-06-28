import Link from "next/link";
import { getBookBySlug } from "@/app/admin/actions";

export default async function SuccessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  const steps = [
    { step: 1, title: "Payment Confirmed", desc: "Your payment has been received and verified." },
    { step: 2, title: "PDF Personalization", desc: "Your copy is being personalized with your license ID — this takes just a moment." },
    { step: 3, title: "Book Delivered", desc: "Your personalized PDF and 21-Day Challenge will be sent to your email within minutes." },
    { step: 4, title: "Start Reading", desc: "Open your inbox, download your copy, and begin your journey to financial clarity." },
  ];

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      <header className="px-6 py-5" style={{ borderBottom: "1px solid rgba(200,168,75,0.2)" }}>
        <Link href="/" className="font-brand text-[#c8a84b]" style={{ fontSize: "16px", letterSpacing: "4px", textTransform: "uppercase" }}>
          BrilliantLabsPh Bibliotech
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-lg w-full text-center">
          <div className="text-6xl mb-8">📖</div>
          <h1 className="font-display font-light text-[#e8dfc0] mb-4" style={{ fontSize: "40px", lineHeight: 1.2 }}>
            Your order is{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #c8a84b, #f5e642)" }}>
              confirmed!
            </span>
          </h1>
          {book && <p className="text-[#e8dfc0]/60 mb-12">Thank you for purchasing <em>{book.title}</em>. Check your email for delivery.</p>}

          <div className="space-y-4 mb-12 text-left">
            {steps.map((s) => (
              <div key={s.step} className="emerald-card rounded-xl px-6 py-4 flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-[#04100a]"
                  style={{ background: "#c8a84b" }}>
                  {s.step}
                </div>
                <div>
                  <p className="font-medium text-[#e8dfc0]">{s.title}</p>
                  <p className="text-sm mt-0.5 text-[#e8dfc0]/55">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href={`/${slug}`} className="btn-gold px-8 py-4 inline-block">
            ← Back to Book Page
          </Link>
        </div>
      </div>
    </main>
  );
}
