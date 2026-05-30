export const fromNodeHeaders = jest.fn(
  (headers: Record<string, string | string[] | undefined>) => new Headers(),
);

export const toNodeHandler = jest.fn(() => jest.fn());
