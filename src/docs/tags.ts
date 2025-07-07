export const TAGS = {
  BENCHMARKS: "Benchmark Management",
  TESTS: "Test Execution",
} as const;

export const TAG_DESCRIPTIONS: Partial<Record<keyof typeof TAGS, string>> = {
  BENCHMARKS: "Enables the management of Benchmarks.",
  TESTS: "Enables running benchmark tests against AI models.",
} as const;

/**
 s* Hierarchy order: Benchmarks
 */
export const HIERARCHY_PRIORITY: Record<string, number> = {
  [TAGS.BENCHMARKS]: 2,
  [TAGS.TESTS]: 1,
};
