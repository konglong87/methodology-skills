const lunar = require('lunar-javascript');

/**
 * 八字排盘模块
 * 负责：干支排盘、五行强弱、神煞、大运流年
 */
class BazilCalculator {
  // 天干
  TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  // 地支
  DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  // 天干阴阳
  TIANGAN_YINYANG = {
    '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴',
    '戊': '阳', '己': '阴', '庚': '阳', '辛': '阴',
    '壬': '阳', '癸': '阴'
  };
  // 地支藏干
  DIZHI_CANGGAN = {
    '子': '癸', '丑': '癸辛甲', '寅': '甲丙戊', '卯': '乙',
    '辰': '戊乙癸', '巳': '戊庚丙', '午': '丁己', '未': '己丁乙',
    '申': '庚壬戊', '酉': '辛', '戌': '戊辛丁', '亥': '壬甲'
  };
  // 五行
  WUXING = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水'
  };

  /**
   * 八字排盘
   * @param {Date} birthDate - 出生日期
   * @param {number} hour - 小时（0-23）
   * @param {string} gender - 性别（男/女）
   */
  calculateBazi(birthDate, hour, gender) {
    // 使用fromYmdHms确保包含时间信息，这样时柱计算才正确
    const solarDate = lunar.Solar.fromYmdHms(
      birthDate.getFullYear(),
      birthDate.getMonth() + 1, // JavaScript月份从0开始
      birthDate.getDate(),
      hour,
      0,
      0
    );
    const lunarDate = solarDate.getLunar();

    const yearGanZhi = lunarDate.getYearInGanZhi();
    const monthGanZhi = lunarDate.getMonthInGanZhi();
    const dayGanZhi = lunarDate.getDayInGanZhi();
    const hourGanZhi = lunarDate.getTimeInGanZhi();

    const gzStr = yearGanZhi + monthGanZhi + dayGanZhi + hourGanZhi;

    return {
      year: yearGanZhi,
      month: monthGanZhi,
      day: dayGanZhi,
      hour: hourGanZhi,
      // 拆解
      yearGan: yearGanZhi.charAt(0),
      yearZhi: yearGanZhi.charAt(1),
      monthGan: monthGanZhi.charAt(0),
      monthZhi: monthGanZhi.charAt(1),
      dayGan: dayGanZhi.charAt(0),
      dayZhi: dayGanZhi.charAt(1),
      hourGan: hourGanZhi.charAt(0),
      hourZhi: hourGanZhi.charAt(1),
      // 计算日主
      dayMaster: dayGanZhi.charAt(0),
      dayMasterYinyang: this.TIANGAN_YINYANG[dayGanZhi.charAt(0)],
      dayMasterWuxing: this.WUXING[dayGanZhi.charAt(0)],
      // 五行分布
      wuxingDistribution: this.calculateWuxing(gzStr),
      // 计算大运
      dayun: this.calculateDayun(dayGanZhi, gender),
      // 纳音
      nayin: this.calculateNayin(yearGanZhi, monthGanZhi, dayGanZhi, hourGanZhi)
    };
  }

  /**
   * 计算大运
   * @param {string} dayGanZhi - 日柱干支
   * @param {string} gender - 性别
   * @param {number} startAge - 起始年龄（默认0岁起运）
   */
  calculateDayun(dayGanZhi, gender, startAge = 0) {
    const dayGan = dayGanZhi.charAt(0);
    const isYang = this.TIANGAN.indexOf(dayGan) % 2 === 0;

    // 大运排法：阳干顺行，阴干逆行
    // 男性：阳干顺行，阴干逆行
    // 女性：阴干顺行，阳干逆行
    const isMale = gender === '男';
    let direction;
    if (isMale) {
      direction = isYang ? 1 : -1;
    } else {
      direction = isYang ? -1 : 1;
    }

    const dayunList = [];
    const ganIndex = this.TIANGAN.indexOf(dayGan);
    const zhiIndex = this.DIZHI.indexOf(dayGanZhi.charAt(1));

    // 计算10步大运
    for (let i = 0; i < 10; i++) {
      const ganIdx = (ganIndex + direction * (i + 1) + 10) % 10;
      const zhiIdx = (zhiIndex + direction * (i + 1) + 12) % 12;

      dayunList.push({
        index: i + 1,
        gan: this.TIANGAN[ganIdx],
        zhi: this.DIZHI[zhiIdx],
        ganzhi: this.TIANGAN[ganIdx] + this.DIZHI[zhiIdx],
        startAge: startAge + i * 10,
        endAge: startAge + (i + 1) * 10 - 1
      });
    }

    return dayunList;
  }

  /**
   * 计算流年
   * @param {string} dayGanZhi - 日柱干支
   * @param {number} startYear - 起始年份
   * @param {number} count - 数量
   */
  calculateLiunian(dayGanZhi, startYear, count = 10) {
    const dayGan = dayGanZhi.charAt(0);
    const ganIndex = this.TIANGAN.indexOf(dayGan);
    const liunianList = [];

    // 天干循环
    for (let i = 0; i < count; i++) {
      const year = startYear + i;
      const ganIdx = (ganIndex + i + 10) % 10;
      const yearGan = this.TIANGAN[ganIdx];
      const yearZhi = this.DIZHI[(year - 4) % 12];

      liunianList.push({
        year,
        ganzhi: yearGan + yearZhi,
        gan: yearGan,
        zhi: yearZhi,
        wuxing: this.WUXING[yearGan]
      });
    }

    return liunianList;
  }

  /**
   * 计算五行分布
   */
  calculateWuxing(gzStr) {
    const wuxing = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
    for (const char of gzStr) {
      if (this.WUXING[char]) {
        wuxing[this.WUXING[char]]++;
      }
    }
    return wuxing;
  }

  /**
   * 计算日主强弱
   */
  calculateDayMasterStrength(bazi) {
    const dayWuxing = bazi.dayMasterWuxing;
    const wuxingDist = bazi.wuxingDistribution;

    // 简单判断：看日主五行在全局中的占比
    const total = wuxingDist.木 + wuxingDist.火 + wuxingDist.土 + wuxingDist.金 + wuxingDist.水;
    const dayCount = wuxingDist[dayWuxing];
    const ratio = dayCount / total;

    // 简单判断：占比超过30%为偏强，低于20%为偏弱
    let strength;
    if (ratio >= 0.3) {
      strength = '偏强';
    } else if (ratio <= 0.15) {
      strength = '偏弱';
    } else {
      strength = '中和';
    }

    return {
      dayWuxing,
      count: dayCount,
      ratio: Math.round(ratio * 100) + '%',
      strength,
      // 需要参考月令才能更准确，这里是简化实现
      note: '需结合月令综合判断'
    };
  }

  /**
   * 计算纳音五行
   */
  calculateNayin(yearGz, monthGz, dayGz, hourGz) {
    // 60甲子纳音表（简化版）
    const nayinMap = {
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

    return {
      year: nayinMap[yearGz] || '未知',
      month: nayinMap[monthGz] || '未知',
      day: nayinMap[dayGz] || '未知',
      hour: nayinMap[hourGz] || '未知'
    };
  }

  /**
   * 计算大运的十二长生状态
     * @param {string} dayMaster - 日主（如"甲"）
     * @param {string} dayunGanzhi - 大运干支（如"甲子"）
     * @returns {Object} - 十二长生状态及其含义
     */
    calculateShierChangsheng(dayMaster, dayunGanzhi) {
        const wuxing = this.WUXING[dayMaster];
        const zhi = dayunGanzhi[1]; // 取地支

        // 十二长生表：根据五行和地支确定状态
        const changshengTable = {
            '木': {
                '亥': '长生', '子': '沐浴', '丑': '冠带', '寅': '临官', '卯': '帝旺',
                '辰': '衰', '巳': '病', '午': '死', '未': '墓', '申': '绝', '酉': '胎', '戌': '养'
            },
            '火': {
                '寅': '长生', '卯': '沐浴', '辰': '冠带', '巳': '临官', '午': '帝旺',
                '未': '衰', '申': '病', '酉': '死', '戌': '墓', '亥': '绝', '子': '胎', '丑': '养'
            },
            '土': {
                '申': '长生', '酉': '沐浴', '戌': '冠带', '亥': '临官', '子': '帝旺',
                '丑': '衰', '寅': '病', '卯': '死', '辰': '墓', '巳': '绝', '午': '胎', '未': '养'
            },
            '金': {
                '巳': '长生', '午': '沐浴', '未': '冠带', '申': '临官', '酉': '帝旺',
                '戌': '衰', '亥': '病', '子': '死', '丑': '墓', '寅': '绝', '卯': '胎', '辰': '养'
            },
            '水': {
                '申': '长生', '酉': '沐浴', '戌': '冠带', '亥': '临官', '子': '帝旺',
                '丑': '衰', '寅': '病', '卯': '死', '辰': '墓', '巳': '绝', '午': '胎', '未': '养'
            }
        };

        const state = changshengTable[wuxing]?.[zhi] || '未知';

        return {
            state: state,
            meaning: this.getChangshengMeaning(state)
        };
    }

    getChangshengMeaning(state) {
        const meanings = {
            '长生': '万物萌发，生机勃勃，主新事物、新发展、新机遇',
            '沐浴': '初生之苗，需要呵护，主变化、动荡、不安定',
            '冠带': '渐入佳境，成长期，主学习、积累、准备',
            '临官': '建功立业，大有可为，主事业、成就、发展',
            '帝旺': '极盛时期，登峰造极，主顶峰、辉煌、成功',
            '衰': '盛极而衰，逐渐走下坡，主衰退、减弱、收缩',
            '病': '多事之秋，需要休养，主疾病、困难、阻碍',
            '死': '气数已尽，需要重生，主结束、转化、变革',
            '墓': '归藏之时，积蓄能量，主收藏、积累、储备',
            '绝': '绝处逢生，物极必反，主转折、转机、变化',
            '胎': '重新孕育，新的开始，主希望、新生、机遇',
            '养': '休养生息，积蓄力量，主成长、培育、准备'
        };
        return meanings[state] || '未知状态';
    }
}

module.exports = BazilCalculator;
