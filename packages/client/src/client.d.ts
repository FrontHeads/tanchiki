declare global {
  const __SERVER_PORT__: number;
  const __SLACK_FEEDBACK_WEBHOOK_URL__: string;

  // We can't use type here to define additional Window properties
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    __PRELOADED_STATE__?: Record<string, Record<string, unknown>>;
  }

  export type Nullable<T> = T | null;

  export type TupleArray<T, len extends number> = [T, ...T[]] & { length: len };

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Array<T> {
    findLast(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T;
  }
}

export {};
