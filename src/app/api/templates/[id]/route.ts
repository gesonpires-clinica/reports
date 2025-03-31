import { NextRequest, NextResponse } from "next/server";
import Template from "@/lib/templateSchema";
import { connectToDatabase } from "@/lib/db";

// Buscar template específico
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const template = await Template.findById(params.id);
    if (!template) {
      return NextResponse.json({ error: "Template não encontrado" }, { status: 404 });
    }
    return NextResponse.json(template, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar template:", error);
    return NextResponse.json({ error: "Erro ao buscar template" }, { status: 500 });
  }
}

// Atualizar template
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const template = await Template.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!template) {
      return NextResponse.json({ error: "Template não encontrado" }, { status: 404 });
    }
    return NextResponse.json(template, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar template:", error);
    return NextResponse.json({ error: "Erro ao atualizar template" }, { status: 500 });
  }
}

// Excluir template
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const template = await Template.findByIdAndDelete(params.id);
    if (!template) {
      return NextResponse.json({ error: "Template não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Template excluído com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir template:", error);
    return NextResponse.json({ error: "Erro ao excluir template" }, { status: 500 });
  }
} 