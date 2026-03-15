import User from "../models/user.model.js";
import Plan from "../models/plan.model.js";

export const checkSubscription = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user.id);

      if (
        user &&
        user.subscription.status === "premium" &&
        user.subscription.endDate
      ) {
        const now = new Date();

        if (now > user.subscription.endDate) {
          const freePlan = await Plan.findOne({ name: "Free" });
          await User.findByIdAndUpdate(user._id, {
            $set: {
              "subscription.status": "free",
              "subscription.warningEmailSent": false,
              "subscription.adInterval": freePlan ? freePlan.adInterval : 3,
              "subscription.playlistLimit": freePlan
                ? freePlan.playlistLimit
                : 5,
            },
          });
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};
