import { Benchmark, IBenchmark } from '../../db/schema';
import {
  createBenchmarkSchema,
  updateBenchmarkSchema,
  CreateBenchmarkInput,
  UpdateBenchmarkInput,
  synthesizeBenchmark,
} from './schema';

export class BenchmarkService {
  static async createBenchmark(data: CreateBenchmarkInput): Promise<any> {
    const validatedData = createBenchmarkSchema.parse(data);
    const existingBenchmark = await Benchmark.findOne({ 
      name: validatedData.name 
    }).lean();
    
    if (existingBenchmark) {
      throw new Error(`Benchmark with name '${validatedData.name}' already exists`);
    }

    const benchmark = new Benchmark(validatedData);
    await benchmark.save();
    
    return synthesizeBenchmark(benchmark.toObject());
  }

  static async getBenchmarks(): Promise<any[]> {
    
    const benchmarks = await Benchmark.find()
      .sort({ created_at: -1 })
      .lean();

  const synthesizedBenchmarks = benchmarks.map((benchmark) => {
    return synthesizeBenchmark(benchmark as any)
  })

    return synthesizedBenchmarks;
  }

  static async getBenchmarkById(id: string): Promise<any | null> {
    const benchmark = await Benchmark.findById(id).lean();
    return benchmark ? synthesizeBenchmark(benchmark as any) : null;
  }

  static async updateBenchmark(id: string, data: UpdateBenchmarkInput): Promise<any | null> {
    const validatedData = updateBenchmarkSchema.parse(data);
    const entityExists = await Benchmark.findById(id);
    if (!entityExists) {
      throw new Error(`Benchmark with ID '${id}' not found`);
    }

    // todo find a better way to do this
    if (validatedData.name && validatedData.name !== entityExists.name) {
      const duplicateBenchmark = await Benchmark.findOne({ 
        name: validatedData.name,
        _id: { $ne: id }
      });
      
      if (duplicateBenchmark) {
        throw new Error(`Benchmark with name '${validatedData.name}' already exists`);
      }
    }

    const updatedBenchmark = await Benchmark.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    ).lean();

    return updatedBenchmark ? synthesizeBenchmark(updatedBenchmark as any) : null;
  }

  static async deleteBenchmark(id: string): Promise<boolean> {
    const result = await Benchmark.findByIdAndDelete(id);
    return result !== null;
  }
}

export const benchmarkService = new BenchmarkService();