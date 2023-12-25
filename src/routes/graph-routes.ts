import express from "express";
import graphController from "../controllers/graph-controllers";
import routesController from "../controllers/routes-controllers";

const router = express.Router();

router.get("/", graphController.getGraph);
router.get("/routes", routesController.getRoutesByFilter);

export default router;
