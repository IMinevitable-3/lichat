import dotenv from 'dotenv';
dotenv.config();
export const PORT: number = parseInt(process.env.PORT || "8080");
export const DEV: boolean = (process.env.NODE_ENV || "dev") === 'dev'
export const APPID: string = process.env.APPID || "unknown"
export const JWT_SECRET: string = process.env.JWT_SECRET || "niku_enduku_bro"
export const MONGO_URI: string = process.env.MONGO_URI || "mongodb://localhost:27017/lichat"