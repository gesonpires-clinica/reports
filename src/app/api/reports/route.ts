import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Report } from "@/models/Report";

// Criar um novo relatório
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const report = await Report.create(body);
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar relatório:", error);
    return NextResponse.json({ error: "Erro ao criar relatório" }, { status: 500 });
  }
}

// Buscar todos os relatórios
export async function GET() {
  try {
    await connectToDatabase();
    const reports = await Report.find();
    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error);
    return NextResponse.json({ error: "Erro ao buscar relatórios" }, { status: 500 });
  }
}
