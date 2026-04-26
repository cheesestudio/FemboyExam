/**
 * 男娘指数测试 - 主逻辑
 * 16P风格重构版
 * @version 2.0.0
 */

let currentQuestion = 0;
let answers = [];
let result = null;

// 全局错误处理
window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
});

/**
 * 设置 ARIA 属性
 */
function setAriaHidden() {
    Object.values(pages).forEach(p => {
        if (p) p.setAttribute('aria-hidden', 'true');
    });
}

// 页面元素引用
const pages = {
    welcome: document.getElementById('welcome-page'),
    question: document.getElementById('question-page'),
    result: document.getElementById('result-page')
};

/**
 * 显示指定页面
 */
function showPage(pageName) {
    // 先移除当前页面的焦点，避免aria-hidden冲突
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
    }
    Object.values(pages).forEach(p => {
        if (p) {
            p.classList.remove('active');
            p.setAttribute('aria-hidden', 'true');
        }
    });
    if (pages[pageName]) {
        pages[pageName].classList.add('active');
        pages[pageName].setAttribute('aria-hidden', 'false');
    }
}

/**
 * 更新进度条
 */
function updateProgress() {
    const total = QUESTIONS.length;
    const progress = ((currentQuestion + 1) / total) * 100;

    const progressFill = document.getElementById('progress-fill');
    const progressCounter = document.getElementById('progress-counter');

    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    if (progressCounter) {
        progressCounter.textContent = `${currentQuestion + 1} / ${total}`;
    }
}

/**
 * 渲染当前问题
 */
function renderQuestion() {
    const q = QUESTIONS[currentQuestion];
    if (!q) return;

    const questionText = document.getElementById('question-text');
    const questionNum = document.getElementById('question-num');

    if (questionText) {
        questionText.textContent = q.text;
    }
    if (questionNum) {
        questionNum.textContent = currentQuestion + 1;
    }

    // 根据问题是否带有weights来决定显示内容
    // 选项文本现在由HTML中的option-label处理，不需要动态设置

    updateProgress();

    // 重置选择状态
    const yesBtn = document.getElementById('btn-yes');
    const noBtn = document.getElementById('btn-no');
    if (yesBtn) yesBtn.classList.remove('selected');
    if (noBtn) noBtn.classList.remove('selected');
}

/**
 * 处理答案选择
 */
function answer(value) {
    answers.push(value);

    // 添加点击反馈
    const btn = value ? document.getElementById('btn-yes') : document.getElementById('btn-no');
    if (btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    }

    currentQuestion++;

    // 提前加载下一题数据
    if (currentQuestion < QUESTIONS.length) {
        setTimeout(() => {
            renderQuestion();
        }, 200);
    } else {
        setTimeout(() => {
            finishTest();
        }, 200);
    }
}

/**
 * 完成测试
 */
function finishTest() {
    result = calculateScore(answers);

    // 切换到结果页
    setTimeout(() => {
        showPage('result');
        renderResult();
    }, 300);
}

/**
 * 渲染结果页面
 */
