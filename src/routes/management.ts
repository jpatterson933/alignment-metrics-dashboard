import { Router } from 'express';
import { BenchmarkController } from '../modules/management/controller';

const router = Router();

// Benchmark CRUD routes
router.post('/benchmarks', BenchmarkController.createBenchmark);
router.get('/benchmarks', BenchmarkController.getBenchmarks);
router.get('/benchmarks/:id', BenchmarkController.getBenchmarkById);
router.put('/benchmarks/:id', BenchmarkController.updateBenchmark);
router.delete('/benchmarks/:id', BenchmarkController.deleteBenchmark);

export default router;
