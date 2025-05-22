import db from "../database/connection";

/**
 * Fetches related entities in a many-to-many relationship and attaches them to parent entities
 * @param parentEntities Array of parent entities (e.g., roles)
 * @param options Configuration for the relationship
 * @returns The original entities with related items attached
 */
export async function attachManyToMany<T, R>(
  parentEntities: T[],
  options: {
    parentIdKey: keyof T; // Key in parent entity used as foreign key (usually 'id')
    relationTable: string; // Junction table name (e.g., 'role_permissions')
    parentForeignKey: string; // Foreign key in junction table referring to parent (e.g., 'role_id')
    relatedForeignKey: string; // Foreign key in junction table referring to related entity (e.g., 'permission_id')
    relatedTable: string; // Related entity table (e.g., 'permissions')
    relatedFields: string[]; // Fields to select from related table
    outputKey: string; // Key to use in parent entity for storing related items
  },
): Promise<(T & Record<string, R[]>)[]> {
  if (parentEntities.length === 0) {
    return parentEntities as (T & Record<string, R[]>)[];
  }

  // Get all parent IDs in one array
  const parentIds = parentEntities.map((entity) => entity[options.parentIdKey]);

  // Get all parent-related mappings in a single query
  const relationMappings = await db(options.relationTable)
    .whereIn(options.parentForeignKey, parentIds as number[] | string[])
    .select([options.parentForeignKey, options.relatedForeignKey]);

  // Get all unique related IDs
  const uniqueRelatedIds = [
    ...new Set(
      relationMappings.map((mapping) => mapping[options.relatedForeignKey]),
    ),
  ];

  // Fetch all required related entities in a single query
  const relatedEntities =
    uniqueRelatedIds.length > 0
      ? await db(options.relatedTable)
          .whereIn("id", uniqueRelatedIds)
          .select(options.relatedFields)
      : [];

  // Create a lookup map for related entities
  const relatedEntitiesMap = relatedEntities.reduce(
    (map, entity) => {
      map[entity.id] = entity;
      return map;
    },
    {} as Record<number, R>,
  );

  // Map related entities to each parent
  return parentEntities.map((entity) => {
    const relatedIds = relationMappings
      .filter(
        (mapping) =>
          mapping[options.parentForeignKey] === entity[options.parentIdKey],
      )
      .map((mapping) => mapping[options.relatedForeignKey]);

    const relatedItems = relatedIds
      .map((id) => relatedEntitiesMap[id])
      .filter(Boolean); // Remove undefined items

    return {
      ...entity,
      [options.outputKey]: relatedItems || [],
    } as T & Record<string, R[]>;
  });
}

/**
 * Fetches related entities in a one-to-many relationship and attaches them to parent entities
 * @param parentEntities Array of parent entities (e.g., users)
 * @param options Configuration for the relationship
 * @returns The original entities with related items attached
 */
export async function attachHasMany<T, R>(
  parentEntities: T[],
  options: {
    parentIdKey: keyof T; // Key in parent entity used as foreign key (usually 'id')
    relatedTable: string; // Related entity table (e.g., 'posts')
    foreignKey: string; // Foreign key in related table referring to parent (e.g., 'user_id')
    relatedFields: string[]; // Fields to select from related table
    outputKey: string; // Key to use in parent entity for storing related items
    whereConditions?: Record<string, any>; // Optional additional conditions
  },
): Promise<(T & Record<string, R[]>)[]> {
  if (parentEntities.length === 0) {
    return parentEntities as (T & Record<string, R[]>)[];
  }

  // Get all parent IDs in one array
  const parentIds = parentEntities.map((entity) => entity[options.parentIdKey]);

  // Build query
  let query = db(options.relatedTable)
    .whereIn(options.foreignKey, parentIds as number[] | string[])
    .select([options.foreignKey, ...options.relatedFields]);

  // Add optional where conditions
  if (options.whereConditions) {
    for (const [key, value] of Object.entries(options.whereConditions)) {
      query = query.where(key, value);
    }
  }

  // Fetch all related entities in a single query
  const relatedEntities = await query;

  // Group related entities by parent ID
  const relatedEntitiesByParentId = relatedEntities.reduce(
    (map, entity) => {
      const parentId = entity[options.foreignKey];
      if (!map[parentId]) {
        map[parentId] = [];
      }
      map[parentId].push(entity);
      return map;
    },
    {} as Record<string | number, R[]>,
  );

  // Map related entities to each parent
  return parentEntities.map((entity) => {
    const parentId = entity[options.parentIdKey];
    return {
      ...entity,
      [options.outputKey]: relatedEntitiesByParentId[parentId] || [],
    } as T & Record<string, R[]>;
  });
}

