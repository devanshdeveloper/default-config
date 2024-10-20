import { ZodSchema } from "zod";
export default class DefaultConfig<T extends object> {
    private config;
    private schema;
    constructor(schema: ZodSchema<T>, initialConfig?: Partial<T>, defaultConfig?: Partial<T>);
    private mergeConfig;
    private validateConfig;
    get(key: string): any;
    set(key: string, value: any): void;
    private normalizeKey;
    getAll(): T;
}
