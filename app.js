/**
 * 男娘指数测试 - 主逻辑
 */

let currentQuestion = 0;
let answers = [];
let result = null;

// 页面元素
const pages = {
  welcome: document.getElementById('welcome-page'),
  question: document.getElementById('question-page'),
  result: document.getElementById('result-page')
};

function showPage(pageName) {
  Object.values(pages).forEach(p => p.classList.remove('active'));
  pages[pageName].classList.add('active');
}

function updateProgress() {
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  document.getElementById('progress-bar').style.width = `${progress}%`;
  document.getElementById('progress-text').textContent = `第 ${currentQuestion + 1} / ${QUESTIONS.length} 题`;
}

function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  document.getElementById('question-text').textContent = q.text;
  updateProgress();
}

function answer(value) {
  answers.push(value);
  currentQuestion++;

  // 题目切换动画
  const questionPage = document.getElementById('question-page');
  questionPage.style.opacity = '0';
  questionPage.style.transform = 'translateX(40px)';

  setTimeout(() => {
    if (currentQuestion >= QUESTIONS.length) {
      finishTest();
    } else {
      renderQuestion();
      questionPage.style.opacity = '1';
      questionPage.style.transform = 'translateX(0)';
    }
  }, 250);
}

function finishTest() {
  result = calculateScore(answers);

  // 添加加载过渡动画
  document.getElementById('question-page').classList.add('fade-out');

  setTimeout(() => {
    showPage('result');
    document.getElementById('result-rank').textContent = result.rank;
    document.getElementById('result-score').textContent = `综合得分: ${result.total}分`;

    // 生成性格分析报告
    document.getElementById('personality-report').textContent = generateReport(result.scores);
  }, 400);
}

function restart() {
  currentQuestion = 0;
  answers = [];
  result = null;
  showPage('welcome');
}

// 事件绑定
document.getElementById('start-btn').addEventListener('click', () => {
  currentQuestion = 0;
  answers = [];
  showPage('question');
  renderQuestion();
});

document.getElementById('btn-yes').addEventListener('click', () => answer(true));
document.getElementById('btn-no').addEventListener('click', () => answer(false));
document.getElementById('btn-restart').addEventListener('click', restart);

console.log('✅ 男娘指数测试 已加载完成');
