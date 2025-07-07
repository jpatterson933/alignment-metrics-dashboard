import * as Sentry from "@sentry/node";
import { config } from "./common/config";
import { ErrorHandler } from "./middleware/error";

Sentry.init({
  // dsn: config.SENTRY_DSN,
  // environment: config.SENTRY_ENV,
  integrations: [],
  profilesSampleRate: 0.5,
  tracesSampleRate: 0.5,
});

// app setup
// import compression from "compression";
import cors from "cors";
import express from "express";
// import { logRequest } from "./middleware/log";

// import { authMiddleware, mcpMiddleware } from "./middleware/auth";

// routes setup
import managementRoutes from "./routes/management";
import testRoutes from "./routes/tests";
import resultsRoutes from "./routes/results";
import { docsRoutes } from "./routes/docs";

const app = express();
// app.use(compression());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
// app.use(logRequest);
app.use(
  express.text({
    type: ["text/xml", "application/xml"],
    limit: "50mb",
  })
);

// app.use(authMiddleware);
// app.use(mcpMiddleware);

app.get("/", (req, res) => {
  res.redirect("/docs");
});

// Routes
app.use("/api/v1", managementRoutes);
app.use("/api/v1", testRoutes);
app.use("/api/v1", resultsRoutes);
app.use("/", docsRoutes);

// Sentry should be setup after routes and before other error middlewares
if (config.SENTRY_ENABLED) {
  console.info("[SENTRY] Setting up Sentry error handler");
  Sentry.setupExpressErrorHandler(app);
}

app.use(ErrorHandler.handle);

export { app };
