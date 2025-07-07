import { createDocument } from "zod-openapi";
import * as yaml from "yaml";
import { registry } from "./registry";
import { routeProviders } from "./providers";
import { TAG_DESCRIPTIONS } from "./tags";
import { sortTagsByHierarchy } from "./sorting";
import { TAGS } from "./tags";
// import { mcpScopes, oauth2Scopes } from "../modules/auth/scopes";

// Register all route providers
routeProviders.forEach((provider) => provider(registry));

/**
 * Creates an OpenAPI document from the given registry
 * @param registry - The docs registry containing all registered routes
 * @returns The OpenAPI document object
 */
export function getDocument(registry: { paths: any }) {
  const tags = sortTagsByHierarchy(
    Object.entries(TAGS).map(([key, value]) => ({
      name: value,
      description: TAG_DESCRIPTIONS[key as keyof typeof TAGS],
    }))
  );

  return createDocument({
    openapi: "3.1.0",
    info: {
      title: "QTI API",
      version: "1.0.0",
      description:
        "A robust assessment engine implementing the QTI 3.0 specification, designed for creating, managing, and delivering educational assessments.",
    },
    servers: [
      {
        url: process.env.API_BASE_URL || "http://localhost:3000/api",
        description: "Main Server",
      },
    ],
    security: [{ OAuth2: [] }, { MCP: [] }],
    tags,
    paths: registry.paths,
    // components: {
    //   securitySchemes: {
    //     // OAuth2: {
    //     //   type: "oauth2",
    //     //   flows: {
    //     //     clientCredentials: {
    //     //       scopes: oauth2Scopes,
    //     //       tokenUrl: `${process.env.COGNITO_AUTHORITY}/oauth2/token`,
    //     //     },
    //     //   },
    //     // },
    //     // MCP: {
    //     //   type: "oauth2",
    //     //   flows: {
    //     //     authorizationCode: {
    //     //       authorizationUrl: `${process.env.COGNITO_AUTHORITY}/oauth2/authorize`,
    //     //       tokenUrl: `${process.env.COGNITO_AUTHORITY}/oauth2/token`,
    //     //       scopes: mcpScopes,
    //     //     },
    //     //   },
    //     // },
    //   },
    // },
  });
}

const document = getDocument(registry);

const yamlDocument = yaml.stringify(document);

export { yamlDocument, document };
