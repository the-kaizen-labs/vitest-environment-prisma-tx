# Contributing to vitest-environment-prisma-tx

Thank you for considering contributing to vitest-environment-prisma-tx! Whether you're fixing a typo, reporting a bug, or proposing a new feature, your contribution helps make database testing faster and easier for the entire Vitest and Prisma community. This is a small project maintained in limited time, and every contribution is genuinely appreciated.

## How You Can Contribute

Contributions come in many forms, and all of them are valued:

- **Report bugs** and suggest improvements
- **Improve documentation** (README, code comments, examples)
- **Answer questions** in GitHub issues
- **Review pull requests** from other contributors
- **Share your experience** using the library with the community

You don't need to write code to make a meaningful impact!

## Reporting Issues

Before creating a new issue, please:

1. **Search existing issues** (including closed ones) to avoid duplicates
2. **Check the [README](./README.md)** to ensure you've followed the setup correctly

When reporting a bug, please include:

- A **clear description** of the problem
- **Steps to reproduce** the issue with a minimal example
- **Expected behavior** vs. **actual behavior**
- **Version information**:
  - Node.js version (`node --version`)
  - Package version
  - Vitest version
  - Prisma version
  - Database adapter and version (e.g. `@prisma/adapter-pg`)
- **Error messages** or stack traces if applicable

The more details you provide, the easier it is to understand and fix the issue.

## 💻 Development Setup

### Prerequisites

- **Node.js**
- **pnpm** (this project uses pnpm, not npm or yarn)

### Installation

1. **Fork the repository** on GitHub

2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/vitest-environment-prisma-tx.git
   # then add the upstream remote (the-kaizen-labs/vitest-environment-prisma-tx)
   cd vitest-environment-prisma-tx
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

### Running Tests

```bash
pnpm test                      # Run all tests with coverage
pnpm test -- --watch           # Run tests in watch mode
```

All tests must pass before submitting a pull request.

### Code Quality Checks

This project uses [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) for formatting:

```bash
pnpm run lint                  # Check for linting issues
pnpm run format:check          # Check code formatting
pnpm run format                # Auto-format code
pnpm run typecheck             # Run TypeScript type checking
```

All checks must pass before submitting a pull request.

### Building

```bash
pnpm run build                 # Build the package
```

The build output will be in the `dist/` directory.

## Submitting Changes

### Before You Start

For **non-trivial changes** (new features, significant refactoring, architectural changes), please **open an issue first** to discuss your proposed changes. This helps:

- Avoid duplicate work
- Ensure the change aligns with the project's goals and scope
- Get early feedback on your approach
- Save your time if the change isn't a good fit

For **small fixes** (typos, small bug fixes, documentation improvements), feel free to submit a pull request directly.

### Creating a Pull Request

1. **Create a feature branch** from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**:
   - Write or update tests for your changes
   - Ensure all tests pass: `pnpm test`
   - Run code quality checks: `pnpm run lint && pnpm run format:check && pnpm run typecheck`
   - Update documentation if needed (README, code comments, etc.)

3. **Commit your changes** following our [commit message guidelines](#commit-message-guidelines)

4. **Push to your fork**:

   ```bash
   git push origin feat/your-feature-name
   ```

5. **Create a pull request** on GitHub with a descriptive title and description

6. **In your PR description**, include:
   - **What problem you're solving** or what feature you're adding
   - **How you solved it** (your approach)
   - **References to related issues** (e.g., "Fixes #123" or "Closes #456")
   - **Breaking changes** if any (and migration instructions)
   - **Screenshots or examples** if applicable

7. **Enable the checkbox** to allow maintainer edits so we can make minor adjustments if needed

### PR Review Process

- PRs are typically reviewed within a few days
- You may be asked to make changes - please respond to feedback constructively
- Once approved, your PR will be merged using "Squash and Merge"
- Your contribution will be included in the next release with automated changelog generation

## Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for changelog generation and versioning. If your PR contains a user-facing change (a feature, fix, or breaking change), add a changeset:

```bash
pnpm changeset
```

Pick the appropriate semver bump (`patch` / `minor` / `major`) and write a short summary that will land in the public changelog. Commit the generated file in `.changeset/` along with your PR.

Internal-only changes (refactors, tests, CI tweaks) don't need a changeset.

## Commit Message Guidelines

Commit messages are not parsed for releases (Changesets owns that), but please keep them readable:

- Use imperative mood: "add feature" not "added feature"
- Keep the summary line short and descriptive
- Add a body when the change needs context or migration notes

## Testing Guidelines

Every code contribution should include appropriate tests.

### Test Structure

- Tests are located in the `src/` directory alongside the source code
- Test files use the `.test.ts` extension (e.g., `index.test.ts`, `context.test.ts`)

### Writing Tests

- Use Vitest's testing APIs (`describe`, `it`, `expect`, etc.)
- Test both **success cases** and **failure cases**
- Ensure tests are **isolated** (don't depend on other tests or their execution order)
- Keep tests **focused** (one concept per test)
- Use **descriptive test names** that explain what is being tested

### Example

```ts
import { describe, it, expect } from 'vitest';

describe('MyFeature', () => {
  it('should handle valid input correctly', () => {
    // Test implementation
  });

  it('should throw error for invalid input', () => {
    expect(() => myFunction(invalidInput)).toThrow();
  });
});
```

## Getting Help

- **Usage questions?** Check the [README](./README.md) first
- **Found a bug?** [Open an issue](https://github.com/the-kaizen-labs/vitest-environment-prisma-tx/issues/new)
- **Want to discuss a feature?** [Open an issue](https://github.com/the-kaizen-labs/vitest-environment-prisma-tx/issues/new) for discussion
- **General questions?** Feel free to start a discussion or comment on relevant issues

## License

By contributing to vitest-environment-prisma-tx, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
