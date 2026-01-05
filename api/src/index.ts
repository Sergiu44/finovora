import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { OK } from "./utils/constants/http";
import { DatabaseFactory } from "./config/db/DatabaseFactory";
import { IDatabaseConnection } from "./config/db/IDatabaseConnection";
import errorHandler from "./middleware/errorHandler";
import userRoutes from "./features/users/user.routes";
import accountTypesRoutes from "./features/accounts/accountTypes/accountTypes.routes";
import accountsRoutes from "./features/accounts/accounts.routes";
import currencyRoutes from "./features/currencies/currency.routes";
import categoryRoutes from "./features/categories/category.routes";
import transactionRoutes from "./features/transactions/transaction.routes";
import nomenclatureRoutes from "./features/nomenclatures";
import authRoutes from "./auth/auth.routes";
import sessionRoutes from "./auth/sessions/session.routes";
import { CLIENT_APP_ORIGIN, NODE_ENV, PORT } from "./utils/constants/env";
import path from "path";
import userGradientRoutes from "./features/users/userGradients/userGradient.routes";
import profileSetupSessionRoutes from "./features/users/profileSetupSessions/profileSetupSession.routes";
import cron from "node-cron";
import { jobs } from "../jobs";
import userCurrenciesRoutes from "./features/users/userCurrencies/userCurrencies.routes";

dotenv.config({ path: path.join(__dirname, ".env") });

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

app.use("/sessions", sessionRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/account-types", accountTypesRoutes);
app.use("/accounts", accountsRoutes);
app.use("/categories", categoryRoutes);
app.use("/currencies", currencyRoutes);
app.use("/transactions", transactionRoutes);
app.use("/nomenclatures", nomenclatureRoutes);
app.use("/user-gradients", userGradientRoutes);
app.use("/profile-setup-sessions", profileSetupSessionRoutes);
app.use("/user-currencies", userCurrenciesRoutes);

app.use(errorHandler);

// Initialize database connection using factory
const db: IDatabaseConnection =
  DatabaseFactory.createDatabaseConnection(NODE_ENV);
db.connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log("API server is running on http://localhost:" + PORT);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });


jobs.forEach(job => {
  cron.schedule(job.rate, job.fn);
})