import { Request, Response } from 'express';
import { ResultsService } from './service';

export class ResultsController {
  static async getResultsByBenchmarkId(req: Request, res: Response): Promise<void> {
    const results = await ResultsService.getResultsByBenchmarkId(req.params.benchmarkId);
    res.status(200).json(results);
  }
}

export const resultsController = new ResultsController();
