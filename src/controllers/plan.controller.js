import Plan from "../models/plan.model.js";
import User from "../models/user.model.js";

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
    const { name, price, benefits, isActive, adInterval, playlistLimit } = req.body;
    
    const updated = await Plan.findByIdAndUpdate(
      id,
      {
        name,
        price: Number(price),
        benefits,
        isActive,
        adInterval: Number(adInterval),
        playlistLimit: Number(playlistLimit),
      },
      { new: true },
    );

    if (!updated)
      return res.status(404).json({ message: "Plan no encontrado" });

    await User.updateMany(
      { "subscription.status": updated.name.toLowerCase() },
      { 
        $set: { 
          "subscription.adInterval": updated.adInterval,
          "subscription.playlistLimit": updated.playlistLimit
        } 
      }
    );

    res.json(updated);
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ message: "Error al actualizar la base de datos" });
  }
};