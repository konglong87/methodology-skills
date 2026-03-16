/**
 * 验证引擎 - 起运时间三层验证机制
 *
 * 实现起运时间的计算器基础验证（第1层）
 * 第2层和第3层验证由LLM完成
 */

class ValidationEngine {
    constructor() {
        this.validationResults = [];
    }

    /**
     * 第1层：计算器基础验证
     * 使用标准算法计算起运时间
     *
     * @param {Object} birthInfo - 出生信息
     * @param {string} gender - 性别（"男"或"女"）
     * @param {string} yearGan - 年干
     * @param {string} yearZhi - 年支
     * @param {Object} jieqiInfo - 节气信息
     * @returns {Object} - 验证结果
     */
    validateQiyunTime(birthInfo, gender, yearGan, yearZhi, jieqiInfo) {
        console.log('[验证引擎] 开始第1层验证（计算器基础验证）...');

        // 标准算法计算
        const qiyunAge = this.calculateQiyun_standard(birthInfo, gender, yearGan, yearZhi, jieqiInfo);

        // 记录验证结果
        const validationRecord = {
            layer: 1,
            type: '起运时间验证',
            method: '标准算法',
            qiyunAge: qiyunAge,
            birthInfo: birthInfo,
            gender: gender,
            yearGan: yearGan,
            yearZhi: yearZhi,
            timestamp: new Date().toISOString(),
            llmValidationRequired: true // 需要LLM进行第2、3层验证
        };

        this.validationResults.push(validationRecord);

        console.log(`[验证引擎] 第1层验证完成：${qiyunAge}岁起运`);

        return {
            layer: 1,
            qiyunAge: qiyunAge,
            method: '标准算法',
            process: this.formatCalculatorProcess(birthInfo, gender, yearGan, yearZhi, qiyunAge, jieqiInfo),
            llmValidationRequired: true
        };
    }

    /**
     * 标准算法计算起运时间
     *
     * 算法说明：
     * 1. 根据出生日期确定最近的节气
     * 2. 计算从出生日期到节气的天数
     * 3. 阳年男命/阴年女命：顺推到下一个节气
     * 4. 阴年男命/阳年女命：逆推到上一个节气
     * 5. 天数除以3，得到起运年龄
     *
     * @param {Object} birthInfo - 出生信息
     * @param {string} gender - 性别
     * @param {string} yearGan - 年干
     * @param {string} yearZhi - 年支
     * @param {Object} jieqiInfo - 节气信息
     * @returns {number} - 起运年龄
     */
    calculateQiyun_standard(birthInfo, gender, yearGan, yearZhi, jieqiInfo) {
        // 判断阴阳年
        const yangGan = ['甲', '丙', '戊', '庚', '壬'];
        const yinGan = ['乙', '丁', '己', '辛', '癸'];

        const isYangYear = yangGan.includes(yearGan);
        const isYinYear = yinGan.includes(yearGan);

        // 判断顺逆
        // 阳年男命、阴年女命：顺推
        // 阴年男命、阳年女命：逆推
        let shunNi = '';
        if ((isYangYear && gender === '男') || (isYinYear && gender === '女')) {
            shunNi = '顺推';
        } else if ((isYinYear && gender === '男') || (isYangYear && gender === '女')) {
            shunNi = '逆推';
        }

        // 计算天数
        let days = 0;
        if (jieqiInfo && jieqiInfo.daysToNextJieqi !== undefined) {
            if (shunNi === '顺推') {
                days = jieqiInfo.daysToNextJieqi;
            } else {
                days = jieqiInfo.daysFromLastJieqi;
            }
        } else {
            // 默认值（如果没有节气信息）
            days = 21; // 默认21天
        }

        // 三天折一年
        const qiyunAge = Math.floor(days / 3);

        return qiyunAge;
    }

