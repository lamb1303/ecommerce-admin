import supabase from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const { data, error } = await supabase
      .from("article")
      .update(body)
      .eq("id", params.id)
      .select();

    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log("ARTICLE_PATCH", error);
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const { data, error } = await supabase
      .from("article")
      .update({ deleted_at: new Date })
      .eq("id", params.id)
      .eq("author_id", userId.toString())

    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log("ARTICLE_DELETE", error);
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
