import Anthropic from '@anthropic-ai/sdk';

export interface GenerateOptions {
  maxTokens?: number;
  temperature?: number;
}

/**
 * Claude API client wrapper for WeChat Article Writer
 * Provides simplified interface for calling Claude API with robust error handling
 */
export class ClaudeAPIClient {
  private client: Anthropic;

  /**
   * Create Claude API client
   * @param apiKey Optional API key (falls back to env vars: CLAUDE_API_KEY or ANTHROPIC_API_KEY)
   * @throws Error if no API key found
   */
  constructor(apiKey?: string) {
    const key = apiKey || process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;

    if (!key) {
      throw new Error(
        'Claude API key not found. Provide apiKey parameter or set CLAUDE_API_KEY or ANTHROPIC_API_KEY environment variable.'
      );
    }

    this.client = new Anthropic({ apiKey: key });
  }

  /**
   * Generate text using Claude API
   * @param prompt User prompt to send to Claude
   * @param options Generation options (maxTokens, temperature)
   * @returns Generated text content
   * @throws Error if API call fails
   */
  async generate(prompt: string, options: GenerateOptions = {}): Promise<string> {
    const { maxTokens = 4096, temperature = 0.7 } = options;

    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        temperature,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Extract text content from response
      const textContent = response.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('');

      return textContent;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Claude API error: ${error.message}`);
      }
      throw new Error(`Claude API error: ${String(error)}`);
    }
  }
}

/**
 * Check if an error is retryable
 * @param error Error to check
 * @returns true if error is retryable, false otherwise
 */
function isRetryableError(error: unknown): boolean {
  // Network errors (no status code)
  if (error instanceof Error && !('status' in error)) {
    return true;
  }

  // Check status code if available
  const errorWithStatus = error as { status?: number };
  const status = errorWithStatus.status;

  if (typeof status === 'number') {
    // Retry: 5xx server errors, 429 rate limit
    return status >= 500 || status === 429;
  }

  // Default to not retrying unknown error types
  return false;
}

/**
 * Generate text with automatic retry on failure
 * @param client ClaudeAPIClient instance
 * @param prompt User prompt to send to Claude
 * @param options Generation options (maxTokens, temperature)
 * @param maxRetries Maximum retry attempts (default: 1)
 * @returns Generated text content
 * @throws Error if all retry attempts fail
 */
export async function generateWithRetry(
  client: ClaudeAPIClient,
  prompt: string,
  options: GenerateOptions = {},
  maxRetries: number = 1
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt}/${maxRetries}...`);
      }

      const result = await client.generate(prompt, options);
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      console.warn(
        `Generation attempt ${attempt + 1}/${maxRetries + 1} failed:`,
        lastError.message
      );

      // Don't retry on non-retryable errors
      if (!isRetryableError(error)) {
        console.warn('Error is not retryable, aborting...');
        break;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff with jitter: wait 1s, 2s, 4s, ...
      const baseBackoffMs = Math.pow(2, attempt) * 1000;
      const jitterMs = Math.random() * 500; // Add up to 500ms jitter
      const backoffMs = baseBackoffMs + jitterMs;
      console.log(`Waiting ${backoffMs.toFixed(0)}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  throw new Error(
    `Failed after ${maxRetries + 1} attempts. Last error: ${lastError?.message || 'Unknown error'}`
  );
}