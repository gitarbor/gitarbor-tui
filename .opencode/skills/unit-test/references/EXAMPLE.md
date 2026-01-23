# Example Test Structure

This document provides detailed examples of well-structured Bun tests for RestMan.

## Basic Test Structure

```typescript
import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test';
import { functionToTest } from './module';

describe('Module: functionToTest', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('happy path', () => {
    test('should return expected result with valid input', () => {
      const result = functionToTest('valid input');
      expect(result).toBe('expected output');
    });
  });

  describe('edge cases', () => {
    test('should handle empty string', () => {
      const result = functionToTest('');
      expect(result).toBe('');
    });

    test('should handle null', () => {
      const result = functionToTest(null);
      expect(result).toBeNull();
    });
  });

  describe('error handling', () => {
    test('should throw error for invalid input', () => {
      expect(() => functionToTest('invalid')).toThrow('Expected error message');
    });
  });
});
```

## Testing Async Functions

```typescript
import { describe, test, expect } from 'bun:test';
import { fetchData } from './api';

describe('API: fetchData', () => {
  test('should fetch data successfully', async () => {
    const result = await fetchData();
    expect(result).toBeDefined();
    expect(result.status).toBe('success');
  });

  test('should handle errors gracefully', async () => {
    await expect(fetchData('invalid-id')).rejects.toThrow();
  });
});
```

## Testing with Mocks

```typescript
import { describe, test, expect, mock, beforeEach } from 'bun:test';
import * as fs from 'fs/promises';

describe('File operations', () => {
  let mockReadFile: any;

  beforeEach(() => {
    mockReadFile = mock(() => Promise.resolve('{"data": "test"}'));
    fs.readFile = mockReadFile;
  });

  test('should read and parse file', async () => {
    const result = await loadConfig();
    
    expect(mockReadFile).toHaveBeenCalledTimes(1);
    expect(result.data).toBe('test');
  });
});
```

## Testing with Setup and Teardown

```typescript
import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'bun:test';

describe('Database operations', () => {
  let db: Database;

  beforeAll(() => {
    // One-time setup for all tests
    db = new Database(':memory:');
  });

  afterAll(() => {
    // One-time cleanup after all tests
    db.close();
  });

  beforeEach(() => {
    // Reset state before each test
    db.exec('DELETE FROM users');
  });

  test('should insert user', () => {
    const user = { name: 'Test', email: 'test@example.com' };
    db.insertUser(user);
    
    const result = db.getUser(1);
    expect(result.name).toBe('Test');
  });
});
```

## Testing RestMan Components

```typescript
import { describe, test, expect, mock } from 'bun:test';
import { substituteVariables } from './variables';

describe('Variables: substituteVariables', () => {
  test('should substitute single variable', () => {
    const text = 'Hello {{NAME}}';
    const variables = { NAME: 'World' };
    
    const result = substituteVariables(text, variables);
    
    expect(result).toBe('Hello World');
  });

  test('should substitute multiple variables', () => {
    const text = '{{METHOD}} {{URL}}';
    const variables = { METHOD: 'GET', URL: 'https://api.example.com' };
    
    const result = substituteVariables(text, variables);
    
    expect(result).toBe('GET https://api.example.com');
  });

  test('should keep placeholder if variable not found', () => {
    const text = 'Hello {{UNKNOWN}}';
    const variables = { NAME: 'World' };
    
    const result = substituteVariables(text, variables);
    
    expect(result).toBe('Hello {{UNKNOWN}}');
  });

  test('should trim whitespace from variable names', () => {
    const text = 'Hello {{ NAME }}';
    const variables = { NAME: 'World' };
    
    const result = substituteVariables(text, variables);
    
    expect(result).toBe('Hello World');
  });

  test('should handle empty text', () => {
    const result = substituteVariables('', {});
    expect(result).toBe('');
  });

  test('should handle empty variables object', () => {
    const text = 'Hello {{NAME}}';
    const result = substituteVariables(text, {});
    expect(result).toBe('Hello {{NAME}}');
  });
});
```

## Testing Error Handling

```typescript
import { describe, test, expect } from 'bun:test';
import { parseJSON } from './parser';

describe('Parser: parseJSON', () => {
  test('should parse valid JSON', () => {
    const result = parseJSON('{"key": "value"}');
    expect(result).toEqual({ key: 'value' });
  });

  test('should throw error for invalid JSON', () => {
    expect(() => parseJSON('invalid')).toThrow();
  });

  test('should return default value on error', () => {
    const result = parseJSONSafe('invalid', { default: true });
    expect(result).toEqual({ default: true });
  });

  test('should handle Error instance checks', () => {
    try {
      parseJSON('invalid');
    } catch (error) {
      expect(error instanceof Error).toBe(true);
      if (error instanceof Error) {
        expect(error.message).toContain('JSON');
      }
    }
  });
});
```
