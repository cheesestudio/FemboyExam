try {
/**
 * 雷达图可视化组件 - 16P风格重构
 * 基于 Chart.js 实现六维六边形雷达图
 * 紫色主题配色方案
 */

const RadarChartComponent = {
    // 六个维度定义 (与问题维度对应)
    dimensions: [
        '软萌度',
        '娇羞度',
        '女性化',
        '声线天赋',
        '心理认同',
        '行动力'
    ],

    // 紫色马卡龙配色方案
    colors: {
        fill: 'rgba(139, 92, 246, 0.25)',
        border: '#8B5CF6',
        pointBackground: '#FFFFFF',
        pointBorder: '#7C3AED',
        pointHoverBackground: '#7C3AED',
        pointHoverBorder: '#5B3A9E',
        gridLines: 'rgba(168, 85, 247, 0.2)',
        angleLines: 'rgba(168, 85, 247, 0.3)'
    },

    gradientFill: null,

    chartInstance: null,

    /**
     * 使用Canvas 2D API 绘制雷达图 (无需Chart.js处理数）
     * @param {string} canvasId - canvas元素ID
     * @param {Array<number>} scores - 六个维度得分数组 (0-100)
     */
    drawRadarChart(canvasId, scores) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 40;

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 绘制背景网格
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
        ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.lineWidth = 1;

        const levels = 5;
        for (let i = 1; i <= levels; i++) {
            const r = (radius / levels) * i;
            ctx.beginPath();
            for (let j = 0; j < 6; j++) {
                const angle = (Math.PI / 3) * j - Math.PI / 2;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // 绘制轴线
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
            ctx.stroke();
        }

        // 绘制数据多边形
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            const value = Math.max(0, Math.min(100, scores[i] || 0));
            const r = (radius * value) / 100;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();

        // 填充多边形
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 绘制数据点
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            const value = Math.max(0, Math.min(100, scores[i] || 0));
            const r = (radius * value) / 100;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.strokeStyle = '#7C3AED';
            ctx.lineWidth = 2.5;
            ctx.stroke();
        }

        // 绘制标签
        ctx.fillStyle = '#8E8E99';
        ctx.font = '13px "Poppins", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            const labelRadius = radius + 25;
            const x = centerX + Math.cos(angle) * labelRadius;
            const y = centerY + Math.sin(angle) * labelRadius;
            ctx.fillText(this.dimensions[i], x, y);
        }
    },

    /**
     * 初始化雷达图
     * @param {string} canvasId - canvas元素ID
     * @param {Array<number>} scores - 六个维度得分数组 (0-100)
     */
    init(canvasId, scores) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        // 销毁已有实例，确保可以重用
        this.destroy();

        // 设置高清屏幕支持
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        // 检查Chart.js是否可用
        if (typeof Chart !== 'undefined') {
            // 使用Chart.js绘制
            this.chartInstance = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: this.dimensions,
                    datasets: [{
                        label: '能力得分',
                        data: scores,
                        backgroundColor: this.colors.fill,
                        borderColor: this.colors.border,
                        borderWidth: 2.5,
                        pointBackgroundColor: this.colors.pointBackground,
                        pointBorderColor: this.colors.pointBorder,
                        pointBorderWidth: 2.5,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointHoverBackgroundColor: this.colors.pointHoverBackground,
                        pointHoverBorderColor: this.colors.pointHoverBorder,
                        pointHoverBorderWidth: 3,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? {
                        duration: 0
                    } : {
                        duration: 1500,
                        easing: 'easeOutQuart'
                    },
                    scales: {
                        r: {
                            min: 0,
                            max: 100,
                            beginAtZero: true,
                            ticks: {
                                display: false,
                                stepSize: 20
                            },
                            grid: {
                                color: this.colors.gridLines,
                                lineWidth: 1,
                                circular: true,
                                display: true
                            },
                            angleLines: {
                                color: this.colors.angleLines,
                                lineWidth: 1
                            },
                            pointLabels: {
                                font: {
                                    size: 13,
                                    family: '"Poppins", sans-serif',
                                    weight: '500'
                                },
                                color: '#8E8E99',
                                padding: 12
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        } else {
            // 降级方案: 使用Canvas 2D API绘制
            this.drawRadarChart(canvasId, scores);
        }
    },

    /**
     * 更新雷达图数据
     * @param {Array<number>} scores - 新的得分数组
     */
    update(scores) {
        if (this.chartInstance) {
            this.chartInstance.data.datasets[0].data = scores;
            this.chartInstance.update();
        } else {
            // 降级方案更新
            const canvas = document.querySelector('.radar-chart');
            if (canvas) {
                this.drawRadarChart(canvas.id, scores);
            }
        }
    },

    /**
     * 销毁图表实例
     */
    destroy() {
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
    }
};

// 确保全局可用
if (typeof window !== 'undefined') {
    window.RadarChartComponent = RadarChartComponent;
}
} catch (e) {
    console.error('Error initializing RadarChartComponent:', e);
    // 定义降级子至少防止崩溃
    if (typeof window !== 'undefined') {
        window.RadarChartComponent = {
            init: function(canvasId, scores) {
                const canvas = document.getElementById(canvasId);
                if (!canvas) return;
                // 简单的Canvas绘制作为最后降级
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#f5f5f5';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#666';
                ctx.font = '14px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('图表加载失败', canvas.width/2, canvas.height/2);
            },
            destroy: function() {}
        };
    }
}

