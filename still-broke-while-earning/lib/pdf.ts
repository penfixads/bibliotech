import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { createClient } from "@supabase/supabase-js";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function personalizePdf({
  storagePath,
  buyerName,
  buyerEmail,
  licenseId,
  orderNumber,
  bookTitle,
  issueDate,
}: {
  storagePath: string;
  buyerName: string;
  buyerEmail: string;
  licenseId: string;
  orderNumber: string;
  bookTitle: string;
  issueDate: string;
}): Promise<Uint8Array> {
  const supabase = db();

  // Download base PDF from Supabase storage
  const { data, error } = await supabase.storage
    .from("books")
    .download(storagePath);
  if (error || !data) throw new Error(`Failed to download PDF: ${error?.message}`);

  const baseBytes = await data.arrayBuffer();
  const pdfDoc = await PDFDocument.load(baseBytes);

  // Embed fonts
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Insert a new license page as page 2 (after cover)
  const licensePage = pdfDoc.insertPage(1);
  const { width, height } = licensePage.getSize();

  const gold = rgb(0.788, 0.643, 0.278);
  const dark = rgb(0.08, 0.11, 0.16);
  const cream = rgb(0.94, 0.91, 0.85);
  const dimCream = rgb(0.69, 0.65, 0.58);

  // Background
  licensePage.drawRectangle({ x: 0, y: 0, width, height, color: dark });

  // Top gold rule
  licensePage.drawRectangle({ x: 60, y: height - 80, width: width - 120, height: 1, color: gold });

  // BrilliantLabsPh Bibliotech
  licensePage.drawText("BrilliantLabsPh Bibliotech", {
    x: width / 2 - timesBold.widthOfTextAtSize("BrilliantLabsPh Bibliotech", 11) / 2,
    y: height - 65,
    size: 11,
    font: timesBold,
    color: gold,
  });

  // Book title
  const titleLines = bookTitle.split("\n");
  titleLines.forEach((line, i) => {
    licensePage.drawText(line, {
      x: width / 2 - timesItalic.widthOfTextAtSize(line, 16) / 2,
      y: height - 130 - i * 22,
      size: 16,
      font: timesItalic,
      color: cream,
    });
  });

  // Subtitle
  const subtitle = "Why Earning More Won't Fix Your Money Problems";
  licensePage.drawText(subtitle, {
    x: width / 2 - timesItalic.widthOfTextAtSize(subtitle, 10) / 2,
    y: height - 170,
    size: 10,
    font: timesItalic,
    color: dimCream,
  });

  // Divider
  licensePage.drawRectangle({ x: width / 2 - 40, y: height - 195, width: 80, height: 0.75, color: gold });

  // "is an officially licensed edition for"
  const forText = "is an officially licensed edition for";
  licensePage.drawText(forText, {
    x: width / 2 - timesItalic.widthOfTextAtSize(forText, 11) / 2,
    y: height - 225,
    size: 11,
    font: timesItalic,
    color: dimCream,
  });

  // Buyer name
  licensePage.drawText(buyerName, {
    x: width / 2 - timesBold.widthOfTextAtSize(buyerName, 20) / 2,
    y: height - 262,
    size: 20,
    font: timesBold,
    color: cream,
  });

  // License details
  const details = [
    `License ID: ${licenseId}`,
    `Issue Date: ${issueDate}`,
    `Order Number: ${orderNumber}`,
    `Email: ${buyerEmail}`,
  ];

  details.forEach((line, i) => {
    licensePage.drawText(line, {
      x: width / 2 - timesItalic.widthOfTextAtSize(line, 10) / 2,
      y: height - 300 - i * 18,
      size: 10,
      font: timesItalic,
      color: dimCream,
    });
  });

  // Bottom rule
  licensePage.drawRectangle({ x: 60, y: 70, width: width - 120, height: 1, color: gold });

  // Footer
  const footer = "This is a personal license. Unauthorized distribution is prohibited.";
  licensePage.drawText(footer, {
    x: width / 2 - timesItalic.widthOfTextAtSize(footer, 8) / 2,
    y: 55,
    size: 8,
    font: timesItalic,
    color: rgb(0.5, 0.47, 0.42),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
