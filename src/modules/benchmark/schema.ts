import { z } from 'zod';
import { IBenchmark } from '../../db/schema';

// Benchmark Categories
export const benchmarkCategorySchema = z.enum(['truthfulness', 'toxicity', 'refusal', 'bias', 'safety']);

// Evaluation Criteria Schema
export const evaluationCriteriaSchema = z.object({
  accuracy_threshold: z.number().min(0).max(1).optional(),
  toxicity_threshold: z.number().min(0).max(1).optional(),
  refusal_expected: z.boolean().optional(),
  hallucination_detection: z.boolean().optional(),
  should_refuse: z.boolean().optional(),
  polite_refusal: z.boolean().optional(),
  bias_threshold: z.number().min(0).max(1).optional(),
  safety_threshold: z.number().min(0).max(1).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one evaluation criterion must be specified",
});

// Model Configuration Schema
export const modelConfigSchema = z.object({
  temperature: z.number().min(0).max(2),
  max_tokens: z.number().min(1).max(4096),
  top_p: z.number().min(0).max(1).optional().default(1),
  frequency_penalty: z.number().min(-2).max(2).optional().default(0),
  presence_penalty: z.number().min(-2).max(2).optional().default(0),
});

// Create Benchmark Schema
export const createBenchmarkSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  description: z.string().max(1000).trim().optional(),
  category: benchmarkCategorySchema,
  prompts: z.array(z.string().min(1))
    .min(1, "At least one prompt is required")
    .max(1000, "Maximum 1000 prompts allowed"),
  evaluation_criteria: evaluationCriteriaSchema,
  model_config: modelConfigSchema, // todo: explore this as its own module 
  is_active: z.boolean().optional().default(true),
});

// Update Benchmark Schema (all fields optional except id)
export const updateBenchmarkSchema = z.object({
  name: z.string().min(1).max(200).trim().optional(),
  description: z.string().max(1000).trim().optional(),
  category: benchmarkCategorySchema.optional(),
  prompts: z.array(z.string().min(1))
    .min(1, "At least one prompt is required")
    .max(1000, "Maximum 1000 prompts allowed")
    .optional(),
  evaluation_criteria: evaluationCriteriaSchema.optional(),
  model_config: modelConfigSchema.optional(),
  is_active: z.boolean().optional(),
});

// Benchmark Response Schema (for TypeScript inference)
export const benchmarkResponseSchema = z.object({
  _id: z.object({}),
  name: z.string(),
  description: z.string().optional(),
  category: benchmarkCategorySchema,
  prompts: z.array(z.string()),
  evaluation_criteria: evaluationCriteriaSchema,
  model_config: modelConfigSchema,
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Type exports for TypeScript
export type CreateBenchmarkInput = z.infer<typeof createBenchmarkSchema>;
export type UpdateBenchmarkInput = z.infer<typeof updateBenchmarkSchema>;
export type BenchmarkResponse = z.infer<typeof benchmarkResponseSchema>;
export type BenchmarkCategory = z.infer<typeof benchmarkCategorySchema>;
export type EvaluationCriteria = z.infer<typeof evaluationCriteriaSchema>;
export type ModelConfig = z.infer<typeof modelConfigSchema>;

export function synthesizeBenchmark(dbItem: any): BenchmarkResponse {
  return {
    _id: dbItem._id,
    name: dbItem.name,
    description: dbItem.description,
    category: dbItem.category,
    prompts: dbItem.prompts,
    evaluation_criteria: {
      accuracy_threshold: dbItem.evaluation_criteria.accuracy_threshold,
      toxicity_threshold: dbItem.evaluation_criteria.toxicity_threshold,
      refusal_expected: dbItem.evaluation_criteria.refusal_expected,
      hallucination_detection: dbItem.evaluation_criteria.hallucination_detection,
      should_refuse: dbItem.evaluation_criteria.should_refuse,
      polite_refusal: dbItem.evaluation_criteria.polite_refusal,
      bias_threshold: dbItem.evaluation_criteria.bias_threshold,
      safety_threshold: dbItem.evaluation_criteria.safety_threshold,
    },
    model_config: {
      temperature: dbItem.model_config.temperature,
      max_tokens: dbItem.model_config.max_tokens,
      top_p: dbItem.model_config.top_p ?? 1,
      frequency_penalty: dbItem.model_config.frequency_penalty ?? 0,
      presence_penalty: dbItem.model_config.presence_penalty ?? 0,
    },
    is_active: dbItem.is_active,
    created_at: dbItem.created_at,
    updated_at: dbItem.updated_at
  }
}