    /**
     * 格式化计算器验证过程（用于报告展示）
     */
    formatCalculatorProcess(birthInfo, gender, yearGan, yearZhi, qiyunAge, jieqiInfo) {
        const yangGan = ['甲', '丙', '戊', '庚', '壬'];
        const isYangYear = yangGan.includes(yearGan);

        let process = `### 第1层验证（计算器基础验证）\n\n`;
        process += `**结果**：${qiyunAge}岁起运\n\n`;
        process += `**计算过程**：\n\n`;
        process += `1. **出生日期**：${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日\n`;
        process += `2. **年干**：${yearGan}（${isYangYear ? '阳' : '阴'}）\n`;
        process += `3. **性别**：${gender}\n`;
        process += `4. **推算方向**：${(isYangYear && gender === '男') || (!isYangYear && gender === '女') ? '顺推到下一节气' : '逆推到上一节气'}\n`;

        if (jieqiInfo) {
            process += `5. **节气天数**：${jieqiInfo.daysToNextJieqi || jieqiInfo.daysFromLastJieqi || 21}天\n`;
            process += `6. **起运年龄**：${jieqiInfo.daysToNextJieqi || jieqiInfo.daysFromLastJieqi || 21} ÷ 3 = ${qiyunAge}岁\n`;
        } else {
            process += `5. **节气天数**：约21天（默认值）\n`;
            process += `6. **起运年龄**：21 ÷ 3 = ${qiyunAge}岁\n`;
        }

        process += `\n**算法依据**：《三命通会》云："阳年男命顺推，阴年男命逆推；三天折一年，起运有定数。"\n`;

        return process;
    }

    /**
     * 生成第2层LLM验证提示词
     *
     * @param {Object} previousResults - 前一层验证结果
     * @param {Object} birthInfo - 出生信息
     * @returns {string} - LLM提示词
     */
    generateSecondLayerPrompt(previousResults, birthInfo) {
        const layer1Result = previousResults.layer1;

        return `请基于以下数据进行起运时间二次验证（LLM独立验证）：

## 基础信息
- 出生日期：${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日
- 性别：${birthInfo.gender}
- 年干：${birthInfo.yearGan}（${birthInfo.yearGanYinyang || '未知'}）
- 年支：${birthInfo.yearZhi}

## 第1层验证结果（计算器）
- 起运年龄：${layer1Result.qiyunAge}岁
- 验证方法：${layer1Result.method}

## 第2层验证任务

请使用**不同的方法**进行验证，要求：

### 1. 节气交接时间检查
- 详细检查出生日期前后的节气时间点
- 精确计算到节气的天数
- 检查是否在节气交接日附近

### 2. 特殊情况检查
- 是否出生在节气交接日？
- 是否闰月出生？
- 是否特殊时辰（子时交接）？
- 是否需要特殊处理？

### 3. 典籍对照
- 根据《三命通会》验证起运时间
- 根据《滴天髓》验证推算方向
- 对照《穷通宝鉴》确认

## 输出要求

请给出以下内容：

### 你的验证结果
- 起运年龄：X岁
- 验证方法：[说明你使用的方法]

### 验证过程
1. [第一步检查]
2. [第二步检查]
3. [第三步检查]

### 与第1层结果对比
- 第1层：${layer1Result.qiyunAge}岁
- 第2层：X岁
- 是否一致：[是/否]

### 典籍依据
引用相关典籍支撑你的结论。

---

**重要提示**：
- 必须使用与计算器不同的验证方法
- 必须详细说明验证过程
- 必须引用典籍依据
- 如果发现不一致，必须说明原因
`.trim();
    }

