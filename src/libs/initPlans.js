import Plan from "../models/plan.model.js";

export const initializePlans = async () => {
  try {
    const premiumPlanExists = await Plan.findOne({ name: "Premium" });

    if (!premiumPlanExists) {
      const premiumPlan = new Plan({
        name: "Premium",
        price: 2000,
        benefits: [
          "Acceso a todo el catálogo de música.",
          "Sin anuncios.",
          "Descargas ilimitadas.",
          "Calidad de audio mejorada.",
        ],
        isActive: true,
      });
      await premiumPlan.save();
      console.log("Plan Premium creado.");
    }

    const freePlanExists = await Plan.findOne({ name: "Free" });
    if (!freePlanExists) {
      const freePlan = new Plan({
        name: "Free",
        price: 0.00,
        benefits: [
            "Acceso limitado a música.",
            "Anuncios.",
        ],
        isActive: true,
      });
      await freePlan.save();
      console.log("Plan Free creado.");
    }
  } catch (error) {
    console.error("Error creando planes:", error.message);
  }
};
