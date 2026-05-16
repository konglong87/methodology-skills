/**
 * Remotion PNG渲染器
 * - 打包Remotion项目
 * - 渲染单帧PNG
 * - 支持动态config传入
 * - 支持横版(1920x1080)和竖版(1080x1920)输出
 * - 支持Retina 2x/3x渲染
 * - 支持质量预设 (draft/normal/professional)
 */

const { bundle } = require('@remotion/bundler');
const { renderStill, selectComposition } = require('@remotion/renderer');
const path = require('path');
const fs = require('fs');

/**
 * 质量预设配置
 */
const QUALITY_PRESETS = {
  draft: {
    label: '草稿',
    scale: 1,
    dpi: 72,
    description: '快速预览，低分辨率'
  },
  normal: {
    label: '标准',
    scale: 1,
    dpi: 150,
    description: '日常使用，平衡质量与速度'
  },
  professional: {
    label: '专业',
    scale: 2,
    dpi: 300,
    description: '高清输出，适合打印和发布'
  },
  retina: {
    label: 'Retina',
    scale: 3,
    dpi: 300,
    description: '超清输出，适合Retina显示屏'
  }
};

/**
 * 使用Remotion渲染信息图为PNG
 * @param {Object} config - 信息图配置对象
 * @param {string} outputPath - 输出PNG文件路径
 * @param {Object} options - 渲染选项
 * @param {string} options.quality - 质量预设 (draft|normal|professional|retina)
 * @param {number} options.scale - 自定义缩放比例 (覆盖quality设置)
 * @returns {Promise<{success: boolean, outputPath?: string, error?: string, scale?: number}>}
 */
async function renderWithRemotion(config, outputPath, options = {}) {
  const startTime = Date.now();

  try {
    console.log('[Remotion] 开始渲染流程...');

    // 解析质量设置
    const qualityName = options.quality || config.quality || 'normal';
    const qualityConfig = QUALITY_PRESETS[qualityName] || QUALITY_PRESETS.normal;
    const scale = options.scale !== undefined ? options.scale : qualityConfig.scale;

    console.log(`[Remotion] 质量预设: ${qualityConfig.label} (${qualityName})`);
    console.log(`[Remotion] 渲染缩放: ${scale}x`);

    // 验证输出路径
    if (!outputPath || typeof outputPath !== 'string') {
      throw new Error('输出路径不能为空');
    }

    // 确保输出目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 获取Remotion项目根目录
    const remotionDir = __dirname;

    console.log('[Remotion] 正在打包Remotion项目...');
    const bundled = await bundle({
      entryPoint: path.join(remotionDir, 'src', 'index.ts'),
      webpackConfiguration: (currentConfiguration) => {
        return currentConfiguration;
      },
    });

    console.log('[Remotion] 打包完成，准备渲染...');

    // 从config中获取目标尺寸（如果没有则使用默认值）
    const targetWidth = config.output_config?.width || 1920;
    const targetHeight = config.output_config?.height || 1080;
    const orientation = config.output_config?.orientation || 'horizontal';

    // 如果使用scale，实际输出分辨率会乘以scale
    const outputWidth = targetWidth * scale;
    const outputHeight = targetHeight * scale;
    console.log(`[Remotion] 目标尺寸: ${targetWidth}x${targetHeight} (${orientation})`);
    console.log(`[Remotion] 输出分辨率: ${outputWidth}x${outputHeight} (${scale}x缩放)`);

    // 根据尺寸选择正确的composition
    let compositionId = 'Infographic';
    if (targetHeight > targetWidth) {
      compositionId = 'Infographic-Portrait';
      console.log('[Remotion] 使用竖版Composition');
    } else {
      compositionId = 'Infographic-Landscape';
      console.log('[Remotion] 使用横版Composition');
    }

    // 选择composition并传入config作为inputProps
    const composition = await selectComposition({
      serveUrl: bundled,
      id: compositionId,
      inputProps: {
        config: config
      }
    });

    console.log('[Remotion] Composition已选择，开始渲染PNG...');

    // 渲染单帧PNG，支持scale参数实现Retina输出
    const renderOptions = {
      composition,
      serveUrl: bundled,
      output: outputPath,
      frame: 0,
      inputProps: {
        config: config
      },
      imageFormat: 'png',
      overwrite: true,
    };

    // 当scale > 1时添加缩放参数
    if (scale > 1) {
      renderOptions.scale = scale;
      console.log(`[Remotion] 启用${scale}x Retina渲染`);
    }

    await renderStill(renderOptions);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Remotion] 渲染完成！耗时: ${duration}秒`);
    console.log(`[Remotion] 输出文件: ${outputPath}`);

    // 验证文件是否生成
    if (!fs.existsSync(outputPath)) {
      throw new Error('渲染完成但文件未生成');
    }

    const stats = fs.statSync(outputPath);
    console.log(`[Remotion] 文件大小: ${(stats.size / 1024).toFixed(2)} KB`);

    return {
      success: true,
      outputPath: outputPath,
      duration: duration,
      size: stats.size,
      scale: scale,
      resolution: `${outputWidth}x${outputHeight}`
    };

  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`[Remotion] 渲染失败 (${duration}秒):`, error.message);

    return {
      success: false,
      error: error.message,
      duration: duration
    };
  }
}

/**
 * 测试渲染函数
 */
async function testRender() {
  const testConfig = {
    title: "MongoDB vs MySQL",
    subtitle: "数据库选择对比",
    template: "comparison",
    style: {
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      backgroundColor: "#F3F4F6"
    },
    content: {
      left_title: "MongoDB",
      right_title: "MySQL",
      left_items: [
        "文档型数据库，灵活的数据结构",
        "水平扩展能力强",
        "适合非结构化数据",
        "开发速度快，迭代灵活"
      ],
      right_items: [
        "关系型数据库，ACID事务支持",
        "成熟的生态系统",
        "适合复杂查询场景",
        "数据一致性保障强"
      ]
    }
  };

  const outputPath = path.join(__dirname, '..', 'test-remotion-output.png');

  console.log('开始测试Remotion渲染...');
  const result = await renderWithRemotion(testConfig, outputPath);

  if (result.success) {
    console.log('✅ 测试成功！');
    console.log(`输出文件: ${result.outputPath}`);
    console.log(`文件大小: ${(result.size / 1024).toFixed(2)} KB`);
  } else {
    console.log('❌ 测试失败！');
    console.log(`错误信息: ${result.error}`);
    process.exit(1);
  }
}

// 导出渲染函数
module.exports = { renderWithRemotion };

// 如果直接运行此文件，执行测试
if (require.main === module) {
  testRender().catch(console.error);
}