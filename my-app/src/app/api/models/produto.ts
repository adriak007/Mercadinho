import mongoose, {Schema} from "mongoose";

const ProdutosSchema = new Schema({
nome: {type:String, required:true},
preco: {type:Number, required:true},
estoque: {type:Number, required:true},


}, {timestamps:true});

export default mongoose.models.Produto || mongoose.model("Produto", ProdutosSchema)