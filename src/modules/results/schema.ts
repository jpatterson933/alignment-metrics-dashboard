import { z } from 'zod';
import { IBenchmarkResult } from '../../db/schema';

// Prompt Test Result Schema
export const promptTestResultSchema = z.object({
  prompt: z.string().min(1),
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
  execution_time_ms: z.number().min(0),
});

// Benchmark Test Result Schema
export const benchmarkTestResultSchema = z.object({
  benchmark_id: z.string(),
  benchmark_name: z.string(),
  category: z.enum(['truthfulness', 'toxicity', 'refusal', 'bias', 'safety']),
  total_prompts: z.number().min(1),
  prompts_passed: z.number().min(0),
  prompts_failed: z.number().min(0),
  overall_score: z.number().min(0).max(1),
  summary: z.object({
    average_accuracy: z.number().min(0).max(1),
    average_toxicity: z.number().min(0).max(1),
    average_bias: z.number().min(0).max(1),
    average_safety: z.number().min(0).max(1),
    hallucinations_detected: z.number().min(0),
    refusal_rate: z.number().min(0).max(1),
  }),
  prompt_results: z.array(promptTestResultSchema),
  total_execution_time_ms: z.number().min(0),
  timestamp: z.string(),
});

// Stored Benchmark Result Schema (with database fields)
export const storedBenchmarkResultSchema = z.object({
  _id: z.any(),
  benchmark_id: z.any(),
  benchmark_name: z.string(),
  category: z.enum(['truthfulness', 'toxicity', 'refusal', 'bias', 'safety']),
  total_prompts: z.number().min(1),
  prompts_passed: z.number().min(0),
  prompts_failed: z.number().min(0),
  overall_score: z.number().min(0).max(1),
  summary: z.object({
    average_accuracy: z.number().min(0).max(1),
    average_toxicity: z.number().min(0).max(1),
    average_bias: z.number().min(0).max(1),
    average_safety: z.number().min(0).max(1),
    hallucinations_detected: z.number().min(0),
    refusal_rate: z.number().min(0).max(1),
  }),
  prompt_results: z.array(promptTestResultSchema),
  total_execution_time_ms: z.number().min(0),
  timestamp: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Query Schema for filtering results
export const resultsQuerySchema = z.object({
  benchmark_id: z.string().optional(),
  category: z.enum(['truthfulness', 'toxicity', 'refusal', 'bias', 'safety']).optional(),
  min_score: z.number().min(0).max(1).optional(),
  max_score: z.number().min(0).max(1).optional(),
  limit: z.number().min(1).max(100).default(20),
  page: z.number().min(1).default(1),
  sort_by: z.enum(['created_at', 'overall_score', 'timestamp']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// TypeScript types
export type PromptTestResult = z.infer<typeof promptTestResultSchema>;
export type BenchmarkTestResult = z.infer<typeof benchmarkTestResultSchema>;
export type StoredBenchmarkResult = z.infer<typeof storedBenchmarkResultSchema>;
export type ResultsQuery = z.infer<typeof resultsQuerySchema>;
export type CreateResultInput = BenchmarkTestResult;

// Synthesis function to transform DB result to API response
export function synthesizeResult(dbResult: any): StoredBenchmarkResult {
  return {
    _id: dbResult._id,
    benchmark_id: dbResult.benchmark_id,
    benchmark_name: dbResult.benchmark_name,
    category: dbResult.category,
    total_prompts: dbResult.total_prompts,
    prompts_passed: dbResult.prompts_passed,
    prompts_failed: dbResult.prompts_failed,
    overall_score: dbResult.overall_score,
    summary: dbResult.summary,
    prompt_results: dbResult.prompt_results,
    total_execution_time_ms: dbResult.total_execution_time_ms,
    timestamp: dbResult.timestamp.toISOString(),
    created_at: dbResult.created_at.toISOString(),
    updated_at: dbResult.updated_at.toISOString(),
  };
}
