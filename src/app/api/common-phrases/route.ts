import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CommonPhrase } from "@/models/CommonPhrase";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const tags = searchParams.get("tags")?.split(",");

    const query: any = {};
    if (category) query.category = category;
    if (tags?.length) query.tags = { $in: tags };

    const phrases = await CommonPhrase.find(query)
      .sort({ usageCount: -1 })
      .limit(10);

    return NextResponse.json(phrases);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar frases comuns" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const phrase = await CommonPhrase.create(body);
    return NextResponse.json(phrase);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar frase comum" },
      { status: 500 }
    );
  }
} 