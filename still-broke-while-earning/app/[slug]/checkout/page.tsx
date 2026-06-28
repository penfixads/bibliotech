import { notFound } from "next/navigation";
import { getBookBySlug } from "@/app/admin/actions";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book || !book.active) notFound();
  return <CheckoutClient book={book} />;
}
