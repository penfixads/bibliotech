"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { BookData } from "@/lib/supabase";
import { saveBook, toggleBookActive, deleteBook, getSignedUploadUrl, adminLogout } from "./actions";

/* ─── helpers ───────────────────────────────────────────────── */
async function uploadFile(file: File, bucket: string, path: string): Promise<string | null> {
  const res = await getSignedUploadUrl(bucket, path);
  if ("error" in res) { alert("Upload failed: " + res.error); return null; }
  await fetch(res.signedUrl!, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
  return path;
}

function storageUrl(path: string) {
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/books/${path}`;
}

const inputCls = "w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#c8a84b] transition-all";
const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(200,168,75,0.2)", color: "#e8dfc0" };

function Label({ text }: { text: string }) {
  return <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,168,75,0.6)" }}>{text}</p>;
}

/* ─── Image upload box ──────────────────────────────────────── */
function ImgUpload({ label, hint, value, folder, onDone }: {
  label: string; hint?: string; value?: string | null; folder: string; onDone: (p: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const current = preview ?? (value ? storageUrl(value) : null);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setPreview(URL.createObjectURL(file));
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const res = await uploadFile(file, "books", path);
    if (res) onDone(res);
    setUploading(false);
  }

  return (
    <div>
      <Label text={label} />
      {hint && <p className="text-xs mb-3" style={{ color: "rgba(232,223,192,0.3)" }}>{hint}</p>}
      <label className="cursor-pointer block">
        <div className="rounded-xl overflow-hidden flex items-center justify-center transition-all"
          style={{ border: `2px dashed ${current ? "rgba(200,168,75,0.4)" : "rgba(200,168,75,0.2)"}`, minHeight: "120px", background: "rgba(0,0,0,0.2)" }}>
          {current ? (
            <div className="relative w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current} alt="" className="w-full h-full object-contain max-h-64" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.6)" }}>
                <span className="text-xs text-[#c8a84b]">{uploading ? "Uploading…" : "Click to change"}</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-2xl mb-2">📷</p>
              <p className="text-xs" style={{ color: "rgba(232,223,192,0.4)" }}>{uploading ? "Uploading…" : "Click to upload"}</p>
            </div>
          )}
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={pick} disabled={uploading} />
      </label>
    </div>
  );
}

/* ─── PDF upload ─────────────────────────────────────────────── */
function PdfUpload({ label, value, folder, onDone }: {
  label: string; value?: string | null; folder: string; onDone: (p: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const currentName = value?.split("/").pop();

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${folder}/${file.name}`;
    const res = await uploadFile(file, "books", path);
    if (res) { onDone(res); setDone(true); }
    setUploading(false);
  }

  return (
    <div>
      <Label text={label} />
      <label className="cursor-pointer flex items-center gap-4 rounded-xl px-4 py-3"
        style={{ border: "1px dashed rgba(200,168,75,0.25)", background: "rgba(0,0,0,0.15)" }}>
        <span className="text-2xl">📄</span>
        <div className="flex-1 min-w-0">
          {(done || currentName) ? (
            <p className="text-xs truncate" style={{ color: "#86efac" }}>✓ {done ? "Uploaded" : currentName}</p>
          ) : (
            <p className="text-xs" style={{ color: "rgba(232,223,192,0.4)" }}>{uploading ? "Uploading…" : "Click to upload PDF"}</p>
          )}
        </div>
        <span className="text-xs px-3 py-1 rounded-lg flex-shrink-0"
          style={{ background: "rgba(200,168,75,0.1)", color: "#c8a84b", border: "1px solid rgba(200,168,75,0.25)" }}>
          {uploading ? "…" : done || value ? "Change" : "Upload"}
        </span>
        <input type="file" accept="application/pdf" className="hidden" onChange={pick} disabled={uploading} />
      </label>
    </div>
  );
}

