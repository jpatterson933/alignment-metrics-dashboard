import { z, ZodType } from "zod";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { ParameterObject } from "zod-openapi/dist/openapi3-ts/dist/model/openapi31";
import { extendZodWithOpenApi } from "zod-openapi";

// Initialize zod-openapi to add the `.openapi()` helper to Zod schemas
extendZodWithOpenApi(z);

// Error response schemas - used in docs only
export const errorResSchemas = {
  error: z.object({ error: z.string() }),
  errorDetails: z.object({
    error: z.string(),
    details: z.string().optional(),
  }),
  default: z.object({
    error: z.string(),
    details: z.string().optional(),
    message: z.string().optional(),
  }),
  validationError: z.object({
    error: z.string().openapi({ description: "High-level error message" }),
    code: z
      .string()
      .openapi({ description: "Machine code identifying error type" }),
    details: z
      .string()
      .optional()
      .openapi({ description: "Additional human details" }),
    meta: z
      .object({
        issues: z
          .array(
            z.object({
              field: z.string().openapi({ description: "Parameter name" }),
              message: z
                .string()
                .openapi({ description: "Validation message" }),
              code: z.string().openapi({ description: "Zod issue code" }),
            })
          )
          .openapi({ description: "Array of individual validation errors" }),
        eventId: z
          .string()
          .optional()
          .openapi({ description: "Sentry event id" }),
      })
      .openapi({ description: "Structured metadata from validation layer" }),
  }),
};

const InternalServerErrorSchema = z
  .object({
    error: z.string().openapi({
      description: "Error type identifier",
    }),
    message: z.string().openapi({
      description: "Human-readable error message",
    }),
    eventId: z.string().optional().openapi({
      description: "Sentry event ID for error tracking",
    }),
    details: z.string().openapi({
      description: "Stack trace or additional error details",
    }),
  })
  .openapi({
    description: "Internal server error response",
  });

const defaultSuccessResponse = z.object({}).passthrough();

const paramsFactories = {
  string: (name: string, description: string, required = true) =>
    ({
      name,
      description,
      in: "path",
      required,
      schema: {
        type: "string",
      },
    } as ParameterObject),
  query: (name: string, description: string, required = false) =>
    ({
      name,
      description,
      in: "query",
      required,
      schema: {
        type: "string",
      },
    } as ParameterObject),
};

const responseFactories = {
  success: (
    description: string = "Success",
    schema: ZodType = defaultSuccessResponse
  ) => ({
    description,
    content: { "application/json": { schema } },
  }),

  noContent: (description: string = "No Content") => ({
    description,
    content: {},
  }),

  badRequest: (
    description: string = "Bad Request - Invalid parameters or validation error",
    schema: ZodType = errorResSchemas.validationError
  ) => ({
    description,
    content: { "application/json": { schema } },
  }),

  notFound: (
    description: string = "Entity not found",
    schema: ZodType = errorResSchemas.default
  ) => ({
    description,
    content: { "application/json": { schema } },
  }),

  conflict: (
    description: string = "Entity already exists",
    schema: ZodType = errorResSchemas.error
  ) => ({
    description,
    content: { "application/json": { schema } },
  }),

  internalServerError: (description: string = "Internal Server Error") => ({
    description,
    content: { "application/json": { schema: InternalServerErrorSchema } },
  }),
  notImplemented: (
    description: string = "Not Implemented",
    schema: ZodType = errorResSchemas.default
  ) => ({
    description,
    content: { "application/json": { schema } },
  }),

  // Common response sets
  common: (): ZodOpenApiOperationObject["responses"] => ({
    "500": responseFactories.internalServerError(),
  }),
};

export const factories = {
  params: paramsFactories,
  responses: responseFactories,
};

export type Factories = typeof factories;
