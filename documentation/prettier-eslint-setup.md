# Prettier and ESLint Setup

This document describes the Prettier and ESLint configuration for the project, including auto-formatting on save in VSCode.

## Overview

The project uses:

- **Prettier** for code formatting
- **ESLint** for code linting and quality checks
- **VSCode settings** for automatic formatting on save

## Installed Packages

### ESLint Dependencies

- `eslint` - Core ESLint package
- `@eslint/js` - ESLint JavaScript configurations
- `@typescript-eslint/parser` - TypeScript parser for ESLint
- `@typescript-eslint/eslint-plugin` - TypeScript-specific linting rules
- `eslint-plugin-react` - React-specific linting rules
- `eslint-plugin-react-hooks` - Rules for React Hooks
- `eslint-plugin-react-refresh` - Rules for React Fast Refresh
- `eslint-config-prettier` - Disables ESLint rules that conflict with Prettier

### Prettier Dependencies

- `prettier` - Core Prettier package

## Configuration Files

### ESLint Configuration (`eslint.config.js`)

The ESLint configuration extends the TanStack config and includes:

- TypeScript support with strict type checking
- React and React Hooks rules
- React Refresh rules for development
- Prettier compatibility (no conflicting rules)
- Custom rules for unused variables (allows `_` prefix)

Key features:

- Validates `.ts` and `.tsx` files
- Detects React version automatically
- Ignores build outputs and generated files

### Prettier Configuration (`prettier.config.js`)

Prettier is configured with:

- `semi: false` - No semicolons
- `singleQuote: true` - Use single quotes
- `trailingComma: 'all'` - Trailing commas everywhere
- `tabWidth: 2` - 2 spaces for indentation
- `printWidth: 80` - Line width of 80 characters
- `arrowParens: 'always'` - Always include parentheses around arrow function parameters
- `endOfLine: 'lf'` - Unix-style line endings

### VSCode Settings (`.vscode/settings.json`)

VSCode is configured to:

- **Format on save** - Automatically format files when saving
- **Use Prettier as default formatter** - For TypeScript, JavaScript, and React files
- **Run ESLint fixes on save** - Automatically fix ESLint issues when possible
- **Validate ESLint** - For JavaScript, TypeScript, and React files

## Usage

### Manual Formatting

Format all files:

```bash
pnpm prettier --write .
```

Format specific file:

```bash
pnpm prettier --write path/to/file.tsx
```

### Manual Linting

Lint all files:

```bash
pnpm eslint .
```

Lint specific file:

```bash
pnpm eslint path/to/file.tsx
```

Auto-fix ESLint issues:

```bash
pnpm eslint --fix .
```

### Combined Check and Fix

Run both Prettier and ESLint with auto-fix:

```bash
pnpm check
```

This command:

1. Formats all files with Prettier
2. Fixes all auto-fixable ESLint issues

## Auto-Format on Save

When you save a `.ts`, `.tsx`, `.js`, or `.jsx` file in VSCode:

1. **Prettier** will automatically format the file
2. **ESLint** will automatically fix any auto-fixable issues

This ensures consistent code style across the project without manual intervention.

## VSCode Extension Requirements

To use auto-format on save, you need these VSCode extensions:

- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)

## Ignored Files

The following files and directories are ignored by Prettier (`.prettierignore`):

- Lock files (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`)
- `node_modules`
- Build outputs (`dist`, `.output`, `build`, `coverage`)
- Generated files (`routeTree.gen.ts`)
- Config files (`*.config.js`, `*.config.ts`, etc.)
- IDE directories (`.git`, `.vscode`, `.idea`)

ESLint also ignores similar patterns as defined in `eslint.config.js`.

## Troubleshooting

### Format on save not working

1. Ensure you have the Prettier VSCode extension installed
2. Check that `.vscode/settings.json` has `"editor.formatOnSave": true`
3. Verify the file type is configured for Prettier formatting
4. Reload VSCode window

### ESLint not fixing on save

1. Ensure you have the ESLint VSCode extension installed
2. Check that `.vscode/settings.json` has the `editor.codeActionsOnSave` configuration
3. Verify ESLint is validating your file type
4. Check the ESLint output panel for errors

### Conflicts between Prettier and ESLint

The `eslint-config-prettier` package is included to disable any ESLint rules that conflict with Prettier. If you encounter conflicts:

1. Ensure `eslint-config-prettier` is the last item in the ESLint config
2. Check that you're using compatible versions of all packages
3. Run `pnpm check` to see if there are any issues

## Best Practices

1. **Commit formatted code** - Always ensure code is formatted before committing
2. **Use the check command** - Run `pnpm check` before pushing changes
3. **Don't disable rules without reason** - If you need to disable a rule, document why
4. **Keep extensions updated** - Regularly update VSCode extensions for best compatibility
