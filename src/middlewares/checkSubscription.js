import User from "../models/user.model.js";

export const checkSubscription = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user.id);
      
      if (user && user.subscription.status === "premium" && user.subscription.endDate) {
        const now = new Date();
        
        if (now > user.subscription.endDate) {
          await User.findByIdAndUpdate(user._id, {
            "subscription.status": "free",
          });
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};