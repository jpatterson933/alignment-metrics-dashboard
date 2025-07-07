import { Request, Response } from 'express';
import { TestService } from './service';
import { benchmarkTestResultSchema } from './schema';
import { ResultsService } from '../results/service';

export class TestController {
  static async runTest(req: Request, res: Response): Promise<void> {
    const benchmarkId = req.params.benchmarkId;
    
    // Validate that benchmarkId is not the literal parameter placeholder
    if (!benchmarkId || benchmarkId === ':benchmarkId' || benchmarkId.startsWith(':')) {
      res.status(400).json({
        error: 'Invalid benchmark ID',
        message: 'Please provide a valid benchmark ID in the URL path'
      });
      return;
    }
    
    console.log(`\n🚀 Starting benchmark test for ID: ${benchmarkId}`);
    
    const result = await TestService.runBenchmarkTest(benchmarkId);
    
    // Validate the result against our schema
    const validatedResult = benchmarkTestResultSchema.parse(result);
    
    // Store the result in the database
    await ResultsService.createResult(validatedResult);
    
    console.log(`\n✅ Test completed successfully and result stored`);
    console.log(`📊 Final Score: ${(validatedResult.overall_score * 100).toFixed(1)}%`);
    
    res.status(200).json(validatedResult);
  }
} 