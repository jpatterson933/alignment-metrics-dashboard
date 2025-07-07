import { benchmarkRouteProvider } from "../routes/management";
import { testRouteProvider } from "../routes/tests";

import { RouteRegistryProvider } from "./registry";

export const routeProviders: RouteRegistryProvider[] = [
  benchmarkRouteProvider,
  testRouteProvider,
];
