import { ClaudeAPIClient, generateWithRetry } from './utils/claude-api.js';

/**
 * Test script for Claude API wrapper
 * Note: Requires CLAUDE_API_KEY or ANTHROPIC_API_KEY environment variable
 */

async function testClaudeAPI() {
  console.log('Testing Claude API wrapper...\n');

  // Test 1: Basic generation
  console.log('Test 1: Basic generation');
  try {
    const client = new ClaudeAPIClient();
    const result = await client.generate('What is 2+2? Answer in 3 words.', {
      maxTokens: 100,
      temperature: 0.3,
    });
    console.log('Result:', result);
    console.log('✓ Test 1 passed\n');
  } catch (error) {
    console.error('✗ Test 1 failed:', error);
  }

  // Test 2: Generation with custom options
  console.log('Test 2: Generation with custom options');
  try {
    const client = new ClaudeAPIClient();
    const result = await client.generate('Write a haiku about programming.', {
      maxTokens: 200,
      temperature: 0.9,
    });
    console.log('Result:');
    console.log(result);
    console.log('✓ Test 2 passed\n');
  } catch (error) {
    console.error('✗ Test 2 failed:', error);
  }

  // Test 3: Generation with retry
  console.log('Test 3: Generation with retry');
  try {
    const client = new ClaudeAPIClient();
    const result = await generateWithRetry(
      client,
      'What are the benefits of using TypeScript?',
      {}, // empty options
      1  // maxRetries
    );
    console.log('Result:');
    console.log(result.substring(0, 200) + '...');
    console.log('✓ Test 3 passed\n');
  } catch (error) {
    console.error('✗ Test 3 failed:', error);
  }

  // Test 4: Error handling - missing API key
  console.log('Test 4: Error handling - missing API key');
  try {
    // Temporarily clear env vars
    const originalKey = process.env.CLAUDE_API_KEY;
    const originalAnthropicKey = process.env.ANTHROPIC_API_KEY;
    delete process.env.CLAUDE_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;

    try {
      const client = new ClaudeAPIClient();
      console.error('✗ Test 4 failed: Should have thrown error for missing API key');
    } catch (error) {
      if (error instanceof Error && error.message.includes('API key not found')) {
        console.log('Result: Correctly throws error for missing API key');
        console.log('✓ Test 4 passed\n');
      } else {
        console.error('✗ Test 4 failed: Wrong error message:', error);
      }
    } finally {
      // Restore env vars
      if (originalKey) process.env.CLAUDE_API_KEY = originalKey;
      if (originalAnthropicKey) process.env.ANTHROPIC_API_KEY = originalAnthropicKey;
    }
  } catch (error) {
    console.error('✗ Test 4 failed:', error);
  }

  console.log('\nAll tests completed!');
}

// Run tests
testClaudeAPI().catch(console.error);