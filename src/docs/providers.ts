import { benchmarkRouteProvider } from "../routes/management";

import { RouteRegistryProvider } from "./registry";

export const routeProviders: RouteRegistryProvider[] = [
  benchmarkRouteProvider,
];
