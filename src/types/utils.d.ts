export type Childless<T> = T extends never | {[k: string]: never}
? never
: {} extends T
  ? never
  : T
export type FilteredKeys<T> = {[P in keyof T]: Childless<T[P]> extends never ? never : P}[keyof T];
export type FilteredObj<T> = T extends never | {[k: string]: never}
  ? never
  : {} extends T
    ? never
    : T extends string | number | boolean | Function//{[k: string]: any}
      ? T
      : {
        [K in FilteredKeys<T>]: FilteredObj<T[K]>;// extends [never] ? false : true;// | {[k: string]: never} ? never : T;
      };
