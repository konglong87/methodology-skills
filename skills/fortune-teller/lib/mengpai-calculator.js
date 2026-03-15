/**
 * 盲派排盘模块
 * 负责：调候用神、流通通道、格局判定
 * 盲派核心：「调候+流通+格局」三大要素
 */
class MengpaiCalculator {
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

  // 季节
  SEASONS = {
    '寅': '春', '卯': '春', '辰': '春',
    '巳': '夏', '午': '夏', '未': '夏',
    '申': '秋', '酉': '秋', '戌': '秋',
    '亥': '冬', '子': '冬', '丑': '冬'
  };

  /**
   * 盲派核心三要素分析
   * @param {Object} bazi - 八字数据（从bazi-calculator获取）
   */
  calculateMengpai(bazi) {
    return {
      // 调候：寒热燥湿
      tiaohou: this.calculateTiaohou(bazi),
      // 流通：五行顺逆
      liutong: this.calculateLiutong(bazi),
      // 格局
      geju: this.calculateGeju(bazi),
      // 象意解读
      xiangyi: this.calculateXiangyi(bazi),
      // 干支作用关系
      ganzhiAction: this.calculateGanzhiAction(bazi)
    };
  }

  /**
   * 调候用神判断
   * 盲派调候：看八字寒热燥湿是否平衡
   */
  calculateTiaohou(bazi) {
    const monthZhi = bazi.monthZhi;
    const season = this.SEASONS[monthZhi] || '未知';

    // 判断季节寒热
    let seasonNature;
    if (season === '夏') {
      seasonNature = { name: '热', value: 3 };
    } else if (season === '冬') {
      seasonNature = { name: '寒', value: -3 };
    } else if (season === '春' || season === '秋') {
      seasonNature = { name: '温', value: 0 };
    }

    // 计算全局寒热燥湿
    const { fire, water, dryness, humidity } = this.calculateHuoShui(bazi);

    // 调候用神
    let tiaohouYongshen = [];
    let tiaohouType = '';

    if (season === '夏') {
      // 夏天用水调候
      if (water < 2) {
        tiaohouYongshen.push('水');
        tiaohouType = '用水调夏热';
      }
    } else if (season === '冬') {
      // 冬天用火调候
      if (fire < 2) {
        tiaohouYongshen.push('火');
        tiaohouType = '用火调冬寒';
      }
    } else if (season === '春') {
      // 春天木旺，用金克
      if (dryness > 2) {
        tiaohouYongshen.push('金');
        tiaohouType = '用金泄春气';
      } else {
        tiaohouYongshen.push('水');
        tiaohouType = '用水生木';
      }
    } else if (season === '秋') {
      // 秋天金旺，用火炼
      if (fire < 2) {
        tiaohouYongshen.push('火');
        tiaohouType = '用火炼秋金';
      } else {
        tiaohouYongshen.push('土');
        tiaohouType = '用土泄金气';
      }
    }

    return {
      season,
      seasonNature,
      fire,
      water,
      dryness,
      humidity,
      tiaohouYongshen: tiaohouYongshen.length > 0 ? tiaohouYongshen : ['待定'],
      tiaohouType: tiaohouType || '中和平衡',
      result: tiaohouYongshen.length > 0 ? `宜用${tiaohouYongshen.join('、')}` : '无需特别调候'
    };
  }

  /**
   * 计算火水燥湿
   */
  calculateHuoShui(bazi) {
    const allGanzhi = bazi.year + bazi.month + bazi.day + bazi.hour;
    let fire = 0, water = 0, dryness = 0, humidity = 0;

    for (const char of allGanzhi) {
      if (this.WUXING[char] === '火') fire++;
      if (this.WUXING[char] === '水') water++;
      if (['辰', '丑'].includes(char)) humidity++; // 湿土
      if (['戌', '未'].includes(char)) dryness++; // 燥土
    }

    return { fire, water, dryness, humidity };
  }

  /**
   * 流通分析（五行顺逆）
   * 盲派看五行是否流通有情
   */
  calculateLiutong(bazi) {
    const wuxingDist = bazi.wuxingDistribution;

    // 计算五行流通顺序
    // 木 → 火 → 土 → 金 → 水 → 木
    const flow = ['木', '火', '土', '金', '水'];
    const liutongPoints = [];

    for (let i = 0; i < 5; i++) {
      const current = flow[i];
      const next = flow[(i + 1) % 5];
      const currentCount = wuxingDist[current] || 0;
      const nextCount = wuxingDist[next] || 0;

      if (currentCount > 0 && nextCount > 0) {
        liutongPoints.push({
          from: current,
          to: next,
          status: '通'
        });
      } else {
        liutongPoints.push({
          from: current,
          to: next,
          status: '阻'
        });
      }
    }

    // 判断是否流通
    const tongCount = liutongPoints.filter(p => p.status === '通').length;
    let liutongStatus = '';
    if (tongCount >= 4) {
      liutongStatus = '流通有情';
    } else if (tongCount >= 2) {
      liutongStatus = '部分流通';
    } else {
      liutongStatus = '流通受阻';
    }

    return {
      wuxingDist,
      liutongPoints,
      tongCount,
      liutongStatus,
      analysis: `五行${liutongStatus}，${tongCount}/5个通道畅通`
    };
  }

