import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { buyerName, buyerEmail } = await req.json();

  if (!buyerName || !buyerEmail) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

  const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          billing: {
            name: buyerName,
            email: buyerEmail,
          },
          send_email_receipt: false,
          show_description: true,
          show_line_items: true,
          line_items: [
            {
              currency: "PHP",
              amount: 95000, // ₱950.00 in centavos
              description: "Still Broke While Earning — Digital Book + 21-Day Challenge",
              name: "Still Broke While Earning",
              quantity: 1,
            },
          ],
          payment_method_types: ["card", "gcash", "paymaya", "grab_pay"],
          success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${siteUrl}/checkout`,
          metadata: {
            buyer_name: buyerName,
            buyer_email: buyerEmail,
          },
        },
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data.errors?.[0]?.detail ?? "Payment session failed." },
      { status: 500 }
    );
  }

  const checkoutUrl = data.data?.attributes?.checkout_url;
  return NextResponse.json({ url: checkoutUrl });
}
