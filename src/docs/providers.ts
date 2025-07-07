import { benchmarkRouteProvider } from "../routes/management";
import { testRouteProvider } from "../routes/tests";
import { resultsRouteProvider } from "../routes/results";

import { RouteRegistryProvider } from "./registry";

export const routeProviders: RouteRegistryProvider[] = [
  benchmarkRouteProvider,
  testRouteProvider,
  resultsRouteProvider,
];
