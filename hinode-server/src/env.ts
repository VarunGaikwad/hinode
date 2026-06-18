import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 7000
};
