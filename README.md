# 职业胜任力雷达测评系统

一个基于 HTML5 Canvas 的交互式职业胜任力测评工具，支持 6 大维度能力评估、自动评分计算、雷达图可视化与结果分享。

## ✨ 功能特性

- 📋 结构化测评问卷：6 个维度，30 道专业题目
- 📊 实时雷达图可视化：Canvas 高性能渲染，动态过渡动画
- 🎯 智能评分系统：自动计算维度得分与综合评分
- 📤 结果分享功能：生成可分享的结果卡片与数据链接
- 📱 完全响应式设计：适配桌面与移动设备
- 🚀 零依赖原生实现：无需构建工具，直接部署运行

## 🚀 快速部署

### Vercel 一键部署
1. Fork 本项目到你的 GitHub
2. 访问 [Vercel](https://vercel.com/new) 导入仓库
3. 点击 Deploy 即可完成部署

### GitHub Pages 部署
1. 在仓库设置中开启 GitHub Pages
2. 选择 `main` 分支作为源
3. 访问 `your-username.github.io/repo-name` 即可使用

### 本地运行
```bash
# 直接在浏览器打开 index.html 即可
# 或者使用任意静态文件服务器
npx serve .
```

## 📂 项目结构
```
.
├── index.html          # 主页面
├── style.css           # 样式文件
├── app.js              # 应用主逻辑
├── questions.js        # 测评题库配置
├── scoring.js          # 评分算法
├── radar-chart.js      # 雷达图渲染引擎
├── share.js            # 分享功能
├── vercel.json         # Vercel 部署配置
└── docs/               # 文档目录
```

## 🛠️ 技术栈
- 原生 HTML5 / CSS3 / JavaScript (ES6+)
- Canvas 2D 图形渲染
- 本地存储 (LocalStorage)
- 无外部依赖，无构建流程

## 📋 使用流程
1. 开始测评 → 填写个人信息
2. 按顺序完成 30 道测评题目
3. 系统自动计算各维度得分
4. 查看雷达图分析报告
5. 保存或分享测评结果

## 📄 许可证
MIT License

## 🤝 贡献
欢迎提交 Issue 和 Pull Request 来改进本项目。
