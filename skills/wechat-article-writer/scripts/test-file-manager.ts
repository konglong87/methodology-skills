import * as fs from 'fs';
import * as path from 'path';
import {
  generateSlug,
  createOutputDir,
  saveWithBackup,
  ensureDir,
} from './utils/file-manager';

// Test directory
const TEST_DIR = path.join(__dirname, 'test-output');

console.log('🧪 Testing file-manager.ts\n');

// Test 1: generateSlug
console.log('Test 1: generateSlug');
const testCases = [
  { input: 'AI工具推荐', expected: 'ai工具推荐' },
  { input: '如何提高工作效率', expected: '如何提高工作效率' },
  { input: 'Effective Time Management', expected: 'effective-time-management' },
  { input: 'Python Programming for Beginners', expected: 'python-programming-for-beginners' },
  { input: 'AI Tools For Productivity', expected: 'ai-tools-for-productivity' },
];

testCases.forEach(({ input, expected }) => {
  const result = generateSlug(input);
  const status = result === expected ? '✓' : '✗';
  console.log(`  ${status} "${input}" → "${result}" (expected: "${expected}")`);
});
console.log();

// Test 2: createOutputDir
console.log('Test 2: createOutputDir');
const slug = 'test-article';
const outputPath1 = createOutputDir(TEST_DIR, slug);
console.log(`  ✓ Created: ${outputPath1}`);

// Test conflict resolution - should create new directory with timestamp
const outputPath2 = createOutputDir(TEST_DIR, slug);
console.log(`  ✓ Created with conflict resolution: ${outputPath2}`);

if (path.dirname(outputPath1) === path.dirname(outputPath2) && path.basename(outputPath1) !== path.basename(outputPath2)) {
  console.log(`  ✓ Conflict resolution works correctly`);
} else {
  console.log(`  ✗ Conflict resolution failed`);
}
console.log();

// Test 3: saveWithBackup
console.log('Test 3: saveWithBackup');
const testFile = path.join(outputPath1, 'test.md');
const content1 = '# Version 1\nThis is the first version.';
saveWithBackup(testFile, content1);
console.log(`  ✓ Saved initial file: ${testFile}`);

const backupFiles = fs.readdirSync(outputPath1).filter(f => f.includes('backup'));
if (backupFiles.length === 0) {
  console.log(`  ✓ No backup created for first save`);
} else {
  console.log(`  ✗ Unexpected backup created: ${backupFiles}`);
}

const content2 = '# Version 2\nThis is the second version.';
saveWithBackup(testFile, content2);
const backupFilesAfter = fs.readdirSync(outputPath1).filter(f => f.includes('backup'));
if (backupFilesAfter.length === 1) {
  console.log(`  ✓ Backup created on second save: ${backupFilesAfter[0]}`);
} else {
  console.log(`  ✗ Backup creation failed: ${backupFilesAfter}`);
}

// Verify content
const savedContent = fs.readFileSync(testFile, 'utf-8');
if (savedContent === content2) {
  console.log(`  ✓ Content saved correctly`);
} else {
  console.log(`  ✗ Content mismatch`);
}
console.log();

// Test 4: ensureDir
console.log('Test 4: ensureDir');
const nestedDir = path.join(TEST_DIR, 'nested', 'deep', 'directory');
ensureDir(nestedDir);
if (fs.existsSync(nestedDir)) {
  console.log(`  ✓ Created nested directory: ${nestedDir}`);
} else {
  console.log(`  ✗ Failed to create nested directory`);
}
console.log();

console.log('✅ All tests completed!');
console.log(`Test output directory: ${TEST_DIR}`);