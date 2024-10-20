export default class DefaultConfig {
  config;
  schema;
  constructor(schema, initialConfig = {}, defaultConfig = {}) {
    this.schema = schema;
    const mergedConfig = this.mergeConfig(defaultConfig, initialConfig);
    this.config = this.validateConfig(mergedConfig);
  }
  mergeConfig(defaultConfig, userConfig) {
    const merge = (target, source) => {
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
  validateConfig(config) {
    const parsedConfig = this.schema.safeParse(config);
    if (!parsedConfig.success) {
      throw new Error(
        `Config validation failed: ${parsedConfig.error.message}`
      );
    }
    return parsedConfig.data;
  }
  get(key) {
    const path = this.normalizeKey(key);
    return path.reduce((acc, part) => acc && acc[part], this.config);
  }
  set(key, value) {
    const path = this.normalizeKey(key);
    let current = this.config;
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
  normalizeKey(key) {
    return key.replace(/\[(\d+)\]|\["(.*?)"\]/g, ".$1$2").split(".");
  }
  getAll() {
    return this.config;
  }
}
//# sourceMappingURL=index.js.map
