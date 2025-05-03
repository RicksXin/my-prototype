# 基于 DIV 的可编辑对话框

这是一个不使用`input`或`textarea`元素，而是基于`div`实现的可编辑对话框组件。

## 特性

- 使用`contenteditable`属性实现的可编辑区域
- 美观的 UI 设计，包含头部、正文和底部
- 完整的键盘支持（Ctrl+Enter 确认，ESC 取消）
- 粘贴时自动转换为纯文本
- 字符数量限制
- 支持取消操作并恢复原始内容
- 响应式设计

## 使用方法

1. 将三个文件（HTML、CSS、JS）放在同一目录下
2. 在浏览器中打开`index.html`
3. 直接在对话框中输入内容

## 定制选项

你可以修改以下部分来定制对话框：

### HTML 结构

- 修改`data-placeholder`属性来更改占位符文本
- 调整按钮文本和头部标题

### CSS 样式

- 修改颜色方案（主要在`:root`中定义的变量）
- 调整尺寸、圆角和阴影效果
- 更改字体和文本样式

### JavaScript 功能

- 调整`maxLength`变量来更改最大字符数限制
- 取消注释"点击外部关闭"功能
- 添加自定义验证逻辑
- 修改`confirmDialog`函数来处理提交的数据

## 集成到现有项目

要将此组件集成到现有项目中：

```javascript
// 获取对话框内容
function getDialogContent() {
  const content = document.getElementById("editable-dialog").textContent.trim();
  return content;
}

// 设置对话框内容
function setDialogContent(text) {
  document.getElementById("editable-dialog").textContent = text;
}

// 显示对话框的例子
function showDialog(initialText = "") {
  const dialog = document.querySelector(".dialog-container");
  dialog.style.display = "block";
  setDialogContent(initialText);
  document.getElementById("editable-dialog").focus();
}
```
