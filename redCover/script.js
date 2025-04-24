document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const coverText = document.getElementById('cover-text');
    const addHighlightBtn = document.getElementById('add-highlight-btn');
    const highlightContainer = document.querySelector('.highlight-container');
    const footerLeft = document.getElementById('footer-left');
    const footerRight = document.getElementById('footer-right');
    const coverTitle = document.getElementById('cover-title');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const preview = document.getElementById('preview');
    const previewText = document.getElementById('preview-text');
    const previewFooterLeft = document.getElementById('preview-footer-left');
    const previewFooterRight = document.getElementById('preview-footer-right');
    const bgOptions = document.querySelectorAll('.bg-option');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    
    // 水印相关元素
    const watermarkToggle = document.getElementById('watermark-toggle');
    const watermarkSettings = document.getElementById('watermark-settings');
    const watermarkPosition = document.getElementById('watermark-position');
    const watermarkFontSize = document.getElementById('watermark-font-size');
    const watermarkOpacity = document.getElementById('watermark-opacity');
    const watermarkColor = document.getElementById('watermark-color');
    const watermark = document.getElementById('watermark');
    const fontSizeValue = document.querySelector('.font-size-value');
    const opacityValue = document.querySelector('.opacity-value');
    
    // 初始变量
    let selectedBg = 'dot';
    let history = [];
    let currentHistoryId = null;
    
    // 从localStorage加载历史记录
    loadHistory();
    
    // 应用默认样式
    preview.querySelector('.cover').classList.add('bg-dot');
    
    // 添加高亮文字
    addHighlightBtn.addEventListener('click', addHighlightItem);
    
    // 清空历史记录
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // 初始化移除按钮事件
    initRemoveButtons();
    
    // 水印显示切换
    watermarkToggle.addEventListener('change', () => {
        if (watermarkToggle.checked) {
            watermarkSettings.classList.add('active');
            watermark.classList.add('active');
            updateWatermark();
        } else {
            watermarkSettings.classList.remove('active');
            watermark.classList.remove('active');
        }
    });
    
    // 水印位置变化
    watermarkPosition.addEventListener('change', updateWatermark);
    
    // 水印字号变化
    watermarkFontSize.addEventListener('input', () => {
        fontSizeValue.textContent = `${watermarkFontSize.value}px`;
        updateWatermark();
    });
    
    // 水印透明度变化
    watermarkOpacity.addEventListener('input', () => {
        opacityValue.textContent = `${watermarkOpacity.value}%`;
        updateWatermark();
    });
    
    // 水印颜色变化
    watermarkColor.addEventListener('input', updateWatermark);
    
    // 背景选择
    bgOptions.forEach(option => {
        option.addEventListener('click', () => {
            bgOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            selectedBg = option.getAttribute('data-bg');
            updateBackground();
        });
    });
    
    // 生成封面按钮点击事件
    generateBtn.addEventListener('click', () => {
        generateCover();
        saveCurrentConfig();
    });
    
    // 下载封面按钮点击事件
    downloadBtn.addEventListener('click', downloadCover);
    
    // 监听输入变化
    footerLeft.addEventListener('input', updateFooter);
    footerRight.addEventListener('input', updateFooter);
    
    // 添加高亮项
    function addHighlightItem() {
        const newItem = document.createElement('div');
        newItem.className = 'highlight-item';
        newItem.innerHTML = `
            <input type="text" class="highlight-text" placeholder="输入需要高亮的文字">
            <input type="color" class="highlight-color" value="#FF6B6B">
            <button type="button" class="remove-highlight-btn">×</button>
        `;
        
        highlightContainer.appendChild(newItem);
        
        // 添加移除按钮事件
        newItem.querySelector('.remove-highlight-btn').addEventListener('click', function() {
            newItem.remove();
        });
    }
    
    // 初始化移除按钮
    function initRemoveButtons() {
        document.querySelectorAll('.remove-highlight-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.highlight-item').remove();
            });
        });
    }
    
    // 获取所有高亮设置
    function getHighlightSettings() {
        const highlights = [];
        document.querySelectorAll('.highlight-item').forEach(item => {
            const text = item.querySelector('.highlight-text').value.trim();
            const color = item.querySelector('.highlight-color').value;
            
            if (text) {
                highlights.push({ text, color });
            }
        });
        return highlights;
    }
    
    // 更新背景
    function updateBackground() {
        const cover = preview.querySelector('.cover');
        cover.classList.remove('bg-dot', 'bg-solid', 'bg-gradient');
        cover.classList.add(`bg-${selectedBg}`);
    }
    
    // 更新页脚
    function updateFooter() {
        previewFooterLeft.textContent = footerLeft.value;
        previewFooterRight.textContent = footerRight.value;
    }
    
    // 生成封面
    function generateCover() {
        // 获取文本和高亮设置
        const text = coverText.value.trim() || '在这里输入\n你想要展示的\n封面文字';
        const highlights = getHighlightSettings();
        
        // 分割文本为行
        let lines = text.split('\n');
        let formattedText = '';
        
        // 处理每一行
        lines.forEach((line, index) => {
            let processedLine = line;
            
            // 对每个高亮词进行处理
            highlights.forEach(highlight => {
                // 使用正则表达式确保完整匹配单词
                const regex = new RegExp(highlight.text, 'g');
                processedLine = processedLine.replace(regex, 
                    `<span class="highlight" style="--highlight-color: ${highlight.color};">${highlight.text}</span>`);
            });
            
            formattedText += processedLine;
            
            // 如果不是最后一行，添加换行
            if (index < lines.length - 1) {
                formattedText += '<br>';
            }
        });
        
        previewText.innerHTML = formattedText;
        updateFooter();
        updateWatermark();
    }
    
    // 保存当前配置
    function saveCurrentConfig() {
        // 如果没有文字内容则不保存
        if (!coverText.value.trim()) return;
        
        // 获取当前配置
        const config = {
            id: Date.now().toString(),
            title: coverTitle.value.trim() || `封面 ${new Date().toLocaleString('zh-CN', {
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            })}`,
            coverText: coverText.value,
            highlights: getHighlightSettings(),
            bgStyle: selectedBg,
            footerLeft: footerLeft.value,
            footerRight: footerRight.value,
            watermarkEnabled: watermarkToggle.checked,
            watermarkPosition: watermarkPosition.value,
            watermarkFontSize: watermarkFontSize.value,
            watermarkOpacity: watermarkOpacity.value,
            watermarkColor: watermarkColor.value,
            date: new Date().toISOString()
        };
        
        // 如果当前选中了历史记录，则更新它，否则添加新记录
        if (currentHistoryId) {
            const index = history.findIndex(item => item.id === currentHistoryId);
            if (index !== -1) {
                history[index] = config;
            } else {
                history.unshift(config);
            }
        } else {
            history.unshift(config);
        }
        
        // 最多保存20条记录
        if (history.length > 20) {
            history = history.slice(0, 20);
        }
        
        // 保存到localStorage
        saveHistory();
        
        // 更新历史显示
        renderHistory();
        
        // 更新当前选中的历史记录
        currentHistoryId = config.id;
    }
    
    // 加载历史记录
    function loadHistory() {
        try {
            const savedHistory = localStorage.getItem('xiaohongshu_covers');
            if (savedHistory) {
                history = JSON.parse(savedHistory);
                renderHistory();
            }
        } catch (e) {
            console.error('加载历史记录失败:', e);
            history = [];
        }
    }
    
    // 保存历史记录到localStorage
    function saveHistory() {
        try {
            localStorage.setItem('xiaohongshu_covers', JSON.stringify(history));
        } catch (e) {
            console.error('保存历史记录失败:', e);
            // 如果localStorage满了，可以清除一些旧记录
            if (e.name === 'QuotaExceededError') {
                // 删除一半的历史记录
                history = history.slice(0, Math.ceil(history.length / 2));
                try {
                    localStorage.setItem('xiaohongshu_covers', JSON.stringify(history));
                } catch (e2) {
                    console.error('尝试减少记录后保存仍然失败:', e2);
                }
            }
        }
    }
    
    // 清空历史记录
    function clearHistory() {
        if (confirm('确定要清空所有保存的封面记录吗？')) {
            history = [];
            currentHistoryId = null;
            localStorage.removeItem('xiaohongshu_covers');
            renderHistory();
        }
    }
    
    // 渲染历史记录列表
    function renderHistory() {
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-history';
            emptyMsg.textContent = '暂无保存的封面';
            historyList.appendChild(emptyMsg);
            return;
        }
        
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            if (item.id === currentHistoryId) {
                historyItem.classList.add('active');
            }
            
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            historyItem.innerHTML = `
                <div class="history-item-title">${escapeHTML(item.title)}</div>
                <div class="history-item-preview">${escapeHTML(item.coverText.split('\n')[0])}</div>
                <div class="history-item-date">${formattedDate}</div>
                <div class="history-item-delete" title="删除">×</div>
            `;
            
            // 点击历史项加载配置
            historyItem.addEventListener('click', (e) => {
                // 忽略删除按钮的点击
                if (e.target.classList.contains('history-item-delete')) {
                    return;
                }
                loadConfig(item);
            });
            
            // 删除历史项
            historyItem.querySelector('.history-item-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteHistoryItem(item.id);
            });
            
            historyList.appendChild(historyItem);
        });
    }
    
    // 加载配置
    function loadConfig(config) {
        // 设置当前选中的历史ID
        currentHistoryId = config.id;
        
        // 更新表单值
        coverText.value = config.coverText || '';
        footerLeft.value = config.footerLeft || 'Embrace the life';
        footerRight.value = config.footerRight || 'Made with care';
        coverTitle.value = config.title || '';
        
        // 更新背景样式
        selectedBg = config.bgStyle || 'dot';
        bgOptions.forEach(option => {
            if (option.getAttribute('data-bg') === selectedBg) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
        
        // 清空高亮容器
        highlightContainer.innerHTML = '';
        
        // 添加高亮项
        if (config.highlights && config.highlights.length > 0) {
            config.highlights.forEach(highlight => {
                const newItem = document.createElement('div');
                newItem.className = 'highlight-item';
                newItem.innerHTML = `
                    <input type="text" class="highlight-text" value="${escapeHTML(highlight.text)}" placeholder="输入需要高亮的文字">
                    <input type="color" class="highlight-color" value="${highlight.color}">
                    <button type="button" class="remove-highlight-btn">×</button>
                `;
                
                highlightContainer.appendChild(newItem);
                
                // 添加移除按钮事件
                newItem.querySelector('.remove-highlight-btn').addEventListener('click', function() {
                    newItem.remove();
                });
            });
        } else {
            // 如果没有高亮项，添加一个空的
            addHighlightItem();
        }
        
        // 更新水印设置
        if (config.watermarkEnabled) {
            watermarkToggle.checked = true;
            watermarkSettings.classList.add('active');
            watermark.classList.add('active');
        } else {
            watermarkToggle.checked = false;
            watermarkSettings.classList.remove('active');
            watermark.classList.remove('active');
        }
        
        if (config.watermarkPosition) {
            watermarkPosition.value = config.watermarkPosition;
        }
        
        if (config.watermarkFontSize) {
            watermarkFontSize.value = config.watermarkFontSize;
            fontSizeValue.textContent = `${config.watermarkFontSize}px`;
        }
        
        if (config.watermarkOpacity) {
            watermarkOpacity.value = config.watermarkOpacity;
            opacityValue.textContent = `${config.watermarkOpacity}%`;
        }
        
        if (config.watermarkColor) {
            watermarkColor.value = config.watermarkColor;
        }
        
        // 生成预览
        generateCover();
        updateBackground();
        updateWatermark();
        
        // 更新历史列表显示
        renderHistory();
    }
    
    // 删除历史项
    function deleteHistoryItem(id) {
        if (confirm('确定要删除这个保存的封面吗？')) {
            const index = history.findIndex(item => item.id === id);
            if (index !== -1) {
                history.splice(index, 1);
                saveHistory();
                renderHistory();
                
                // 如果删除的是当前选中的项，清除选中状态
                if (id === currentHistoryId) {
                    currentHistoryId = null;
                }
            }
        }
    }
    
    // HTML转义函数，防止XSS
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // 下载封面
    function downloadCover() {
        // 处理点状背景的问题
        const coverElement = preview.querySelector('.cover');
        const originalBg = selectedBg;
        
        // 创建临时的点状背景 Canvas（如果是点状背景）
        if (selectedBg === 'dot') {
            // 创建点状背景的canvas
            const dotCanvas = document.createElement('canvas');
            const ctx = dotCanvas.getContext('2d');
            const size = 16; // 背景点的间距
            const dotSize = 1; // 点的大小
            
            // 设置canvas尺寸为预览区域大小
            const previewRect = preview.getBoundingClientRect();
            dotCanvas.width = previewRect.width;
            dotCanvas.height = previewRect.height;
            
            // 设置背景色为白色
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, dotCanvas.width, dotCanvas.height);
            
            // 绘制点状图案
            ctx.fillStyle = '#ddd';
            for (let x = 0; x < dotCanvas.width; x += size) {
                for (let y = 0; y < dotCanvas.height; y += size) {
                    ctx.beginPath();
                    ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // 将canvas转换为dataURL并设置为封面背景
            const dotPattern = dotCanvas.toDataURL('image/png');
            coverElement.style.backgroundImage = `url(${dotPattern})`;
            coverElement.style.backgroundSize = `${size}px ${size}px`;
            
            // 移除类名避免冲突
            coverElement.classList.remove('bg-dot');
        }
        
        // 使用html2canvas捕获
        html2canvas(preview, {
            backgroundColor: null,
            scale: 2,
            logging: false,
            allowTaint: true,
            useCORS: true
        }).then(canvas => {
            // 恢复原始背景
            if (originalBg === 'dot') {
                coverElement.style.backgroundImage = '';
                coverElement.style.backgroundSize = '';
                coverElement.classList.add('bg-dot');
            }
            
            // 创建下载链接
            const link = document.createElement('a');
            link.download = '小红书封面.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(error => {
            console.error('导出图片失败:', error);
            alert('导出图片失败，请重试');
            
            // 确保恢复原始背景
            if (originalBg === 'dot') {
                coverElement.style.backgroundImage = '';
                coverElement.style.backgroundSize = '';
                coverElement.classList.add('bg-dot');
            }
        });
    }
    
    // 更新水印样式
    function updateWatermark() {
        // 移除所有位置类名
        watermark.className = 'watermark';
        if (watermarkToggle.checked) {
            watermark.classList.add('active');
        }
        
        // 添加位置类名
        watermark.classList.add(watermarkPosition.value);
        
        // 设置字号
        watermark.style.fontSize = `${watermarkFontSize.value}px`;
        
        // 设置透明度和颜色
        const opacity = watermarkOpacity.value / 100;
        const color = watermarkColor.value;
        watermark.style.color = hexToRgba(color, opacity);
        watermark.style.backgroundColor = hexToRgba(color, 0.1 * opacity);
        watermark.style.boxShadow = `0 0 10px ${hexToRgba(color, 0.2 * opacity)}`;
        
        // 根据字号调整内边距
        const fontSize = parseInt(watermarkFontSize.value);
        const padding = Math.max(Math.floor(fontSize / 4), 4);
        watermark.style.padding = `${padding}px ${padding * 1.5}px`;
    }
    
    // Hex颜色转RGBA
    function hexToRgba(hex, alpha = 1) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // 初始化
    updateFooter();
});

// 添加html2canvas库，用于导出图片
(function() {
    const script = document.createElement('script');
    script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    script.async = true;
    document.head.appendChild(script);
})(); 