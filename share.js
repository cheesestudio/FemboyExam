
/**
 * 分享功能模块
 * 包含base64编码/解码分享链接和html2canvas图片生成功能
 */

// 加载html2canvas库
function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
        if (window.html2canvas) {
            resolve(window.html2canvas);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = () => resolve(window.html2canvas);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * 编码分享数据为base64 URL
 * @param {Object} data - 要分享的数据对象
 * @returns {string} 分享链接
 */
export function encodeShareLink(data) {
    try {
        const jsonString = JSON.stringify(data);
        const base64 = btoa(unescape(encodeURIComponent(jsonString)));
        const url = new URL(window.location.href);
        url.searchParams.set('share', base64);
        return url.toString();
    } catch (error) {
        console.error('编码分享链接失败:', error);
        return null;
    }
}

/**
 * 解码分享链接中的base64数据
 * @returns {Object|null} 解码后的数据
 */
export function decodeShareLink() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const shareData = urlParams.get('share');

        if (!shareData) {
            return null;
        }

        const jsonString = decodeURIComponent(escape(atob(shareData)));
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('解码分享链接失败:', error);
        return null;
    }
}

/**
 * 生成结果页面图片
 * @param {HTMLElement} element - 要截图的DOM元素
 * @returns {Promise<string>} 图片DataURL
 */
export async function generateImage(element) {
    try {
        await loadHtml2Canvas();

        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            logging: false,
            allowTaint: true
        });

        return canvas.toDataURL('image/png');
    } catch (error) {
        console.error('生成图片失败:', error);
        throw error;
    }
}

/**
 * 下载图片
 * @param {string} dataUrl - 图片DataURL
 * @param {string} filename - 文件名
 */
export function downloadImage(dataUrl, filename = 'assessment-result.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否成功
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('复制到剪贴板失败:', error);
        return false;
    }
}

/**
 * 初始化分享按钮
 * @param {HTMLElement} container - 按钮容器
 * @param {Function} getDataFn - 获取分享数据的回调函数
 */
export function initShareButtons(container, getDataFn) {
    // 创建分享按钮组
    const shareContainer = document.createElement('div');
    shareContainer.className = 'share-buttons';
    shareContainer.innerHTML = `
        <button id="copyLinkBtn" class="share-btn">🔗 复制分享链接</button>
        <button id="downloadImageBtn" class="share-btn">📷 保存为图片</button>
    `;

    container.appendChild(shareContainer);

    // 复制链接事件
    document.getElementById('copyLinkBtn').addEventListener('click', async () => {
        const data = getDataFn();
        const link = encodeShareLink(data);

        if (link && await copyToClipboard(link)) {
            showToast('分享链接已复制到剪贴板！');
        } else {
            showToast('复制失败，请手动复制');
        }
    });

    // 下载图片事件
    document.getElementById('downloadImageBtn').addEventListener('click', async () => {
        const btn = document.getElementById('downloadImageBtn');
        const originalText = btn.textContent;
        btn.textContent = '⏳ 生成中...';
        btn.disabled = true;

        try {
            const targetElement = document.querySelector('.result-container') || container.closest('.result-container') || document.body;
            const dataUrl = await generateImage(targetElement);
            downloadImage(dataUrl);
            showToast('图片已开始下载！');
        } catch (error) {
            showToast('图片生成失败，请重试');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

/**
 * 显示提示消息
 * @param {string} message - 消息内容
 */
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        animation: fadeInOut 2.5s ease;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2500);

    // 添加动画样式
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }

            .share-buttons {
                display: flex;
                gap: 12px;
                margin-top: 24px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .share-btn {
                padding: 10px 18px;
                border: none;
                border-radius: 6px;
                background: #4f46e5;
                color: white;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .share-btn:hover {
                background: #4338ca;
                transform: translateY(-1px);
            }

            .share-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }
}
