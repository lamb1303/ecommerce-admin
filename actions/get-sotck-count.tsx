import supabase from "@/lib/supabase";

export const getTotalNews = async () => {
  const { data: totalNews } = await supabase.from("article").select("*");

  return totalNews?.length;
};
