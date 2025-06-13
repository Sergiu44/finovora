import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CLIENT_APP_ORIGIN, NODE_ENV, PORT } from "../utils/constants/env";
import { OK } from "../utils/constants/http";
import { DatabaseFactory } from "./config/db/DatabaseFactory";
import { IDatabaseConnection } from "./config/db/IDatabaseConnection";
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: CLIENT_APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (_, res) => {
  res.status(OK).send("Hello world!");
});

app.use(errorHandler);

// Initialize database connection using factory
const db: IDatabaseConnection =
  DatabaseFactory.createDatabaseConnection(NODE_ENV);
db.connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log("API server is running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
