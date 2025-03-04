import React from "react";
import { ArticleForm } from "./components/article-form";
import supabase from "@/lib/supabase";

const ArticlePage = async ({ params }: { params: { newId: string } }) => {
  const { data: article } = await supabase
    .from("article")
    .select()
    .eq("id", params.newId)
    .single();

  const { data: categories } = await supabase.from("category").select("*");

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ArticleForm initialData={article} categories={categories} />
      </div>
    </div>
  );
};

export default ArticlePage;
