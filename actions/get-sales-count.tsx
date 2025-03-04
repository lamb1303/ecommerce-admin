import supabase from "@/lib/supabase";

export const getSalesCount = async (storeId: string) => {
  const { data: salesCount, error } = await supabase
    .from("order")
    .select("*")
    .eq("storeid", storeId)
    .eq("ispaid", true);

  return salesCount;
};
