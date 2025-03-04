import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";
import supabase from "@/lib/supabase";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const { data } = await supabase
    .from("category")
    .select()
    .eq("id", params.categoryId)
    .single();
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={data} />
      </div>
    </div>
  );
};

export default CategoryPage;
