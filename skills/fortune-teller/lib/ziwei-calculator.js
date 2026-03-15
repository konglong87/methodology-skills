/**
 * 紫微斗数排盘模块
 *
 * 三个层次：
 * 1. 144种基本命盘（12宫位 × 12种主星分布）
 * 2. 1440种变化（144种基本命盘 × 10种天干四化）
 * 3. 259,200种完整命盘（60年 × 12月 × 30日 × 12时辰）
 */

// 十四主星
const ZHUSHENG = [
  '紫微', '天府', '天机', '太阳', '武曲', '天同', '廉贞',
  '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'
];

// 四化（按年份天干）
const SIHUA = {
  '甲': { lu: '廉贞', quan: '武曲', ke: '太阳', ji: '贪狼' },
  '乙': { lu: '天机', quan: '紫微', ke: '太阴', ji: '武曲' },
  '丙': { lu: '天同', quan: '天机', ke: '廉贞', ji: '巨门' },
  '丁': { lu: '太阴', quan: '天同', ke: '巨门', ji: '贪狼' },
  '戊': { lu: '贪狼', quan: '太阴', ke: '右弼', ji: '天机' },
  '己': { lu: '武曲', quan: '贪狼', ke: '天梁', ji: '曲艺' },
  '庚': { lu: '太阳', quan: '武曲', ke: '天同', ji: '太阴' },
  '辛': { lu: '巨门', quan: '太阳', ke: '曲艺', ji: '昌符' },
  '壬': { lu: '天梁', quan: '紫微', ke: '左辅', ji: '武曲' },
  '癸': { lu: '破军', quan: '巨门', ke: '太阴', ji: '贪狼' }
};

// 十二宫位
const GONGWEI = [
  '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
  '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
];

// 地支对应宫位（简化）
const ZHI_TO_GONG = {
  '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
  '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11
};

class ZiweiCalculator {
  /**
   * 紫微斗数排盘
   * @param {Date} birthDate - 出生日期
   * @param {number} hour - 小时（0-23）
   * @param {string} gender - 性别
   */
  calculateZiwei(birthDate, hour, gender) {
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    // 计算命宫
    const mingGongZhi = this.calculateMingGongZhi(year, month, day, hour);

    // 获取天干
    const gan = this.getYearGan(year);

    // 计算四化
    const sihua = SIHUA[gan] || SIHUA['甲'];

    // 计算主星分布
    const mainStars = this.calculateMainStars(mingGongZhi, year);

    // 计算南斗六星
    const nStars = this.calculateNStars(mingGongZhi);

    // 计算北斗七星
    const bStars = this.calculateBStars(mingGongZhi);

    // 分布宫位
    const gongwei = this.distributeGongwei(mingGongZhi, mainStars, nStars, bStars);

    // 计算大运
    const dayun = this.calculateZiweiDayun(mingGongZhi, gender);

    return {
      year,
      month,
      day,
      hour,
      gan,
      mingGongZhi,
      mingGongIndex: ZHI_TO_GONG[mingGongZhi],
      mainStars,
      nStars,
      bStars,
      sihua,
      gongwei,
      dayun
    };
  }

  /**
   * 计算命宫地支
   * 简化口诀：月支+时支（阳男阴女顺，阴男阳女逆）
   */
  calculateMingGongZhi(year, month, day, hour) {
    // 获取月支
    const monthZhi = this.getMonthZhi(month);
    // 获取时支
    const hourZhi = this.getHourZhi(hour);

    // 命宫 = 月支 + 时支（简化计算）
    const monthIndex = this.DIZHI.indexOf(monthZhi);
    const hourIndex = this.DIZHI.indexOf(hourZhi);

    // 命宫计算：基本公式
    let mingGongIndex = (monthIndex + hourIndex) % 12;
    return this.DIZHI[mingGongIndex];
  }

  getMonthZhi(month) {
    const monthZhi = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
    return monthZhi[month - 1];
  }

  getHourZhi(hour) {
    // 子时（23:00-1:00）为0
    if (hour >= 23 || hour < 1) return '子';
    return this.DIZHI[Math.floor((hour + 1) / 2) % 12];
  }

  getYearGan(year) {
    const gans = '甲乙丙丁戊己庚辛壬癸';
    return gans[(year - 4) % 10];
  }

  /**
   * 计算十四主星分布
   */
  calculateMainStars(mingGongZhi, year) {
    const mingIndex = ZHI_TO_GONG[mingGongZhi];

    // 按顺序分布主星
    const stars = {};
    ZHUSHENG.forEach((star, i) => {
      const gongIndex = (mingIndex + i) % 12;
      stars[GONGWEI[gongIndex]] = star;
    });

    return stars;
  }

  /**
   * 计算南斗六星
   */
  calculateNStars(mingGongZhi) {
    const mingIndex = ZHI_TO_GONG[mingGongZhi];
    const nStars = ['天机', '天梁', '天同', '天府', '太阴', '贪狼'];

    const result = {};
    nStars.forEach((star, i) => {
      const gongIndex = (mingIndex + i) % 12;
      result[GONGWEI[gongIndex]] = star;
    });

    return result;
  }

  /**
   * 计算北斗七星
   */
  calculateBStars(mingGongZhi) {
    const mingIndex = ZHI_TO_GONG[mingGongZhi];
    const bStars = ['太阳', '武曲', '廉贞', '巨门', '天相', '七杀', '破军'];

    const result = {};
    bStars.forEach((star, i) => {
      const gongIndex = (mingIndex + i) % 12;
      result[GONGWEI[gongIndex]] = star;
    });

    return result;
  }

  /**
   * 分布宫位
   */
  distributeGongwei(mingGongZhi, mainStars, nStars, bStars) {
    const mingIndex = ZHI_TO_GONG[mingGongZhi];
    const result = {};

    GONGWEI.forEach((gong, index) => {
      const offset = (index - mingIndex + 12) % 12;
      result[gong] = {
        mainStar: mainStars[gong] || '无',
        nStar: nStars[gong] || '无',
        bStar: bStars[gong] || '无',
        index: offset
      };
    });

    return result;
  }

  /**
   * 计算紫微斗数大运
   */
  calculateZiweiDayun(mingGongZhi, gender) {
    const mingIndex = ZHI_TO_GONG[mingGongZhi];
    const isMale = gender === '男';
    const isYangYear = true; // 简化

    // 大运方向：阳男阴女顺，阴男阳女逆
    const direction = (isMale && isYangYear) || (!isMale && !isYangYear) ? 1 : -1;

    const dayunList = [];
    for (let i = 0; i < 12; i++) {
      const gongIndex = (mingIndex + direction * (i + 1) + 12) % 12;
      dayunList.push({
        index: i + 1,
        gong: GONGWEI[gongIndex],
        startAge: i * 10,
        endAge: (i + 1) * 10 - 1
      });
    }

    return dayunList;
  }

  /**
   * 计算流年
   */
  calculateZiweiLiunian(birthYear, year) {
    const offset = year - birthYear;
    const yearZhi = this.DIZHI[(year - 4) % 12];

    return {
      year,
      yearZhi,
      index: offset,
      tianZhu: ZHUSHENG[offset % 14] // 简单轮流
    };
  }
}

// 添加静态属性
ZiweiCalculator.prototype.DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

module.exports = ZiweiCalculator;
