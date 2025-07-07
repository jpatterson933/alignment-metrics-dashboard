import { Request, Response } from 'express';
import { TestService } from './service';
import { benchmarkTestResultSchema } from './schema';

export class TestController {
  static async runTest(req: Request, res: Response): Promise<void> {
    const benchmarkId = req.params.benchmarkId;
    
    console.log(`\n🚀 Starting benchmark test for ID: ${benchmarkId}`);
    
    const result = await TestService.runBenchmarkTest(benchmarkId);
    
    // Validate the result against our schema
    const validatedResult = benchmarkTestResultSchema.parse(result);
    
    console.log(`\n✅ Test completed successfully`);
    console.log(`📊 Final Score: ${(validatedResult.overall_score * 100).toFixed(1)}%`);
    
    res.status(200).json(validatedResult);
  }
} 