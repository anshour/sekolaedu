import { Op, WhereOptions } from "sequelize";

type FilterHandler = (value: any) => any;

interface Filters {
  [key: string]: FilterHandler;
}

class InvalidFilterError extends Error {
  constructor(invalidKey: string, allowedKeys: string[]) {
    super(
      `Invalid filter key: '${invalidKey}'. Allowed keys: ${allowedKeys.join(", ")}`,
    );
    this.name = "InvalidFilterError";
  }
}

export default function buildWhereQuery<T = any>(
  filterValues: Record<string, any> | undefined | null,
  filterHandlers: Filters = {},
): WhereOptions<T> {
  const whereCondition: WhereOptions<T> = {};

  if (!filterValues) {
    return whereCondition;
  }

  const allowedKeys = Object.keys(filterHandlers);

  Object.entries(filterValues).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (!filterHandlers.hasOwnProperty(key)) {
      throw new InvalidFilterError(key, allowedKeys);
    }

    const result = filterHandlers[key](value);
    if (result !== undefined) {
      if (result[Op.or] || result[Op.and]) {
        Object.assign(whereCondition, result);
      } else {
        // @ts-ignore
        whereCondition[key] = result;
      }
    }
  });

  return whereCondition;
}
