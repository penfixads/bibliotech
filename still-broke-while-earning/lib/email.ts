import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookDeliveryEmail({
  buyerName,
  buyerEmail,
  licenseId,
  orderNumber,
  issueDate,
  pdfBuffers,
}: {
  buyerName: string;
  buyerEmail: string;
  licenseId: string;
  orderNumber: string;
  issueDate: string;
  pdfBuffers: { filename: string; content: Uint8Array }[];
}) {
  const firstName = buyerName.split(" ")[0];

  await resend.emails.send({
    from: "BrilliantLabsPh Bibliotech <bibliotech@brilliantlabsph.com>",
    to: buyerEmail,
    subject: `Your copy of Still Broke While Earning is here! 📖`,
    attachments: pdfBuffers.map(({ filename, content }) => ({
      filename,
      content: Buffer.from(content),
    })),
    html: `
      <div style="font-family:Georgia,serif;max-width:580px;margin:0 auto;background:#0d1b2a;color:#e8e0d0;padding:48px 36px;border-radius:14px;">

        <div style="text-align:center;margin-bottom:36px;">
          <p style="color:#c9a84c;font-size:10px;letter-spacing:5px;text-transform:uppercase;margin:0 0 4px;">BrilliantLabsPh</p>
          <p style="color:#7a7060;font-size:9px;letter-spacing:4px;text-transform:uppercase;margin:0;">Bibliotech</p>
          <div style="width:60px;height:1px;background:#c9a84c;margin:16px auto 0;"></div>
        </div>

        <h1 style="color:#c9a84c;font-size:24px;font-weight:normal;margin:0 0 8px;text-align:center;">
          Your book is ready, ${firstName}.
        </h1>
        <p style="color:#7a7060;font-size:13px;text-align:center;margin:0 0 32px;">
          Thank you for your purchase. Your personally licensed copy is attached.
        </p>

        <div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:24px 28px;margin-bottom:28px;">
          <p style="color:#c9a84c;font-size:9px;letter-spacing:4px;text-transform:uppercase;margin:0 0 16px;">Your License Details</p>
          <table style="width:100%;font-size:13px;border-collapse:collapse;">
            <tr><td style="color:#7a7060;padding:4px 0;width:40%;">License ID</td><td style="color:#e8e0d0;font-family:monospace;">${licenseId}</td></tr>
            <tr><td style="color:#7a7060;padding:4px 0;">Order Number</td><td style="color:#e8e0d0;font-family:monospace;">${orderNumber}</td></tr>
            <tr><td style="color:#7a7060;padding:4px 0;">Issue Date</td><td style="color:#e8e0d0;">${issueDate}</td></tr>
            <tr><td style="color:#7a7060;padding:4px 0;">Licensed To</td><td style="color:#e8e0d0;">${buyerName}</td></tr>
          </table>
        </div>

        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(201,168,76,0.12);border-radius:10px;padding:20px 28px;margin-bottom:32px;">
          <p style="color:#c9a84c;font-size:9px;letter-spacing:4px;text-transform:uppercase;margin:0 0 12px;">What's Included</p>
          <ul style="margin:0;padding:0;list-style:none;">
            <li style="color:#b0a898;font-size:13px;padding:4px 0;">✓ &nbsp;Still Broke While Earning — Full Book (11 Parts)</li>
            <li style="color:#b0a898;font-size:13px;padding:4px 0;">✓ &nbsp;21-Day Financial Freedom Challenge</li>
            <li style="color:#b0a898;font-size:13px;padding:4px 0;">✓ &nbsp;13 Printable Worksheets</li>
            <li style="color:#b0a898;font-size:13px;padding:4px 0;">✓ &nbsp;Lifetime Access</li>
          </ul>
        </div>

        <p style="color:#7a7060;font-size:11px;text-align:center;line-height:1.7;margin:0 0 8px;">
          This is a personal license. Sharing or distributing this content<br/>violates your purchase agreement.
        </p>

        <div style="width:60px;height:1px;background:rgba(201,168,76,0.3);margin:28px auto;"></div>

        <p style="color:#4a4438;font-size:11px;text-align:center;margin:0;">
          © ${new Date().getFullYear()} BrilliantLabsPh · M.A. Jacinto, CSFP
        </p>
      </div>
    `,
  });
}
