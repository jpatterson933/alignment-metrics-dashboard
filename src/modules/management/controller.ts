import { Request, Response } from 'express';
import { BenchmarkService } from './service';
import { createBenchmarkSchema } from './schema';

export class BenchmarkController {
  static async createBenchmark(req: Request, res: Response): Promise<void> {
      const validateBody = createBenchmarkSchema.parse(req.body)
      await BenchmarkService.createBenchmark(validateBody);
      res.status(201).json('Benchmark create successfully');
  }
  
  static async getBenchmarks(req: Request, res: Response): Promise<void> {
    const benchmarks = await BenchmarkService.getBenchmarks();
      res.status(200).json(benchmarks);
  }

  static async getBenchmarkById(req: Request, res: Response): Promise<void> {
      const benchmark = await BenchmarkService.getBenchmarkById(req.params.id);
      res.status(200).json(benchmark);
  }

  static async updateBenchmark(req: Request, res: Response): Promise<void> {
      const benchmark = await BenchmarkService.updateBenchmark(req.params.id, req.body);
      res.status(200).json(benchmark);
  }

  static async deleteBenchmark(req: Request, res: Response): Promise<void> {
      const deleted = await BenchmarkService.deleteBenchmark(req.params.id);
      res.status(200).json(deleted);
  }

}

export const benchmarkController = new BenchmarkController();
