import { createClient } from "@supabase/supabase-js";

export function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export function dbPublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type BookData = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  author: string;
  author_credentials?: string | null;
  author_title?: string | null;
  author_bio?: string | null;
  author_tags?: string[] | null;
  hero_headline: string;
  hero_subline_1?: string | null;
  hero_subline_2?: string | null;
  hero_bg_url?: string | null;
  book_3d_url?: string | null;
  book_front_url?: string | null;
  book_back_url?: string | null;
  price: number;
  original_price?: number | null;
  price_label?: string | null;
  problem_section?: {
    eyebrow?: string; headline?: string; subtext?: string;
    pains?: { title: string; text: string }[];
  } | null;
  learn_section?: {
    eyebrow?: string; headline?: string; subtext?: string;
    promises?: { number: string; title: string; text: string }[];
  } | null;
  includes_section?: { label: string; desc: string }[] | null;
  method_section?: {
    name?: string; eyebrow?: string; headline?: string; subtext?: string;
    steps?: { step: number; title: string; text: string }[];
  } | null;
  testimonials?: { quote: string; name: string; title: string; stars: number }[] | null;
  main_pdf_path?: string | null;
  challenge_pdf_path?: string | null;
  active: boolean;
  created_at: string;
};
