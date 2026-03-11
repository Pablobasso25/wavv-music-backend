import Plan from "../models/plan.model.js";

export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los planes" });
  }
};
export const updatePlanPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, benefits, isActive } = req.body;
    const updated = await Plan.findByIdAndUpdate(
      id,
      {
        name: title,
        price: Number(price),
        benefits,
        isActive,
      },
      { new: true },
    );

    if (!updated)
      return res.status(404).json({ message: "Plan no encontrado" });
    res.json(updated);
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ message: "Error al actualizar la base de datos" });
  }
};