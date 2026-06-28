import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}>
            <span style={{ fontSize: "28px" }}>✦</span>
          </div>
          <h1 className="font-display text-3xl font-light mb-3" style={{ color: "#c9a84c" }}>
            Payment Confirmed
          </h1>
          <p style={{ color: "rgba(232,224,208,0.7)", lineHeight: 1.7 }}>
            Thank you for your purchase! Your personally licensed copy of{" "}
            <strong style={{ color: "#e8e0d0" }}>Still Broke While Earning</strong> is being
            prepared and will be delivered to your email within a few minutes.
          </p>
        </div>

        <div className="rounded-xl p-6 mb-8 text-left"
          style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}>
          <p style={{ color: "#c9a84c", fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "12px" }}>
            What happens next
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Check your email for your personalized PDF",
              "Your license ID is printed inside the book",
              "Both the book and 21-Day Challenge are included",
              "Keep the email — it contains your license details",
            ].map((item) => (
              <li key={item} style={{ color: "rgba(232,224,208,0.7)", fontSize: "13px", padding: "5px 0", display: "flex", gap: "10px" }}>
                <span style={{ color: "#c9a84c" }}>✓</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <Link href="/"
          className="inline-block text-sm transition-colors"
          style={{ color: "rgba(232,224,208,0.5)" }}
          onMouseOver={undefined}>
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