function renderResult() {
    if (!result) return;

    const rankElement = document.getElementById('result-rank');
    const rankLabel = document.getElementById('rank-label');
    const scoreElement = document.getElementById('result-score');
    const reportElement = document.getElementById('personality-report');
    const dimensionsList = document.getElementById('dimensions-list');
    const radarCanvas = document.getElementById('radar-chart');

    // 设置等级和得分
    if (rankElement) {
        rankElement.textContent = result.rank;
    }
    if (rankLabel) {
        const rankMap = {
            'Saob': '天才级',
            'A': '优秀级',
            'B': '良好级',
            'C': '及格级',
            'D': '待提升'
        };
        rankLabel.textContent = rankMap[result.rank] || '级';
    }
    if (scoreElement) {
        scoreElement.textContent = result.total;
    }

    // 生成性格分析报告
    if (reportElement && window.generateReport) {
        // 将6个维度的百分制得分转换为0-3的级别
        const scoreArray = DIMENSIONS.map(dim => {
            const val = result.scores[dim] || 0;
            return Math.max(0, Math.min(3, Math.ceil(val / 34)));
        });

        try {
            const reportData = generateReport(scoreArray);
            reportElement.textContent = reportData.report;
        } catch (e) {
            console.error('Report generation error:', e);
            reportElement.textContent = '报告生成出错，请稍后重试';
        }
    }

    // 渲染维度得分条
    if (dimensionsList) {
        // 使用 replaceChildren 替代 innerHTML
        dimensionsList.replaceChildren();
        DIMENSIONS.forEach((dim, index) => {
            const dimNameMap = {
                soft: '软萌度',
                shy: '娇羞度',
                feminine: '女性化',
                voice: '声线天赋',
                identity: '心理认同',
                action: '行动力'
            };

            // 使用 createElement 替代 innerHTML
            const item = document.createElement('div');
            item.className = 'dimension-item';
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.setAttribute('aria-label', `${dimNameMap[dim] || dim} 得分: ${result.scores[dim] || 0}分`);

            const colorDot = document.createElement('span');
            colorDot.className = `dim-color-dot ${dim}`;
            colorDot.setAttribute('aria-hidden', 'true');

            const nameSpan = document.createElement('span');
            nameSpan.className = 'dim-name';
            nameSpan.textContent = dimNameMap[dim] || dim;

            const barContainer = document.createElement('div');
            barContainer.className = 'dim-bar-container';

            const bar = document.createElement('div');
            bar.className = `dim-bar ${dim}`;
            bar.style.width = '0%';
            bar.setAttribute('aria-label', '得分进度条');
            barContainer.appendChild(bar);

            const scoreSpan = document.createElement('span');
            scoreSpan.className = 'dim-score';
            scoreSpan.textContent = `${result.scores[dim] || 0}分`;

            item.appendChild(colorDot);
            item.appendChild(nameSpan);
            item.appendChild(barContainer);
            item.appendChild(scoreSpan);
            dimensionsList.appendChild(item);

            // 延迟动画
            setTimeout(() => {
                item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';

                setTimeout(() => {
                    bar.style.width = `${result.scores[dim] || 0}%`;
                }, 100);
            }, index * 100);
        });
    }

    // 初始化雷达图
    if (radarCanvas) {
        const radarScores = DIMENSIONS.map(dim => result.scores[dim] || 0);
        // 延迟初始化，确保DOM已准备好
        setTimeout(() => {
            if (window.RadarChartComponent) {
                window.RadarChartComponent.init('radar-chart', radarScores);
            } else {
                console.error('RadarChartComponent not found! Check if radar-chart.js loaded correctly and Chart.js CDN is accessible.');
                // Hide canvas and show fallback message
                radarCanvas.style.display = 'none';
                const parent = radarCanvas.parentElement;
                if (parent) {
                    const hint = document.createElement('div');
                    hint.style.cssText = 'text-align:center;padding:20px;color:var(--text-muted);font-size:0.9rem;';
                    hint.textContent = '图表加载失败，请检查网络连接并刷新页面';
                    parent.appendChild(hint);
                }
            }
        }, 100);
    }
}

/**
 * 重新开始
 */
function restart() {
    currentQuestion = 0;
    answers = [];
    result = null;

    // 销毁雷达图
    if (window.RadarChartComponent) {
        window.RadarChartComponent.destroy();
    }

    showPage('welcome');
}

// ============================================
// 事件绑定
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const yesBtn = document.getElementById('btn-yes');
    const noBtn = document.getElementById('btn-no');
    const restartBtn = document.getElementById('btn-restart');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            currentQuestion = 0;
            answers = [];
            showPage('question');
            renderQuestion();
        });
    }

    if (yesBtn) {
        yesBtn.addEventListener('click', () => answer(true));
        yesBtn.setAttribute('aria-label', '选择是 - 按键 1 或 右方向键');
    }

    if (noBtn) {
        noBtn.addEventListener('click', () => answer(false));
        noBtn.setAttribute('aria-label', '选择否 - 按键 2 或 左方向键');
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', restart);
        restartBtn.setAttribute('aria-label', '重新开始测试');
    }

    // 键盘支持
    document.addEventListener('keydown', (e) => {
        if (pages.question.classList.contains('active')) {
            if (e.key === '1' || e.key === 'y' || e.key === 'Y' || e.key === 'ArrowRight') {
                if (currentQuestion < QUESTIONS.length) {
                    answer(true);
                }
            } else if (e.key === '2' || e.key === 'n' || e.key === 'N' || e.key === 'ArrowLeft') {
                if (currentQuestion < QUESTIONS.length) {
                    answer(false);
                }
            }
        }
    });

    console.log('⭐ 男娘指数测试 - 16P风格版本 已加载完成');
});
