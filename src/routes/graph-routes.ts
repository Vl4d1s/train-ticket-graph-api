import express from "express";
import graphController from "../controllers/graph-controllers";

const router = express.Router();

router.get("/", graphController.getGraph);

export default router;
