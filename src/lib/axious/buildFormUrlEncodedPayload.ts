export const buildFormUrlEncodedPayload = (payload: unknown) => {
  const params = new URLSearchParams();

  const appendValue = (key: string, value: unknown) => {
    if (value === undefined || value === null) {
      return;
    }

    if (value instanceof Date) {
      params.append(key, value.toISOString());
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          appendValue(`${key}[${index}]`, item);
          return;
        }

        appendValue(`${key}[]`, item);
      });
      return;
    }

    if (typeof value === "object") {
      Object.entries(value as Record<string, unknown>).forEach(([nestedKey, nestedValue]) => {
        appendValue(`${key}[${nestedKey}]`, nestedValue);
      });
      return;
    }

    params.append(key, String(value));
  };

  if (payload && typeof payload === "object") {
    Object.entries(payload as Record<string, unknown>).forEach(([key, value]) => {
      appendValue(key, value);
    });
  }

  return params;
};
