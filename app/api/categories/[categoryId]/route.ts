import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";
import supabase from "@/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    // const { userId } = auth();
    // if (!userId) {
    //   return new NextResponse("Unauthorized", {
    //     status: 401,
    //   });
    // }

    // Fetch the category to ensure it exists
    const { data: category, error: categoryError } = await supabase
      .from("category")
      .select("*")
      .eq("id", params.categoryId)
      .single();

    if (categoryError || !category) {
      console.log("Error fetching category:", categoryError);
      return new NextResponse("Category not found", { status: 404 });
    }

    // Fetch the articles associated with the category
    const { data: articles, error: articlesError } = await supabase
      .from("article")
      .select("*")
      .eq("category_id", params.categoryId)
      .is("deleted_at", null);

    if (articlesError) {
      console.log("Error fetching articles:", articlesError);
      return new NextResponse("Internal error", { status: 500 });
    }

    return NextResponse.json({ category, articles }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const { data: category } = await supabase
      .from("category")
      .delete()
      .eq("id", params.categoryId)
      .select();

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, description } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!description) {
      return new NextResponse("description is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const { data: category } = await supabase
      .from("category")
      .update(body)
      .eq("id", params.categoryId)
      .select();

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