  /**
   * 格局判定
   * 盲派格局：专旺格、从格、化气格等
   */
  calculateGeju(bazi) {
    const wuxingDist = bazi.wuxingDistribution;
    const dayMaster = bazi.dayMaster;
    const dayWuxing = this.WUXING[dayMaster];
    const total = wuxingDist.木 + wuxingDist.火 + wuxingDist.土 + wuxingDist.金 + wuxingDist.水;

    // 计算日主占比
    const dayRatio = (wuxingDist[dayWuxing] || 0) / total;

    // 判断格局
    let gejuType = '';
    let gejuName = '';

    if (dayRatio >= 0.5) {
      // 专旺格
      gejuType = '专旺格';
      if (dayWuxing === '木') gejuName = '曲直仁寿格';
      else if (dayWuxing === '火') gejuName = '炎上格';
      else if (dayWuxing === '土') gejuName = '稼穑格';
      else if (dayWuxing === '金') gejuName = '从革格';
      else if (dayWuxing === '水') gejuName = '润下格';
    } else if (dayRatio <= 0.15) {
      // 从格
      gejuType = '从格';
      // 找出最强的非日主五行
      const maxWuxing = Object.entries(wuxingDist)
        .filter(([w]) => w !== dayWuxing)
        .sort((a, b) => b[1] - a[1])[0];
      gejuName = `从${maxWuxing[0]}格`;
    } else {
      // 正格
      gejuType = '正格';
      // 判断是否成特殊格局
      const maxWuxing = Object.entries(wuxingDist)
        .filter(([w]) => w !== dayWuxing)
        .sort((a, b) => b[1] - a[1])[0];

      if (maxWuxing[1] >= 3) {
        gejuName = `${maxWuxing[0]}旺格`;
      } else {
        gejuName = '普通格局';
      }
    }

    return {
      dayMaster,
      dayWuxing,
      dayRatio: Math.round(dayRatio * 100) + '%',
      gejuType,
      gejuName,
      analysis: `日主${dayMaster}属${dayWuxing}，占比${Math.round(dayRatio * 100)}%，${gejuType}${gejuName}`
    };
  }

  /**
   * 象意解读
   * 盲派象意：根据干支组合解读象意
   */
  calculateXiangyi(bazi) {
    // 简化实现：提供基础象意
    const xiangyiList = [];

    // 日柱象意
    const dayGan = bazi.dayGan;
    const dayZhi = bazi.dayZhi;
    xiangyiList.push({
      gan: dayGan,
      zhi: dayZhi,
      ganXiangyi: this.getGanXiangyi(dayGan),
      zhiXiangyi: this.getZhiXiangyi(dayZhi)
    });

    return xiangyiList;
  }

  getGanXiangyi(gan) {
    const xiangyi = {
      '甲': '参天大树，栋梁之才',
      '乙': '花草藤蔓，柔性灵活',
      '丙': '太阳之火，光明热烈',
      '丁': '灯烛之火，星星之火',
      '戊': '高山厚土，稳重诚实',
      '己': '田园沃土，细腻包容',
      '庚': '刀剑金属，刚健果断',
      '辛': '珠玉首饰，美丽精致',
      '壬': '江河湖海，奔放流动',
      '癸': '雨露泉水，滋润细腻'
    };
    return xiangyi[gan] || '待解读';
  }

  getZhiXiangyi(zhi) {
    const xiangyi = {
      '子': '老鼠、智慧、流动',
      '丑': '牛、踏实、勤劳',
      '寅': '老虎、威武、权柄',
      '卯': '兔子、温和、灵敏',
      '辰': '龙、尊贵、变化',
      '巳': '蛇、智慧、神秘',
      '午': '马、热情、奔放',
      '未': '羊、温和、细腻',
      '申': '猴、灵活、变通',
      '酉': '鸡、准时、美丽',
      '戌': '狗、忠诚、守护',
      '亥': '猪、憨厚、包容'
    };
    return xiangyi[zhi] || '待解读';
  }

  /**
   * 干支作用关系
   */
  calculateGanzhiAction(bazi) {
    // 简化实现：提供基础作用关系分析
    return {
      note: '干支作用关系需结合具体组合深入分析',
      suggestions: ['关注日柱与月柱关系', '注意地支刑冲合害', '分析干支生克']
    };
  }
}

module.exports = MengpaiCalculator;
