import app from "./app.js";
import { connectDB } from "./db.js";
import { PORT } from "./config.js";
import { initializeAdmin } from "./libs/initAdmin.js";
import { initializePlans } from "./libs/initPlans.js";

connectDB().then(async () => {
  await initializeAdmin();
  await initializePlans();
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log("Server on port", PORT));
}

export default app;
