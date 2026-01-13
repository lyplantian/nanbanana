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

import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "<OPENROUTER_API_KEY>",
  defaultHeaders: {
    "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  },
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash-image",
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "What is in this image?"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
            }
          }
        ]
      }
    ]
  });

  console.log(completion.choices[0].message);
}

main();

帮我实现核心功能：
1. 用户点击Add Image后可以上传图片
2. 用户上传图片，并且在Main Prompt中写入提示词，点击Generate Now后，把图片和提示词都发给Gemini 2.5 Flash Image (Nano Banana) API处理，在Output Gallery区域返回API生成好的图片。
3. 这是API的说明文档：https://openrouter.ai/google/gemini-2.5-flash-image/api
4. 这是API key：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，新建一个.env.local文件，存放API key
5. 这是API示例代码：
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "<OPENROUTER_API_KEY>",
  defaultHeaders: {
    "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  },
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash-image",
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "What is in this image?"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
            }
          }
        ]
      }
    ]
  });

  console.log(completion.choices[0].message);
}

main();


====================
Supabase Google 登录（Server-side / SSR）
====================

前置条件：你需要在 Supabase 控制台启用 Google Provider，并配置回调地址。

1) Supabase Dashboard -> Authentication -> Providers -> Google
   - 启用 Google
   - 填写 Google OAuth 的 Client ID / Client Secret（来自 Google Cloud Console）

2) Supabase Dashboard -> Authentication -> URL Configuration
   - 将 Redirect URLs 添加：
     - http://localhost:3000/auth/callback
     - 你的线上域名，例如 https://your-domain.com/auth/callback

3) 在本项目根目录 `.env.local` 配置：
   - NEXT_PUBLIC_SUPABASE_URL=你的 Supabase 项目 URL
   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的 Supabase publishable key
     （或使用 legacy：NEXT_PUBLIC_SUPABASE_ANON_KEY）

4) 确保 Next.js 中间件已启用（用于刷新 session/cookies）：
   - middleware.ts

5) 重启开发服务器：
   - npm run dev

参考文档：
- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
