import { Router } from 'express';
import { TestController } from '../modules/tests/controller';
import type { RouteRegistryProvider } from "../docs/registry";
import { benchmarkTestResultSchema } from '../modules/tests/schema';
import { TAGS } from '../docs/tags';

const router = Router();

// Test routes
router.post('/runtest/:benchmarkId', TestController.runTest);

export const testRouteProvider: RouteRegistryProvider = ({
  register,
  params,
  responses,
}) => {
  register("/runtest/:benchmarkId", "post", {
    operationId: "runBenchmarkTest",
    summary: "Run a benchmark test against Claude API",
    description: "Execute all prompts from a benchmark against Claude and return evaluation results",
    tags: [TAGS.TESTS],
    parameters: [
      params.string(
        "benchmarkId",
        "The unique identifier of the benchmark to test",
        true
      ),
    ],
    responses: {
      200: {
        description: "Benchmark test completed successfully",
        content: {
          "application/json": {
            schema: benchmarkTestResultSchema,
          },
        },
      },
    },
  });
};

export default router;
