/**
 * 分享功能模块 - URL编码解码 + 图片分享
 * 实现无存储分享功能，通过URL hash编码测试结果，并生成分享图片
 */

/**
 * 编码测试结果到URL hash
 * @param {Object} scores - 包含六个维度得分的对象
 * @returns {string} 包含编码结果的完整URL
 */
function encodeResult(scores) {
    const data = btoa(JSON.stringify(scores));
    return window.location.origin + window.location.pathname + '#result=' + data;
}

/**
 * 从URL hash解码测试结果
 * @returns {Object|null} 解码后的得分对象，如果无效则返回null
 */
function decodeResult() {
    if (window.location.hash) {
        try {
            // 支持旧的格式（直接编码对象）和新的格式（带result=前缀）
            let hash = window.location.hash.slice(1);
            if (hash.startsWith('result=')) {
                hash = hash.substring(7);
            }
            return JSON.parse(atob(hash));
        } catch (e) {
            console.error('Failed to decode result from URL:', e);
            return null;
        }
    }
    return null;
}

/**
 * 生成并复制分享链接到剪贴板
 * @param {Object} scores - 测试得分
 * @returns {Promise<boolean>} 是否成功复制
 */
async function copyShareLink(scores) {
    const shareUrl = encodeResult(scores);

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(shareUrl);
            return true;
        } else {
            // 降级方案：创建临时输入框
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                textArea.remove();
                return true;
            } catch (err) {
                textArea.remove();
                console.error('Fallback copy failed:', err);
                return false;
            }
        }
    } catch (err) {
        console.error('Copy to clipboard failed:', err);
        return false;
    }
}

/**
 * 显示非阻塞通知
 * @param {string} message - 通知消息
 * @param {number} duration - 显示时长（毫秒）
 */
function showNotice(message, duration = 2000) {
    // 移除已存在的通知
    const existingNotice = document.querySelector('.share-notice');
    if (existingNotice) {
        existingNotice.remove();
    }

    const notice = document.createElement('div');
    notice.className = 'share-notice';
    notice.textContent = message;
    notice.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(91, 58, 158, 0.95);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 8px 32px rgba(91, 58, 158, 0.3);
        animation: noticeFadeIn 0.3s ease-out;
    `;

    document.body.appendChild(notice);

    setTimeout(() => {
        notice.style.animation = 'noticeFadeOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (notice.parentNode) {
                notice.remove();
            }
        }, 300);
    }, duration);
}

/**
 * 生成分享图片
 * @param {Object} result - 结果对象
 * @param {Object} result.scores - 各维度得分对象
 * @param {number} result.total - 综合得分
 * @param {string} result.rank - 评级
 * @returns {Promise<string>} 图片的dataURL
 */
async function generateShareImage(result) {
    if (!result || !result.scores) {
        throw new Error('Invalid result object');
    }

    return new Promise((resolve, reject) => {
        try {
            // 创建canvas画布
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 白色背景尺寸 - 调整到更合适的尺寸
            const width = 750;
            const height = 1100;
            canvas.width = width;
            canvas.height = height;

            // 白色背景
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);

            // 绘制装饰元素
            drawDecorations(ctx, width, height);

            // 绘制标题
            drawTitle(ctx, width);

            // 绘制评级和得分
            drawRankAndScore(ctx, result, width);

            // 绘制雷达图
            drawRadarChart(ctx, result.scores, width, height);

            // 绘制维度得分条
            drawDimensionBars(ctx, result.scores, width, height);

            // 绘制性格分析报告
            drawReport(ctx, result, width, height);

            // 绘制底部信息
            drawFooter(ctx, width, height);

            // 转换为图片并下载
            const dataURL = canvas.toDataURL('image/png', 1.0);

            // 触发下载
            const link = document.createElement('a');
            link.download = `男娘指数测试结果-${Date.now()}.png`;
            link.href = dataURL;
            link.click();

            resolve(dataURL);
        } catch (error) {
            console.error('Image generation failed:', error);
            reject(error);
        }
    });
}

function drawDecorations(ctx, width, height) {
    // 绘制渐变装饰背景
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'rgba(91, 58, 158, 0.1)');
    gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.15)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)');

    // 顶部装饰条
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, 8);

    // 底部装饰条
    ctx.fillStyle = gradient;
    ctx.fillRect(0, height - 8, width, 8);

    // 装饰圆点
    ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.beginPath();
    ctx.arc(40, 40, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width - 40, height - 40, 20, 0, Math.PI * 2);
    ctx.fill();
}

function drawTitle(ctx, width) {
    // 标题背景
    ctx.fillStyle = '#5B3A9E';
    ctx.beginPath();
    ctx.roundRect(20, 20, width - 40, 60, 15);
    ctx.fill();

    // 标题文字
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px "PingFang SC", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ 男娘指数测试结果报告 ✨', width / 2, 50);
}

function drawRankAndScore(ctx, result, width) {
    const y = 110;

    // 评级背景
    const rankColors = {
        'Saob': '#FFD700',
        'A': '#4CAF50',
        'B': '#2196F3',
        'C': '#FF9800',
        'D': '#F44336'
    };

    const rankNames = {
        'Saob': '天才级',
        'A': '优秀级',
        'B': '良好级',
        'C': '及格级',
        'D': '待提升'
    };

    const color = rankColors[result.rank] || '#9C27B0';
    const rankName = rankNames[result.rank] || '未知';

    // 评级卡片
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(60, y, 120, 50, 12);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px "PingFang SC", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(result.rank, 120, y + 15);
    ctx.font = '12px "PingFang SC", -apple-system, sans-serif';
    ctx.fillText(rankName, 120, y + 35);

    // 综合得分
    ctx.fillStyle = '#2C2C2C';
    ctx.font = 'bold 24px "PingFang SC", -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${result.total}分`, 200, y + 25);

    ctx.fillStyle = '#666666';
    ctx.font = '14px "PingFang SC", -apple-system, sans-serif';
    ctx.fillText('综合得分', 200, y + 45);
}

