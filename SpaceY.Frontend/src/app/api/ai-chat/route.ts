// app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import ProductServices from '@/services/ProductServices';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;

export async function POST(req: NextRequest) {
    const { question } = await req.json();

    const products = await ProductServices.GetAll();

    const productContext = products
        .map(
            (p) =>
                `- ${p.title}: ${p.description}, màu: ${p.availableColors}, kích thước: ${p.availableSizes}`
        )
        .join('\n');

    const prompt = `
        Bạn là một chuyên gia tư vấn sản phẩm gỗ decor, có khả năng thuyết phục và sáng tạo nội dung hấp dẫn.
        
        Dưới đây là danh sách sản phẩm hiện có:
        
        ${productContext}
        
        Người dùng hỏi: "${question}"
        
        Yêu cầu:
        - Gợi ý các sản phẩm phù hợp với nội dung ngắn gọn, rõ ràng, dễ hiểu.
        - Trình bày câu trả lời đẹp mắt, sử dụng **dấu chấm (1. 2. 3.), gạch đầu dòng (-), hoặc icon phù hợp**. **Không dùng dấu "*" hoặc "***"**.
        - Nếu thông tin chưa đủ, **hãy tự tưởng tượng thêm chi tiết hợp lý** để giúp người dùng hình dung và hài lòng.
        - Tránh lặp lại câu hỏi, trả lời bằng **tiếng Việt tự nhiên**.
        
        Nếu cần, bạn có thể hỏi lại một số thông tin đơn giản (vị trí đặt, phong cách, ngân sách...) để tư vấn chính xác hơn.
        `;
        

    const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        }
    );
  

    if (!geminiResponse.ok) {
        return NextResponse.json(
            { reply: 'Xin lỗi, có lỗi xảy ra khi gọi Gemini API.' },
            { status: 500 }
        );
    }

    const data = await geminiResponse.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Xin lỗi, không có phản hồi.';

    return NextResponse.json({ reply });
}
