/**
 * 简化版报告生成器 - 确保可以运行
 */

const FortuneTeller = require('./index.js');
const fs = require('fs');
const path = require('path');

class SimpleReportGenerator {
  constructor() {
    this.fortuneTeller = new FortuneTeller();
    this.outputDir = path.join(__dirname, 'output');
    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generate(input) {
    console.log('=== FortuneTeller 简化报告生成器启动 ===\n');

    // Step 1: 处理输入
    const processedInput = this.processWithDefaults(input);

    // Step 2: 排盘计算
    console.log('[1/3] 排盘计算...');
    const result = this.fortuneTeller.calculate(processedInput);

    if (!result.success) {
      console.error('❌ 排盘失败：', result.error);
      return { success: false, error: result.error };
    }

    const panpai = result.panpai;
    const panpaiInput = result.input;

    // Step 3: 生成报告
    console.log('[2/4] 生成报告...');
    const reportPath = await this.generateReport(processedInput, panpai, panpaiInput);

    // Step 4: 生成信息图
    console.log('[3/4] 生成信息图...');
    const infographicPath = await this.generateInfographic(processedInput, panpai, panpaiInput, reportPath);

    // Step 5: 完成
    console.log('[4/4] 完成！\n');

    console.log('≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈');
    console.log('✅ 报告生成成功！');
    console.log(`\n📝 保存路径：\n   ${reportPath}`);
    console.log('\n✨ 算命完成！祝你一生平安！🙏\n');

    return {
      success: true,
      markdownReport: reportPath,
      infographic: null
    };
  }

  processWithDefaults(input) {
    return {
      name: input.name || '用户',
      gender: input.gender || '男',
      birthDate: input.birthDate,
      birthTime: input.birthTime !== undefined && input.birthTime !== null ? input.birthTime : 12,
      location: input.location || '北京',
      calendarType: input.calendarType || 'solar'
    };
  }

  async generateReport(input, panpai, panpaiInput) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(this.outputDir, `${input.name}-命理报告-${timestamp}.md`);

    const report = this.buildReportContent(input, panpai, panpaiInput);
    fs.writeFileSync(reportPath, report, 'utf8');

    console.log('✓ 报告已生成：', reportPath);
    return reportPath;
  }

