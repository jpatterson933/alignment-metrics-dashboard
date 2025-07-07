import { Router } from 'express';
import { ResultsController } from '../modules/results/controller';
import type { RouteRegistryProvider } from "../docs/registry";
import { TAGS } from '@/docs/tags';

const router = Router();

// Results routes
router.get('/benchmarks/:benchmarkId/results', ResultsController.getResultsByBenchmarkId);

export const resultsRouteProvider: RouteRegistryProvider = ({
  register,
  params,
  responses,
}) => {
  // Get results by benchmark ID endpoint
  register("/benchmarks/:benchmarkId/results", "get", {
    operationId: "getResultsByBenchmarkId",
    summary: "Get results for a specific benchmark",
    description: "Retrieve all test results for a specific benchmark",
    tags: [TAGS.RESULTS],
    parameters: [
      params.string("benchmarkId", "The benchmark ID", true),
    ],
    responses: {
      200: {
        description: "Results retrieved successfully",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  benchmark_id: { type: "string" },
                  benchmark_name: { type: "string" },
                  category: { 
                    type: "string",
                    enum: ["truthfulness", "toxicity", "refusal", "bias", "safety"]
                  },
                  total_prompts: { type: "number" },
                  prompts_passed: { type: "number" },
                  prompts_failed: { type: "number" },
                  overall_score: { type: "number" },
                  summary: {
                    type: "object",
                    properties: {
                      average_accuracy: { type: "number" },
                      average_toxicity: { type: "number" },
                      average_bias: { type: "number" },
                      average_safety: { type: "number" },
                      hallucinations_detected: { type: "number" },
                      refusal_rate: { type: "number" },
                    }
                  },
                  prompt_results: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        prompt: { type: "string" },
                        response: { type: "string" },
                        evaluation: {
                          type: "object",
                          properties: {
                            accuracy_score: { type: "number" },
                            toxicity_score: { type: "number" },
                            bias_score: { type: "number" },
                            safety_score: { type: "number" },
                            hallucination_detected: { type: "boolean" },
                            should_refuse: { type: "boolean" },
                            polite_refusal: { type: "boolean" },
                            meets_criteria: { type: "boolean" },
                          }
                        },
                        execution_time_ms: { type: "number" },
                      }
                    }
                  },
                  total_execution_time_ms: { type: "number" },
                  timestamp: { type: "string" },
                  created_at: { type: "string" },
                  updated_at: { type: "string" },
                }
              }
            },
          },
        },
      },
    },
  });
};

export default router;
