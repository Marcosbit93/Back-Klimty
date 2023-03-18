import express, { Application, Request, Response, NextFunction } from "express"
import config from "./config/index"
import db from "./db/index"
import morgan from "morgan";
import cors from "cors"
/* import routes from "./routes" */

const app: Application = express();
const port = config.port;

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions)); // esta librería es para poder trabajar front con back en localhost
app.use(morgan("dev"));
app.use(express.json());

// Express Routing
/* app.use("/api", routes); */

// ERROR MIDDLEWARE
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err, err.stack);
  res.status(500).send(err);
});

db.sync({ force: false }).then(() => {
  app.listen(port, () => console.log(`SERVER ON PORT: ${port}`));
});

export default app;