/**
 * Remotion PNG渲染器
 * - 打包Remotion项目
 * - 渲染单帧PNG
 * - 支持动态config传入
 * - 支持横版(1920x1080)和竖版(1080x1920)输出
 */

const { bundle } = require('@remotion/bundler');
const { renderStill, selectComposition } = require('@remotion/renderer');
const path = require('path');
const fs = require('fs');

/**
 * 使用Remotion渲染信息图为PNG
 * @param {Object} config - 信息图配置对象
 * @param {string} outputPath - 输出PNG文件路径
 * @returns {Promise<{success: boolean, outputPath?: string, error?: string}>}
 */
async function renderWithRemotion(config, outputPath) {
  const startTime = Date.now();

  try {
    console.log('[Remotion] 开始渲染流程...');
    console.log('[Remotion] 配置:', JSON.stringify(config, null, 2));

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

    console.log(`[Remotion] 目标尺寸: ${targetWidth}x${targetHeight} (${orientation})`);

    // 根据尺寸选择正确的composition
    let compositionId = 'Infographic'; // 默认
    if (targetHeight > targetWidth) {
      // 竖版 - 使用Portrait composition
      compositionId = 'Infographic-Portrait';
      console.log('[Remotion] 使用竖版Composition');
    } else {
      // 横版 - 使用Landscape composition
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

    // 渲染单帧PNG（使用renderStill而不是renderMedia）
    // 注意：不再需要手动传递width/height，因为composition已经定义了正确的尺寸
    await renderStill({
      composition,
      serveUrl: bundled,
      output: outputPath,
      frame: 0, // 渲染第0帧
      inputProps: {
        config: config
      },
      imageFormat: 'png',
      overwrite: true
    });

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
      size: stats.size
    };

  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`[Remotion] 渲染失败 (${duration}秒):`, error.message);
    console.error('[Remotion] 错误堆栈:', error.stack);

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