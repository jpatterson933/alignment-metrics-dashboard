import { Router } from 'express';
import { BenchmarkController } from '../modules/benchmark/controller';
import type { RouteRegistryProvider } from "../docs/registry";
import { benchmarkResponseSchema, createBenchmarkSchema, updateBenchmarkSchema } from '@/modules/benchmark/schema';
import { TAGS } from '@/docs/tags';

const router = Router();

// Benchmark CRUD routes
router.post('/benchmarks', BenchmarkController.createBenchmark);
router.get('/benchmarks', BenchmarkController.getBenchmarks);
router.get('/benchmarks/:id', BenchmarkController.getBenchmarkById);
router.put('/benchmarks/:id', BenchmarkController.updateBenchmark);
router.delete('/benchmarks/:id', BenchmarkController.deleteBenchmark);

export const benchmarkRouteProvider: RouteRegistryProvider = ({
  register,
  params,
  responses,
}) => {
  // Assessment Test endpoints
  register("/benchmarks", "post", {
    operationId: "createBenchmark",
    summary: "Create a new benchmark",
    description:
      "Create a new benchmark.",
    tags: [TAGS.BENCHMARKS],
    requestBody: {
      description: "The benchmark to create",
      required: true,
      content: {
        "application/json": {
          schema: createBenchmarkSchema,
        },
      },
    },
    responses: {
      201: {
        description: "Benchmark created successfully",
        content: {
          "application/json": {
            schema: benchmarkResponseSchema,
          },
        },
      },
    },
  });

  register("/benchmarks", "get", {
    operationId: "getBenchmarks",
    summary: "Get all benchmarks",
    description:
      "Get all benchmarks.",
    tags: [TAGS.BENCHMARKS],
    responses: {
      200: responses.success(
        "Benchmarks retrieved successfully",
        benchmarkResponseSchema.array()
      ),
    },
  });

  register("/benchmarks/:id", "get", {
    operationId: "getBenchmarkById",
    summary: "Get a benchmark by id",
    description:
      "Retrieve a benchmark by id.",
    tags: [TAGS.BENCHMARKS],
    parameters: [
      params.string(
        "identifier",
        "The unique identifier of the assessment test to retrieve",
        true
      ),
    ],
    responses: {
      200: responses.success(
        "Assessment test retrieved successfully",
        benchmarkResponseSchema
      ),
    },
  });

 
  register("/benchmarks/:id", "put", {
    operationId: "updateBenchmark",
    summary: "Update a benchmark",
    description:
      "Update a benchmark.",
    tags: [TAGS.BENCHMARKS],
    parameters: [
      params.string("id", "Benchmark identifier to update", true),
    ],
    requestBody: {
      description: "The benchmark to update",
      required: true,
      content: {
        "application/json": {
          schema: updateBenchmarkSchema,
        },
      },
    },
    responses: {
      200: {
        description: "Benchmark updated successfully",
        content: {
          "application/json": {
            schema: benchmarkResponseSchema,
          },
        },
      },
    },
  });

  register("/benchmarks/:id", "delete", {
    operationId: "deleteBenchmark",
    summary: "Delete a benchmark",
    description:
      "Permanently delete a benchmark.",
    tags: [TAGS.BENCHMARKS],
    parameters: [
      params.string(
        "id",
        "The identifier of the benchmark to delete",
        true
      ),
    ],
    responses: {
      204: responses.noContent(),
    },
  });
};

export default router;
