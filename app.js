/**
 * 答题流程状态机实现
 * 实现欢迎页面、答题页面、结果页面三个状态的切换
 * 包含进度条、页面切换动画、答题逻辑
 */

import { initShareButtons, decodeShareLink } from './share.js';

const QuizStateMachine = {
    // 状态定义
    states: {
        WELCOME: 'welcome',
        QUESTION: 'question',
        RESULT: 'result'
    },

    // 当前状态
    currentState: null,

    // 答题数据
    data: {
        currentQuestionIndex: 0,
        answers: [],
        score: 0
    },

    /**
     * 初始化状态机
     */
    init() {
        this.bindEvents();
        this.transitionTo(this.states.WELCOME);
    },

    /**
     * 状态切换方法
     * @param {string} newState - 目标状态
     */
    transitionTo(newState) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.classList.add('hidden');
        });

        // 执行状态进入逻辑
        switch (newState) {
            case this.states.WELCOME:
                this.enterWelcomeState();
                break;
            case this.states.QUESTION:
                this.enterQuestionState();
                break;
            case this.states.RESULT:
                this.enterResultState();
                break;
        }

        this.currentState = newState;
    },

    /**
     * 进入欢迎页面状态
     */
    enterWelcomeState() {
        const welcomePage = document.getElementById('welcome-page');
        welcomePage.classList.remove('hidden');

        // 添加进入动画
        setTimeout(() => {
            welcomePage.classList.add('active');
        }, 50);

        // 重置答题数据
        this.data.currentQuestionIndex = 0;
        this.data.answers = [];
        this.data.score = 0;
        this.updateProgressBar();
    },

    /**
     * 进入答题页面状态
     */
    enterQuestionState() {
        const questionPage = document.getElementById('question-page');
        questionPage.classList.remove('hidden');

        setTimeout(() => {
            questionPage.classList.add('active');
        }, 50);

        this.renderCurrentQuestion();
        this.updateProgressBar();
    },

    /**
     * 进入结果页面状态
     */
    enterResultState() {
        const resultPage = document.getElementById('result-page');
        resultPage.classList.remove('hidden');

        setTimeout(() => {
            resultPage.classList.add('active');
        }, 50);

        this.calculateScore();
        this.renderResult();
    },

    /**
     * 渲染当前题目
     */
    renderCurrentQuestion() {
        const question = QUESTIONS[this.data.currentQuestionIndex];
        const container = document.getElementById('question-container');

        container.innerHTML = `
            <div class="question-card animate-fade-in">
                <h3 class="question-text">${question.text}</h3>
                <div class="options-list">
                    ${question.options.map((option, index) => `
                        <button class="option-btn" data-index="${index}">
                            <span class="option-label">${String.fromCharCode(65 + index)}</span>
                            <span class="option-text">${option}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // 绑定选项点击事件
        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAnswerSelect(parseInt(e.currentTarget.dataset.index)));
        });
    },

    /**
     * 处理答案选择
     * @param {number} optionIndex - 选中的选项索引
     */
    handleAnswerSelect(optionIndex) {
        this.data.answers[this.data.currentQuestionIndex] = optionIndex;

        // 显示选中状态
        document.querySelectorAll('.option-btn').forEach((btn, idx) => {
            btn.classList.remove('selected');
            if (idx === optionIndex) {
                btn.classList.add('selected');
            }
        });

        // 延迟后切换到下一题或结果
        setTimeout(() => {
            if (this.data.currentQuestionIndex < QUESTIONS.length - 1) {
                this.data.currentQuestionIndex++;
                this.renderCurrentQuestion();
                this.updateProgressBar();
            } else {
                this.transitionTo(this.states.RESULT);
            }
        }, 600);
    },

    /**
     * 更新进度条
     */
    updateProgressBar() {
        const progress = ((this.data.currentQuestionIndex + 1) / QUESTIONS.length) * 100;
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = `${progress}%`;

        document.getElementById('progress-text').textContent =
            `题目 ${this.data.currentQuestionIndex + 1} / ${QUESTIONS.length}`;
    },

    /**
     * 计算最终得分
     */
    calculateScore() {
        this.data.score = calculateScore(this.data.answers);
    },

    /**
     * 渲染结果页面
     */
    renderResult() {
        const resultContainer = document.getElementById('result-container');
        const result = getResultDescription(this.data.score);
        const dimensionScores = calculateDimensionScores(this.data.answers);

        resultContainer.innerHTML = `
            <div class="result-card animate-fade-in">
                <div class="score-header">
                    <div class="score-display">
                        <div class="score-value">${this.data.score}</div>
                        <div class="score-label">综合得分</div>
                    </div>
                    <div class="level-badge">
                        <span class="level-text">${result.level}</span>
                    </div>
                </div>

                <div class="radar-chart-container">
                    <canvas id="radar-chart" width="300" height="300"></canvas>
                </div>

                <div class="result-description">
                    <h4>${result.title}</h4>
                    <p>${result.description}</p>
                </div>

                <div class="dimension-scores">
                    ${dimensionScores.map((score, index) => `
                        <div class="dimension-item">
                            <span class="dimension-name">${RadarChartComponent.dimensions[index]}</span>
                            <div class="dimension-bar">
                                <div class="dimension-fill" style="width: ${score}%"></div>
                            </div>
                            <span class="dimension-score">${score}</span>
                        </div>
                    `).join('')}
                </div>

                <button id="restart-btn" class="restart-btn">重新测试</button>
            </div>
        `;

        // 初始化雷达图
        setTimeout(() => {
            RadarChartComponent.init('radar-chart', dimensionScores);
        }, 100);

        document.getElementById('restart-btn').addEventListener('click', () => {
            RadarChartComponent.destroy();
            this.transitionTo(this.states.WELCOME);
        });

        // 初始化分享按钮
        const resultCard = resultContainer.querySelector('.result-card');
        initShareButtons(resultCard, () => {
            return {
                score: this.data.score,
                answers: this.data.answers,
                timestamp: Date.now()
            };
        });
    },

    /**
     * 绑定全局事件
     */
    bindEvents() {
        // 开始测试按钮
        document.getElementById('start-btn').addEventListener('click', () => {
            this.transitionTo(this.states.QUESTION);
        });
    }
};

// 页面加载完成后初始化状态机
document.addEventListener('DOMContentLoaded', () => {
    QuizStateMachine.init();
    console.log('答题状态机已初始化');
});
