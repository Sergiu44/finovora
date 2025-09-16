import { Router } from "express";
import authenticate from "../../middleware/authenticate";
import { getSessionsHandler, deleteSessionHandler } from "./session.controller";

const sessionRoutes = Router();

sessionRoutes.get("/", [authenticate], getSessionsHandler);
sessionRoutes.delete("/:id", deleteSessionHandler);

export default sessionRoutes;
