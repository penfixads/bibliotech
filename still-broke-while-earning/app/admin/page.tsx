import { redirect } from "next/navigation";
import { checkAdmin, getAllBooks } from "./actions";
import AdminPanel from "./AdminPanel";

export default async function AdminPage() {
  const isAdmin = await checkAdmin();
  if (!isAdmin) redirect("/admin/login");

  const books = await getAllBooks();
  return <AdminPanel books={books} />;
}
