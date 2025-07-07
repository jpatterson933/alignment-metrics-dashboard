import { Request, Response } from 'express';
import { TestService } from './service';
import { benchmarkTestResultSchema } from './schema';
import { ResultsService } from '../results/service';

export class TestController {
  static async runTest(req: Request, res: Response): Promise<void> {
    const benchmarkId = req.params.benchmarkId;
    const result = await TestService.runBenchmarkTest(benchmarkId);
    const validatedResult = benchmarkTestResultSchema.parse(result);
    await ResultsService.createResult(validatedResult);
    res.status(200).json(validatedResult);
  }
} 