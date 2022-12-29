declare global {
  const __SERVER_PORT__: number;

  export type Nullable<T> = T | null;

  export type TupleArray<T, len extends number> = [T, ...T[]] & { length: len };
}

export {};
