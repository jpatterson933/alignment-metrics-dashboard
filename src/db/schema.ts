import mongoose, { Schema, Document } from 'mongoose';

// Benchmark Categories
export type BenchmarkCategory = 'truthfulness' | 'toxicity' | 'refusal' | 'bias' | 'safety';

// Evaluation Criteria Interface
export interface EvaluationCriteria {
  accuracy_threshold?: number;
  toxicity_threshold?: number;
  refusal_expected?: boolean;
  hallucination_detection?: boolean;
  should_refuse?: boolean;
  polite_refusal?: boolean;
  bias_threshold?: number;
  safety_threshold?: number;
}

// Model Configuration Interface
export interface ModelConfig {
  temperature: number;
  max_tokens: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

// Benchmark Document Interface
export interface IBenchmark extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  category: BenchmarkCategory;
  prompts: string[];
  evaluation_criteria: EvaluationCriteria;
  model_config: ModelConfig;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Benchmark Results Interfaces
export interface IPromptResult {
  prompt: string;
  response: string;
  evaluation: {
    accuracy_score: number;
    toxicity_score: number;
    bias_score: number;
    safety_score: number;
    hallucination_detected: boolean;
    should_refuse: boolean;
    polite_refusal: boolean;
    meets_criteria: boolean;
  };
  execution_time_ms: number;
}

export interface IBenchmarkResult extends Document {
  _id: mongoose.Types.ObjectId;
  benchmark_id: mongoose.Types.ObjectId;
  benchmark_name: string;
  category: BenchmarkCategory;
  total_prompts: number;
  prompts_passed: number;
  prompts_failed: number;
  overall_score: number;
  summary: {
    average_accuracy: number;
    average_toxicity: number;
    average_bias: number;
    average_safety: number;
    hallucinations_detected: number;
    refusal_rate: number;
  };
  prompt_results: IPromptResult[];
  total_execution_time_ms: number;
  timestamp: Date;
  created_at: Date;
  updated_at: Date;
}

// Benchmark Schema
const benchmarkSchema = new Schema<IBenchmark>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: ['truthfulness', 'toxicity', 'refusal', 'bias', 'safety'],
      index: true,
    },
    prompts: {
      type: [String],
      required: true,
      validate: {
        validator: function(v: string[]) {
          return v && v.length > 0 && v.length <= 1000;
        },
        message: 'Prompts array must contain 1-1000 items'
      }
    },
    evaluation_criteria: {
      type: Schema.Types.Mixed,
      required: true,
      validate: {
        validator: function(v: any) {
          return v && typeof v === 'object' && Object.keys(v).length > 0;
        },
        message: 'Evaluation criteria must be a non-empty object'
      }
    },
    model_config: {
      temperature: {
        type: Number,
        required: true,
        min: 0,
        max: 2,
      },
      max_tokens: {
        type: Number,
        required: true,
        min: 1,
        max: 4096,
      },
      top_p: {
        type: Number,
        min: 0,
        max: 1,
        default: 1,
      },
      frequency_penalty: {
        type: Number,
        min: -2,
        max: 2,
        default: 0,
      },
      presence_penalty: {
        type: Number,
        min: -2,
        max: 2,
        default: 0,
      },
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'benchmarks',
  }
);

// Benchmark Results Schema
const benchmarkResultSchema = new Schema<IBenchmarkResult>(
  {
    benchmark_id: {
      type: Schema.Types.ObjectId,
      ref: 'Benchmark',
      required: true,
      index: true,
    },
    benchmark_name: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['truthfulness', 'toxicity', 'refusal', 'bias', 'safety'],
      index: true,
    },
    total_prompts: {
      type: Number,
      required: true,
      min: 1,
    },
    prompts_passed: {
      type: Number,
      required: true,
      min: 0,
    },
    prompts_failed: {
      type: Number,
      required: true,
      min: 0,
    },
    overall_score: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    summary: {
      average_accuracy: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
      },
      average_toxicity: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
      },
      average_bias: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
      },
      average_safety: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
      },
      hallucinations_detected: {
        type: Number,
        required: true,
        min: 0,
      },
      refusal_rate: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
      },
    },
    prompt_results: [{
      prompt: {
        type: String,
        required: true,
      },
      response: {
        type: String,
        required: true,
      },
      evaluation: {
        accuracy_score: {
          type: Number,
          required: true,
          min: 0,
          max: 1,
        },
        toxicity_score: {
          type: Number,
          required: true,
          min: 0,
          max: 1,
        },
        bias_score: {
          type: Number,
          required: true,
          min: 0,
          max: 1,
        },
        safety_score: {
          type: Number,
          required: true,
          min: 0,
          max: 1,
        },
        hallucination_detected: {
          type: Boolean,
          required: true,
        },
        should_refuse: {
          type: Boolean,
          required: true,
        },
        polite_refusal: {
          type: Boolean,
          required: true,
        },
        meets_criteria: {
          type: Boolean,
          required: true,
        },
      },
      execution_time_ms: {
        type: Number,
        required: true,
        min: 0,
      },
    }],
    total_execution_time_ms: {
      type: Number,
      required: true,
      min: 0,
    },
    timestamp: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'benchmark_results',
  }
);

// Indexes for better query performance
benchmarkSchema.index({ category: 1, is_active: 1 });
benchmarkSchema.index({ created_at: -1 });

// Results indexes
benchmarkResultSchema.index({ benchmark_id: 1, created_at: -1 });
benchmarkResultSchema.index({ category: 1, created_at: -1 });
benchmarkResultSchema.index({ overall_score: -1 });
benchmarkResultSchema.index({ timestamp: -1 });

// Models
export const Benchmark = mongoose.model<IBenchmark>('Benchmark', benchmarkSchema);
export const BenchmarkResult = mongoose.model<IBenchmarkResult>('BenchmarkResult', benchmarkResultSchema);
