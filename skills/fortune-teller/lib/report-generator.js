/**
 * 报告生成模块
 * 负责生成命理分析报告
 */

class ReportGenerator {
  /**
   * 生成命理分析报告
   */
  generateReport(name, input, panpai, analysis) {
    const sections = [
      this.generateBasicInfo(name, input),
      this.generateBaziSection(panpai.bazi),
      this.generateZiweiSection(panpai.ziwei),
      this.generateMengpaiSection(panpai.mengpai),
      this.generateNanbeipaiSection(panpai.nanbeipai),
      this.generateEraSection(analysis.eraBackground),
      this.generateDisclaimer()
    ];

    return sections.join('\n\n');
  }

  /**
   * 基础信息
   */
  generateBasicInfo(name, input) {
    return `## 一、基础信息

- 姓名：${name}
- 性别：${input.gender}
- 出生日期：${input.solarDate.year}年${input.solarDate.month}月${input.solarDate.day}日
- 出生地：${input.location || '未提供'}
- 真太阳时：${input.trueSolarTime.hour}时${input.trueSolarTime.minute}分`;
  }

  /**
   * 八字命理
   */
  generateBaziSection(bazi) {
    return `## 二、八字命理

### 四柱
- 年柱：${bazi.year}（${bazi.nayin?.year || '未知'}）
- 月柱：${bazi.month}
- 日柱：${bazi.day}（${bazi.nayin?.day || '未知'}）
- 时柱：${bazi.hour}

### 日主信息
- 日主：${bazi.dayMaster}（${bazi.dayMasterYinyang}${bazi.dayMasterWuxing}）
- 日主强弱：${bazi.strength?.strength || '待分析'}
- 分析：${bazi.strength?.note || '需综合月令判断'}

### 五行分布
- 木：${bazi.wuxingDistribution?.木 || 0}个
- 火：${bazi.wuxingDistribution?.火 || 0}个
- 土：${bazi.wuxingDistribution?.土 || 0}个
- 金：${bazi.wuxingDistribution?.金 || 0}个
- 水：${bazi.wuxingDistribution?.水 || 0}个

### 大运
${bazi.dayun?.slice(0, 5).map(d => `- ${d.gan}${d.zhi}（${d.startAge}-${d.endAge}岁）`).join('\n') || '暂无'}

### 纳音
- 年柱：${bazi.nayin?.year || '未知'}
- 月柱：${bazi.nayin?.month || '未知'}
- 日柱：${bazi.nayin?.day || '未知'}
- 时柱：${bazi.nayin?.hour || '未知'}`;
  }

  /**
   * 紫微斗数
   */
  generateZiweiSection(ziwei) {
    const gongweiList = [
      '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
      '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
    ];

    return `## 三、紫微斗数

### 基本信息
- 命宫地支：${ziwei.mingGongZhi}
- 命宫宫位：${ziwei.mingGongIndex + 1}宫

### 四化飞星
- 禄：${ziwei.sihua?.lu || '无'}
- 权：${ziwei.sihua?.quan || '无'}
- 科：${ziwei.sihua?.ke || '无'}
- 忌：${ziwei.sihua?.ji || '无'}

### 十二宫位主星
${gongweiList.map(g => {
  const data = ziwei.gongwei?.[g];
  return `- ${g}：${data?.mainStar || '无主星'}`;
}).join('\n')}

### 大运
${ziwei.dayun?.slice(0, 5).map(d => `- 第${d.index}步大运：${d.gong}（${d.startAge}-${d.endAge}岁）`).join('\n') || '暂无'}`;
  }

  /**
   * 盲派分析
   */
  generateMengpaiSection(mengpai) {
    return `## 四、盲派分析

### 调候（寒热燥湿）
- 季节：${mengpai.tiaohou?.season || '未知'}
- 季节特性：${mengpai.tiaohou?.seasonNature?.name || '未知'}
- 调候用神：${mengpai.tiaohou?.tiaohouYongshen?.join('、') || '待定'}
- 结论：${mengpai.tiaohou?.result || '待分析'}

### 流通（五行顺逆）
- 流通状态：${mengpai.liutong?.liutongStatus || '待分析'}
- 详细：${mengpai.liutong?.analysis || '待分析'}

### 格局
- 格局类型：${mengpai.geju?.gejuType || '待分析'}
- 格局名称：${mengpai.geju?.gejuName || '待分析'}
- 分析：${mengpai.geju?.analysis || '待分析'}`;
  }

  /**
   * 南北派分析
   */
  generateNanbeipaiSection(nanbeipai) {
    return `## 五、南北派分析

### 南方派用神法
- 分析：${nanbeipai.uniqueYongshen?.nanfang?.analysis || '待分析'}
- 用神建议：${nanbeipai.uniqueYongshen?.nanfang?.yongshen?.join('、') || '待定'}

### 北方派用神法
- 季节：${nanbeipai.uniqueYongshen?.beifang?.season || '未知'}
- 需求用神：${nanbeipai.uniqueYongshen?.beifang?.need?.join('、') || '待定'}
- 分析：${nanbeipai.uniqueYongshen?.beifang?.analysis || '待分析'}

### 干支阴阳
- 阳干支数量：${nanbeipai.ganzhiYinyang?.yangCount || 0}个
- 阴干支数量：${nanbeipai.ganzhiYinyang?.yinCount || 0}个
- 整体：${nanbeipai.ganzhiYinyang?.balanceType || '待分析'}

### 纳音
- 日柱纳音：${nanbeipai.nayin?.day || '未知'}
- 纳音分类：${nanbeipai.nayin?.analysis || '待分析'}`;
  }

  /**
   * 时代背景分析
   */
  generateEraSection(eraBackground) {
    if (!eraBackground) {
      return `## 六、时代背景分析

暂无时代背景数据`;
    }

    return `## 六、时代背景分析

### 出生时期
- 时期：${eraBackground.name}
- 时间段：${eraBackground.period || '未知'}
- 特征：${eraBackground.features?.join('、') || '无'}
- 机遇：${eraBackground.opportunity || '无'}
- 风险：${eraBackground.risk || '无'}

### 背景说明
${eraBackground.description || '无'}`;
  }

  /**
   * 免责声明
   */
  generateDisclaimer() {
    return `## 七、综合分析

（此部分需要LLM调用进行深度分析，包括各派系结论交叉验证）

## 八、人生建议

（此部分需要LLM调用提供具体职业方向、性格分析等建议）

## 九、免责声明

本报告仅供参考，娱乐而已。

**三分天注定，七分靠打拼。**

一名二运三风水。不要相信宿命论，品德、福报、风水都是宏观命运的一部分。只要心善、努力和乐观，就是好命。加油！

---
*本报告由FortuneTeller算命系统自动生成*
`;
  }

  /**
   * 生成结构化JSON输出
   */
  generateJSON(name, input, panpai, analysis) {
    return {
      meta: {
        name,
        gender: input.gender,
        birthDate: `${input.solarDate.year}-${input.solarDate.month}-${input.solarDate.day}`,
        location: input.location,
        trueSolarTime: `${input.trueSolarTime.hour}:${input.trueSolarTime.minute}`,
        generatedAt: new Date().toISOString()
      },
      bazi: panpai.bazi,
      ziwei: panpai.ziwei,
      mengpai: panpai.mengpai,
      nanbeipai: panpai.nanbeipai,
      eraBackground: analysis.eraBackground
    };
  }
}

module.exports = ReportGenerator;
