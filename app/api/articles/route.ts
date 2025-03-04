import supabase from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { title } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }
    if (!title) {
      return new NextResponse("Título es requerido", {
        status: 400,
      });
    }

    const article = await supabase
      .from("article")
      .insert({ ...body, author_id: userId.toString() })
      .select();
    return NextResponse.json(article);
  } catch (error) {
    console.log("ARTICLE_POST", error);
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }
    const { data } = await supabase
      .from("article")
      .select("*")
      .eq("author_id", userId.toString())
      .is('deleted_at', null); 
    return NextResponse.json(data);
  } catch (error) {
    console.log("ARTICLE_GET", error);
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
