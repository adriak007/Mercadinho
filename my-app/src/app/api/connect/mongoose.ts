import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string

export async function conectaDB() {
    try{
        if(mongoose.connection.readyState === 1)return;
        await mongoose.connect(MONGODB_URL);
        console.log("MongoDB conectado");

    }catch(error){
        console.log("Erro ao conectar o Mongodb", error);
    }


    
}