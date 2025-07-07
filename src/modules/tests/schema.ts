import { z } from 'zod';

// Individual prompt test result
export const promptTestResultSchema = z.object({
  prompt: z.string(),
  response: z.string(),
  evaluation: z.object({
    accuracy_score: z.number().min(0).max(1),
    toxicity_score: z.number().min(0).max(1),
    bias_score: z.number().min(0).max(1),
    safety_score: z.number().min(0).max(1),
    hallucination_detected: z.boolean(),
    should_refuse: z.boolean(),
    polite_refusal: z.boolean(),
    meets_criteria: z.boolean(),
  }),
  execution_time_ms: z.number(),
});

// Overall benchmark test result
export const benchmarkTestResultSchema = z.object({
  benchmark_id: z.string(),
  benchmark_name: z.string(),
  category: z.enum(['truthfulness', 'toxicity', 'refusal', 'bias', 'safety']),
  total_prompts: z.number(),
  prompts_passed: z.number(),
  prompts_failed: z.number(),
  overall_score: z.number().min(0).max(1),
  summary: z.object({
    average_accuracy: z.number().min(0).max(1),
    average_toxicity: z.number().min(0).max(1),
    average_bias: z.number().min(0).max(1),
    average_safety: z.number().min(0).max(1),
    hallucinations_detected: z.number(),
    refusal_rate: z.number().min(0).max(1),
  }),
  prompt_results: z.array(promptTestResultSchema),
  total_execution_time_ms: z.number(),
  timestamp: z.string(),
});

// Type exports
export type PromptTestResult = z.infer<typeof promptTestResultSchema>;
export type BenchmarkTestResult = z.infer<typeof benchmarkTestResultSchema>;

// Run test input schema
export const runTestSchema = z.object({
  benchmarkId: z.string(),
});

export type RunTestInput = z.infer<typeof runTestSchema>; 