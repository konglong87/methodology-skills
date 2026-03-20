const lunar = require('lunar-javascript');

/**
 * 输入处理模块
 * 负责：农历/阳历双向转换、真太阳时计算、数据验证
 */
class InputHandler {
  /**
   * 农历转阳历
   */
  lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeapMonth = false) {
    // lunar-javascript库使用负数月份表示闰月
    // 例如：闰四月用 -4 表示
    const month = isLeapMonth ? -lunarMonth : lunarMonth;
    const lunarDate = lunar.Lunar.fromYmd(lunarYear, month, lunarDay);
    const solar = lunarDate.getSolar();
    return {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay()
    };
  }

  /**
   * 阳历转农历
   */
  solarToLunar(solarYear, solarMonth, solarDay) {
    const solarDate = lunar.Solar.fromYmd(solarYear, solarMonth, solarDay);
    const lunarDate = solarDate.getLunar();

    // lunar-javascript库中，闰月用负数表示（如闰四月 = -4）
    const month = lunarDate.getMonth();
    const isLeapMonth = month < 0;

    return {
      year: lunarDate.getYear(),
      month: isLeapMonth ? Math.abs(month) : month,  // 转为正数
      day: lunarDate.getDay(),
      isLeapMonth: isLeapMonth
    };
  }

  /**
   * 双向验证（2遍）
   * 阳历 → 农历 → 阳历，验证两次转换是否一致
   */
  validateDateConversion(solarYear, solarMonth, solarDay) {
    // 第一遍
    const lunar1 = this.solarToLunar(solarYear, solarMonth, solarDay);
    const solarBack1 = this.lunarToSolar(lunar1.year, lunar1.month, lunar1.day, lunar1.isLeapMonth);

    // 第二遍
    const lunar2 = this.solarToLunar(solarBack1.year, solarBack1.month, solarBack1.day);
    const solarBack2 = this.lunarToSolar(lunar2.year, lunar2.month, lunar2.day, lunar2.isLeapMonth);

    return {
      verified: solarBack2.year === solarYear && solarBack2.month === solarMonth && solarBack2.day === solarDay,
      lunar1, solarBack1, lunar2, solarBack2
    };
  }

  /**
   * 计算真太阳时
   * @param {number} longitude - 出生地经度
   * @param {number} hour - 北京时间小时
   * @param {number} minute - 分钟
   */
  trueSolarTime(longitude, hour, minute) {
    // 北京时间（东经120度）为基准
    const beijingLongitude = 120;
    const diff = (longitude - beijingLongitude) * 4; // 每度4分钟
    const totalMinutes = hour * 60 + minute + diff;

    let adjustedHour = Math.floor(totalMinutes / 60);
    let adjustedMinute = Math.round(totalMinutes % 60);

    // 处理跨天情况
    if (adjustedHour >= 24) {
      adjustedHour -= 24;
    } else if (adjustedHour < 0) {
      adjustedHour += 24;
    }

    // 处理分钟的进位或借位
    if (adjustedMinute >= 60) {
      adjustedMinute -= 60;
      adjustedHour += 1;
    } else if (adjustedMinute < 0) {
      adjustedMinute += 60;
      adjustedHour -= 1;
    }

    return {
      hour: adjustedHour,
      minute: adjustedMinute,
      diff: diff
    };
  }

  /**
   * 中国主要城市的经度参考
   */
  getChinaCityLongitude(cityName) {
    const cityLongitudes = {
      '北京': 116.46,
      '上海': 121.48,
      '广州': 113.23,
      '深圳': 114.07,
      '杭州': 120.19,
      '南京': 118.78,
      '武汉': 114.31,
      '成都': 104.06,
      '重庆': 106.54,
      '西安': 108.95,
      '天津': 117.2,
      '苏州': 120.65,
      '郑州': 113.62,
      '长沙': 112.93,
      '沈阳': 123.38,
      '青岛': 120.38,
      '大连': 121.64,
      '厦门': 118.1,
      '昆明': 102.73,
      '哈尔滨': 126.53,
      '长春': 125.32,
      '福州': 119.27,
      '南昌': 115.89,
      '贵阳': 106.63,
      '南宁': 108.37,
      '海口': 110.35,
      '石家庄': 114.51,
      '太原': 112.53,
      '济南': 117.02,
      '兰州': 103.73,
      '西宁': 101.78,
      '银川': 106.27,
      '乌鲁木齐': 87.68,
      '拉萨': 91.11,
      '呼和浩特': 111.67,
      '昆明': 102.73
    };
    return cityLongitudes[cityName] || null;
  }
}

module.exports = InputHandler;
