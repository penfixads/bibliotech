import { createClient } from "@supabase/supabase-js";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function generateLicenseId({
  bookSlug,
  country = "PH",
  licenseType = "R",
}: {
  bookSlug: string;
  country?: string;
  licenseType?: string;
}): Promise<{ licenseId: string; orderNumber: string }> {
  const supabase = db();
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const bookCode = bookSlug.toUpperCase().replace(/-/g, "").slice(0, 6);

  // Atomically increment counter for this book+month
  const { data, error } = await supabase.rpc("increment_license_counter", {
    p_book_slug: bookSlug,
    p_year_month: yearMonth,
  });

  if (error) throw new Error(`License counter error: ${error.message}`);
  const seq = String(data).padStart(7, "0");

  const licenseId = `BL-${bookCode}-${country}-${yearMonth}-${seq}-${licenseType}`;

  // Order number: MSG-YYYYMMDD-XXXXX
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const orderNumber = `MSG-${dateStr}-${seq.slice(-5)}`;

  return { licenseId, orderNumber };
}