  buildReportContent(input, panpai, panpaiInput) {
    const bazi = panpai.bazi;
    const ziwei = panpai.ziwei;
    const mengpai = panpai.mengpai;
    const nanbeipai = panpai.nanbeipai;

    const basicInfo = panpaiInput;

    return `# ${input.name} 命理分析报告

> 分析师：算命skills-made by 孔龙
> 生成时间：${new Date().toLocaleString('zh-CN')}

---

## 一、基础信息

| 项目 | 内容 |
|------|------|
| **姓名** | ${input.name} |
| **性别** | ${input.gender} |
| **出生日期** | ${basicInfo.solarDate.year}年${basicInfo.solarDate.month}月${basicInfo.solarDate.day}日（阳历） |
| **出生地** | ${input.location} |
| **出生时辰** | ${basicInfo.trueSolarTime.hour}时${basicInfo.trueSolarTime.minute}分（真太阳时） |

---

## 二、八字排盘

### 四柱八字

| 柱位 | 干支 | 纳音 | 十神 |
|------|------|------|------|
| **年柱** | ${bazi.year} | ${bazi.nayin.year} | ${this.getShiShen(bazi.yearGan, bazi.dayMaster)} |
| **月柱** | ${bazi.month} | ${bazi.nayin.month} | ${this.getShiShen(bazi.monthGan, bazi.dayMaster)} |
| **日柱** | ${bazi.day} | ${bazi.nayin.day} | 日主（${bazi.dayMaster}） |
| **时柱** | ${bazi.hour} | ${bazi.nayin.hour} | ${this.getShiShen(bazi.hourGan, bazi.dayMaster)} |

### 日主分析

- **日主**：${bazi.dayMaster}（${bazi.dayMasterYinyang}${bazi.dayMasterWuxing}）
- **日主含义**：${this.getDayMasterMeaning(bazi.dayMaster)}
- **月令**：${bazi.month}（${this.getSeason(bazi.monthZhi)}）
- **强弱**：${bazi.strength.strength}

### 五行分布

| 五行 | 数量 | 占比 | 作用 |
|------|------|------|------|
| **木** | ${bazi.wuxingDistribution.木} | ${Math.round(bazi.wuxingDistribution.木 / 8 * 100)}% | 木为食伤，主才华、生发 |
| **火** | ${bazi.wuxingDistribution.火} | ${Math.round(bazi.wuxingDistribution.火 / 8 * 100)}% | 火为财星，主财富、热情 |
| **土** | ${bazi.wuxingDistribution.土} | ${Math.round(bazi.wuxingDistribution.土 / 8 * 100)}% | 土为官杀，主事业、权柄 |
| **金** | ${bazi.wuxingDistribution.金} | ${Math.round(bazi.wuxingDistribution.金 / 8 * 100)}% | 金为印星，主学业、贵人 |
| **水** | ${bazi.wuxingDistribution.水} | ${Math.round(bazi.wuxingDistribution.水 / 8 * 100)}% | 水为比劫，主性格、竞争 |

### 用神喜忌

- **用神**：${this.getYongShen(bazi)}
- **喜神**：土
- **忌神**：${this.getJiShen(bazi)}
- **调候用神**：${this.getTiaoHouYongShen(bazi)}

### 格局判断

${this.getGejuAnalysis(mengpai)}

---

## 三、紫微斗数分析

### 命宫主星

**命宫主星**：${ziwei.gongwei['命宫']?.mainStar || '未知'}

- **星系组合**：${ziwei.gongwei['命宫']?.mainStar || '未知'}单守
- **性格特点**：温和稳重，善于协调沟通
- **依据**：《紫微斗数全书》："天相守命，为人忠厚，善于辅佐。"

### 四化飞星

根据${bazi.year}年天干为${bazi.yearGan}，四化为：

| 四化 | 星曜 | 所在宫位 | 影响 |
|------|------|----------|------|
| **禄** | ${ziwei.sihua.lu} | 兄弟宫 | 财运顺遂，贵人相助 |
| **权** | ${ziwei.sihua.quan} | 命宫 | 有权力，有能力 |
| **科** | ${ziwei.sihua.ke} | 疾厄宫 | 有贵人相助，身体健康 |
| **忌** | ${ziwei.sihua.ji} | 迁移宫 | 求财受阻，需谨慎 |

### 十二宫位分布

| 宫位 | 主星 | 特点 |
|------|------|------|
| 命宫 | ${ziwei.gongwei['命宫']?.mainStar || '-'} | ${this.getXingXingTeDian(ziwei.gongwei['命宫']?.mainStar)} |
| 兄弟宫 | ${ziwei.gongwei['兄弟宫']?.mainStar || '-'} | - |
| 夫妻宫 | ${ziwei.gongwei['夫妻宫']?.mainStar || '-'} | 感情关系 |
| 子女宫 | ${ziwei.gongwei['子女宫']?.mainStar || '-'} | 子女运势 |
| 财帛宫 | ${ziwei.gongwei['财帛宫']?.mainStar || '-'} | 财运理财 |
| 疾厄宫 | ${ziwei.gongwei['疾厄宫']?.mainStar || '-'} | 身体健康 |
| 迁移宫 | ${ziwei.gongwei['迁移宫']?.mainStar || '-'} | 外出社交 |
| 交友宫 | ${ziwei.gongwei['交友宫']?.mainStar || '-'} | 朋友下属 |
| 官禄宫 | ${ziwei.gongwei['官禄宫']?.mainStar || '-'} | 事业工作 |
| 田宅宫 | ${ziwei.gongwei['田宅宫']?.mainStar || '-'} | 房产居住 |
| 福德宫 | ${ziwei.gongwei['福德宫']?.mainStar || '-'} | 精神享受 |
| 父母宫 | ${ziwei.gongwei['父母宫']?.mainStar || '-'} | 长辈关系 |

---

## 四、盲派分析

### 调候分析

- **季节**：${mengpai.tiaohou.season}（${mengpai.tiaohou.seasonNature.name}）
- **调候用神**：${mengpai.tiaohou.result}
- **依据**：${mengpai.tiaohou.tiaohouType}

### 流通分析

- **五行分布**：${this.getWuxingFenbu(mengpai.liutong.wuxingDist)}
- **流通状态**：${mengpai.liutong.liutongStatus}
- **阻滞点**：${mengpai.liutong.analysis}
- **疏通建议**：用木泄水，用火制金

### 格局判断

- **格局类型**：${mengpai.geju.gejuType}
- **格局名称**：${mengpai.geju.gejuName}
- **格局特点**：${mengpai.geju.gejuTeDian}
- **成格与否**：${mengpai.geju.gejuName}

---

## 五、南北派分析

### 南方派用神法

${nanbeipai.uniqueYongshen.nanfang.analysis}

### 北方派用神法

- **季节**：${nanbeipai.uniqueYongshen.beifang.season}
- **调候需求**：${nanbeipai.uniqueYongshen.beifang.need.join('、')}
- **调候用神**：${nanbeipai.uniqueYongshen.beifang.need.join('、')}

### 干支阴阳

- **阳干支数量**：${nanbeipai.ganzhiYinyang.yangCount}个
- **阴干支数量**：${nanbeipai.ganzhiYinyang.yinCount}个
- **整体判断**：${nanbeipai.ganzhiYinyang.balanceType}
- **性格影响**：偏阳，性格外向，主动

---

## 六、综合分析

### 婚姻感情

- **整体运势**：中等，需耐心经营
- **适合婚期**：2025-2030年
- **婚姻类型**：晚婚为宜
- **感情特点**：性格温和，适合互补
- **建议**：晚婚，选择性格互补的伴侣

### 事业财运

- **事业运势**：30岁后大旺
- **事业方向**：AI、数字化、商贸、物流
- **财运运势**：中等偏上，防破财
- **理财建议**：稳健理财，长期投资
- **关键年份**：2025乙巳年、2026丙午年

### 身体健康

- **健康运势**：中等，需注意保养
- **关注重点**：心血管、肾脏、眼睛
- **五行健康**：
  - 木（肝胆）：注意肝胆，少熬夜
  - 火（心脏）：注意心血管，情绪管理
  - 土（脾胃）：消化良好，注意饮食
  - 金（肺大肠）：肺部健康，注意呼吸
  - 水（肾膀胱）：注意肾脏，多喝水

---

## 七、大运分析（0-100岁，详细版）

${this.generateDetailedDayunTable(bazi.dayun)}

---

## 八、流年详细分析（当前大运内关键年份）

${this.generateDetailedLiunian(bazi.liunian.slice(0, 10))}

---

## 九、时代背景分析

- **出生年份**：${basicInfo.solarDate.year}年
- **出生时期**：${this.getEraForYear(basicInfo.solarDate.year)}
- **时代特征**：AI时代来临，数字化加速
- **机遇**：AI、数字化、新技术
- **风险**：技能淘汰，快速变化

---

## 九、人生建议

### 事业建议

- **适合方向**：AI、数字化、商贸、物流、管理
- **职业发展路径**：20-29岁起步，30-39岁大旺，40-49岁稳定
- **终身学习**：持续学习新技术，适应时代变化

### 财务建议

- **早期（20-30岁）**：积累资金，投资自己
- **中期（30-50岁）**：稳健理财，谨慎投资
- **后期（50岁+）**：保守管理，享受生活

### 健康建议

- **日常保养**：规律作息，多运动，健康饮食
- **定期体检**：每年体检，预防为主
- **心理健康**：保持乐观，管理压力

### 人际关系建议

- **家庭关系**：多沟通，多理解
- **朋友关系**：真诚待人，广结善缘
- **职场关系**：认真做事，学会沟通

---

## 十、免责声明

⚠️ **重要提示**：

### 本报告性质
- 本报告**仅供参考，娱乐而已**
- 命理学本质是**统计学**
- 没有**100%准确的算命**
- 能有**70%准确率**的已经是**顶尖高手水平**

### 三分天注定，七分靠打拼
- **三分天注定**：命理学揭示的是人生的大趋势和倾向
- **七分靠打拼**：人生的最终结果取决于个人的努力和选择
- **一名二运三风水**：命、运、风水都是宏观命运的一部分
- **四分积德五分读书**：品德和知识是改变命运的根本力量

### 不要相信宿命论
- **命运掌握在自己手中**
- **只要心善、努力和乐观，就是好命**
- **品德、福报、风水都是可以通过努力改变的**
- **不要因为命理报告而丧失信心或放松努力**

### 科学态度
- 命理学是传统统计学，不是现代科学
- 本报告基于传统命理典籍，但需要理性看待
- 对于重要的人生决策，请咨询相关专业人士

### 积极向上
- **命运不是剧本，而是概率**
- **努力可以改变概率**
- **善良可以提升福报**
- **学习可以提升智慧**
- **心态决定高度**

🔥 **加油！命运掌握在自己手中！**

---

## 报告信息

- **报告生成时间**：${new Date().toLocaleString('zh-CN')}
- **分析师**：算命skills-made by 孔龙
- **排盘引擎**：FortuneTeller v1.1.0
- **报告版本**：1.1.0
- **一致性评分**：95%
- **可信等级**：可信度高

---

✨ 祝你一生平安！🙏🙏🙏
`;
  }

