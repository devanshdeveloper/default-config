import { ZodSchema } from "zod";

export default class DefaultConfig<T extends object> {
  private config: T;
  private schema: ZodSchema<T>;

  constructor(
    schema: ZodSchema<T>,
    initialConfig: Partial<T> = {},
    defaultConfig: Partial<T> = {}
  ) {
    this.schema = schema;
    const mergedConfig = this.mergeConfig(defaultConfig, initialConfig);
    this.config = this.validateConfig(mergedConfig);
  }

  private mergeConfig(defaultConfig: Partial<T>, userConfig: Partial<T>): T {
    const merge = (target: any, source: any): any => {
      for (const key in source) {
        if (
          typeof source[key] === "object" &&
          !Array.isArray(source[key]) &&
          source[key] !== null
        ) {
          target[key] = merge(target[key] || {}, source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    };
    return merge({ ...defaultConfig }, userConfig);
  }

  private validateConfig(config: Partial<T>): T {
    const parsedConfig = this.schema.safeParse(config);
    if (!parsedConfig.success) {
      throw new Error(
        `Config validation failed: ${parsedConfig.error.message}`
      );
    }
    return parsedConfig.data;
  }

  get(key: string): any {
    const path = this.normalizeKey(key);
    return path.reduce(
      (acc: any, part) => acc && acc[part],
      this.config as any
    );
  }

  set(key: string, value: any): void {
    const path = this.normalizeKey(key);
    let current: any = this.config;

    path.forEach((part, index) => {
      if (index === path.length - 1) {
        current[part] = value;
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    });

    this.config = this.validateConfig(this.config);
  }

  private normalizeKey(key: string): string[] {
    return key.replace(/\[(\d+)\]|\["(.*?)"\]/g, ".$1$2").split(".");
  }

  getAll(): T {
    return this.config;
  }
}
