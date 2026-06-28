import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateLicenseId } from "@/lib/license";
import { personalizePdf } from "@/lib/pdf";
import { sendBookDeliveryEmail } from "@/lib/email";
import { createHmac } from "crypto";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function verifySignature(payload: string, sigHeader: string): boolean {
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;
  if (!secret) return true; // skip in dev if not set
  const computed = createHmac("sha256", secret).update(payload).digest("hex");
  return computed === sigHeader;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("paymongo-signature") ?? "";

  if (!verifySignature(rawBody, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventType = event?.data?.attributes?.type;

  // Only process successful checkout payments
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

  // Generate license
  const issueDate = new Date().toLocaleDateString("en-PH", {
    year: "numeric", month: "long", day: "numeric",
  });

  const { licenseId, orderNumber } = await generateLicenseId({
    bookSlug: "sbwe",
    country: "PH",
    licenseType: "R",
  });

  // Save license record
  await supabase.from("licenses").insert({
    license_id: licenseId,
    order_number: orderNumber,
    buyer_name: buyerName,
    buyer_email: buyerEmail,
    book_slug: "sbwe",
    book_name: "Still Broke While Earning",
    country: "PH",
    license_type: "R",
    amount: 950,
    payment_id: paymentId,
    payment_method: paymentMethod,
    issued_at: new Date().toISOString(),
  });

  // Personalize both PDFs
  const sharedArgs = { buyerName, buyerEmail, licenseId, orderNumber, issueDate };

  const [sбweBytes, challengeBytes] = await Promise.all([
    personalizePdf({
      storagePath: "still-broke-while-earning.pdf",
      bookTitle: "Still Broke While Earning",
      ...sharedArgs,
    }),
    personalizePdf({
      storagePath: "21-day-financial-freedom.pdf",
      bookTitle: "21-Day Financial\nFreedom Challenge",
      ...sharedArgs,
    }),
  ]);

  // Send delivery email
  await sendBookDeliveryEmail({
    buyerName,
    buyerEmail,
    licenseId,
    orderNumber,
    issueDate,
    pdfBuffers: [
      { filename: "Still-Broke-While-Earning.pdf", content: sбweBytes },
      { filename: "21-Day-Financial-Freedom-Challenge.pdf", content: challengeBytes },
    ],
  });

  // Mark email sent
  await supabase
    .from("licenses")
    .update({ email_sent_at: new Date().toISOString() })
    .eq("payment_id", paymentId);

  return NextResponse.json({ received: true, licenseId, orderNumber });
}
