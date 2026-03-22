export type SortDirection = "asc" | "desc";

export type SortRule<Field extends string> = {
  field: Field;
  direction: SortDirection;
};

export const compareText = (left: string, right: string, direction: SortDirection) => {
  const result = left.localeCompare(right, undefined, { sensitivity: "base" });
  return direction === "asc" ? result : -result;
};

export const compareNumber = (left: number, right: number, direction: SortDirection) => {
  const result = left - right;
  return direction === "asc" ? result : -result;
};

export const compareDate = (left: string, right: string, direction: SortDirection) =>
  compareNumber(new Date(left).getTime(), new Date(right).getTime(), direction);

export const applySortRules = <T, Field extends string>(
  items: T[],
  rules: SortRule<Field>[],
  comparatorMap: Record<Field, (left: T, right: T, direction: SortDirection) => number>
) =>
  [...items].sort((left, right) => {
    for (const rule of rules) {
      const compare = comparatorMap[rule.field];
      const result = compare(left, right, rule.direction);
      if (result !== 0) {
        return result;
      }
    }

    return 0;
  });
