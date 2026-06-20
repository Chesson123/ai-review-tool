import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import axios from 'axios';

const deepseekApiKey = process.env.DEEPSEEK_API_KEY!;

async function extractTextFromFile(file: File): Promise<string | { imageBase64: string; mimeType: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileType = file.type;

  if (fileType === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (fileType.startsWith('image/')) {
    const base64 = buffer.toString('base64');
    return { imageBase64: base64, mimeType: fileType };
  }

  throw new Error('Unsupported file type');
}

async function callDeepSeekAPI(content: string | { imageBase64: string; mimeType: string }): Promise<string> {
  const prompt = '请分析上传的作业内容，按章节归类，提炼核心知识点、难点、易错点，并统计高频考点。输出为整洁的Markdown格式。';

  let messages: Array<{ role: string; content: unknown }>;

  if (typeof content === 'string') {
    messages = [
      {
        role: 'user',
        content: `${prompt}\n\n文档内容：\n${content}`,
      },
    ];
  } else {
    messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${content.mimeType};base64,${content.imageBase64}`,
            },
          },
        ],
      },
    ];
  }

  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages,
        max_tokens: 4096,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${deepseekApiKey}`,
        },
        timeout: 60000,
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw new Error('Failed to process document with AI');
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!deepseekApiKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '请上传文件' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: '文件大小不能超过10MB' }, { status: 400 });
    }

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '仅支持PDF和图片文件（PNG、JPG、WEBP）' }, { status: 400 });
    }

    const content = await extractTextFromFile(file);

    if (typeof content === 'string' && content.trim().length === 0) {
      return NextResponse.json({ error: '无法从文档中提取内容' }, { status: 400 });
    }

    const aiResponse = await callDeepSeekAPI(content);

    return NextResponse.json({
      success: true,
      result: aiResponse,
    });
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '处理文件时出错' },
      { status: 500 }
    );
  }
}
