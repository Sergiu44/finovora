import { Router } from "express";
import { getSessionsHandler, deleteSessionHandler } from "../controllers/session.controller";
import authenticate from "../middleware/authenticate";

const sessionRoutes = Router();

sessionRoutes.get("/", [authenticate], getSessionsHandler);
sessionRoutes.delete("/:id", deleteSessionHandler);

export default sessionRoutes;
