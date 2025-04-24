# Anime Collection Website

## 本地视频设置

本项目使用本地视频文件作为首页背景。请按照以下步骤设置本地视频：

1. 在 `public/videos/` 目录中放置您的背景视频文件（MP4格式）
2. 在 `public/thumbnails/` 目录中放置对应的缩略图（可选）
3. 更新 `public/data/local-videos.json` 文件，添加您的视频信息

### local-videos.json 格式

\`\`\`json
[
  {
    "id": "video1",
    "title": "视频标题",
    "videoPath": "/videos/your-video-filename.mp4",
    "thumbnailPath": "/thumbnails/your-thumbnail-filename.jpg"
  }
]
\`\`\`

### 检查视频文件

您可以运行以下命令来检查本地视频文件是否存在：

\`\`\`bash
node scripts/check-videos.js
\`\`\`

## 数据获取

运行以下命令从AniList API获取动漫数据：

\`\`\`bash
node fetch-anilist-data.js
\`\`\`

数据将保存在 `public/data/` 目录中。
