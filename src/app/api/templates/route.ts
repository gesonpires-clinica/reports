import { NextRequest, NextResponse } from "next/server";
import Template from "@/lib/templateSchema";
import { connectToDatabase } from "@/lib/db";

// Listar todos os templates
export async function GET() {
  try {
    await connectToDatabase();
    const templates = await Template.find();
    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar templates:", error);
    return NextResponse.json({ error: "Erro ao buscar templates" }, { status: 500 });
  }
}

// Criar novo template
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const template = await Template.create(body);
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar template:", error);
    return NextResponse.json({ error: "Erro ao criar template" }, { status: 500 });
  }
} 