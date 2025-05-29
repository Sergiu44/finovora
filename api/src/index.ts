import express from "express";
import bodyParser from "body-parser";
import { sequelize } from "./services/sequelize";
const app = express();

app.use(bodyParser.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Error initializing the API server:", err);
  });

app.listen(3000, () => {
  console.log("API server is running on http://localhost:3000");
});
