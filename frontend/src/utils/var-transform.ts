type FlexibleObject = {
  [key: string]: string | null | Array<any> | number | FlexibleObject;
};

const isFormData = (o: unknown) => o instanceof FormData;

const isBlob = (o: unknown) => {
  if (typeof window === "undefined") return false;
  return o instanceof Blob;
};

const isArray = (a: unknown) => Array.isArray(a);

const isObject = (o: unknown) =>
  o === Object(o) && !isArray(o) && typeof o !== "function";

const toCamel = (s: string) =>
  s.replace(/([-_][a-z])/gi, ($1: string) =>
    $1.toUpperCase().replace("-", "").replace("_", "")
  );

const toUnderscore = (s: string) =>
  s.replace(/\.?([A-Z])/g, (_x, y) => `_${y.toLowerCase()}`).replace(/^_/, "");

export const camelizeKey = (o: any): any => {
  if (isBlob(o)) return o;

  if (Array.isArray(o)) {
    return o.map(camelizeKey);
  }

  if (typeof o === "object" && o !== null) {
    return Object.entries(o).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [toCamel(key)]: camelizeKey(value),
      }),
      {}
    );
  }

  return o;
};

export const decamelizeKey = (o: any): any => {
  if (isFormData(o)) {
    return Array.from(o.entries()).reduce((formData, [key, value]) => {
      formData.append(toUnderscore(key), value);
      return formData;
    }, new FormData());
  }

  if (Array.isArray(o)) {
    return o.map(decamelizeKey);
  }

  if (typeof o === "object" && o !== null) {
    return Object.entries(o).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [toUnderscore(key)]: decamelizeKey(value),
      }),
      {}
    );
  }

  return o;
};

export const removeNull = (o: FlexibleObject) => {
  const obj = JSON.parse(JSON.stringify(o));
  const cleanObject = (object: FlexibleObject) => {
    Object.keys(object).forEach((key) => {
      if (null === object[key]) object[key] = "";
      if (typeof object[key] === "object")
        cleanObject(object[key] as FlexibleObject);
    });
    return object;
  };
  return cleanObject(obj);
};

/**
 *  Mengubah object menjadi url parameter
 *
 * @param options
 * @returns url parameter page=1&filter[name]=adi
 */
export const objectToUrlParam = (
  options: Record<string, any> | null
): string => {
  if (!options) {
    return "";
  }

  const encodeValue = (value: any): string =>
    encodeURIComponent(value instanceof Object ? JSON.stringify(value) : value);

  const buildQueryString = (data: any, parentKey?: string): string => {
    return Object.entries(data)
      .filter(([_, value]) => value != null)
      .map(([key, value]) => {
        const fullKey = parentKey ? `${parentKey}[${key}]` : key;
        return value instanceof Object
          ? buildQueryString(value, fullKey)
          : `${encodeURIComponent(fullKey)}=${encodeValue(value)}`;
      })
      .join("&");
  };

  return buildQueryString(options);
};

export const groupByKey = (array: Array<any>, keyName: string) => {
  const newKeyName = keyName.replace(".", "_");

  // Replace lodash chain with native JS
  const grouped = array.reduce((acc: { [key: string]: any[] }, curr: any) => {
    const key = keyName.split(".").reduce((obj, key) => obj?.[key], curr) ?? "";
    acc[key] = acc[key] || [];
    acc[key].push(curr);
    return acc;
  }, {});

  return Object.entries(grouped).map(([key, value]) => ({
    [newKeyName]: key,
    data: value,
  }));
};

export const htmlToText = (text: string | null, length = 0) => {
  if (text === null) return "";
  let newText = text.replace(/<[^>]+>|&nbsp;|&quot;|&amp;|\s\s+/g, "");

  if (length) {
    newText = newText.substring(0, length);
  }

  return newText;
};

export interface OptionsParam {
  value: string | number;
  label: string;
}

export interface OptionsParamExtended {
  value: string;
  label: string;
  [key: string]: any;
}

export interface OptionGroupParam extends OptionsParam {
  group: {
    name: string;
  };
}

export function makeGroupOptions(options: Array<OptionGroupParam>) {
  const sorted = [...options].sort((a, b) => a.label.localeCompare(b.label));

  const grouped = sorted.reduce(
    (acc: { [key: string]: OptionGroupParam[] }, curr) => {
      const key = curr.group.name;
      acc[key] = acc[key] || [];
      acc[key].push(curr);
      return acc;
    },
    {}
  );

  return Object.entries(grouped).map(([group, newOptions]) => ({
    label: group,
    options: newOptions,
  }));
}

export const addTrailingZeros = (num: string | number, totalLength: number) => {
  return String(num).padEnd(totalLength, "0");
};

export const getFilename = (url?: string): string => {
  if (!url) {
    return "";
  }
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const filename = pathname.split("/").pop();

  return filename || "";
};
/**
 * Converts an object to FormData
 * Handles nested objects, arrays, and files
 * @param object Object to convert to FormData
 * @param formData Existing FormData instance (optional)
 * @param parentKey Parent key for nested objects (optional)
 * @returns FormData
 */
export const objectToFormData = (
  object: Record<string, any>,
  formData: FormData = new FormData(),
  parentKey?: string
): FormData => {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof File || value instanceof Blob) {
        formData.append(formKey, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayKey = `${formKey}[${index}]`;
          if (item instanceof File || item instanceof Blob) {
            formData.append(arrayKey, item);
          } else if (typeof item === "object" && item !== null) {
            objectToFormData(item, formData, arrayKey);
          } else {
            formData.append(arrayKey, String(item));
          }
        });
      } else if (typeof value === "object" && value !== null) {
        objectToFormData(value, formData, formKey);
      } else if (value !== undefined && value !== null) {
        formData.append(formKey, String(value));
      }
    }
  }

  return formData;
};
