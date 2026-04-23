# Product Requirements Document: 男娘指数测试网站

**Version**: 1.0
**Date**: 2026-04-23
**Author**: Sarah (Product Owner)
**Quality Score**: 94/100

---

## Executive Summary

本项目是一个面向大学生、二次元爱好者、VRChat 玩家群体的娱乐向心理测试网站。通过 20 道简单的是非选择题，评估用户在六个维度上的男娘属性指数，最终生成带有六边形雷达图可视化的测试报告，并支持结果分享。

网站采用清新可爱的马卡龙配色风格，优先适配移动端体验，整体氛围轻松娱乐同时保证测试结果的准确性和参考价值。项目将部署在 Vercel 与 GitHub Pages，实现零成本快速上线。

---

## Problem Statement

**Current Situation**:
- 二次元社群中存在大量对于"男娘"属性的趣味讨论，但缺乏标准化、可视化的测试工具
- 现有同类测试大多设计粗糙，没有美观的数据可视化，也不支持便捷的结果分享
- 大部分测试网站UI老旧，不符合当代年轻用户的审美偏好
- 缺少专门针对 VRChat / 虚拟现实用户群体的趣味测评内容

**Proposed Solution**:
开发一个设计精美、体验流畅的男娘指数测试网站，提供专业的六维雷达图可视化报告，娱乐性与参考性并存。

**Business Impact**:
- 预期上线首月获得 10k+ 独立访问
- 在二次元社群获得自然传播与二次创作
- 成为同类测试中设计质量最高的标杆产品

---

## Success Metrics

**Primary KPIs:**
- 测试完成率: > 70%
- 结果分享率: > 25%
- 平均访问时长: > 2分钟
- 移动端适配评分: ≥ 95 Lighthouse 分数

**Validation**:
上线后第一周通过 Google Analytics 监控上述指标，第四周进行复盘评估。

---

## User Personas

### Primary: 二次元青年男性
- **Role**: 大学生 / 刚工作的年轻男性
- **Goals**: 趣味测试、社群玩梗、自我认同探索
- **Pain Points**: 找不到设计美观的同类测试，现有测试结果无法方便分享
- **Technical Level**: 中级，熟悉移动端网页操作

### Secondary: VRChat 玩家
- **Role**: 虚拟现实社群活跃用户
- **Goals**: 角色属性参考、社群互动素材
- **Pain Points**: 缺少针对他们群体的测试内容
- **Technical Level**: 高级，熟悉各种网络工具

---

## User Stories & Acceptance Criteria

### Story 1: 完成测试流程

**As a** 用户
**I want to** 顺利完成 20 道测试题
**So that** 我可以得到我的男娘指数结果

**Acceptance Criteria:**
- [ ] 打开网站即显示开始测试按钮
- [ ] 每次只显示一道题目，只有 是/否 两个选项
- [ ] 顶部显示清晰的答题进度条
- [ ] 点击选项后自动平滑过渡到下一题
- [ ] 答完所有题目后自动加载结果页面

### Story 2: 查看可视化测试报告

**As a** 用户
**I want to** 看到我的测试结果
**So that** 我可以了解自己在各个维度的得分

**Acceptance Criteria:**
- [ ] 显示六维六边形雷达图：软萌度、娇羞度、女性化、声线天赋、心理认同、行动力
- [ ] 给出总体 S/A/B/C/D 等级评定
- [ ] 每个维度显示具体分数值
- [ ] 针对等级给出符合风格的趣味评价文字
- [ ] 报告整体采用马卡龙配色风格

### Story 3: 分享测试结果

**As a** 用户
**I want to** 把我的测试结果分享出去
**So that** 我可以在社群和朋友互动

**Acceptance Criteria:**
- [ ] 提供一键生成分享图片功能
- [ ] 分享图片包含完整雷达图、等级和总分
- [ ] 提供复制分享链接功能
- [ ] 支持直接分享到主流社交平台

---

