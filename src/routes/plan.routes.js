import { Router } from "express";
import { getPlans, updatePlanPrice } from "../controllers/plan.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.get("/plans", getPlans);
router.put("/plans/:id", authRequired, updatePlanPrice);

export default router;