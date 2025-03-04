import prismadb from "@/lib/prismadb";
import supabase from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, description } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", {
        status: 401,
      });
    }
    if (!name) {
      return new NextResponse("Name is required", {
        status: 400,
      });
    }

    if (!description) {
      return new NextResponse("description is required", {
        status: 400,
      });
    }

    const category = await supabase
      .from("category")
      .insert([{ name, description }]);
    return NextResponse.json(category);
  } catch (error) {
    console.log("CATEGORIES_POST", error);
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", {
        status: 401,
      });
    }
    const { data: categories } = await supabase.from("category").select("*");
    return NextResponse.json(categories);
  } catch (error) {
    console.log("CATEGORIES_GET", error);
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
