"use client";

import { useState, useTransition } from "react";
import { BookData } from "@/lib/supabase";
import { saveBook, toggleBookActive, deleteBook, getSignedUploadUrl, adminLogout } from "./actions";

/* ─── Types ───────────────────────────────────────────────── */
type Pain = { title: string; text: string };
type Promise_ = { number: string; title: string; text: string };
type Include = { label: string; desc: string };
type Step = { step: number; title: string; text: string };
type Testimonial = { quote: string; name: string; title: string; stars: number };

const TABS = ["Books", "New Book"];

/* ─── Upload helper ───────────────────────────────────────── */
async function uploadFile(file: File, bucket: string, path: string): Promise<string | null> {
  const res = await getSignedUploadUrl(bucket, path);
  if ("error" in res) return null;
  await fetch(res.signedUrl!, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
  return path;
}

/* ─── Section builders ────────────────────────────────────── */
function DynList<T>({ label, items, setItems, renderItem, newItem }: {
  label: string; items: T[]; setItems: (v: T[]) => void;
  renderItem: (item: T, idx: number, onChange: (v: T) => void) => React.ReactNode;
  newItem: () => T;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(232,223,192,0.5)" }}>{label}</span>
        <button type="button" onClick={() => setItems([...items, newItem()])}
          className="text-xs px-3 py-1 rounded-lg" style={{ background: "rgba(200,168,75,0.1)", color: "#c8a84b", border: "1px solid rgba(200,168,75,0.3)" }}>
          + Add
        </button>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="rounded-xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,168,75,0.15)" }}>
          {renderItem(item, idx, (v) => {
            const next = [...items]; next[idx] = v; setItems(next);
          })}
          <button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))}
            className="text-xs" style={{ color: "#fca5a5" }}>Remove</button>
        </div>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: "rgba(232,223,192,0.5)" }}>{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#c8a84b]";
const inputStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,168,75,0.25)", color: "#e8dfc0" };

/* ─── Image upload field ──────────────────────────────────── */
function ImageField({ label, currentPath, onUpload, folder }: {
  label: string; currentPath?: string | null; folder: string;
  onUpload: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setPreview(URL.createObjectURL(file));
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const result = await uploadFile(file, "books", path);
    if (result) onUpload(result);
    setUploading(false);
  }

  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        {(preview || currentPath) && (
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(200,168,75,0.2)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview ?? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/books/${currentPath}`}
              alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <label className="cursor-pointer text-xs px-4 py-2 rounded-lg transition-all"
          style={{ background: "rgba(200,168,75,0.1)", color: "#c8a84b", border: "1px solid rgba(200,168,75,0.3)" }}>
          {uploading ? "Uploading…" : currentPath || preview ? "Change" : "Upload"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {currentPath && !preview && <span className="text-xs truncate max-w-[120px]" style={{ color: "rgba(232,223,192,0.3)" }}>{currentPath.split("/").pop()}</span>}
      </div>
    </Field>
  );
}

function PdfField({ label, currentPath, onUpload, folder }: {
  label: string; currentPath?: string | null; folder: string;
  onUpload: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${folder}/${file.name}`;
    const result = await uploadFile(file, "books", path);
    if (result) { onUpload(result); setDone(true); }
    setUploading(false);
  }

  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <label className="cursor-pointer text-xs px-4 py-2 rounded-lg transition-all"
          style={{ background: "rgba(200,168,75,0.1)", color: "#c8a84b", border: "1px solid rgba(200,168,75,0.3)" }}>
          {uploading ? "Uploading…" : done || currentPath ? "✓ Uploaded — Change" : "Upload PDF"}
          <input type="file" accept="application/pdf" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {currentPath && !done && <span className="text-xs truncate max-w-[160px]" style={{ color: "rgba(232,223,192,0.3)" }}>{currentPath.split("/").pop()}</span>}
      </div>
    </Field>
  );
}

