export const TAGS = {
  BENCHMARKS: "Benchmark Management",

} as const;

export const TAG_DESCRIPTIONS: Partial<Record<keyof typeof TAGS, string>> = {
  BENCHMARKS: "Enables the management of Benchmarks.",
} as const;

/**
 s* Hierarchy order: Benchmarks
 */
export const HIERARCHY_PRIORITY: Record<string, number> = {
  [TAGS.BENCHMARKS]: 1,
};
