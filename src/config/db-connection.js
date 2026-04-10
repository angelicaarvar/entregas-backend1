import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

export const connectDB = async ()=>{
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Conectado a la base de datos MongoDB');
    } catch (error) {
        console.log('Error al conectar a la base de datos:', error);
    }
}