## Functional Requirements

### Core Features

**测试答题系统**
- 共 20 道单选题，每题只有 是/否 两个选项
- 线性答题流程，不支持返回修改
- 实时进度条显示答题进度
- 平滑的页面过渡动画
- 答题过程无刷新

**可视化结果报告**
- SVG 绘制的六边形雷达图，六个维度满分均为100分
- 总分换算为 S/A/B/C/D 五个等级
- 每个维度单独显示分数与评价
- 马卡龙渐变色填充，柔和阴影效果
- 响应式布局，在手机屏幕上完美展示

**分享功能**
- 客户端生成高清分享图片
- 支持一键复制测试链接
- 打开分享链接直接显示对应结果
- 不需要后端存储，所有数据编码在URL中

### Out of Scope
- 用户账号系统与历史记录保存
- 题目自定义编辑功能
- 多语言支持
- 后台数据统计面板
- 广告与变现功能

---

## Technical Constraints

### Performance
- 首屏加载时间 < 1.5s
- 页面切换动画帧率 ≥ 60fps
- 图片生成耗时 < 500ms
- 支持离线使用（Service Worker）

### Security
- 所有逻辑运行在客户端，不收集用户数据
- 无后端服务器，无数据存储
- 符合 GDPR 隐私要求
- 无外部追踪脚本（除基础访问统计）

### Integration
- **Vercel**: 自动部署与CDN
- **GitHub Pages**: 备用部署方案
- **html2canvas**: 客户端图片生成
- **Chart.js**: 雷达图可视化

### Technology Stack
- 前端框架: React / Vue 3
- 样式: Tailwind CSS
- 图表: Chart.js / Recharts
- 部署: Vercel + GitHub Actions
- 目标环境: 现代浏览器，移动端优先

---

## MVP Scope & Phasing

### Phase 1: MVP (初始上线)
- ✅ 20道测试题完整流程
- ✅ 六边形雷达图结果展示
- ✅ 等级评定系统
- ✅ 移动端完美适配
- ✅ 马卡龙配色UI
- ✅ 结果分享图片生成

**MVP Definition**: 可以正常完成测试、查看结果并分享的最小可用版本。

### Phase 2: 上线后优化
- 📌 更多等级的评价文案
- 📌 结果页面动画效果增强
- 📌 社交平台直接分享按钮
- 📌 深色模式支持

### Future Considerations
- 🔮 更多测试维度与题目
- 🔮 用户提交题目功能
- 🔮 结果对比功能
- 🔮 多语言版本

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| 移动端浏览器图片生成兼容性 | 中 | 中 | 降级方案：提供截图引导，备用纯文本分享 |
| 社交媒体平台图片拦截 | 中 | 低 | 同时提供链接分享与图片下载 |
| 雷达图在小屏幕显示效果 | 低 | 中 | 提前在多种真机尺寸测试优化 |
| Vercel 访问速度在国内 | 高 | 中 | 同时部署 GitHub Pages 作为镜像 |

---

## Dependencies & Blockers

**Dependencies:**
- Chart.js / 同类雷达图库
- html2canvas / dom-to-image
- Tailwind CSS 配色预设

**Known Blockers:**
- 暂无已知 blockers

---

## Appendix

### Glossary
- **男娘**: 二次元社群用语，指外貌、性格、行为偏向女性化的男性，无贬义
- **雷达图**: 同时显示多个维度数据的多边形图表，适合此类属性测试
- **马卡龙色**: 低饱和度、柔和明亮的配色风格，具有可爱清新的视觉效果

### References
- [VRChat 社群文化参考](https://vrchat.com/)
- [六边形雷达图设计规范](https://www.chartjs.org/docs/latest/charts/radar.html)
- [马卡龙配色参考](https://colorhunt.co/palettes/pastel)

---

*本PRD通过交互式需求收集与质量评分流程生成，完整覆盖了业务、功能、用户体验与技术维度的所有关键要求。*
