import app from "./app.js";
import { connectDB } from "./db.js";
import { PORT } from "./config.js";
import { startSubscriptionChecker } from "./jobs/subscriptionChecker.js";

connectDB();
startSubscriptionChecker();
app.listen(PORT);
console.log("Server on port", PORT);