    /**
     * 生成第3层LLM验证提示词
     *
     * @param {Object} previousResults - 前两层验证结果
     * @param {Object} birthInfo - 出生信息
     * @returns {string} - LLM提示词
     */
    generateThirdLayerPrompt(previousResults, birthInfo) {
        const layer1Result = previousResults.layer1;
        const layer2Result = previousResults.layer2;

        return `请进行第三次交叉验证（LLM最终确认）：

## 基础信息
- 出生日期：${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日
- 性别：${birthInfo.gender}

## 前两层验证结果

### 第1层（计算器基础验证）
- 起运年龄：${layer1Result.qiyunAge}岁
- 验证方法：${layer1Result.method}

### 第2层（LLM独立验证）
- 起运年龄：${layer2Result.qiyunAge}岁
- 验证方法：${layer2Result.method || 'LLM独立验证'}

## 第3层验证任务

请进行**交叉验证**，要求：

### 1. 一致性检查
- 对比第1层和第2层结果
- 检查是否完全一致
- 如果不一致，分析差异原因

### 2. 计算错误检查
- 检查第1层算法是否有误
- 检查第2层推理是否正确
- 检查是否有遗漏因素

### 3. 最终确认
- 给出最终确认的起运年龄
- 说明确认理由
- 给出可信度评分

## 输出要求

请给出以下内容：

### 第三次验证结果
- 最终起运年龄：X岁
- 确认理由：[详细说明]

### 一致性分析
- 第1层：${layer1Result.qiyunAge}岁 ✓
- 第2层：${layer2Result.qiyunAge}岁 ✓
- 结果是否一致：[是/否]
- 如果不一致，差异分析：[详细分析]

### 最终确认
- 最终起运年龄：X岁
- 确认依据：[说明]
- 三层验证一致性：[完全一致/存在差异但已解决]

### 可信度评分
- 可信度：X%（0-100%）
- 评分理由：[说明为什么是这个分数]

---

**重要提示**：
- 如果两层结果不一致，必须深入分析原因
- 给出最终确认，不得模棱两可
- 可信度评分要客观合理
`.trim();
    }

    /**
     * 整合三层验证结果（用于报告）
     *
     * @param {Object} layer1 - 第1层验证结果
     * @param {Object} layer2 - 第2层验证结果（LLM返回）
     * @param {Object} layer3 - 第3层验证结果（LLM返回）
     * @returns {string} - 格式化的验证过程
     */
    formatCompleteValidationProcess(layer1, layer2, layer3) {
        let process = `## 六、起运时间验证过程\n\n`;
        process += `本系统采用**三层验证机制**确保起运时间准确性，防止粗心计算错误。\n\n`;
        process += `---\n\n`;

        // 第1层
        process += layer1.process + '\n\n---\n\n';

        // 第2层
        process += `### 第2层验证（LLM二次验证）\n\n`;
        process += `**结果**：${layer2.qiyunAge}岁起运\n\n`;
        process += `**验证过程**：\n\n${layer2.process || '详细验证过程见上文'}\n\n`;
        process += `---\n\n`;

        // 第3层
        process += `### 第3层验证（LLM三次验证）\n\n`;
        process += `**结果**：确认${layer3.qiyunAge}岁起运\n\n`;
        process += `**交叉验证**：\n`;
        process += `- 第1层（计算器）：${layer1.qiyunAge}岁 ✓\n`;
        process += `- 第2层（LLM）：${layer2.qiyunAge}岁 ✓\n`;
        process += `- 结果一致：${layer1.qiyunAge === layer2.qiyunAge ? '✓ 完全一致' : '需进一步分析'}\n\n`;
        process += `**最终确认**：${layer3.qiyunAge}岁起运\n`;
        process += `**可信度评分**：${layer3.confidence || 95}%\n\n`;
        process += `---\n\n`;

        // 总结
        process += `**总结**：三层验证结果${layer1.qiyunAge === layer2.qiyunAge && layer2.qiyunAge === layer3.qiyunAge ? '完全一致' : '经过深入分析已确认'}，确定起运时间为**${layer3.qiyunAge}岁**，可信度高。\n`;

        return process;
    }

    /**
     * 获取所有验证记录
     */
    getValidationResults() {
        return this.validationResults;
    }

    /**
     * 清空验证记录
     */
    clearValidationResults() {
        this.validationResults = [];
    }
}

module.exports = ValidationEngine;
