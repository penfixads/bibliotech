import { NextRequest, NextResponse } from "next/server";
import { getBookBySlug } from "@/app/admin/actions";

export async function POST(req: NextRequest) {
  const { buyerName, buyerEmail, bookSlug, price } = await req.json();

  if (!buyerName || !buyerEmail) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

  // Determine book info: prefer DB lookup, fallback to passed price or hardcoded SBWE
  let bookTitle = "Still Broke While Earning";
  let bookDescription = "Still Broke While Earning — Digital Book + 21-Day Challenge";
  let amountCentavos = 95000;
  let slug = bookSlug ?? "still-broke-while-earning";

  if (bookSlug) {
    const book = await getBookBySlug(bookSlug);
    if (book) {
      bookTitle = book.title;
      bookDescription = `${book.title} — Digital Book`;
      if (book.challenge_pdf_path) bookDescription += " + Challenge";
      amountCentavos = book.price * 100;
      slug = book.slug;
    } else if (price) {
      amountCentavos = Number(price) * 100;
    }
  }

  const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          billing: { name: buyerName, email: buyerEmail },
          send_email_receipt: false,
          show_description: true,
          show_line_items: true,
          line_items: [{
            currency: "PHP",
            amount: amountCentavos,
            description: bookDescription,
            name: bookTitle,
            quantity: 1,
          }],
          payment_method_types: ["card", "gcash", "paymaya", "grab_pay"],
          success_url: `${siteUrl}/${slug}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${siteUrl}/${slug}/checkout`,
          metadata: {
            buyer_name: buyerName,
            buyer_email: buyerEmail,
            book_slug: slug,
          },
        },
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json({ error: data.errors?.[0]?.detail ?? "Payment session failed." }, { status: 500 });
  }

  const checkoutUrl = data.data?.attributes?.checkout_url;
  return NextResponse.json({ url: checkoutUrl });
}
