import { ParsedUrlQuery } from 'querystring';

export const objToQueryString = <T extends object>(obj: T): string => {
  if (!obj || Object.keys(obj).length === 0) return '';

  const filteredEntries = Object.entries(obj)
    .filter(
      ([, value]) => value !== undefined && value !== '' && value !== null
    )
    .map(([key, value]) => [key, String(value)]);

  return new URLSearchParams(filteredEntries).toString();
};

export const objToQueryStringWithArray = <T extends object>(obj: T): string => {
  if (!obj || Object.keys(obj).length === 0) return '';

  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      if (Array.isArray(value)) {
        // Xử lý mảng: thêm từng phần tử với cùng key
        value.forEach((item) => {
          if (item !== undefined && item !== '' && item !== null) {
            params.append(key, String(item));
          }
        });
      } else {
        // Xử lý giá trị đơn lẻ
        params.append(key, String(value));
      }
    }
  });

  return params.toString();
};

export const queryStringToObj = <T>(
  query: string | Record<string, string | string[]> | ParsedUrlQuery
): T => {
  if (typeof query === 'string') {
    const params = new URLSearchParams(query);
    const result: Record<string, any> = {};

    Array.from(params.entries()).forEach(([key, value]) => {
      if (key in result) {
        result[key] = Array.isArray(result[key])
          ? [...result[key], value]
          : [result[key], value];
      } else {
        result[key] = value;
      }
    });

    return result as T;
  }

  return query as unknown as T;
};
