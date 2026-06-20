\# 作业复习大纲生成器



一个帮助学生将期末作业整理成复习大纲的全栈Web应用。



\## 功能特点



\- \*\*文件上传\*\*: 支持PDF和图片文件（PNG、JPG、WEBP）

\- \*\*AI分析\*\*: 自动提炼核心知识点、重点难点、高频考点

\- \*\*Markdown渲染\*\*: 清晰展示分析结果

\- \*\*Word导出\*\*: 一键下载为Word文档

\- \*\*使用限制\*\*: 浏览器本地记录每日使用次数（每天10次）



\## 技术栈



\- \*\*前端\*\*: Next.js 13 + React + Tailwind CSS + shadcn/ui

\- \*\*后端\*\*: Next.js API Routes

\- \*\*AI\*\*: DeepSeek API



\## 本地开发



1\. 安装依赖

```bash

npm install

```



2\. 配置环境变量



创建 `.env` 文件：



```env

DEEPSEEK\_API\_KEY=your\_deepseek\_api\_key

```



获取 DeepSeek API Key：

1\. 访问 \[DeepSeek平台](https://platform.deepseek.com)

2\. 注册/登录后进入 API Keys 页面

3\. 创建新的 API Key



3\. 启动开发服务器

```bash

npm run dev

```



\## Vercel部署步骤



\### 1. 推送代码到GitHub



```bash

git init

git add .

git commit -m "Initial commit"

git branch -M main

git remote add origin https://github.com/your-username/your-repo.git

git push -u origin main

```



\### 2. 在Vercel导入项目



1\. 访问 \[Vercel](https://vercel.com)

2\. 点击 "Import Project"

3\. 选择你的GitHub仓库

4\. 点击 "Import"



\### 3. 配置环境变量



在Vercel项目设置中添加以下环境变量：



| 变量名 | 值 | 说明 |

|--------|---|------|

| `DEEPSEEK\_API\_KEY` | 你的DeepSeek API Key | AI处理密钥 |



\### 4. 部署



点击 "Deploy" 按钮，Vercel会自动构建和部署你的应用。



\## 自定义配置



\### 修改每日请求限制



编辑 `app/page.tsx`：



```typescript

const DAILY\_LIMIT = 20; // 改为你想要的数量

```



\### 修改提示词



编辑 `app/api/analyze/route.ts` 中的 `prompt` 变量。



\## 许可证



MIT



