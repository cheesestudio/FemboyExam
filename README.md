# ✨ 男娘指数测试 | Femboy Exam

一个面向二次元社群的趣味心理测试网站，通过20道题目评估你的男娘属性指数，生成美观的六边形雷达图报告。

🌐 **在线演示**: https://cheesestudio.github.io/FemboyExam/

## ✨ 功能特性

- 📋 20道趣味测试题，六个维度精准评估
- 📊 六边形雷达图可视化，马卡龙可爱配色
- 🎯 S/A/B/C/D 五级评分系统
- 📱 移动端优先完美适配
- 🚀 纯客户端运行，零后端零数据收集
- 💾 不需要注册，不需要登录，刷新即重来

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
├── vercel.json         # Vercel 部署配置
└── docs/               # 文档目录
```

## 🛠️ 技术栈
- 原生 HTML5 / CSS3 / JavaScript (ES6+)
- Canvas 2D 图形渲染
- 本地存储 (LocalStorage)
- 无外部依赖，无构建流程

## 📋 使用流程
1. 打开网站点击开始测试
2. 按顺序完成 20 道是/否选择题
3. 自动生成你的男娘指数报告
4. 查看六维雷达图分析

## 📄 许可证
MIT License

## 🤝 贡献
欢迎提交 Issue 和 Pull Request 来改进本项目。
