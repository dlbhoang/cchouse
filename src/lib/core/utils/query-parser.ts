import { z } from 'zod';
import { ParsedUrlQuery } from 'querystring';

/**
 * Safely parse URL query parameters using a Zod schema
 * @param query - Next.js router query object
 * @param schema - Zod schema for validation
 * @param fallback - Fallback values if parsing fails
 * @returns Parsed and validated data
 */
export function parseQueryParams<T extends z.ZodTypeAny>(
  query: ParsedUrlQuery,
  schema: T,
  fallback: z.infer<T>
): z.infer<T> {
  if (Object.keys(query).length === 0) {
    return fallback;
  }

  try {
    return schema.parse(query);
  } catch (error) {
    console.warn('Invalid query parameters:', error);
    return fallback;
  }
}