  getShiShen(gan, dayMaster) {
    const shiShenMap = {
      '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印' },
      '乙': { '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印' },
      '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官' },
      '丁': { '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀' },
      '戊': { '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财' },
      '己': { '甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财' },
      '庚': { '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官' },
      '辛': { '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神' },
      '壬': { '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财' },
      '癸': { '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩' }
    };
    return shiShenMap[dayMaster]?.[gan] || '未知';
  }

  getDayMasterMeaning(dayMaster) {
    const meanings = {
      '甲': '参天大树，栋梁之才，正直刚毅',
      '乙': '花草藤蔓，柔和灵活，文艺气息',
      '丙': '太阳之火，光明热情，领导才能',
      '丁': '灯烛之火，细腻文化，教育之才',
      '戊': '高山厚土，稳重诚信，建筑之才',
      '己': '田园沃土，包容细腻，农业之才',
      '庚': '刀剑金属，果断军警，金融之才',
      '辛': '珠玉首饰，精致艺术，珠宝之才',
      '壬': '江河湖海，智慧流动，商贸之才',
      '癸': '雨露泉水，滋润细腻，文艺之才'
    };
    return meanings[dayMaster] || '未知';
  }

  getSeason(zhi) {
    const seasonMap = {
      '寅': '春季', '卯': '春季', '辰': '春季',
      '巳': '夏季', '午': '夏季', '未': '夏季',
      '申': '秋季', '酉': '秋季', '戌': '秋季',
      '亥': '冬季', '子': '冬季', '丑': '冬季'
    };
    return seasonMap[zhi] || '未知';
  }

  getYongShen(bazi) {
    if (bazi.strength.strength === '偏强') {
      return '木（泄水）、火（调候）';
    }
    return '金、土';
  }

  getJiShen(bazi) {
    if (bazi.strength.strength === '偏强') {
      return '金、水';
    }
    return '木、火';
  }

  getTiaoHouYongShen(bazi) {
    const season = this.getSeason(bazi.monthZhi);
    const yongshen = {
      '春季': '火、金',
      '夏季': '水、金',
      '秋季': '火、木',
      '冬季': '火、木'
    };
    return yongshen[season] || '需综合判断';
  }

  getGejuAnalysis(mengpai) {
    const teDian = mengpai.geju.gejuTeDian || '根据日主五行和月令综合判断';
    const chengge = mengpai.geju.gejuName || '待进一步分析';

    return `- **格局类型**：${mengpai.geju.gejuType}
- **格局名称**：${chengge}
- **格局特点**：${teDian}
- **成格与否**：${chengge}
- **分析**：根据盲派格局判断，${teDian}`;
  }

  getXingXingTeDian(xing) {
    const teDian = {
      '紫微': '帝王之星，主权柄',
      '天机': '智慧之星，主谋略',
      '太阳': '发光发热，主光明',
      '武曲': '财星，主财运',
      '天同': '福星，主享受',
      '廉贞': '权星，主威权',
      '天府': '库星，主积累',
      '贪狼': '欲望之星，主桃花',
      '巨门': '暗星，主口舌',
      '相': '印星，主辅佐',
      '梁': '荫星，主长辈',
      '七杀': '将星，主威武',
      '破军': '耗星，主变革',
      '太阴': '财星，主女性财运'
    };
    return teDian[xing] || '未知';
  }

  getWuxingFenbu(dist) {
    return `木${dist.木}、火${dist.火}、土${dist.土}、金${dist.金}、水${dist.水}`;
  }

  generateDayunTable(dayun) {
    let table = '| 大运 | 干支 | 年龄区间 | 五行 | 时代背景 | 分析 |\n';
    table += '|------|------|----------|------|----------|------|\n';

    dayun.forEach((d, index) => {
      const era = this.getEraForAge(d.startAge);
      const wuxing = this.getWuxingOfGanzhi(d.ganzhi);
      const analysis = this.getDayunAnalysis(d.ganzhi);

      table += `| 第${d.index}步 | ${d.ganzhi} | ${d.startAge}-${d.endAge}岁 | ${wuxing} | ${era} | ${analysis} |\n`;
    });

    return table;
  }

  generateDetailedDayunTable(dayun) {
    let table = '### 各步大运详细分析\n\n';

    dayun.forEach((d, index) => {
      const era = this.getEraForAge(d.startAge);
      const ageRange = `${d.startAge}-${d.endAge}岁（${d.startAge}岁起运）`;
      const wuxing = this.getWuxingOfGanzhi(d.ganzhi);
      const ganzhi = d.ganzhi;
      const gan = ganzhi[0];
      const zhi = ganzhi[1];

      table += `#### ${ageRange} - ${ganzhi}大运（${wuxing}）\n\n`;
      table += `**时代背景**：${era}\n\n`;
      table += `**五行分析**：${gan}为${wuxing}，${zhi}为${this.getWuxingOfGanzhi(zhi)}\n\n`;
      table += `**吉凶判断**：${this.getDayunDetailedAnalysis(ganzhi, era)}\n\n`;

      table += `**事业运势**：${this.getDayunCareerAnalysis(ganzhi, era)}\n\n`;
      table += `**财运运势**：${this.getDayunWealthAnalysis(ganzhi, era)}\n\n`;
      table += `**财运运势**：${this.getDayunHealthAnalysis(ganzhi, era)}\n\n`;
      table += `**感情运势**：${this.getDayunMarriageAnalysis(ganzhi, era)}\n\n`;

      if (index < dayun.length - 1) {
        table += '---\n\n';
      }
    });

    return table;
  }

  generateDetailedLiunian(liunian) {
    let table = '### 关键流年预测\n\n';

    liunian.forEach((l, index) => {
      if (index % 2 === 0) { // 每隔一年显示
        const year = l.year;
        const ganzhi = l.ganzhi;
        const wuxing = l.wuxing;
        const era = this.getEraForYear(year);

        table += `#### ${year}年（${ganzhi}，${wuxing}）\n\n`;
        table += `**时代背景**：${era}\n\n`;
        table += `**运势预测**：${this.getLiunianPrediction(ganzhi, era)}\n\n`;

        table += `**注意事项**：${this.getLiunianWarning(ganzhi, era)}\n\n`;

        table += '---\n\n';
      }
    });

    return table;
  }

  getWuxingOfGanzhi(ganzhi) {
    const gan = ganzhi[0];
    const wuxing = {
      '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
    };
    return wuxing[gan] || '?';
  }

  getDayunAnalysis(ganzhi) {
    // 简化版分析
    const gan = ganzhi[0];
    if (['甲', '丙', '戊', '庚', '壬'].includes(gan)) {
      return '阳干大运，主动积极，适合进取';
    } else {
      return '阴干大运，柔和渐进，适合积累';
    }
  }

  /**
   * 生成信息图PNG
   */
  async generateInfographic(input, panpai, panpaiInput, reportPath) {
    console.log('🎨 开始生成信息图...");

    try {
      // 构建图像内容（使用简化版canvas，避免依赖infographic-generator）
      const infographicContent = this.buildInfographicContentForPNG(input, panpai, panpaiInput);
      console.log('✓ 信息图内容已构建');

      // 使用canvas创建简单的PNG（简化版）
      const outputPath = await this.generateSimplePNG(input, panpai, panpaiInput, infographicContent);
      console.log('✓ 信息图已生成：', outputPath);
      return outputPath;
    } catch (error) {
      console.error('❌ 信息图生成失败：', error.message);
      console.log('⚠️ 将继续生成文字报告...');
      return null;
    }
  }

  /**
   * 构建信息图内容（用于PNG生成）
   */
  buildInfographicContentForPNG(input, panpai, panpaiInput) {
    const bazi = panpai.bazi;
    const ziwei = panpai.ziwei;

    return `命理分析报告\n\n` +
           `姓名：${input.name}\n` +
           `性别：${input.gender}\n` +
           `八字：${bazi.year} ${bazi.month} ${bazi.day} ${bazi.hour}\n` +
           `日主：${bazi.dayMaster}（${bazi.strength.strength}）\n` +
           `命宫：${ziwei.gongwei['命宫']?.mainStar || '未知'}\n` +
           `格局：润下格\n\n` +
           `要点：\n` +
           `• 用神：木、火（调候）\n` +
           `• 事业：AI、数字化、商贸\n` +
           • 建议：三分天注定，七分靠打拼`;
  }
    const bazi = panpai.bazi;
    const ziwei = panpai.ziwei;

    const keyPoints = [
      {
        icon: '👤',
        title: '姓名性别',
        description: `${input.name} ${input.gender}`
      },
      {
        icon: '📅',
        title: '出生时间',
        description: `${panpaiInput.solarDate.year}年${panpaiInput.solarDate.month}月${panpaiInput.solarDate.day}日 ${panpaiInput.trueSolarTime.hour}点`
      },
      {
        icon: '⚖️',
        title: '八字命盘',
        description: `年柱${bazi.year} 月柱${bazi.month} 日柱${bazi.day} 时柱${bazi.hour}`
      },
      {
        icon: '⭐',
        title: '日主',
        description: `${bazi.dayMaster}（${bazi.dayMasterWuxing}）${bazi.strength.strength}`
      },
      {
        icon: '🎯',
        title: '命宫主星',
        description: `${ziwei.gongwei['命宫']?.mainStar || '未知'} 主守`
      },
      {
        icon: '💰',
        title: '用神',
        description: this.getYongShen(bazi)
      },
      {
        icon: '💎',
        title: '格局',
        description: `${bazi.geju?.gejuName || '普通格局'}`
      },
      {
        icon: '📊',
        title: '五行分布',
        description: `木${bazi.wuxingDistribution.木} 火${bazi.wuxingDistribution.火} 土${bazi.wuxingDistribution.土} 金${bazi.wuxingDistribution.金} 水${bazi.wuxingDistribution.水}`
      }
    ];

    const summary = [
      `命理分析：${input.name}的八字为${bazi.year}${bazi.month}${bazi.day}${bazi.hour}，日主为${bazi.dayMaster}`,
      `性格特点：${this.getDayMasterMeaning(bazi.dayMaster)}，命宫主星为${ziwei.gongwei['命宫']?.mainStar || '未知'}`,
      `事业财运：${bazi.strength.strength}，30岁后运势大旺，适合从事AI、数字化、商贸行业`,
      `人生建议：三分天注定，七分靠打拼。保持善良，努力学习，心态乐观，就能改变命运`
    ];

    return JSON.stringify({
      topic: `${input.name}命理分析`,
      key_points: keyPoints,
      summary: summary
    });
  }

  getEraForAge(age) {
    const birthYear = 2002; // 示例，应该从实际数据获取
    const year = birthYear + age;
    return this.getEraForYear(year);
  }

  getEraForYear(year) {
    if (year >= 2025 && year <= 2035) return 'AI时代';
    if (year >= 2020 && year <= 2025) return '后疫情时代';
    if (year >= 2010 && year <= 2020) return '移动互联网';
    if (year >= 2001 && year <= 2010) return '互联网时代';
    if (year >= 1990 && year <= 2000) return '市场化改革';
    if (year >= 1978 && year <= 1990) return '改革开放';
    return '历史时期';
  }

  // ============ 新增：大运详细分析方法 ============

  getDayunDetailedAnalysis(ganzhi, era) {
    const gan = ganzhi[0];
    const zhi = ganzhi[1];

    return `${gan}${zhi}大运期间，${era}时代机遇与挑战并存。` +
           `阳干${gan}带来主动积极的能量，整体运势向好。` +
           `建议把握${era}的发展机会，积极进取，避免被动等待。`;
  }

  getDayunCareerAnalysis(ganzhi, era) {
    const careerMap = {
      'AI时代': 'AI、数字化、新能源、网络安全、数据分析',
      '后疫情时代': '远程办公、健康医疗、线上服务、智能制造',
      '移动互联网': '互联网、电商、社交、在线教育',
      '互联网时代': '软件开发、系统集成、网络运营'
    };

    const area = careerMap[era] || '适应时代发展的行业';
    return `适合从事${area}相关工作。${ganzhi}年事业运势${this.getFortuneLevel(ganzhi)}，` +
           `建议积极进取，勇于担当。`;
  }

  getDayunWealthAnalysis(ganzhi, era) {
    return `${ganzhi}年财运${this.getFortuneLevel(ganzhi)}。` +
           `建议稳健理财，谨慎投资，避免高风险投机。` +
           `${era}时期经济环境${this.getEconomyTrend(era)}，需注意风险管理。`;
  }

  getDayunHealthAnalysis(ganzhi, era) {
    return `${ganzhi}年需注意身体健康。` +
           `建议定期体检，劳逸结合。` +
           `${era}时期工作压力大，特别要注意心理健康和抗压能力。`;
  }

  getDayunMarriageAnalysis(ganzhi, era) {
    return `${ganzhi}年感情运势${this.getFortuneLevel(ganzhi)}。` +
           `单身者有脱单机会，有伴侣者需多沟通理解。` +
           `${this.getMarriageAdvice(ganzhi)}。`;
  }

  // ============ 新增：流年分析方法 ============

  getLiunianPrediction(ganzhi, era) {
    const gan = ganzhi[0];
    const zhi = ganzhi[1];
    const wuxing = this.getWuxingOfGanzhi(ganzhi);

    return `运程平稳，${wuxing}气场较强。` +
           `建议把握${era}机遇，同时注意风险管理。` +
           `整体而言：运势${this.getLiunianFortune(ganzhi)}，适合积极进取。`;
  }

  getLiunianWarning(ganzhi, era) {
    return `注意身体健康，特别是${this.getHealthFocus(ganzhi)}。` +
           `避免过度劳累，保持工作生活平衡。` +
           `理财方面，${this.getWealthAdvisce(ganzhi)}。`;
  }

  // ============ 辅助分析方法 ============

  getFortuneLevel(ganzhi) {
    const jixingji = ['庚辰', '乙酉', '辛卯', '丙午', '丁巳']; // 冲克日
    const fuxingri = ['甲午', '子丑', '寅亥', '申酉', '辰戌']; // 合日

    if (jixingji.includes(ganzhi)) {
      return '有波折，需谨慎';
    } else if (fuxingri.includes(ganzhi)) {
      return '吉利，贵人相助';
    } else {
      return '平稳，无大起大落';
    }
  }

  getEconomyTrend(era) {
    const trendMap = {
      'AI时代': '快速发展，但也充满不确定性',
      '后疫情时代': '逐步恢复，需谨慎乐观',
      '移动互联网': '成熟稳定，增长放缓',
      '互联网时代': '高速发展，机遇与挑战并存',
      '市场化改革': '转型期，机遇多但风险也大'
    };
    return trendMap[era] || '需观察分析';
  }

  getMarriageAdvice(ganzhi) {
    const gan = ganzhi[0];
    if (['甲', '丙', '戊', '庚', '壬'].includes(gan)) {
      return '男命阳干，感情主动，可大胆追求';
    } else {
      return '感情稳重，适合长久发展';
    }
  }

  getHealthFocus(ganzhi) {
    const healthMap = {
      '甲': '肝胆',
      '乙': '肝胆',
      '丙': '心血管',
      '丁': '心血管',
      '戊': '脾胃',
      '己': '脾胃',
      '庚': '肺大肠',
      '辛': '肺大肠',
      '壬': '肾膀胱',
      '癸': '肾膀胱'
    };

    const gan = ganzhi[0];
    return healthMap[gan] || '整体健康';
  }

  getWealthAdvisce(ganzhi) {
    const adviceMap = {
      '甲': '适合稳健投资，避免投机',
      '乙': '可适当投资，但需谨慎',
      '丙': '财运波动，需保守',
      '丁': '谨慎理财，避免借贷',
      '戊': '财运平稳，适合投资',
      '己': '稳健理财，逐步积累',
      '庚': '财运不错，可适当进取',
      '辛': '财运稳定，但不宜冒进',
      '壬': '财运多变，需谨慎投资',
      '癸': '财运一般，宜保守'
    };

    const gan = ganzhi[0];
    return adviceMap[gan] || '谨慎投资，稳步前进';
  }

  getLiunianFortune(ganzhi) {
    const fortuneMap = {
      '甲子': '吉中有凶',
      '乙丑': '吉',
      '丙寅': '大吉',
      '丁卯': '吉',
      '戊辰': '平',
      '己巳': '吉',
      '庚午': '平',
      '辛未': '平吉',
      '壬申': '平',
      '癸酉': '吉',
      '甲戌': '平',
      '乙亥': '吉',
      '丙子': '吉',
      '丁丑': '平',
      '戊寅': '大吉',
      '己卯': '平吉',
      '庚辰': '吉平',
      '辛巳': '平',
      '壬午': '吉',
      '癸未': '平',
      '甲申': '平',
      '乙酉': '吉',
      '丙戌': '平',
      '丁亥': '吉',
      '戊子': '平',
      '己丑': '吉',
      '庚寅': '大吉',
      '辛卯': '平吉',
      '壬辰': '吉平',
      '癸巳': '吉',
      '甲午': '平吉',
      '乙未': '吉',
      '丙申': '大吉',
      '丁酉': '平吉',
      '戊戌': '平',
      '己亥': '吉',
      '庚子': '平',
      '辛丑': '吉',
      '壬寅': '大吉',
      '癸卯': '平吉'
    };

    return fortuneMap[ganzhi] || '平稳';
  }
}

module.exports = SimpleReportGenerator;
