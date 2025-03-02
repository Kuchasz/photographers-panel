# Photographers Panel

This is a monorepo managed with pnpm workspaces.

## Setup

1. Install pnpm if you don't have it already:
   ```bash
   npm install -g pnpm
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Development

- Run all packages in watch mode:
  ```bash
  pnpm run watch
  ```

- Run a specific package:
  ```bash
  pnpm run watch --filter=@pp/web
  ```

- Build all packages:
  ```bash
  pnpm run build
  ```

- Build a specific package:
  ```bash
  pnpm run build --filter=@pp/web
  ```

## Adding dependencies

- Add a dependency to a specific package:
  ```bash
  pnpm add <package> --filter=@pp/<package-name>
  ```

- Add a dependency to all packages:
  ```bash
  pnpm add <package> -w
  ```

- Add a workspace package as a dependency:
  ```bash
  pnpm add @pp/<package-name> --filter=@pp/<target-package> --workspace
  ```

## Migration from npm

If you're migrating from npm, run the migration script:
```bash
./migrate-to-pnpm.sh
```
