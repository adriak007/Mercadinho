import { NextResponse } from "next/server";
import { conectaDB } from "../../connect/mongoose";
import Produto from "../../models/produto";


export async function PUT(req:Request, {params}:any) {
    await conectaDB()
    const data = await req.json();
    const produto = await Produto.findByIdAndUpdate(params.id, data,{new: true});
    
    return NextResponse.json(produto)
}



export async function DELETE(req:Request, {params}:any) {
    await conectaDB()

    await Produto.findByIdAndDelete(params.id);
    
    return NextResponse.json({message: "Produto removido"});
}