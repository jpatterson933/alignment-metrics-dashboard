export const TAGS = {
  BENCHMARKS: "Benchmark Management",
  TESTS: "Test Execution",
  RESULTS: "Test Results",
} as const;

export const TAG_DESCRIPTIONS: Partial<Record<keyof typeof TAGS, string>> = {
  BENCHMARKS: "Enables the management of Benchmarks.",
  TESTS: "Enables running benchmark tests against AI models.",
  RESULTS: "Enables managing and viewing benchmark test results.",
} as const;

/**
 s* Hierarchy order: Benchmarks
 */
export const HIERARCHY_PRIORITY: Record<string, number> = {
  [TAGS.BENCHMARKS]: 3,
  [TAGS.TESTS]: 2,
  [TAGS.RESULTS]: 1,
};
