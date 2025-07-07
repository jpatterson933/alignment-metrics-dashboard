import { BenchmarkResult } from '../../db/schema';
import {
  benchmarkTestResultSchema,
  CreateResultInput,
  StoredBenchmarkResult,
  synthesizeResult,
} from './schema';
import mongoose from 'mongoose';

export class ResultsService {
  static async createResult(data: CreateResultInput): Promise<StoredBenchmarkResult> {
    const validatedData = benchmarkTestResultSchema.parse(data);
    
    const result = new BenchmarkResult({
      benchmark_id: new mongoose.Types.ObjectId(validatedData.benchmark_id),
      benchmark_name: validatedData.benchmark_name,
      category: validatedData.category,
      total_prompts: validatedData.total_prompts,
      prompts_passed: validatedData.prompts_passed,
      prompts_failed: validatedData.prompts_failed,
      overall_score: validatedData.overall_score,
      summary: validatedData.summary,
      prompt_results: validatedData.prompt_results,
      total_execution_time_ms: validatedData.total_execution_time_ms,
      timestamp: new Date(validatedData.timestamp),
    });

    await result.save();
    return synthesizeResult(result.toObject());
  }

  static async getResultsByBenchmarkId(benchmarkId: string): Promise<StoredBenchmarkResult[]> {
    const results = await BenchmarkResult.find({ 
      benchmark_id: new mongoose.Types.ObjectId(benchmarkId) 
    })
    .sort({ created_at: -1 })
    .lean();

    return results.map(result => synthesizeResult(result));
  }
}

export const resultsService = new ResultsService();
