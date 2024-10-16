import dotenv from 'dotenv';

dotenv.config();

export const PORT = `${process.env.PORT}`;
export const DB_ADDRESS = `${process.env.DB_ADDRESS}`;
