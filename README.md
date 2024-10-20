# DefaultConfig

`DefaultConfig` is a TypeScript class designed to manage configuration settings dynamically. It supports deep merging of configurations, allows dynamic access to nested properties, and validates configurations against a schema using [Zod](https://zod.dev).

## Features

- **Dynamic Configuration**: Get and set nested configuration values using dot notation.
- **Deep Merging**: Merge user configurations with default configurations recursively.
- **Validation**: Validate configurations using a Zod schema to ensure they meet defined types and constraints.
- **Type Safety**: Leverage TypeScript for type safety in your configuration management.

## Installation

To install the package, run:

```bash
npm install default-config zod
```

## Usage

### Importing the DefaultConfig

```typescript
import DefaultConfig from "default-";
import { z } from "zod";
```

### Define Your Configuration Schema

Use Zod to create a schema that your configuration must adhere to.

```typescript
const configSchema = z.object({
  api: z.object({
    url: z.string().url(),
    timeout: z.number().min(1000),
    headers: z
      .object({
        authorization: z.string().optional(),
      })
      .optional(),
  }),
  features: z.object({
    enableLogging: z.boolean(),
    flags: z
      .object({
        featureX: z.boolean().optional(),
        featureY: z.boolean(),
      })
      .optional(),
  }),
});
```

### Create Default and Initial Configurations

Define your default and initial configurations.

```typescript
const defaultConfig = {
  api: {
    url: "https://example.com",
    timeout: 5000,
  },
  features: {
    enableLogging: false,
    flags: {
      featureY: true,
    },
  },
};

const initialConfig = {
  api: {
    headers: {
      authorization: "Bearer token",
    },
  },
};
```

### Instantiate the DefaultConfig

Create an instance of the DefaultConfig using the schema, default config, and initial config.

```typescript
const defaultConfig = new DefaultConfig(
  configSchema,
  initialConfig,
  defaultConfig
);
```

### Accessing Configuration Values

You can access configuration values dynamically using dot notation.

```typescript
console.log(defaultConfig.get("api.url")); // 'https://example.com'
console.log(defaultConfig.get("api.headers.authorization")); // 'Bearer token'
console.log(defaultConfig.get("features.flags.featureY")); // true
```

### Modifying Configuration Values

You can update configuration values dynamically, and the new values will be validated.

```typescript
defaultConfig.set("api.timeout", 6000); // Update timeout
defaultConfig.set("features.flags.featureX", true); // Enable featureX

// This will throw an error if the config value is invalid
try {
  defaultConfig.set("api.url", "invalid-url"); // Invalid URL
} catch (e) {
  console.error(e.message); // Config validation failed: Invalid input
}
```

### Retrieve the Entire Configuration

You can get the entire merged and validated configuration.

```typescript
console.log(DefaultConfig.getAll());
```

## API

### DefaultConfig<T>

#### Constructor

```typescript
constructor(schema: ZodSchema<T>, initialConfig: Partial<T>, defaultConfig: Partial<T>)
```

- schema: A Zod schema that defines the structure and validation rules for the configuration.
- initialConfig: An optional object with initial configuration values.
- defaultConfig: An optional object with default configuration values.

#### Methods

- get(key: string): any: Retrieve a configuration value by its dot-notated key.
- set(key: string, value: any): void: Set a configuration value dynamically using a dot-notated key.
- getAll(): T: Retrieve the entire current configuration.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or create an issue.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
