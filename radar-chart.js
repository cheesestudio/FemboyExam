/**
 * 雷达图可视化组件
 * 基于 Chart.js 实现六维六边形雷达图
 * 使用马卡龙配色方案
 */

const RadarChartComponent = {
    // 六个维度定义
    dimensions: [
        '逻辑思维',
        '创新能力',
        '沟通表达',
        '执行效率',
        '协作精神',
        '抗压能力'
    ],

    // 马卡龙配色
    colors: {
        fill: 'rgba(108, 122, 224, 0.35)',
        border: '#6C7AE0',
        pointBackground: '#FFFFFF',
        pointBorder: '#6C7AE0',
        gridLines: 'rgba(200, 200, 200, 0.5)',
        angleLines: 'rgba(180, 180, 180, 0.4)'
    },

    chartInstance: null,

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

        // 销毁已有实例
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        const ctx = canvas.getContext('2d');

        this.chartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: this.dimensions,
                datasets: [{
                    label: '能力评估',
                    data: scores,
                    backgroundColor: this.colors.fill,
                    borderColor: this.colors.border,
                    borderWidth: 2,
                    pointBackgroundColor: this.colors.pointBackground,
                    pointBorderColor: this.colors.pointBorder,
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        beginAtZero: true,
                        grid: {
                            color: this.colors.gridLines,
                            circular: false // 启用六边形网格
                        },
                        angleLines: {
                            color: this.colors.angleLines
                        },
                        pointLabels: {
                            font: {
                                size: 12,
                                family: 'system-ui, sans-serif'
                            },
                            color: '#444444'
                        },
                        ticks: {
                            display: false,
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}分`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                }
            }
        });
    },

    /**
     * 更新雷达图数据
     * @param {Array<number>} scores - 新的得分数组
     */
    update(scores) {
        if (this.chartInstance) {
            this.chartInstance.data.datasets[0].data = scores;
            this.chartInstance.update();
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
