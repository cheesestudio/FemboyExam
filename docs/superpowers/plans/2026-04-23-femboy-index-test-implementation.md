# 男娘指数测试网站 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal**: 实现一个设计精美、移动端优先的男娘指数测试网站，包含20道题目、六边形雷达图结果展示与分享功能。

**Architecture**: 纯客户端单页应用，无后端服务器。采用状态机管理测试流程，所有逻辑运行在浏览器端。使用URL hash编码测试结果实现无存储分享。

**Tech Stack**: 
- 纯原生 HTML + CSS + JavaScript (无框架，最小化体积)
- Tailwind CSS v3 样式
- Chart.js v4 雷达图
- html2canvas 图片生成
- 零外部依赖 零运行时 API 调用

---

## 项目文件结构

```
├── index.html              # 入口文件
├── style.css               # 马卡龙配色与样式
├── app.js                  # 主应用逻辑
├── questions.js            # 20道测试题与权重定义
├── scoring.js              # 评分算法与等级系统
├── radar-chart.js          # 雷达图封装
├── share.js                # 分享与图片生成
└── vercel.json             # Vercel 部署配置
```

---

## Task 1: 项目初始化与基础布局

**Files:**
- Create: `index.html`
- Create: `style.css`

- [ ] **Step 1: 创建基础 HTML 骨架**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>男娘指数测试</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
    <div id="app" class="max-w-md mx-auto px-4 py-8">
        <!-- 页面内容将通过 JS 渲染 -->
    </div>
    <script src="questions.js"></script>
    <script src="scoring.js"></script>
    <script src="radar-chart.js"></script>
    <script src="share.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: 创建马卡龙配色样式文件**

```css
:root {
  --macaron-pink: #FFB6C1;
  --macaron-purple: #DDA0DD;
  --macaron-blue: #B0E0E6;
  --macaron-yellow: #FFFACD;
  --macaron-green: #98FB98;
  --macaron-orange: #FFDAB9;
}

* {
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.answer-btn {
  transition: all 0.2s ease;
  transform: translateY(0);
}

.answer-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 182, 193, 0.4);
}

.progress-bar {
  height: 8px;
  border-radius: 4px;
  background: rgba(255,255,255,0.3);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--macaron-pink), var(--macaron-purple));
  transition: width 0.3s ease;
}

.card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 182, 193, 0.2);
}
```

- [ ] **Step 3: 提交初始化**

```bash
git add index.html style.css
git commit -m "init: project base structure and macaron styling"
```

---

## Task 2: 测试题目与评分系统

**Files:**
- Create: `questions.js`
- Create: `scoring.js`

- [ ] **Step 1: 定义20道测试题与维度权重**

```javascript
const QUESTIONS = [
  { id: 1, text: "你会下意识用可爱的语气词吗？", weights: { soft: 15, shy: 5, feminine: 10 } },
  { id: 2, text: "拍照时喜欢比耶或者托脸吗？", weights: { soft: 10, feminine: 15 } },
  { id: 3, text: "害怕一个人走夜路吗？", weights: { shy: 10, feminine: 5 } },
  { id: 4, text: "声音比较轻柔或者偏高吗？", weights: { voice: 20 } },
  { id: 5, text: "有时候会觉得当女生更好吗？", weights: { identity: 20 } },
  { id: 6, text: "买衣服会优先看好看而不是实用吗？", weights: { feminine: 15, soft: 5 } },
  { id: 7, text: "容易害羞脸红吗？", weights: { shy: 20 } },
  { id: 8, text: "曾经尝试过女装或者想尝试吗？", weights: { action: 20, feminine: 5 } },
  { id: 9, text: "喜欢可爱的小动物吗？", weights: { soft: 15 } },
  { id: 10, text: "被夸奖的时候会不好意思吗？", weights: { shy: 10, identity: 5 } },
  { id: 11, text: "对化妆、护肤有了解或者感兴趣吗？", weights: { feminine: 15, action: 10 } },
  { id: 12, text: "有人说过你说话很软萌吗？", weights: { voice: 15, soft: 10 } },
  { id: 13, text: "玩游戏会选女性角色吗？", weights: { identity: 15, feminine: 5 } },
  { id: 14, text: "不喜欢和人起冲突吗？", weights: { shy: 10, soft: 5 } },
  { id: 15, text: "会模仿动漫里女孩子的说话方式吗？", weights: { voice: 15, soft: 5 } },
  { id: 16, text: "曾经戴过假发或者头饰吗？", weights: { action: 18, feminine: 7 } },
  { id: 17, text: "吃甜食会开心吗？", weights: { soft: 12 } },
  { id: 18, text: "觉得自己内心更偏向女性吗？", weights: { identity: 20 } },
  { id: 19, text: "走路姿势比较轻盈吗？", weights: { feminine: 10, action: 5 } },
  { id: 20, text: "如果可以的话想变成女孩子吗？", weights: { identity: 15, action: 15, feminine: 10 } }
];

const DIMENSIONS = ['soft', 'shy', 'feminine', 'voice', 'identity', 'action'];
const DIMENSION_NAMES = {
  soft: '软萌度',
  shy: '娇羞度',
  feminine: '女性化',
  voice: '声线天赋',
  identity: '心理认同',
  action: '行动力'
};
```

