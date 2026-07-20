import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { searchDevelopers } from "../controllers/search.controller";

const searchRouter = express.Router();

searchRouter.get("/", authMiddleware, searchDevelopers);

export default searchRouter;