function drawRadarChart(ctx, scores, centerX, centerY) {
    const radius = 100;
    const centerXPos = centerX / 2;
    const centerYPos = 340;

    const dimensions = [
        { name: '软萌度', key: 'soft', color: '#E966A0' },
        { name: '娇羞度', key: 'shy', color: '#60A5FA' },
        { name: '女性化', key: 'feminine', color: '#F472B6' },
        { name: '声线天赋', key: 'voice', color: '#A78BFA' },
        { name: '心理认同', key: 'identity', color: '#7C3AED' },
        { name: '行动力', key: 'action', color: '#8B5CF6' }
    ];

    // 绘制网格线
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;

    for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        const r = (radius * i) / 3;
        for (let j = 0; j < 6; j++) {
            const angle = (Math.PI * 2 * j) / 6 - Math.PI / 2;
            const x = centerXPos + Math.cos(angle) * r;
            const y = centerYPos + Math.sin(angle) * r;
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    // 绘制轴线
    dimensions.forEach((dim, i) => {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const x = centerXPos + Math.cos(angle) * radius;
        const y = centerYPos + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.moveTo(centerXPos, centerYPos);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 1;
        ctx.stroke();
    });

    // 绘制数据区域
    ctx.beginPath();
    dimensions.forEach((dim, i) => {
        const score = scores[dim.key] || 0;
        const r = (radius * score) / 100;
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const x = centerXPos + Math.cos(angle) * r;
        const y = centerYPos + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.closePath();

    // 填充区域
    ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.fill();

    // 绘制边框
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制数据点
    dimensions.forEach((dim, i) => {
        const score = scores[dim.key] || 0;
        const r = (radius * score) / 100;
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const x = centerXPos + Math.cos(angle) * r;
        const y = centerYPos + Math.sin(angle) * r;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = dim.color;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // 绘制标签
    ctx.fillStyle = '#2C2C2C';
    ctx.font = '12px "PingFang SC", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    dimensions.forEach((dim, i) => {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const x = centerXPos + Math.cos(angle) * (radius + 25);
        const y = centerYPos + Math.sin(angle) * (radius + 25);

        ctx.fillText(dim.name, x, y);
    });
}

function drawDimensionBars(ctx, scores, width, height) {
    const dimensions = [
        { name: '软萌度', key: 'soft', color: '#E966A0' },
        { name: '娇羞度', key: 'shy', color: '#60A5FA' },
        { name: '女性化', key: 'feminine', color: '#F472B6' },
        { name: '声线天赋', key: 'voice', color: '#A78BFA' },
        { name: '心理认同', key: 'identity', color: '#7C3AED' },
        { name: '行动力', key: 'action', color: '#8B5CF6' }
    ];

    const startX = (width - 300) / 2;
    const startY = 520;
    const barHeight = 20;
    const barSpacing = 30;
    const maxWidth = 300;

    ctx.font = '12px "PingFang SC", -apple-system, sans-serif';

    dimensions.forEach((dim, i) => {
        const y = startY + i * (barHeight + barSpacing);
        const score = scores[dim.key] || 0;
        const barWidth = (score / 100) * maxWidth;

        // 标签
        ctx.fillStyle = '#666666';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(dim.name, startX - 10, y + barHeight / 2);

        // 背景条
        ctx.fillStyle = '#F0F0F0';
        ctx.beginPath();
        ctx.roundRect(startX, y, maxWidth, barHeight, 10);
        ctx.fill();

        // 进度条
        ctx.fillStyle = dim.color;
        ctx.beginPath();
        ctx.roundRect(startX, y, barWidth, barHeight, 10);
        ctx.fill();

        // 分数
        ctx.fillStyle = '#2C2C2C';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${score}分`, startX + maxWidth + 10, y + barHeight / 2);
    });
}

function drawReport(ctx, result, width, height) {
    // 尝试获取性格分析报告
    let report = '生成性格分析报告失败';

    if (window.PersonalityReportGenerator && window.PersonalityReportGenerator.generateReport) {
        // 将百分制转换为0-3级别
        const scoreArray = [
            Math.max(0, Math.min(3, Math.ceil(result.scores.soft / 34))),
            Math.max(0, Math.min(3, Math.ceil(result.scores.shy / 34))),
            Math.max(0, Math.min(3, Math.ceil(result.scores.feminine / 34))),
            Math.max(0, Math.min(3, Math.ceil(result.scores.voice / 34))),
            Math.max(0, Math.min(3, Math.ceil(result.scores.identity / 34))),
            Math.max(0, Math.min(3, Math.ceil(result.scores.action / 34)))
        ];

        try {
            const reportData = window.PersonalityReportGenerator.generateReport(scoreArray);
            report = reportData.report || report;
        } catch (e) {
            console.error('Report generation error:', e);
        }
    } else if (window.generateReport) {
        // 兼容旧版本
        const scoreArray = [
            Math.max(0, Math.min(3, Math.ceil(result.scores.soft / 34))),
            Math.max(0, Math.min(3, Math.ceil(result.scores.shy / 34))),
            Math.max(0, Math.min(3, Math.ceil(result.scores.feminine / 34))),
            Math.max(0, Math.min(3, Math.ceil(result.scores.voice / 34))),
            Math.max(0, Math.min(3, Math.ceil(result.scores.identity / 34))),
            Math.max(0, Math.min(3, Math.ceil(result.scores.action / 34)))
        ];

        try {
            const reportData = generateReport(scoreArray);
            report = reportData.report || report;
        } catch (e) {
            console.error('Report generation error:', e);
        }
    }

    // 绘制报告背景
    ctx.fillStyle = '#F8F8F8';
    ctx.beginPath();
    ctx.roundRect(50, 800, width - 100, 220, 10);
    ctx.fill();

    // 绘制报告标题
    ctx.fillStyle = '#5B3A9E';
    ctx.font = 'bold 14px "PingFang SC", -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('📖 性格分析报告', 60, 810);

    // 绘制报告内容
    ctx.fillStyle = '#333333';
    ctx.font = '11px "PingFang SC", -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // 分行显示报告
    const lines = wrapText(report, 42, 50);
    const maxLines = 8;

    lines.slice(0, maxLines).forEach((line, i) => {
        ctx.fillText(line, 60, 830 + i * 22);
    });

    if (lines.length > maxLines) {
        ctx.fillText('...', 60, 830 + maxLines * 22);
    }
}

function wrapText(text, maxCharsPerLine, maxTotalChars) {
    const lines = [];
    let currentLine = '';
    let charCount = 0;

    const words = text.replace(/\n/g, ' ').split(' ');

    words.forEach(word => {
        const testLine = currentLine + word + ' ';

        if (testLine.length > maxCharsPerLine || charCount + word.length > maxTotalChars) {
            if (currentLine) {
                lines.push(currentLine.trim());
            }
            currentLine = word + ' ';
            charCount = word.length;
        } else {
            currentLine = testLine;
            charCount += word.length;
        }
    });

    if (currentLine) {
        lines.push(currentLine.trim());
    }

    return lines;
}

function drawFooter(ctx, width, height) {
    // 绘制底部背景装饰
    const gradient = ctx.createLinearGradient(0, height - 80, 0, height);
    gradient.addColorStop(0, 'rgba(91, 58, 158, 0.02)');
    gradient.addColorStop(1, 'rgba(91, 58, 158, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, height - 80, width, 80);

    // 绘制分割线
    ctx.strokeStyle = '#E8E6F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, height - 80);
    ctx.lineTo(width - 100, height - 80);
    ctx.stroke();

    // 绘制装饰元素
    ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
    for (let i = 0; i < 5; i++) {
        const x = 120 + i * 150;
        const y = height - 60;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // 绘制项目信息
    ctx.fillStyle = '#666666';
    ctx.font = '11px "PingFang SC", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // GitHub 项目地址
    ctx.fillStyle = '#5B3A9E';
    ctx.font = 'bold 11px "PingFang SC", -apple-system, sans-serif';
    ctx.fillText('github.com/cheesestudio/FemboyExam', width / 2, height - 55);

    // 联系方式
    ctx.fillStyle = '#666666';
    ctx.font = '11px "PingFang SC", -apple-system, sans-serif';
    ctx.fillText('QQ: 2190038793 | 微信: cheesemost', width / 2, height - 35);

    // 底部装饰文字
    ctx.fillStyle = '#C0C0C0';
    ctx.font = '10px "PingFang SC", -apple-system, sans-serif';
    ctx.fillText('✨ 男娘指数测试 - 发现你的内在光谱 ✨', width / 2, height - 18);
}

// 添加 roundRect polyfill
if (CanvasRenderingContext2D.prototype.roundRect === undefined) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
        if (!Array.isArray(radii)) {
            radii = [radii, radii, radii, radii];
        }
        const topLeft = radii[0];
        const topRight = radii[1] !== undefined ? radii[1] : topLeft;
        const bottomRight = radii[2] !== undefined ? radii[2] : topLeft;
        const bottomLeft = radii[3] !== undefined ? radii[3] : topLeft;

        this.moveTo(x + topLeft, y);
        this.lineTo(x + w - topRight, y);
        this.arcTo(x + w, y, x + w, y + topRight, topRight);
        this.lineTo(x + w, y + h - bottomRight);
        this.arcTo(x + w, y + h, x + w - bottomRight, y + h, bottomRight);
        this.lineTo(x + bottomLeft, y + h);
        this.arcTo(x, y + h, x, y + h - bottomLeft, bottomLeft);
        this.lineTo(x, y + topLeft);
        this.arcTo(x, y, x + topLeft, y, topLeft);
        this.closePath();
    };
}

// 导出函数供全局使用
if (typeof window !== 'undefined') {
    window.ShareModule = {
        encodeResult,
        decodeResult,
        copyShareLink,
        showNotice,
        generateShareImage
    };
}