document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const dialogContainer = document.querySelector('.dialog-container');
    const editableDialog = document.getElementById('editable-dialog');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const confirmBtn = document.getElementById('confirm-btn');
    
    // 存储原始内容，用于取消操作
    let originalContent = '';
    
    // 初始化对话框
    function initDialog() {
        // 默认获取焦点
        editableDialog.focus();
        // 存储当前内容以便取消
        originalContent = editableDialog.innerHTML;
        
        // 检测粘贴事件，确保粘贴纯文本
        editableDialog.addEventListener('paste', (e) => {
            e.preventDefault();
            // 获取剪贴板中的纯文本
            const text = e.clipboardData.getData('text/plain');
            // 将纯文本插入到当前位置
            document.execCommand('insertText', false, text);
        });
        
        // 限制输入长度（可选）
        editableDialog.addEventListener('input', (e) => {
            const maxLength = 500; // 最大字符数
            if (editableDialog.textContent.length > maxLength) {
                // 截断文本
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                
                editableDialog.textContent = editableDialog.textContent.substring(0, maxLength);
                
                // 恢复光标位置
                range.setStart(editableDialog.firstChild, maxLength);
                range.setEnd(editableDialog.firstChild, maxLength);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    }
    
    // 关闭对话框
    function closeDialog() {
        // 这里可以扩展为实际的关闭动画或其他处理
        editableDialog.innerHTML = '';
        alert('对话框已关闭');
    }
    
    // 取消操作
    function cancelDialog() {
        // 恢复原始内容
        editableDialog.innerHTML = originalContent;
        closeDialog();
    }
    
    // 确认操作
    function confirmDialog() {
        const content = editableDialog.innerHTML.trim();
        if (content) {
            // 获取输入的内容
            const result = editableDialog.textContent.trim();
            alert(`您输入的内容是: ${result}`);
            // 这里可以添加更多处理逻辑
        } else {
            alert('请输入内容后再确认');
            editableDialog.focus();
            return;
        }
        closeDialog();
    }
    
    // 事件绑定
    closeBtn.addEventListener('click', closeDialog);
    cancelBtn.addEventListener('click', cancelDialog);
    confirmBtn.addEventListener('click', confirmDialog);
    
    // 按键支持
    editableDialog.addEventListener('keydown', (e) => {
        // 回车键确认（可选按住Ctrl）
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            confirmDialog();
        }
        
        // ESC键取消
        if (e.key === 'Escape') {
            e.preventDefault();
            cancelDialog();
        }
    });
    
    // 点击外部关闭（可选功能）
    /*
    document.addEventListener('click', (e) => {
        if (!dialogContainer.contains(e.target)) {
            cancelDialog();
        }
    });
    */
    
    // 初始化
    initDialog();
}); 