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
        Bạn là một người bạn thân thiết, am hiểu về đồ decor gỗ và luôn sẵn sàng chia sẻ những gợi ý tuyệt vời cho không gian sống.
        
        Danh sách sản phẩm hiện có:
        ${productContext}
        
        Người dùng nói: "${question}"
        
         🚫 Khi người dùng hỏi những câu không liên quan đến sản phẩm/decor/nội thất:
        - Trả lời ngắn gọn, lịch sự
        - Sau đó hướng về sản phẩm: "Mình chuyên tư vấn về đồ decor gỗ đó! Bạn có muốn xem qua những món đồ trang trí đẹp cho nhà không?"
        - Gợi ý 1-2 sản phẩm hot nhất

        🎯 Cách trò chuyện:
        - Trả lời như đang chat với bạn bè: thân thiện, gần gũi, dễ hiểu
        - Sử dụng emoji và icon phù hợp để tạo cảm giác vui vẻ
        - Dùng dấu chấm (1. 2. 3.), gạch đầu dòng (-) hoặc icon để trình bày đẹp mắt
        - KHÔNG dùng dấu "*" hay "***"
        - Nếu thông tin sản phẩm chưa đủ, hãy bổ sung chi tiết hợp lý để người dùng dễ hình dung
        
        💡 Mẹo nhỏ:
        - Có thể hỏi thêm về không gian, phong cách, ngân sách để tư vấn chính xác hơn
        - Luôn tạo cảm giác như đang tư vấn cho người thân
        - Kết thúc bằng câu hỏi mở để tiếp tục cuộc trò chuyện
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
