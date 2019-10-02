export type FilteredKeys<T> = { [P in keyof T]: T[P] extends never ? never : P }[keyof T];
export type FilteredObj<T> = T extends never | {[k: string]: never}
  ? never
  : T extends {[k: string]: any}
    ? {
      [K in FilteredKeys<T>]: FilteredObj<T[K]>;// extends [never] ? false : true;// | {[k: string]: never} ? never : T;
    }
    : T;
