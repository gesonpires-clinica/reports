/* eslint-disable @typescript-eslint/no-unused-vars */
import { connectDB } from "@/lib/db";
import Report from "@/lib/reportSchema";
import { NextResponse } from "next/server";

// GET: Buscar relatório por id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Aguarda params antes de acessar id
  await connectDB();
  try {
    const report = await Report.findById(id);
    if (!report) {
      return NextResponse.json(
        { message: "Relatório não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(report, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Erro ao buscar relatório" },
      { status: 500 }
    );
  }
}

// PUT: Atualizar relatório por id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const body = await request.json();
  try {
    const report = await Report.findByIdAndUpdate(id, body, { new: true });
    if (!report) {
      return NextResponse.json(
        { message: "Relatório não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(report, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Erro ao atualizar relatório" },
      { status: 500 }
    );
  }
}

// DELETE: Excluir relatório por id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  try {
    const report = await Report.findByIdAndDelete(id);
    if (!report) {
      return NextResponse.json(
        { message: "Relatório não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Relatório excluído com sucesso" },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Erro ao excluir relatório" },
      { status: 500 }
    );
  }
}
