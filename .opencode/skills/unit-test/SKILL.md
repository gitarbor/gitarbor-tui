---
name: unit-test
description: Create comprehensive unit tests using Bun's test runner. Use when the user asks to create or fix unit tests or create test files.
compatibility: Requires Bun runtime for test execution
metadata:
  author: restman
  version: "1.0"
  category: testing
---

## When to use this skill

Use this skill when:
- User asks to create or write unit tests
- User mentions testing, test coverage, or Bun test
- User wants to test specific functions, modules, or components
- User asks to add test files or improve test coverage
- User mentions test frameworks, mocking, or assertions

## What this skill does

This skill provides expertise in creating comprehensive, well-structured unit tests using Bun's built-in testing framework. It covers test file creation, Bun test features, best practices, and RestMan-specific testing guidelines.

## Core capabilities

### 1. Test File Creation
- Create test files with proper naming conventions: `*.test.ts`, `*_test.ts`, `*.spec.ts`, `*_spec.ts`
- Use TypeScript with proper types from `bun:test`
- Follow the project's code style guidelines (single quotes, camelCase, etc.)

### 2. Bun Test Framework Features

**Basic Testing**
```typescript
import { test, expect, describe } from 'bun:test';

describe('feature name', () => {
  test('should do something', () => {
    expect(result).toBe(expected);
  });
});
```

**Lifecycle Hooks**
- `beforeAll` - Setup before all tests
- `beforeEach` - Setup before each test
- `afterEach` - Cleanup after each test
- `afterAll` - Cleanup after all tests

**Mocking**
```typescript
import { test, expect, mock } from 'bun:test';

const mockFn = mock(() => 'mocked value');
// or
const mockFn = jest.fn(() => 'mocked value');
```

**Snapshot Testing**
```typescript
test('snapshot', () => {
  expect(data).toMatchSnapshot();
});
```

**Concurrent Testing**
```typescript
test.concurrent('async test 1', async () => {
  // runs in parallel
});

test.serial('sequential test', () => {
  // runs sequentially even with --concurrent flag
});
```

### 3. Test Organization Best Practices
- Group related tests with `describe` blocks
- Use descriptive test names that explain behavior
- Follow AAA pattern: Arrange, Act, Assert
- Test edge cases and error conditions
- Use `beforeEach`/`afterEach` for test isolation
- Mock external dependencies and side effects

### 4. RestMan-Specific Testing Guidelines

When testing RestMan code:
- Follow TypeScript strict mode requirements
- Handle `noUncheckedIndexedAccess: true` (indexed access can be undefined)
- Use async/await for asynchronous operations
- Mock file system operations (fs/promises)
- Mock terminal UI components when testing business logic
- Test error handling with `instanceof Error` checks
- Use proper types from the codebase

### 5. Running Tests

Available test commands:
- `bun test` - Run all tests
- `bun test <filter>` - Run tests matching filter
- `bun test --watch` - Watch mode
- `bun test --coverage` - Generate coverage report
- `bun test --timeout 20` - Set timeout (default 5000ms)
- `bun test --bail` - Exit after first failure
- `bun test --update-snapshots` - Update snapshots

## Workflow

When asked to create tests:

1. **Understand the code** - Read and analyze the source file to test
2. **Identify test scenarios** - Determine what needs to be tested:
   - Happy path functionality
   - Edge cases
   - Error conditions
   - Async behavior
   - Side effects (mocking needed)
3. **Create test file** - Use proper naming convention matching source file
4. **Write comprehensive tests** - Cover identified scenarios
5. **Follow project conventions** - Match RestMan code style
6. **Run tests** - Execute with `bun test` to verify they pass
7. **Report results** - Explain what was tested and any issues found

## Key principles

- **Test behavior, not implementation** - Focus on what the code does, not how
- **Keep tests simple and readable** - Tests are documentation
- **One assertion per test when possible** - Makes failures clear
- **Mock external dependencies** - File I/O, network, terminal UI
- **Test edge cases** - null, undefined, empty arrays, errors
- **Maintain test isolation** - Tests should not depend on each other
- **Use descriptive names** - Test names should read like documentation

## Example test structure

See [test structure reference](references/EXAMPLE.md) for detailed examples.

## Remember

- Always ask clarifying questions if the testing scope is unclear
- Suggest additional test scenarios if you identify gaps
- Follow RestMan's code style guidelines strictly
- Use TypeScript types properly
- Mock side effects appropriately
- Run tests after creating them to ensure they pass
- Be proactive about testing edge cases and error conditions