/**
 * Fetches related entities in a many-to-one relationship and attaches them to parent entities
 * @param parentEntities Array of parent entities (e.g., posts)
 * @param options Configuration for the relationship
 * @returns The original entities with related item attached
 */
export async function attachBelongsTo<T, R>(
  parentEntities: T[],
  options: {
    foreignKey: keyof T; // Foreign key in parent entity referring to related (e.g., 'user_id')
    relatedTable: string; // Related entity table (e.g., 'users')
    relatedIdKey: string; // Primary key in related table (usually 'id')
    relatedFields: string[]; // Fields to select from related table
    outputKey: string; // Key to use in parent entity for storing related item
  },
): Promise<(T & Record<string, R>)[]> {
  if (parentEntities.length === 0) {
    return parentEntities as (T & Record<string, R>)[];
  }

  // Get all foreign keys (that are not null)
  const foreignKeys = parentEntities
    .map((entity) => entity[options.foreignKey])
    .filter(Boolean);

  if (foreignKeys.length === 0) {
    // No foreign keys to look up, return parents with null relations
    return parentEntities.map((entity) => ({
      ...entity,
      [options.outputKey]: null,
    })) as (T & Record<string, R>)[];
  }

  // Get all unique foreign keys
  const uniqueForeignKeys = [...new Set(foreignKeys)];

  // Fetch all related entities in a single query
  const relatedEntities = await db(options.relatedTable)
    .whereIn(options.relatedIdKey, uniqueForeignKeys as number[] | string[])
    .select(options.relatedFields);

  // Create a lookup map for related entities
  const relatedEntitiesMap = relatedEntities.reduce(
    (map, entity) => {
      map[entity[options.relatedIdKey]] = entity;
      return map;
    },
    {} as Record<string | number, R>,
  );

  // Map related entities to each parent
  return parentEntities.map((entity) => {
    const foreignKey = entity[options.foreignKey];
    return {
      ...entity,
      [options.outputKey]: foreignKey
        ? relatedEntitiesMap[foreignKey] || null
        : null,
    } as T & Record<string, R>;
  });
}

/**
 * Fetches a single related entity in a one-to-one relationship and attaches it to parent entities
 * @param parentEntities Array of parent entities (e.g., users)
 * @param options Configuration for the relationship
 * @returns The original entities with related item attached
 */
export async function attachHasOne<T, R>(
  parentEntities: T[],
  options: {
    parentIdKey: keyof T; // Key in parent entity used as foreign key (usually 'id')
    relatedTable: string; // Related entity table (e.g., 'profiles')
    foreignKey: string; // Foreign key in related table referring to parent (e.g., 'user_id')
    relatedFields: string[]; // Fields to select from related table
    outputKey: string; // Key to use in parent entity for storing related item
  },
): Promise<(T & Record<string, R>)[]> {
  if (parentEntities.length === 0) {
    return parentEntities as (T & Record<string, R>)[];
  }

  // Get all parent IDs in one array
  const parentIds = parentEntities.map((entity) => entity[options.parentIdKey]);

  // Fetch all related entities in a single query
  const relatedEntities = await db(options.relatedTable)
    .whereIn(options.foreignKey, parentIds as number[] | string[])
    .select([options.foreignKey, ...options.relatedFields]);

  // Create a lookup map for related entities
  const relatedEntitiesMap = relatedEntities.reduce(
    (map, entity) => {
      // In a hasOne relationship, we only need the first matching record
      if (!map[entity[options.foreignKey]]) {
        map[entity[options.foreignKey]] = entity;
      }
      return map;
    },
    {} as Record<string | number, R>,
  );

  // Map related entities to each parent
  return parentEntities.map((entity) => {
    const parentId = entity[options.parentIdKey];
    return {
      ...entity,
      [options.outputKey]: relatedEntitiesMap[parentId] || null,
    } as T & Record<string, R>;
  });
}
