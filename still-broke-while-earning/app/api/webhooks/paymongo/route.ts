import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateLicenseId } from "@/lib/license";
import { personalizePdf } from "@/lib/pdf";
import { sendBookDeliveryEmail } from "@/lib/email";
import { createHmac } from "crypto";
import { BookData } from "@/lib/supabase";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function verifySignature(payload: string, sigHeader: string): boolean {
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;
  if (!secret) return true;
  const computed = createHmac("sha256", secret).update(payload).digest("hex");
  return computed === sigHeader;
}

async function getBook(slug: string): Promise<BookData | null> {
  const supabase = db();
  const { data } = await supabase.from("books").select("*").eq("slug", slug).single();
  return data ?? null;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("paymongo-signature") ?? "";

  if (!verifySignature(rawBody, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventType = event?.data?.attributes?.type;

  if (eventType !== "checkout_session.payment.paid") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.attributes.data;
  const attrs = session?.attributes;
  const metadata = attrs?.metadata ?? {};
  const billing = attrs?.billing ?? {};
  const paymentId = session?.id;
  const paymentMethod = attrs?.payment_method_used ?? "unknown";

  const buyerName = metadata.buyer_name ?? billing.name ?? "Buyer";
  const buyerEmail = metadata.buyer_email ?? billing.email;
  const bookSlug = metadata.book_slug ?? "still-broke-while-earning";

  if (!buyerEmail) {
    return NextResponse.json({ error: "No buyer email in session" }, { status: 400 });
  }

  const supabase = db();

  // Prevent duplicate processing
  const { data: existing } = await supabase
    .from("licenses")
    .select("id")
    .eq("payment_id", paymentId)
    .single();

  if (existing) return NextResponse.json({ received: true, duplicate: true });

  // Get book data from DB
  const book = await getBook(bookSlug);
  const bookTitle = book?.title ?? "Still Broke While Earning";
  const bookCode = bookSlug.toUpperCase().split("-").map((w: string) => w[0]).join("").slice(0, 6);
  const amount = book?.price ?? 950;

  const issueDate = new Date().toLocaleDateString("en-PH", {
    year: "numeric", month: "long", day: "numeric",
  });

  const { licenseId, orderNumber } = await generateLicenseId({
    bookSlug: bookCode,
    country: "PH",
    licenseType: "R",
  });

  // Save license record
  await supabase.from("licenses").insert({
    license_id: licenseId,
    order_number: orderNumber,
    buyer_name: buyerName,
    buyer_email: buyerEmail,
    book_slug: bookSlug,
    book_name: bookTitle,
    country: "PH",
    license_type: "R",
    amount,
    payment_id: paymentId,
    payment_method: paymentMethod,
    issued_at: new Date().toISOString(),
  });

  // Personalize PDFs
  const sharedArgs = { buyerName, buyerEmail, licenseId, orderNumber, issueDate };
  const pdfBuffers: { filename: string; content: Uint8Array }[] = [];

  if (book?.main_pdf_path) {
    const bytes = await personalizePdf({
      storagePath: book.main_pdf_path,
      bookTitle,
      ...sharedArgs,
    });
    pdfBuffers.push({ filename: `${bookSlug}.pdf`, content: bytes });
  }

  if (book?.challenge_pdf_path) {
    const bytes = await personalizePdf({
      storagePath: book.challenge_pdf_path,
      bookTitle: `${bookTitle} — Challenge`,
      ...sharedArgs,
    });
    pdfBuffers.push({ filename: `${bookSlug}-challenge.pdf`, content: bytes });
  }

  // Fallback for SBWE if no DB book yet
  if (pdfBuffers.length === 0) {
    const [sbweBytes, challengeBytes] = await Promise.all([
      personalizePdf({ storagePath: "still-broke-while-earning.pdf", bookTitle, ...sharedArgs }),
      personalizePdf({ storagePath: "21-day-financial-freedom.pdf", bookTitle: "21-Day Financial\nFreedom Challenge", ...sharedArgs }),
    ]);
    pdfBuffers.push(
      { filename: "Still-Broke-While-Earning.pdf", content: sbweBytes },
      { filename: "21-Day-Financial-Freedom-Challenge.pdf", content: challengeBytes },
    );
  }

  await sendBookDeliveryEmail({ buyerName, buyerEmail, licenseId, orderNumber, issueDate, pdfBuffers });

  await supabase
    .from("licenses")
    .update({ email_sent_at: new Date().toISOString() })
    .eq("payment_id", paymentId);

  return NextResponse.json({ received: true, licenseId, orderNumber });
}
