import { app } from "./app";
import { config } from "./common/config";
import { connectDB } from "./db";

(async () => {
  try {
    await connectDB();

    app.listen(config.PORT, () => {
      console.info("[Server] Runnning at", config.API_BASE_URL);
      console.info("[Server] Environment is", config.NODE_ENV);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
