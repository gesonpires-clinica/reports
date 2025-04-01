import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Draft } from "@/models/Draft";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("reportId");
    const section = searchParams.get("section");

    const query: any = {};
    if (reportId) query.reportId = reportId;
    if (section) query.section = section;

    const drafts = await Draft.find(query).sort({ updatedAt: -1 });
    return NextResponse.json(drafts);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar rascunhos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const draft = await Draft.create(body);
    return NextResponse.json(draft);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar rascunho" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID do rascunho é obrigatório" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const draft = await Draft.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(draft);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar rascunho" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID do rascunho é obrigatório" },
        { status: 400 }
      );
    }

    await Draft.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir rascunho" },
      { status: 500 }
    );
  }
} 