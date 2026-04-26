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

        const ctx = canvas.getContext('2d');

        // 销毁已有实例
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        // 获取设备像素比以提高清晰度
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

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
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(31, 31, 46, 0.95)',
                        titleColor: '#F5F5F7',
                        titleFont: {
                            size: 13,
                            family: '"Poppins", sans-serif',
                            weight: '600'
                        },
                        bodyColor: '#E8E6F0',
                        bodyFont: {
                            size: 13,
                            family: '"Poppins", sans-serif'
                        },
                        padding: 12,
                        cornerRadius: 8,
                        boxPadding: 4,
                        callbacks: {
                            label: function(context) {
                                return `得分: ${context.raw}分`;
                            },
                            title: function(context) {
                                return context[0].label;
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'point'
                },
                elements: {
                    line: {
                        tension: 0.1
                    }
                },
                ariaLabel: '六维分数雷达图'
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

// Ensure it's available globally
if (typeof window !== 'undefined') {
    window.RadarChartComponent = RadarChartComponent;
}
} catch (e) {
    console.error('Error initializing RadarChartComponent:', e);
    // Still define a stub to prevent crashes
    if (typeof window !== 'undefined') {
        window.RadarChartComponent = {
            init: function() { console.error('Radar chart not available'); },
            destroy: function() {}
        };
    }
}
