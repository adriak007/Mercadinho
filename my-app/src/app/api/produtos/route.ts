import { NextResponse } from "next/server";
import { conectaDB } from "../connect/mongoose";
import Produto from "../models/produto";


export async function POST(req:Request) {
    await conectaDB();
    const data = await req.json();
    const produto = await Produto.create(data)
    return NextResponse.json(produto);
}

export async function GET() {

    await conectaDB();
    const produtos = await Produto.find();
    return NextResponse.json(produtos);

}