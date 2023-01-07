declare global {
  const __SERVER_PORT__: number;
  export type Nullable<T> = T | null;

  export type TupleArray<T, len extends number> = [T, ...T[]] & { length: len };

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Array<T> {
    findLast(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T;
  }
}

export {};
