/**
 * 南北派排盘模块
 * 负责：独特用神法、命宫归宫、干支分阴阳、纳音取象、卦位预测
 * 南方派特点：重用神之间的配合
 * 北方派特点：重调候用神
 */
class NanbeipaiCalculator {
  // 天干阴阳
  TIANGAN_YINYANG = {
    '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴',
    '戊': '阳', '己': '阴', '庚': '阳', '辛': '阴',
    '壬': '阳', '癸': '阴'
  };

  // 地支阴阳
  DIZHI_YINYANG = {
    '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴',
    '辰': '阳', '巳': '阴', '午': '阳', '未': '阴',
    '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴'
  };

  // 五行
  WUXING = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  };

  // 地支对应五行
  DIZHI_WUXING = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水'
  };

  // 纳音五行（完整60甲子）
  NAYIN_MAP = {
    '甲子': '海中金', '乙丑': '海中金',
    '丙寅': '炉中火', '丁卯': '炉中火',
    '戊辰': '大林木', '己巳': '大林木',
    '庚午': '路旁土', '辛未': '路旁土',
    '壬申': '剑锋金', '癸酉': '剑锋金',
    '甲戌': '山头火', '乙亥': '山头火',
    '丙子': '涧下水', '丁丑': '涧下水',
    '戊寅': '城头土', '己卯': '城头土',
    '庚辰': '白蜡金', '辛巳': '白蜡金',
    '壬午': '杨柳木', '癸未': '杨柳木',
    '甲申': '井泉水', '乙酉': '井泉水',
    '丙戌': '屋上土', '丁亥': '屋上土',
    '戊子': '霹雳火', '己丑': '霹雳火',
    '庚寅': '松柏木', '辛卯': '松柏木',
    '壬辰': '长流水', '癸巳': '长流水',
    '甲午': '砂石金', '乙未': '砂石金',
    '丙申': '山下火', '丁酉': '山下火',
    '戊戌': '平地下', '己亥': '平地下',
    '庚子': '壁上土', '辛丑': '壁上土',
    '壬寅': '金箔金', '癸卯': '金箔金',
    '甲辰': '覆灯火', '乙巳': '覆灯火',
    '丙午': '天河水', '丁未': '天河水',
    '戊申': '大驿土', '己酉': '大驿土',
    '庚戌': '钗钏金', '辛亥': '钗钏金',
    '壬子': '桑柘木', '癸丑': '桑柘木',
    '甲寅': '大溪水', '乙卯': '大溪水',
    '丙辰': '砂石土', '丁巳': '砂石土',
    '戊午': '天上火', '己未': '天上火',
    '庚申': '石榴木', '辛酉': '石榴木',
    '壬戌': '大海水', '癸亥': '大海水'
  };

  /**
   * 南北派综合分析
   * @param {Object} bazi - 八字数据
   * @param {Object} ziweiData - 紫微斗数数据（可选）
   */
  calculateNanbeipai(bazi, ziweiData = {}) {
    return {
      // 独特用神法
      uniqueYongshen: this.calculateUniqueYongshen(bazi),
      // 命宫归宫（紫微斗数）
      mingGongGuigong: this.calculateMingGongGuigong(ziweiData),
      // 干支分阴阳
      ganzhiYinyang: this.calculateGanzhiYinyang(bazi),
      // 纳音取象
      nayin: this.calculateNayin(bazi),
      // 卦位预测
      guawei: this.calculateGuawei(bazi),
      // 技法差异
      jifa: this.calculateJifa(bazi)
    };
  }

  /**
   * 南方派用神法：用神与用神之间的配合
   * 北方派用神法：调候为用
   */
  calculateUniqueYongshen(bazi) {
    const wuxingDist = bazi.wuxingDistribution || {};
    const dayMaster = bazi.dayMaster;
    const dayWuxing = this.WUXING[dayMaster];

    // 南方派：用神之间的配合
    // 找出日主所生的五行（食伤）和克日主的五行（官杀）
    const shengke = this.getShengKe(dayWuxing);

    // 计算各五行占比
    const total = Object.values(wuxingDist).reduce((a, b) => a + b, 0);
    const ratios = {};
    for (const [w, c] of Object.entries(wuxingDist)) {
      ratios[w] = total > 0 ? Math.round(c / total * 100) : 0;
    }

    // 南方派用神：看食伤与官杀的配合
    const nanfangResult = this.analyzeNanfang(shengke, ratios, dayWuxing);

    // 北方派用神：重调候
    const beifangResult = this.analyzeBeifang(bazi);

    return {
      nanfang: nanfangResult,
      beifang: beifangResult,
      conclusion: this.synthesizeNanbeipai(nanfangResult, beifangResult)
    };
  }

  getShengKe(dayWuxing) {
    const shengke = {
      '木': { sheng: '火', ke: '金' },
      '火': { sheng: '土', ke: '水' },
      '土': { sheng: '金', ke: '木' },
      '金': { sheng: '水', ke: '火' },
      '水': { sheng: '木', ke: '土' }
    };
    return shengke[dayWuxing] || { sheng: '未知', ke: '未知' };
  }

  analyzeNanfang(shengke, ratios, dayWuxing) {
    // 南方派：看食伤与官杀的平衡
    const sheng = ratios[shengke.sheng] || 0;
    const ke = ratios[shengke.ke] || 0;

    let analysis = '';
    let yongshen = [];

    if (sheng > ke + 10) {
      analysis = '食伤旺相，宜用官杀制之';
      yongshen.push(shengke.ke);
    } else if (ke > sheng + 10) {
      analysis = '官杀旺相，宜用食伤化之';
      yongshen.push(shengke.sheng);
    } else if (sheng > 0 && ke > 0) {
      analysis = '食伤与官杀平衡，流通有情';
      yongshen.push(shengke.sheng, shengke.ke);
    } else {
      analysis = '用神不显，需综合判断';
    }

    return {
      method: '南方派',
      analysis,
      yongshen,
      note: '南方派重用神之间的配合'
    };
  }

  analyzeBeifang(bazi) {
    // 北方派：重调候
    const monthZhi = bazi.monthZhi;

    // 简单调候判断
    const tiaohou = {
      '寅': { season: '春', need: ['火', '金'] },
      '卯': { season: '春', need: ['火', '金'] },
      '辰': { season: '春', need: ['火', '金'] },
      '巳': { season: '夏', need: ['水', '金'] },
      '午': { season: '夏', need: ['水', '金'] },
      '未': { season: '夏', need: ['水', '金'] },
      '申': { season: '秋', need: ['火', '土'] },
      '酉': { season: '秋', need: ['火', '土'] },
      '戌': { season: '秋', need: ['火', '土'] },
      '亥': { season: '冬', need: ['火', '土'] },
      '子': { season: '冬', need: ['火', '土'] },
      '丑': { season: '冬', need: ['火', '土'] }
    };

    const seasonData = tiaohou[monthZhi] || { season: '未知', need: [] };

    return {
      method: '北方派',
      season: seasonData.season,
      need: seasonData.need,
      analysis: `${seasonData.season}季宜用${seasonData.need.join('、')}`,
      note: '北方派重调候用神'
    };
  }

  synthesizeNanbeipai(nanfangResult, beifangResult) {
    // 综合南北派结论
    const allYongshen = [...new Set([...nanfangResult.yongshen, ...beifangResult.need])];
    return {
      recommendYongshen: allYongshen,
      analysis: '综合南北派：南方重用神配合，北方重调候',
      suggest: '建议两者结合判断'
    };
  }

  /**
   * 命宫归宫（紫微斗数）
   */
  calculateMingGongGuigong(ziweiData) {
    if (!ziweiData || ziweiData.mingGongIndex === undefined || ziweiData.mingGongIndex === null) {
      return {
        note: '需紫微斗数数据才能准确计算命宫归宫',
        mingGongIndex: null,
        analysis: '请提供完整紫微数据进行命宫归宫分析'
      };
    }

    return {
      mingGongIndex: ziweiData.mingGongIndex,
      mingGongName: ['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
                     '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'][ziweiData.mingGongIndex],
      analysis: `命宫落在第${ziweiData.mingGongIndex + 1}宫位`
    };
  }

  /**
   * 干支分阴阳分析
   */
  calculateGanzhiYinyang(bazi) {
    const allGanzhi = [bazi.year, bazi.month, bazi.day, bazi.hour];

    let yangCount = 0;
    let yinCount = 0;
    const details = [];

    for (const gz of allGanzhi) {
      const gan = gz.charAt(0);
      const zhi = gz.charAt(1);

      const ganYang = this.TIANGAN_YINYANG[gan] === '阳';
      const zhiYang = this.DIZHI_YINYANG[zhi] === '阳';

      if (ganYang) yangCount++;
      else yinCount++;

      if (zhiYang) yangCount++;
      else yinCount++;

      details.push({
        ganzhi: gz,
        ganYinyang: this.TIANGAN_YINYANG[gan],
        zhiYinyang: this.DIZHI_YINYANG[zhi],
        isYang: ganYang && zhiYang
      });
    }

    let balanceType = '';
    if (yangCount > yinCount + 2) {
      balanceType = '偏阳';
    } else if (yinCount > yangCount + 2) {
      balanceType = '偏阴';
    } else {
      balanceType = '阴阳平衡';
    }

    return {
      yangCount,
      yinCount,
      balanceType,
      details,
      analysis: `四柱中阳干支${yangCount}个，阴干支${yinCount}个，整体${balanceType}`
    };
  }

  /**
   * 纳音取象
   */
  calculateNayin(bazi) {
    const yearNayin = this.NAYIN_MAP[bazi.year] || '未知';
    const monthNayin = this.NAYIN_MAP[bazi.month] || '未知';
    const dayNayin = this.NAYIN_MAP[bazi.day] || '未知';
    const hourNayin = this.NAYIN_MAP[bazi.hour] || '未知';

    return {
      year: yearNayin,
      month: monthNayin,
      day: dayNayin,
      hour: hourNayin,
      analysis: `年柱${yearNayin}，日柱${dayNayin}，纳音${this.getNayinCategory(dayNayin)}`
    };
  }

  getNayinCategory(nayin) {
    const categories = {
      '海中金': '金', '炉中火': '火', '大林木': '木', '路旁土': '土', '剑锋金': '金',
      '山头火': '火', '涧下水': '水', '城头土': '土', '白蜡金': '金', '杨柳木': '木',
      '井泉水': '水', '屋上土': '土', '霹雳火': '火', '松柏木': '木', '长流水': '水',
      '砂石金': '金', '山下火': '火', '平地下': '土', '壁上土': '土', '金箔金': '金',
      '覆灯火': '火', '天河水': '水', '大驿土': '土', '钗钏金': '金', '桑柘木': '木',
      '大溪水': '水', '砂石土': '土', '天上火': '火', '石榴木': '木', '大海水': '水'
    };
    return categories[nayin] || '未知';
  }

  /**
   * 卦位预测（简化版）
   */
  calculateGuawei(bazi) {
    // 简化实现：用日柱地支对应先天八卦
    const guaMap = {
      '子': '坎', '丑': '坤', '寅': '震', '卯': '巽',
      '辰': '乾', '巳': '兑', '午': '艮', '未': '离',
      '申': '坤', '酉': '震', '戌': '巽', '亥': '乾'
    };

    const dayZhi = bazi.dayZhi;
    const gua = guaMap[dayZhi] || '待定';

    return {
      dayZhi,
      gua,
      analysis: `日支${dayZhi}对应${gua}卦`,
      note: '此为简化卦位预测，准确需结合梅花易数'
    };
  }

  /**
   * 南北派技法差异
   */
  calculateJifa(bazi) {
    return {
      nanfang: {
        name: '南方派',
        focus: '用神与用神之间的配合',
        method: '重用神之间的生克制化'
      },
      beifang: {
        name: '北方派',
        focus: '调候用神为重',
        method: '先看调候，再论用神'
      },
      suggestion: '建议综合两派之长，调候+用神配合兼顾'
    };
  }
}

module.exports = NanbeipaiCalculator;
