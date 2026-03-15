import { Router } from "express";
import { getPlans, updatePlanPrice } from "../controllers/plan.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { updatePlanSchema } from "../schemas/plan.schema.js";

const router = Router();

router.get("/plans", getPlans);
router.put("/plans/:id", authRequired, validateSchema(updatePlanSchema), updatePlanPrice);

export default router;