/* ─── Includes editor ────────────────────────────────────────── */
function IncludesList({ items, onChange }: {
  items: { label: string; desc: string }[];
  onChange: (v: { label: string; desc: string }[]) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input className={inputCls} style={inputStyle} placeholder="Label (e.g. 11 Parts)" value={item.label}
            onChange={e => { const n = [...items]; n[i] = { ...n[i], label: e.target.value }; onChange(n); }} />
          <input className={inputCls} style={inputStyle} placeholder="Short description" value={item.desc}
            onChange={e => { const n = [...items]; n[i] = { ...n[i], desc: e.target.value }; onChange(n); }} />
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="text-lg flex-shrink-0" style={{ color: "rgba(252,165,165,0.6)" }}>×</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { label: "", desc: "" }])}
        className="text-xs px-3 py-1.5 rounded-lg"
        style={{ background: "rgba(200,168,75,0.08)", color: "#c8a84b", border: "1px solid rgba(200,168,75,0.2)" }}>
        + Add item
      </button>
    </div>
  );
}

/* ─── Book Form ──────────────────────────────────────────────── */
function BookForm({ book, onSaved }: { book?: BookData; onSaved: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const [title, setTitle] = useState(book?.title ?? "");
  const [slug, setSlug] = useState(book?.slug ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [authorBio, setAuthorBio] = useState(book?.author_bio ?? "");
  const [price, setPrice] = useState(book?.price?.toString() ?? "950");
  const [origPrice, setOrigPrice] = useState(book?.original_price?.toString() ?? "1200");

  const [headline, setHeadline] = useState(book?.hero_headline ?? "");
  const [sub1, setSub1] = useState(book?.hero_subline_1 ?? "");
  const [sub2, setSub2] = useState(book?.hero_subline_2 ?? "");
  const [heroBg, setHeroBg] = useState(book?.hero_bg_url ?? "");
  const [book3d, setBook3d] = useState(book?.book_3d_url ?? "");
  const [bookFront, setBookFront] = useState(book?.book_front_url ?? "");
  const [bookBack, setBookBack] = useState(book?.book_back_url ?? "");

  const [includes, setIncludes] = useState<{ label: string; desc: string }[]>(
    book?.includes_section ?? [{ label: "", desc: "" }]
  );

  const [mainPdf, setMainPdf] = useState(book?.main_pdf_path ?? "");
  const [challengePdf, setChallengePdf] = useState(book?.challenge_pdf_path ?? "");

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function handleSave() {
    startTransition(async () => {
      const res = await saveBook({
        ...(book?.id ? { id: book.id } : {}),
        title, slug, author,
        author_bio: authorBio || null,
        price: Number(price),
        original_price: origPrice ? Number(origPrice) : null,
        hero_headline: headline,
        hero_subline_1: sub1 || null,
        hero_subline_2: sub2 || null,
        hero_bg_url: heroBg || null,
        book_3d_url: book3d || null,
        book_front_url: bookFront || null,
        book_back_url: bookBack || null,
        includes_section: includes.filter(i => i.label),
        main_pdf_path: mainPdf || null,
        challenge_pdf_path: challengePdf || null,
        // Carry over existing complex sections when editing
        ...(book ? {
          problem_section: book.problem_section,
          learn_section: book.learn_section,
          method_section: book.method_section,
          testimonials: book.testimonials,
          author_credentials: book.author_credentials,
          author_title: book.author_title,
          author_tags: book.author_tags,
          price_label: book.price_label,
        } : {}),
      });
      if (res?.error) { setMsg("Error: " + res.error); return; }
      setMsg("Saved!");
      setTimeout(() => { setMsg(null); onSaved(); }, 1200);
    });
  }

  const slugId = slug || "your-book-slug";

  return (
    <div className="space-y-10">

      {/* 1. Book identity */}
      <div>
        <h3 className="font-display mb-6" style={{ color: "#c8a84b", fontSize: "18px" }}>Book Identity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label text="Book Title" />
            <input className={inputCls} style={inputStyle} value={title} placeholder="Still Broke While Earning"
              onChange={e => { setTitle(e.target.value); if (!book) setSlug(autoSlug(e.target.value)); }} />
          </div>
          <div>
            <Label text="URL Slug" />
            <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid rgba(200,168,75,0.2)" }}>
              <span className="px-3 text-xs flex-shrink-0"
                style={{ background: "rgba(0,0,0,0.2)", color: "rgba(232,223,192,0.25)", borderRight: "1px solid rgba(200,168,75,0.15)", height: "46px", display: "flex", alignItems: "center" }}>
                bibliotech.brilliantlabsph.com/
              </span>
              <input className="flex-1 px-3 py-3 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", color: "#e8dfc0" }}
                value={slug} onChange={e => setSlug(e.target.value)} placeholder="still-broke-while-earning" />
            </div>
          </div>
          <div>
            <Label text="Author Name" />
            <input className={inputCls} style={inputStyle} value={author} placeholder="M.A. Jacinto"
              onChange={e => setAuthor(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label text="Price (₱)" />
              <input type="number" className={inputCls} style={inputStyle} value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div>
              <Label text="Original Price (₱)" />
              <input type="number" className={inputCls} style={inputStyle} value={origPrice} onChange={e => setOrigPrice(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Label text="Author Bio (shown in Meet the Author section)" />
          <textarea className={inputCls} style={inputStyle} rows={3} value={authorBio}
            onChange={e => setAuthorBio(e.target.value)} placeholder="Brief bio about the author..." />
        </div>
      </div>

      <div style={{ height: "1px", background: "rgba(200,168,75,0.12)" }} />

      {/* 2. Hero hook */}
      <div>
        <h3 className="font-display mb-2" style={{ color: "#c8a84b", fontSize: "18px" }}>Hero Hook</h3>
        <p className="text-xs mb-6" style={{ color: "rgba(232,223,192,0.35)" }}>
          The text shown beside the floating book cover. Use \n for line breaks.
        </p>
        <div className="space-y-4">
          <div>
            <Label text="Main Headline" />
            <textarea className={inputCls} style={inputStyle} rows={3} value={headline}
              placeholder={"You work hard.\\nYou earn. And yet…\\nyou're still broke."}
              onChange={e => setHeadline(e.target.value)} />
            <p className="text-xs mt-1" style={{ color: "rgba(232,223,192,0.25)" }}>Use \n where you want a line break</p>
          </div>
          <div>
            <Label text="Subline 1 (regular text)" />
            <input className={inputCls} style={inputStyle} value={sub1} onChange={e => setSub1(e.target.value)}
              placeholder="The answer isn't more income." />
          </div>
          <div>
            <Label text="Subline 2 (gold color)" />
            <input className={inputCls} style={inputStyle} value={sub2} onChange={e => setSub2(e.target.value)}
              placeholder="It's the system you've never been taught." />
          </div>
        </div>
      </div>

      <div style={{ height: "1px", background: "rgba(200,168,75,0.12)" }} />

      {/* 3. Images */}
      <div>
        <h3 className="font-display mb-6" style={{ color: "#c8a84b", fontSize: "18px" }}>Book Images</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ImgUpload label="Floating 3D Cover" hint="The book floating in the hero" value={book3d} folder="covers-3d" onDone={setBook3d} />
          <ImgUpload label="Hero Background" hint="Full-bleed scene behind hero" value={heroBg} folder="heroes" onDone={setHeroBg} />
          <ImgUpload label="Front Cover (flat)" hint="Used in the pricing section" value={bookFront} folder="covers" onDone={setBookFront} />
          <ImgUpload label="Back Cover" hint="Used in Meet the Author" value={bookBack} folder="covers" onDone={setBookBack} />
        </div>
      </div>

      <div style={{ height: "1px", background: "rgba(200,168,75,0.12)" }} />

      {/* 4. What's included */}
      <div>
        <h3 className="font-display mb-2" style={{ color: "#c8a84b", fontSize: "18px" }}>What&apos;s Included</h3>
        <p className="text-xs mb-5" style={{ color: "rgba(232,223,192,0.35)" }}>
          Shown in the pricing card and order summary (e.g. &quot;11 Parts&quot;, &quot;21-Day Challenge&quot;)
        </p>
        <IncludesList items={includes} onChange={setIncludes} />
      </div>

      <div style={{ height: "1px", background: "rgba(200,168,75,0.12)" }} />

      {/* 5. PDFs */}
      <div>
        <h3 className="font-display mb-2" style={{ color: "#c8a84b", fontSize: "18px" }}>Book PDFs</h3>
        <p className="text-xs mb-5" style={{ color: "rgba(232,223,192,0.35)" }}>
          Stored privately in Supabase. Personalized with buyer license and emailed automatically on purchase.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PdfUpload label="Main Book PDF" value={mainPdf} folder={slug || "books"} onDone={setMainPdf} />
          <PdfUpload label="Challenge PDF (optional)" value={challengePdf} folder={slug || "books"} onDone={setChallengePdf} />
        </div>
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-between pt-6" style={{ borderTop: "1px solid rgba(200,168,75,0.15)" }}>
        <div>
          {msg && <span className="text-sm" style={{ color: msg.startsWith("Error") ? "#fca5a5" : "#86efac" }}>{msg}</span>}
          {slug && !msg && (
            <a href={`/${slugId}`} target="_blank" rel="noopener noreferrer"
              className="text-xs transition-colors hover:text-[#c8a84b]" style={{ color: "rgba(232,223,192,0.3)" }}>
              Preview: /{slugId} ↗
            </a>
          )}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onSaved} className="text-sm px-5 py-2.5 rounded-xl border"
            style={{ borderColor: "rgba(200,168,75,0.2)", color: "rgba(232,223,192,0.5)" }}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={isPending || !title || !slug}
            className="btn-gold px-6 py-2.5 text-sm disabled:opacity-50">
            {isPending ? "Saving…" : book ? "Save Changes" : "Create Book"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Admin Panel ────────────────────────────────────────────── */
export default function AdminPanel({ books: initialBooks }: { books: BookData[] }) {
  const [books, setBooks] = useState(initialBooks);
  const [view, setView] = useState<"list" | "new" | "edit">("list");
  const [editing, setEditing] = useState<BookData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [flashMsg, setFlashMsg] = useState<string | null>(null);

  function showFlash(m: string) { setFlashMsg(m); setTimeout(() => setFlashMsg(null), 3000); }

  function handleToggle(id: string, active: boolean) {
    startTransition(async () => {
      const res = await toggleBookActive(id, active);
      if (res?.error) { showFlash("Error: " + res.error); return; }
      setBooks(prev => prev.map(b => b.id === id ? { ...b, active } : b));
      showFlash(active ? "Book published ✓" : "Book unpublished");
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this book? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await deleteBook(id);
      if (res?.error) { showFlash("Error: " + res.error); return; }
      setBooks(prev => prev.filter(b => b.id !== id));
      showFlash("Deleted.");
    });
  }

  function done() {
    setView("list");
    setEditing(null);
    window.location.reload();
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #03100a 0%, #071610 100%)" }}>

      {/* Header */}
      <header className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(3,16,10,0.97)", borderBottom: "1px solid rgba(200,168,75,0.18)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button onClick={() => { setView("list"); setEditing(null); }} className="flex flex-col leading-tight text-left">
            <span className="font-brand text-[#c8a84b]" style={{ fontSize: "17px", letterSpacing: "4px", textTransform: "uppercase" }}>
              BrilliantLabsPh Bibliotech
            </span>
            <span className="text-xs tracking-widest" style={{ color: "rgba(200,168,75,0.4)" }}>Admin</span>
          </button>
          {(view === "new" || view === "edit") && (
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(200,168,75,0.1)", color: "#c8a84b" }}>
              {view === "new" ? "New Book" : `Editing: ${editing?.title}`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {view === "list" && (
            <button onClick={() => setView("new")} className="btn-gold px-5 py-2 text-sm">
              + New Book
            </button>
          )}
          <form action={adminLogout}>
            <button className="text-xs transition-colors hover:text-[#c8a84b]" style={{ color: "rgba(232,223,192,0.3)" }}>
              Sign out
            </button>
          </form>
        </div>
      </header>

      {flashMsg && (
        <div className="mx-6 mt-4 rounded-xl px-4 py-3 text-sm"
          style={{ maxWidth: "900px", margin: "16px auto", background: "rgba(200,168,75,0.08)", border: "1px solid rgba(200,168,75,0.25)", color: "#c8a84b" }}>
          {flashMsg}
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Book list */}
        {view === "list" && (
          <div>
            <h2 className="font-display mb-8" style={{ color: "#c8a84b", fontSize: "26px" }}>Your Books</h2>
            {books.length === 0 ? (
              <div className="emerald-card rounded-2xl p-20 text-center">
                <p className="text-4xl mb-4">📚</p>
                <p className="text-sm" style={{ color: "rgba(232,223,192,0.4)" }}>
                  No books yet. Click &quot;+ New Book&quot; to create your first one.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {books.map(b => {
                  const cover = b.book_3d_url ?? b.book_front_url;
                  const coverUrl = cover ? storageUrl(cover) : null;
                  return (
                    <div key={b.id} className="emerald-card rounded-2xl px-6 py-5 flex items-center gap-5">
                      <div className="flex-shrink-0 w-14 rounded-lg overflow-hidden flex items-center justify-center"
                        style={{ background: "rgba(200,168,75,0.06)", border: "1px solid rgba(200,168,75,0.15)", minHeight: "56px" }}>
                        {coverUrl
                          ? <Image src={coverUrl} alt={b.title} width={56} height={72} className="object-cover" />
                          : <span className="text-2xl py-2">📖</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate" style={{ color: "#e8dfc0" }}>{b.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(232,223,192,0.4)" }}>
                          /{b.slug} · {b.author} · ₱{b.price.toLocaleString()}
                        </p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 ${
                        b.active
                          ? "bg-green-900/30 text-green-300 border border-green-600/25"
                          : "bg-yellow-900/30 text-yellow-400 border border-yellow-600/25"
                      }`}>
                        {b.active ? "Live" : "Draft"}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a href={`/${b.slug}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-3 py-2 rounded-lg border"
                          style={{ borderColor: "rgba(200,168,75,0.2)", color: "rgba(232,223,192,0.4)" }}>
                          View ↗
                        </a>
                        <button onClick={() => { setEditing(b); setView("edit"); }}
                          className="text-xs px-3 py-2 rounded-lg border"
                          style={{ borderColor: "rgba(200,168,75,0.3)", color: "#c8a84b" }}>
                          Edit
                        </button>
                        <button onClick={() => handleToggle(b.id, !b.active)} disabled={isPending}
                          className="text-xs px-3 py-2 rounded-lg border disabled:opacity-50 transition-all"
                          style={{
                            borderColor: b.active ? "rgba(220,38,38,0.3)" : "rgba(74,222,128,0.3)",
                            color: b.active ? "#fca5a5" : "#86efac",
                          }}>
                          {b.active ? "Unpublish" : "Publish"}
                        </button>
                        <button onClick={() => handleDelete(b.id)} disabled={isPending}
                          className="text-xs px-2 py-2 rounded-lg disabled:opacity-50"
                          style={{ color: "rgba(252,165,165,0.3)" }} title="Delete">
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* New / Edit form */}
        {(view === "new" || view === "edit") && (
          <div>
            <button onClick={() => { setView("list"); setEditing(null); }}
              className="text-sm mb-8 flex items-center gap-2 transition-colors hover:text-[#c8a84b]"
              style={{ color: "rgba(232,223,192,0.4)" }}>
              ← Back to books
            </button>
            <div className="emerald-card rounded-2xl p-8 md:p-10">
              <BookForm book={editing ?? undefined} onSaved={done} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
