import path from "path"
import dotenv from "dotenv"

dotenv.config({ path: path.resolve(__dirname, './.env') })

interface Config {
  name: string;
  port: string;
  host: string;
}

const config: Config = {
  name: process.env.DB_NAME!,
  port: process.env.PORT!,
  host: process.env.HOST!,
};

export default config;