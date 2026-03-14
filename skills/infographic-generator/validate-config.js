#!/usr/bin/env node

/**
 * 信息图配置验证工具
 * 用于验证 JSON 配置文件是否符合模板数据结构规范
 */

const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * 验证 Knowledge 模板配置
 */
function validateKnowledgeConfig(config) {
  const errors = [];
  const warnings = [];

  // 检查必需字段
  if (!config.content.title) {
    errors.push('缺少必需字段: content.title');
  }

  if (!config.content.items || !Array.isArray(config.content.items)) {
    errors.push('缺少必需字段: content.items (数组)');
  } else {
    // 检查 items 数量
    if (config.content.items.length < 2) {
      errors.push('items 数量太少，至少需要 2 个要点');
    }
    if (config.content.items.length > 6) {
      warnings.push('items 数量过多，建议 2-6 个要点');
    }

    // 检查每个 item
    config.content.items.forEach((item, index) => {
      if (!item.title) {
        errors.push(`items[${index}] 缺少必需字段: title`);
      }
      if (!item.description) {
        errors.push(`items[${index}] 缺少必需字段: description`);
      }
    });
  }

  return { errors, warnings };
}

/**
 * 验证 Comparison 模板配置
 */
function validateComparisonConfig(config) {
  const errors = [];
  const warnings = [];

  // 检查必需字段
  if (!config.content.title) {
    errors.push('缺少必需字段: content.title');
  }

  // 检查左侧
  if (!config.content.left_title) {
    errors.push('缺少必需字段: content.left_title');
  }
  if (!config.content.left_icon) {
    warnings.push('缺少字段: content.left_icon (建议添加)');
  }
  if (!config.content.left_items || !Array.isArray(config.content.left_items)) {
    errors.push('缺少必需字段: content.left_items (数组)');
  } else {
    config.content.left_items.forEach((item, index) => {
      if (!item.label) {
        errors.push(`left_items[${index}] 缺少必需字段: label`);
      }
      if (!item.value) {
        errors.push(`left_items[${index}] 缺少必需字段: value`);
      }
    });
  }

  // 检查右侧
  if (!config.content.right_title) {
    errors.push('缺少必需字段: content.right_title');
  }
  if (!config.content.right_icon) {
    warnings.push('缺少字段: content.right_icon (建议添加)');
  }
  if (!config.content.right_items || !Array.isArray(config.content.right_items)) {
    errors.push('缺少必需字段: content.right_items (数组)');
  } else {
    config.content.right_items.forEach((item, index) => {
      if (!item.label) {
        errors.push(`right_items[${index}] 缺少必需字段: label`);
      }
      if (!item.value) {
        errors.push(`right_items[${index}] 缺少必需字段: value`);
      }
    });
  }

  return { errors, warnings };
}

/**
 * 主验证函数
 */
function validateConfig(configPath) {
  log('\n🔍 验证配置文件...', 'blue');
  log(`文件: ${configPath}\n`, 'blue');

  // 读取配置文件
  let config;
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(content);
  } catch (error) {
    log('❌ 无法读取或解析配置文件', 'red');
    log(`错误: ${error.message}`, 'red');
    return false;
  }

  // 检查模板类型
  const template = config.template;
  if (!template) {
    log('❌ 缺少必需字段: template', 'red');
    return false;
  }

  log(`模板类型: ${template}`, 'blue');

  // 根据模板类型验证
  let result;
  switch (template) {
    case 'knowledge':
      result = validateKnowledgeConfig(config);
      break;
    case 'comparison':
      result = validateComparisonConfig(config);
      break;
    case 'xiaohongshu':
      result = validateKnowledgeConfig(config); // Xiaohongshu 使用相同结构
      break;
    case 'process':
      log('⚠️  Process 模板已废弃，请使用 Knowledge 模板代替', 'yellow');
      return false;
    default:
      log(`❌ 未知的模板类型: ${template}`, 'red');
      return false;
  }

  // 输出验证结果
  if (result.errors.length > 0) {
    log('\n❌ 发现错误:', 'red');
    result.errors.forEach(error => {
      log(`  - ${error}`, 'red');
    });
  }

  if (result.warnings.length > 0) {
    log('\n⚠️  警告:', 'yellow');
    result.warnings.forEach(warning => {
      log(`  - ${warning}`, 'yellow');
    });
  }

  if (result.errors.length === 0) {
    log('\n✅ 配置验证通过！', 'green');

    // 额外建议
    log('\n💡 建议:', 'blue');
    if (template === 'comparison') {
      log('  - Comparison 模板仅支持两个对象的对比', 'blue');
      log('  - 如需对比三个或更多对象，请使用 Knowledge 模板', 'blue');
    }
    log('  - 使用以下命令生成 PNG:', 'blue');
    log(`    node skill-render.js ${configPath} --use-config\n`, 'blue');

    return true;
  } else {
    log('\n❌ 配置验证失败！请修复上述错误。', 'red');
    return false;
  }
}

// 命令行使用
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('使用方法:');
    console.log('  node validate-config.js <config.json>');
    console.log('');
    console.log('示例:');
    console.log('  node validate-config.js config/knowledge.json');
    process.exit(1);
  }

  const configPath = args[0];
  const success = validateConfig(configPath);
  process.exit(success ? 0 : 1);
}

module.exports = { validateConfig };