/* ─── Book Form ───────────────────────────────────────────── */
function BookForm({ book, onSaved }: { book?: BookData; onSaved: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [section, setSection] = useState(0);

  // Basic
  const [title, setTitle] = useState(book?.title ?? "");
  const [slug, setSlug] = useState(book?.slug ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [authorCreds, setAuthorCreds] = useState(book?.author_credentials ?? "");
  const [authorTitle, setAuthorTitle] = useState(book?.author_title ?? "");
  const [authorBio, setAuthorBio] = useState(book?.author_bio ?? "");
  const [authorTags, setAuthorTags] = useState((book?.author_tags ?? []).join(", "));
  const [price, setPrice] = useState(book?.price?.toString() ?? "950");
  const [origPrice, setOrigPrice] = useState(book?.original_price?.toString() ?? "1200");
  const [priceLabel, setPriceLabel] = useState(book?.price_label ?? "launch price");

  // Hero
  const [headline, setHeadline] = useState(book?.hero_headline ?? "");
  const [sub1, setSub1] = useState(book?.hero_subline_1 ?? "");
  const [sub2, setSub2] = useState(book?.hero_subline_2 ?? "");
  const [heroBg, setHeroBg] = useState(book?.hero_bg_url ?? "");
  const [book3d, setBook3d] = useState(book?.book_3d_url ?? "");
  const [bookFront, setBookFront] = useState(book?.book_front_url ?? "");
  const [bookBack, setBookBack] = useState(book?.book_back_url ?? "");

  // Sections
  const pb = book?.problem_section;
  const [probEyebrow, setProbEyebrow] = useState(pb?.eyebrow ?? "Sound Familiar?");
  const [probHeadline, setProbHeadline] = useState(pb?.headline ?? "");
  const [probSubtext, setProbSubtext] = useState(pb?.subtext ?? "");
  const [pains, setPains] = useState<Pain[]>(pb?.pains ?? [{ title: "", text: "" }]);

  const lb = book?.learn_section;
  const [learnEyebrow, setLearnEyebrow] = useState(lb?.eyebrow ?? "What You'll Learn");
  const [learnHeadline, setLearnHeadline] = useState(lb?.headline ?? "");
  const [learnSubtext, setLearnSubtext] = useState(lb?.subtext ?? "");
  const [promises, setPromises] = useState<Promise_[]>(lb?.promises ?? [{ number: "01", title: "", text: "" }]);

  const [includes, setIncludes] = useState<Include[]>(book?.includes_section ?? [{ label: "", desc: "" }]);

  const mb = book?.method_section;
  const [methodName, setMethodName] = useState(mb?.name ?? "");
  const [methodEyebrow, setMethodEyebrow] = useState(mb?.eyebrow ?? "The Core Method");
  const [methodHeadline, setMethodHeadline] = useState(mb?.headline ?? "");
  const [methodSubtext, setMethodSubtext] = useState(mb?.subtext ?? "");
  const [steps, setSteps] = useState<Step[]>(mb?.steps ?? [{ step: 1, title: "", text: "" }]);

  const [testimonials, setTestimonials] = useState<Testimonial[]>(book?.testimonials ?? [{ quote: "", name: "", title: "", stars: 5 }]);

  const [mainPdf, setMainPdf] = useState(book?.main_pdf_path ?? "");
  const [challengePdf, setChallengePdf] = useState(book?.challenge_pdf_path ?? "");

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function handleSave() {
    startTransition(async () => {
      const payload: Partial<BookData> & { id?: string } = {
        ...(book?.id ? { id: book.id } : {}),
        title, slug, author,
        author_credentials: authorCreds || null,
        author_title: authorTitle || null,
        author_bio: authorBio || null,
        author_tags: authorTags ? authorTags.split(",").map(s => s.trim()).filter(Boolean) : [],
        price: Number(price),
        original_price: origPrice ? Number(origPrice) : null,
        price_label: priceLabel || null,
        hero_headline: headline,
        hero_subline_1: sub1 || null,
        hero_subline_2: sub2 || null,
        hero_bg_url: heroBg || null,
        book_3d_url: book3d || null,
        book_front_url: bookFront || null,
        book_back_url: bookBack || null,
        problem_section: { eyebrow: probEyebrow, headline: probHeadline, subtext: probSubtext, pains: pains.filter(p => p.title) },
        learn_section: { eyebrow: learnEyebrow, headline: learnHeadline, subtext: learnSubtext, promises: promises.filter(p => p.title) },
        includes_section: includes.filter(i => i.label),
        method_section: { name: methodName, eyebrow: methodEyebrow, headline: methodHeadline, subtext: methodSubtext, steps: steps.filter(s => s.title) },
        testimonials: testimonials.filter(t => t.quote),
        main_pdf_path: mainPdf || null,
        challenge_pdf_path: challengePdf || null,
      };
      const res = await saveBook(payload);
      if (res?.error) { setMsg(`Error: ${res.error}`); return; }
      setMsg("Saved successfully!");
      setTimeout(() => { setMsg(null); onSaved(); }, 1500);
    });
  }

  const SECTIONS = ["Basic Info", "Hero", "Covers", "Problem", "Learn", "Inside", "Method", "Testimonials", "PDFs"];

  return (
    <div>
      {/* Section tabs */}
      <div className="flex gap-1 flex-wrap mb-8 pb-4" style={{ borderBottom: "1px solid rgba(200,168,75,0.15)" }}>
        {SECTIONS.map((s, i) => (
          <button key={s} onClick={() => setSection(i)} type="button"
            className="px-3 py-1.5 rounded-lg text-xs transition-all"
            style={{
              background: section === i ? "var(--gold, #c8a84b)" : "transparent",
              color: section === i ? "#0D1B2A" : "rgba(232,223,192,0.5)",
              border: `1px solid ${section === i ? "#c8a84b" : "rgba(200,168,75,0.2)"}`,
              fontWeight: section === i ? 600 : 400,
            }}>
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-5">

        {/* ── Basic Info ── */}
        {section === 0 && <>
          <Field label="Book Title">
            <input className={inputCls} style={inputStyle} value={title}
              onChange={e => { setTitle(e.target.value); if (!book) setSlug(autoSlug(e.target.value)); }} />
          </Field>
          <Field label="Slug (URL path)">
            <input className={inputCls} style={inputStyle} value={slug} onChange={e => setSlug(e.target.value)} placeholder="still-broke-while-earning" />
          </Field>
          <Field label="Author Name">
            <input className={inputCls} style={inputStyle} value={author} onChange={e => setAuthor(e.target.value)} />
          </Field>
          <Field label="Author Credentials (e.g. CSFP)">
            <input className={inputCls} style={inputStyle} value={authorCreds} onChange={e => setAuthorCreds(e.target.value)} />
          </Field>
          <Field label="Author Title">
            <input className={inputCls} style={inputStyle} value={authorTitle} onChange={e => setAuthorTitle(e.target.value)} placeholder="Author · Founder · Entrepreneur" />
          </Field>
          <Field label="Author Bio">
            <textarea className={inputCls} style={inputStyle} rows={4} value={authorBio} onChange={e => setAuthorBio(e.target.value)} />
          </Field>
          <Field label="Author Tags (comma-separated)">
            <input className={inputCls} style={inputStyle} value={authorTags} onChange={e => setAuthorTags(e.target.value)} placeholder="CSFP Certified, FlowPath Founder" />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Price (₱)">
              <input type="number" className={inputCls} style={inputStyle} value={price} onChange={e => setPrice(e.target.value)} />
            </Field>
            <Field label="Original Price (₱)">
              <input type="number" className={inputCls} style={inputStyle} value={origPrice} onChange={e => setOrigPrice(e.target.value)} />
            </Field>
            <Field label="Price Label">
              <input className={inputCls} style={inputStyle} value={priceLabel} onChange={e => setPriceLabel(e.target.value)} />
            </Field>
          </div>
        </>}

        {/* ── Hero ── */}
        {section === 1 && <>
          <Field label="Hero Headline (use \\n for line breaks)">
            <textarea className={inputCls} style={inputStyle} rows={3} value={headline} onChange={e => setHeadline(e.target.value)}
              placeholder={"You work hard.\\nYou earn. And yet…\\nyou're still broke."} />
          </Field>
          <Field label="Hero Subline 1">
            <input className={inputCls} style={inputStyle} value={sub1} onChange={e => setSub1(e.target.value)} placeholder="The answer isn't more income." />
          </Field>
          <Field label="Hero Subline 2 (gold color)">
            <input className={inputCls} style={inputStyle} value={sub2} onChange={e => setSub2(e.target.value)} placeholder="It's the system you've never been taught." />
          </Field>
          <ImageField label="Hero Background Image" currentPath={heroBg} folder="heroes" onUpload={setHeroBg} />
          <ImageField label="3D Floating Book Cover" currentPath={book3d} folder="covers-3d" onUpload={setBook3d} />
        </>}

        {/* ── Covers ── */}
        {section === 2 && <>
          <ImageField label="Front Cover (flat — for pricing section)" currentPath={bookFront} folder="covers" onUpload={setBookFront} />
          <ImageField label="Back Cover (for author section)" currentPath={bookBack} folder="covers" onUpload={setBookBack} />
        </>}

        {/* ── Problem ── */}
        {section === 3 && <>
          <Field label="Section Eyebrow"><input className={inputCls} style={inputStyle} value={probEyebrow} onChange={e => setProbEyebrow(e.target.value)} /></Field>
          <Field label="Section Headline"><input className={inputCls} style={inputStyle} value={probHeadline} onChange={e => setProbHeadline(e.target.value)} /></Field>
          <Field label="Section Subtext"><textarea className={inputCls} style={inputStyle} rows={2} value={probSubtext} onChange={e => setProbSubtext(e.target.value)} /></Field>
          <DynList label="Pain Points" items={pains} setItems={setPains} newItem={() => ({ title: "", text: "" })}
            renderItem={(item, _, onChange) => (<>
              <input className={inputCls} style={inputStyle} placeholder="Title" value={item.title} onChange={e => onChange({ ...item, title: e.target.value })} />
              <textarea className={inputCls} style={inputStyle} placeholder="Description" rows={2} value={item.text} onChange={e => onChange({ ...item, text: e.target.value })} />
            </>)} />
        </>}

        {/* ── Learn ── */}
        {section === 4 && <>
          <Field label="Section Eyebrow"><input className={inputCls} style={inputStyle} value={learnEyebrow} onChange={e => setLearnEyebrow(e.target.value)} /></Field>
          <Field label="Section Headline"><input className={inputCls} style={inputStyle} value={learnHeadline} onChange={e => setLearnHeadline(e.target.value)} /></Field>
          <Field label="Section Subtext"><textarea className={inputCls} style={inputStyle} rows={2} value={learnSubtext} onChange={e => setLearnSubtext(e.target.value)} /></Field>
          <DynList label="Promises / Takeaways" items={promises} setItems={setPromises} newItem={() => ({ number: String(promises.length + 1).padStart(2, "0"), title: "", text: "" })}
            renderItem={(item, _, onChange) => (<>
              <input className={inputCls} style={inputStyle} placeholder="Number (e.g. 01)" value={item.number} onChange={e => onChange({ ...item, number: e.target.value })} />
              <input className={inputCls} style={inputStyle} placeholder="Title" value={item.title} onChange={e => onChange({ ...item, title: e.target.value })} />
              <textarea className={inputCls} style={inputStyle} placeholder="Description" rows={2} value={item.text} onChange={e => onChange({ ...item, text: e.target.value })} />
            </>)} />
        </>}

        {/* ── Inside ── */}
        {section === 5 && (
          <DynList label="What's Inside the Book" items={includes} setItems={setIncludes} newItem={() => ({ label: "", desc: "" })}
            renderItem={(item, _, onChange) => (<>
              <input className={inputCls} style={inputStyle} placeholder="Label (e.g. 11 Parts)" value={item.label} onChange={e => onChange({ ...item, label: e.target.value })} />
              <textarea className={inputCls} style={inputStyle} placeholder="Description" rows={2} value={item.desc} onChange={e => onChange({ ...item, desc: e.target.value })} />
            </>)} />
        )}

        {/* ── Method ── */}
        {section === 6 && <>
          <Field label="Method Name (e.g. FlowPath Budget Method™)"><input className={inputCls} style={inputStyle} value={methodName} onChange={e => setMethodName(e.target.value)} /></Field>
          <Field label="Section Eyebrow"><input className={inputCls} style={inputStyle} value={methodEyebrow} onChange={e => setMethodEyebrow(e.target.value)} /></Field>
          <Field label="Section Headline"><input className={inputCls} style={inputStyle} value={methodHeadline} onChange={e => setMethodHeadline(e.target.value)} /></Field>
          <Field label="Section Subtext"><textarea className={inputCls} style={inputStyle} rows={2} value={methodSubtext} onChange={e => setMethodSubtext(e.target.value)} /></Field>
          <DynList label="Method Steps" items={steps} setItems={setSteps} newItem={() => ({ step: steps.length + 1, title: "", text: "" })}
            renderItem={(item, _, onChange) => (<>
              <input type="number" className={inputCls} style={inputStyle} placeholder="Step #" value={item.step} onChange={e => onChange({ ...item, step: Number(e.target.value) })} />
              <input className={inputCls} style={inputStyle} placeholder="Step Title" value={item.title} onChange={e => onChange({ ...item, title: e.target.value })} />
              <textarea className={inputCls} style={inputStyle} placeholder="Description" rows={2} value={item.text} onChange={e => onChange({ ...item, text: e.target.value })} />
            </>)} />
        </>}

        {/* ── Testimonials ── */}
        {section === 7 && (
          <DynList label="Reader Testimonials" items={testimonials} setItems={setTestimonials} newItem={() => ({ quote: "", name: "", title: "", stars: 5 })}
            renderItem={(item, _, onChange) => (<>
              <textarea className={inputCls} style={inputStyle} placeholder="Quote" rows={3} value={item.quote} onChange={e => onChange({ ...item, quote: e.target.value })} />
              <input className={inputCls} style={inputStyle} placeholder="Reader Name" value={item.name} onChange={e => onChange({ ...item, name: e.target.value })} />
              <input className={inputCls} style={inputStyle} placeholder="Reader Title / Location" value={item.title} onChange={e => onChange({ ...item, title: e.target.value })} />
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "rgba(232,223,192,0.5)" }}>Stars:</span>
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => onChange({ ...item, stars: n })}
                    style={{ color: n <= item.stars ? "#f5e642" : "rgba(232,223,192,0.2)", fontSize: "16px" }}>★</button>
                ))}
              </div>
            </>)} />
        )}

        {/* ── PDFs ── */}
        {section === 8 && <>
          <PdfField label="Main Book PDF" currentPath={mainPdf} folder={slug || "books"} onUpload={setMainPdf} />
          <PdfField label="Challenge PDF (optional)" currentPath={challengePdf} folder={slug || "books"} onUpload={setChallengePdf} />
          <p className="text-xs" style={{ color: "rgba(232,223,192,0.3)" }}>
            PDFs are stored privately in Supabase and personalized per buyer on purchase.
          </p>
        </>}
      </div>

      {/* Save */}
      <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid rgba(200,168,75,0.15)" }}>
        {msg && <span className="text-sm" style={{ color: msg.startsWith("Error") ? "#fca5a5" : "#86efac" }}>{msg}</span>}
        <div className="ml-auto flex gap-3">
          <button type="button" onClick={onSaved} className="text-sm px-5 py-2 rounded-lg border" style={{ borderColor: "rgba(200,168,75,0.2)", color: "rgba(232,223,192,0.5)" }}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={isPending || !title || !slug}
            className="btn-gold px-6 py-2 text-sm disabled:opacity-50">
            {isPending ? "Saving…" : book ? "Save Changes" : "Create Book"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Admin Panel ────────────────────────────────────── */
export default function AdminPanel({ books: initialBooks }: { books: BookData[] }) {
  const [tab, setTab] = useState(0);
  const [books, setBooks] = useState(initialBooks);
  const [editing, setEditing] = useState<BookData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(null), 3000); }

  function handleToggle(id: string, active: boolean) {
    startTransition(async () => {
      const res = await toggleBookActive(id, active);
      if (res?.error) { flash(`Error: ${res.error}`); return; }
      setBooks(prev => prev.map(b => b.id === id ? { ...b, active } : b));
      flash(active ? "Book published." : "Book unpublished.");
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this book? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await deleteBook(id);
      if (res?.error) { flash(`Error: ${res.error}`); return; }
      setBooks(prev => prev.filter(b => b.id !== id));
      flash("Book deleted.");
    });
  }

  function refreshBooks() {
    setTab(0);
    setEditing(null);
    window.location.reload();
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #04100a 0%, #08190f 100%)" }}>
      {/* Header */}
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(4,16,10,0.97)", borderBottom: "1px solid rgba(200,168,75,0.2)", backdropFilter: "blur(12px)" }}>
        <div>
          <span className="font-brand text-[#c8a84b]" style={{ fontSize: "16px", letterSpacing: "4px", textTransform: "uppercase" }}>BrilliantLabsPh Bibliotech</span>
          <span className="ml-3 text-xs tracking-widest uppercase" style={{ color: "rgba(232,223,192,0.4)" }}>Admin</span>
        </div>
        <form action={adminLogout}>
          <button className="text-xs" style={{ color: "rgba(232,223,192,0.4)" }}>Sign out</button>
        </form>
      </header>

      {/* Tabs */}
      <div className="px-6 flex gap-1 pt-4" style={{ borderBottom: "1px solid rgba(200,168,75,0.15)" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => { setTab(i); setEditing(null); }}
            className="px-5 py-2.5 text-sm font-medium transition-all relative"
            style={{ color: tab === i ? "#c8a84b" : "rgba(232,223,192,0.4)" }}>
            {t}
            {tab === i && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#c8a84b" }} />}
          </button>
        ))}
      </div>

      {msg && (
        <div className="mx-6 mt-4 rounded-lg px-4 py-3 text-sm"
          style={{ background: "rgba(200,168,75,0.08)", border: "1px solid rgba(200,168,75,0.25)", color: "#c8a84b" }}>
          {msg}
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* ── Books list ── */}
        {tab === 0 && !editing && (
          <div className="space-y-3">
            <h2 className="font-display text-2xl mb-6" style={{ color: "#c8a84b" }}>All Books</h2>
            {books.length === 0 && (
              <div className="emerald-card rounded-xl p-16 text-center text-sm" style={{ color: "rgba(232,223,192,0.4)" }}>
                No books yet. Click "New Book" to create one.
              </div>
            )}
            {books.map(b => (
              <div key={b.id} className="emerald-card rounded-xl px-6 py-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-medium" style={{ color: "#e8dfc0" }}>{b.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(232,223,192,0.4)" }}>
                    /{b.slug} · {b.author} · ₱{b.price}
                  </div>
                </div>
                <a href={`/${b.slug}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg"
                  style={{ color: "rgba(232,223,192,0.4)", border: "1px solid rgba(200,168,75,0.2)" }}>
                  Preview ↗
                </a>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${b.active ? "bg-green-900/40 text-green-300 border border-green-600/30" : "bg-yellow-900/40 text-yellow-300 border border-yellow-600/30"}`}>
                  {b.active ? "Live" : "Draft"}
                </span>
                <button onClick={() => handleToggle(b.id, !b.active)} disabled={isPending}
                  className="text-xs px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50"
                  style={{ borderColor: "rgba(200,168,75,0.3)", color: "#c8a84b" }}>
                  {b.active ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => { setEditing(b); setTab(0); }}
                  className="text-xs px-3 py-1.5 rounded-lg border"
                  style={{ borderColor: "rgba(200,168,75,0.3)", color: "rgba(232,223,192,0.6)" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(b.id)} disabled={isPending}
                  className="text-xs px-3 py-1.5 rounded-lg border disabled:opacity-50"
                  style={{ borderColor: "rgba(220,38,38,0.35)", color: "#fca5a5" }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Edit book ── */}
        {tab === 0 && editing && (
          <div>
            <button onClick={() => setEditing(null)} className="text-sm mb-6" style={{ color: "rgba(232,223,192,0.4)" }}>
              ← Back to books
            </button>
            <h2 className="font-display text-2xl mb-6" style={{ color: "#c8a84b" }}>Edit: {editing.title}</h2>
            <div className="emerald-card rounded-2xl p-8">
              <BookForm book={editing} onSaved={refreshBooks} />
            </div>
          </div>
        )}

        {/* ── New book ── */}
        {tab === 1 && (
          <div>
            <h2 className="font-display text-2xl mb-6" style={{ color: "#c8a84b" }}>New Book</h2>
            <div className="emerald-card rounded-2xl p-8">
              <BookForm onSaved={refreshBooks} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
