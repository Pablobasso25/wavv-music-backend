import app from "./app.js";
import { connectDB } from "./db.js";
import { PORT } from "./config.js";
import { startSubscriptionChecker } from "./jobs/subscriptionChecker.js";
import { initializeAdmin } from "./libs/initAdmin.js";
import { initializePlans } from "./libs/initPlans.js";

const startServer = async () => {
  await connectDB();
  await initializeAdmin();
  await initializePlans();
  startSubscriptionChecker();
  app.listen(PORT);
  console.log("Server on port", PORT);
};

startServer();