- [ ] **Step 2: 实现评分算法与等级系统**

```javascript
function calculateScore(answers) {
  const scores = { soft: 0, shy: 0, feminine: 0, voice: 0, identity: 0, action: 0 };
  const maxScores = { soft: 0, shy: 0, feminine: 0, voice: 0, identity: 0, action: 0 };
  
  QUESTIONS.forEach((q, i) => {
    Object.entries(q.weights).forEach(([dim, weight]) => {
      maxScores[dim] += weight;
      if (answers[i]) scores[dim] += weight;
    });
  });

  const normalized = {};
  let total = 0;
  DIMENSIONS.forEach(d => {
    normalized[d] = Math.round((scores[d] / maxScores[d]) * 100);
    total += normalized[d];
  });
  
  const average = Math.round(total / 6);
  
  let rank;
  if (average >= 90) rank = 'S';
  else if (average >= 75) rank = 'A';
  else if (average >= 60) rank = 'B';
  else if (average >= 40) rank = 'C';
  else rank = 'D';

  return { scores: normalized, total: average, rank };
}
```

- [ ] **Step 3: 提交评分系统**

```bash
git add questions.js scoring.js
git commit -m "feat: add questions database and scoring algorithm"
```

---

## Task 3: 答题流程状态机

**Files:**
- Create: `app.js`

- [ ] **Step 1: 实现完整答题流程**

```javascript
const state = {
  screen: 'welcome',
  currentQuestion: 0,
  answers: [],
  result: null
};

function render() {
  const app = document.getElementById('app');
  
  switch(state.screen) {
    case 'welcome':
      app.innerHTML = `
        <div class="card p-8 text-center">
          <h1 class="text-3xl font-bold mb-4 text-pink-500">✨ 男娘指数测试 ✨</h1>
          <p class="text-gray-600 mb-8">一共20道题目，测试你到底有多可爱！</p>
          <button onclick="startTest()" class="answer-btn w-full py-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg">
            开始测试
          </button>
        </div>
      `;
      break;
      
    case 'question':
      const q = QUESTIONS[state.currentQuestion];
      const progress = ((state.currentQuestion) / QUESTIONS.length) * 100;
      app.innerHTML = `
        <div class="progress-bar mb-6">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="text-center text-gray-500 mb-4">第 ${state.currentQuestion + 1} / ${QUESTIONS.length} 题</div>
        <div class="card p-8">
          <h2 class="text-xl font-medium mb-8 text-center">${q.text}</h2>
          <div class="grid grid-cols-2 gap-4">
            <button onclick="answer(true)" class="answer-btn py-4 rounded-xl bg-pink-200 text-pink-700 font-bold">✅ 是</button>
            <button onclick="answer(false)" class="answer-btn py-4 rounded-xl bg-gray-200 text-gray-700 font-bold">❌ 否</button>
          </div>
        </div>
      `;
      break;
      
    case 'result':
      renderResult();
      break;
  }
}

function startTest() {
  state.screen = 'question';
  state.currentQuestion = 0;
  state.answers = [];
  render();
}

function answer(value) {
  state.answers.push(value);
  state.currentQuestion++;
  
  if (state.currentQuestion >= QUESTIONS.length) {
    state.result = calculateScore(state.answers);
    state.screen = 'result';
  }
  
  render();
}

document.addEventListener('DOMContentLoaded', render);
```

