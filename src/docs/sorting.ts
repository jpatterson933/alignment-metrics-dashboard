import { HIERARCHY_PRIORITY } from "./tags";

/**
 * Sorts tag objects by hierarchy
 */
export function sortTagsByHierarchy<T extends { name: string }>(
  tags: T[]
): T[] {
  return tags.sort((a, b) => {
    const priorityA = HIERARCHY_PRIORITY[a.name] ?? 0;
    const priorityB = HIERARCHY_PRIORITY[b.name] ?? 0;
    return priorityB - priorityA || a.name.localeCompare(b.name);
  });
}
