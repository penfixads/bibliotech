"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { BookData } from "@/lib/supabase";

const ADMIN_TOKEN = "bl_admin_v1";

export async function adminLogin(formData: FormData) {
  const password = formData.get("password") as string;
  if (password !== process.env.BIBLIOTECH_ADMIN_PASSWORD) {
    return { error: "Invalid password." };
  }
  const cookieStore = await cookies();
  cookieStore.set("admin_token", ADMIN_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  redirect("/admin");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/admin/login");
}

export async function checkAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === ADMIN_TOKEN;
}

export async function getSignedUploadUrl(bucket: string, path: string) {
  if (!(await checkAdmin())) return { error: "Unauthorized" };
  const supabase = db();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path);
  if (error) return { error: error.message };
  return { signedUrl: data.signedUrl, token: data.token, path };
}

export async function saveBook(bookData: Partial<BookData> & { id?: string }) {
  if (!(await checkAdmin())) return { error: "Unauthorized" };
  const supabase = db();

  if (bookData.id) {
    const { error } = await supabase
      .from("books")
      .update({ ...bookData, updated_at: new Date().toISOString() })
      .eq("id", bookData.id);
    if (error) return { error: error.message };
    return { success: true };
  }

  const { data, error } = await supabase
    .from("books")
    .insert({ ...bookData, active: false })
    .select("id")
    .single();
  if (error) return { error: error.message };
  return { success: true, id: data.id };
}

export async function toggleBookActive(id: string, active: boolean) {
  if (!(await checkAdmin())) return { error: "Unauthorized" };
  const supabase = db();
  const { error } = await supabase.from("books").update({ active }).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteBook(id: string) {
  if (!(await checkAdmin())) return { error: "Unauthorized" };
  const supabase = db();
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getAllBooks() {
  const supabase = db();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data as BookData[];
}

export async function getBookBySlug(slug: string) {
  const supabase = db();
  const { data } = await supabase
    .from("books")
    .select("*")
    .eq("slug", slug)
    .single();
  return data as BookData | null;
}