- [ ] **Step 4: 提交答题系统**

```bash
git add app.js
git commit -m "feat: complete test flow state machine"
```

---

## Task 4: 雷达图可视化结果页面

**Files:**
- Create: `radar-chart.js`
- Modify: `app.js`

- [ ] **Step 1: 封装雷达图组件**

```javascript
function renderRadarChart(canvasId, scores) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: DIMENSIONS.map(d => DIMENSION_NAMES[d]),
      datasets: [{
        data: DIMENSIONS.map(d => scores[d]),
        backgroundColor: 'rgba(255, 182, 193, 0.5)',
        borderColor: '#FF69B4',
        borderWidth: 3,
        pointBackgroundColor: '#FF69B4',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#FF69B4'
      }]
    },
    options: {
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { stepSize: 20 },
          grid: { color: 'rgba(255, 182, 193, 0.2)' },
          angleLines: { color: 'rgba(255, 182, 193, 0.3)' }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}
```

- [ ] **Step 2: 实现结果页面渲染**

在 `app.js` 中添加 `renderResult()` 函数。

- [ ] **Step 3: 提交雷达图功能**

```bash
git add radar-chart.js app.js
git commit -m "feat: hexagon radar chart result visualization"
```

---

## Task 5: 分享功能与图片生成

**Files:**
- Create: `share.js`

- [ ] **Step 1: 实现URL编码分享**

```javascript
function encodeResult(scores) {
  const data = btoa(JSON.stringify(scores));
  return window.location.origin + window.location.pathname + '#' + data;
}

function decodeResult() {
  if (window.location.hash) {
    try {
      return JSON.parse(atob(window.location.hash.slice(1)));
    } catch(e) {
      return null;
    }
  }
  return null;
}

async function generateShareImage() {
  const resultCard = document.getElementById('result-card');
  const canvas = await html2canvas(resultCard, {
    backgroundColor: '#FFB6C1',
    scale: 2
  });
  
  const link = document.createElement('a');
  link.download = '男娘指数测试结果.png';
  link.href = canvas.toDataURL();
  link.click();
}
```

- [ ] **Step 2: 提交分享功能**

```bash
git add share.js
git commit -m "feat: share link and image generation"
```

---

## Task 6: 部署配置与最终测试

**Files:**
- Create: `vercel.json`
- Create: `README.md`

- [ ] **Step 1: Vercel 部署配置**

```json
{
  "version": 2,
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

- [ ] **Step 2: 运行完整测试**

打开 `index.html` 在浏览器中测试完整流程：
- ✅ 欢迎页面正常显示
- ✅ 20道题可以正常作答
- ✅ 进度条正确更新
- ✅ 结果页面正确生成雷达图
- ✅ 等级与分数正确显示
- ✅ 分享图片可以正确下载
- ✅ 分享链接可以正确加载结果

- [ ] **Step 3: 提交最终版本**

```bash
git add vercel.json README.md
git commit -m "feat: deployment configuration and documentation"
git push
```

---

## 验收检查清单

✅ 所有PRD需求已覆盖
✅ 移动端完美适配
✅ 马卡龙配色风格统一
✅ 六边形雷达图正常显示六个维度
✅ S/A/B/C/D 等级系统正确
✅ 分享功能正常工作
✅ 零后端依赖 纯客户端运行
✅ Lighthouse 移动端评分 > 95

---

计划已完成并保存到 `docs/superpowers/plans/2026-04-23-femboy-index-test-implementation.md`

### 执行选项

**1. 子agent驱动执行 (推荐)** - 每个任务分配独立子agent，分步执行并审核，快速迭代

**2. 内联执行** - 在当前会话中按顺序执行任务，带检查审核点

您希望选择哪种执行方式？
