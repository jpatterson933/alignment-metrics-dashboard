import { ZodOpenApiOperationObject } from "zod-openapi";
import { factories, Factories } from "./factories";

interface RegistryPathObject {
  [method: string]: ZodOpenApiOperationObject;
}

interface RouteRegistryPaths {
  [path: string]: RegistryPathObject;
}

interface RouteRegistry {
  paths: RouteRegistryPaths;
  register: (
    path: string,
    method: string,
    operation: ZodOpenApiOperationObject
  ) => void;
  params: Factories["params"];
  responses: Factories["responses"];
}

export const registry: RouteRegistry = {
  paths: {},
  register: (path, method, operation) => {
    if (!registry.paths[path]) {
      registry.paths[path] = {};
    }
    registry.paths[path][method] = operation;
  },
  params: factories.params,
  responses: factories.responses,
};

export type RouteRegistryProvider = (registry: RouteRegistry) => void;
