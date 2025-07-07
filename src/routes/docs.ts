import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { document as swaggerDocument, yamlDocument } from "../docs/document";
import { apiReference } from "@scalar/express-api-reference";

const router = Router();

router.get("/openapi.yaml", (req, res) => {
  res.setHeader("Content-Type", "text/yaml");
  res.send(yamlDocument);
});

const scalarConfig = apiReference({
  metaData: { title: "Alignment Metrics API", specVersion: "1.0.0" },
  sources: [
    {
      title: "Alignment Metrics API",
      url: `${process.env.API_BASE_URL?.replace("/api", "")}/openapi.yaml`,
    },
  ],
});

router.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    customSiteTitle: "QTI API",
    swaggerOptions: {
      urls: [
        {
          url: `${process.env.API_BASE_URL?.replace("/api", "")}/openapi.yaml`,
          name: "QTI API",
        },
      ],
    },
  })
);

router.use("/scalar", scalarConfig);

export const docsRoutes = router;
