import * as fs from 'fs';
import * as path from 'path';

/**
 * Generate a slug from Chinese or English text
 * Extracts 2-4 keywords and converts to kebab-case
 * @param text Input text (Chinese or English)
 * @returns kebab-case slug (lowercase, 2-4 words)
 * @example "AI tools recommendation" → "ai-tools-recommendation"
 * @example "Improve work efficiency" → "improve-work-efficiency"
 * @example "" → "untitled-20260313"
 * @note For Chinese text, the function splits by spaces. For proper Chinese segmentation, consider using a dedicated library.
 */
export function generateSlug(text: string): string {
  try {
    // Handle empty input with fallback
    if (!text || text.trim().length === 0) {
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      return `untitled-${dateStr}`;
    }

    // Remove punctuation and special characters, but keep Chinese characters
    const cleanedText = text.replace(/[^\w\s\u4e00-\u9fa5]/g, ' ').trim();

    // Handle case where cleaning results in empty string
    if (cleanedText.length === 0) {
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      return `untitled-${dateStr}`;
    }

    // Split by spaces or common Chinese delimiters
    const words = cleanedText.split(/\s+/).filter(word => word.length > 0);

    // Handle case where no words found after split
    if (words.length === 0) {
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      return `untitled-${dateStr}`;
    }

    // Take first 2-4 words
    const selectedWords = words.slice(0, Math.min(4, Math.max(2, words.length)));

    // Convert to lowercase and join with hyphens
    const slug = selectedWords
      .map(word => word.toLowerCase())
      .join('-');

    // Clean up multiple hyphens and leading/trailing hyphens
    return slug.replace(/-+/g, '-').replace(/^-|-$/g, '');
  } catch (error) {
    // Fallback slug if any error occurs
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    return `untitled-${dateStr}`;
  }
}

/**
 * Generate timestamp in format YYYYMMDD-HHMMSS
 * @returns timestamp string
 * @example "20260313-143022"
 */
function generateTimestamp(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

/**
 * Create output directory with conflict resolution
 * If directory exists, append timestamp: {slug}-YYYYMMDD-HHMMSS
 * @param basePath Base path for output directory
 * @param slug Directory name (kebab-case)
 * @returns Created directory path
 * @throws Error if directory creation fails
 */
export function createOutputDir(basePath: string, slug: string): string {
  try {
    let outputPath = path.join(basePath, slug);

    // Conflict resolution: if directory exists, append timestamp
    if (fs.existsSync(outputPath)) {
      const timestamp = generateTimestamp();
      outputPath = path.join(basePath, `${slug}-${timestamp}`);
    }

    // Create directory recursively with error handling
    try {
      fs.mkdirSync(outputPath, { recursive: true });
    } catch (error) {
      // Handle race condition: directory might have been created by another process
      if (error instanceof Error && (error as any).code === 'EEXIST') {
        // Directory exists, which is fine
        return outputPath;
      }
      throw new Error(`Failed to create directory ${outputPath}: ${error instanceof Error ? error.message : String(error)}`);
    }

    return outputPath;
  } catch (error) {
    throw new Error(`Failed to create output directory: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Save file with backup
 * If file exists, rename to {file}-backup-YYYYMMDD-HHMMSS{ext}
 * Then write new content
 * @param filePath Full path to the file
 * @param content Content to write
 * @throws Error if file save fails
 * @note Uses temp file pattern to prevent data loss on write failure
 */
export function saveWithBackup(filePath: string, content: string): void {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    ensureDir(dir);

    // Write to temp file first to prevent data loss if write fails
    const parsed = path.parse(filePath);
    const timestamp = generateTimestamp();
    const tempPath = path.join(dir, `${parsed.name}.tmp-${timestamp}${parsed.ext}`);

    try {
      fs.writeFileSync(tempPath, content, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to write temp file ${tempPath}: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Backup existing file if it exists
    if (fs.existsSync(filePath)) {
      const backupPath = path.join(dir, `${parsed.name}-backup-${timestamp}${parsed.ext}`);

      try {
        fs.renameSync(filePath, backupPath);
      } catch (error) {
        // Clean up temp file if backup fails
        try {
          fs.unlinkSync(tempPath);
        } catch (cleanupError) {
          // Ignore cleanup errors, we're already in a failure state
        }
        throw new Error(`Failed to backup file ${filePath} to ${backupPath}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // Rename temp file to target file
    try {
      fs.renameSync(tempPath, filePath);
    } catch (error) {
      // If rename fails, try to clean up temp file
      try {
        fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
      throw new Error(`Failed to rename temp file ${tempPath} to ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  } catch (error) {
    throw new Error(`Failed to save file with backup: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Create directory recursively if it doesn't exist
 * @param dirPath Directory path to create
 * @throws Error if directory creation fails
 */
export function ensureDir(dirPath: string): void {
  try {
    // Try to create directory directly to avoid TOCTOU race condition
    try {
      fs.mkdirSync(dirPath, { recursive: true });
    } catch (error) {
      // Handle race condition: directory might have been created by another process
      if (error instanceof Error && (error as any).code === 'EEXIST') {
        // Directory exists, which is fine - but verify it's actually a directory
        const stats = fs.statSync(dirPath);
        if (!stats.isDirectory()) {
          throw new Error(`Path ${dirPath} exists but is not a directory`);
        }
        return;
      }
      throw new Error(`Failed to create directory ${dirPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  } catch (error) {
    throw new Error(`Failed to ensure directory exists: ${error instanceof Error ? error.message : String(error)}`);
  }
}