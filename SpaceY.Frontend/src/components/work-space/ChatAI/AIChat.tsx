'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

// interface AIChatProps {
//     // Có thể thêm props khác nếu cần
// }

const AIChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Xin chào! Tôi là AI trợ lý của bạn. Tôi có thể giúp bạn với việc thiết kế, bố trí sản phẩm, hoặc bất kỳ câu hỏi nào về ứng dụng này.',
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: inputValue }),
            });

            const data = await res.json();

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                content: data.reply || 'Xin lỗi, tôi không thể trả lời lúc này.',
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const inputRef = useRef<HTMLInputElement>(null);
    // const getAIResponse = (userInput: string): string => {
    //     const input = userInput.toLowerCase();

    //     if (input.includes('thiết kế') || input.includes('bố trí')) {
    //         return 'Để có thiết kế tốt, bạn nên chú ý đến việc cân bằng màu sắc, kích thước và vị trí của các sản phẩm. Hãy thử sắp xếp sản phẩm theo nguyên tắc tam giác hoặc tạo điểm nhấn bằng cách đặt sản phẩm chính ở trung tâm.';
    //     } else if (input.includes('màu sắc') || input.includes('màu')) {
    //         return 'Việc phối màu rất quan trọng! Bạn có thể sử dụng màu tương phản để làm nổi bật sản phẩm, hoặc màu hài hòa để tạo cảm giác nhẹ nhàng. Hãy thử điều chỉnh màu nền và màu sản phẩm để tìm ra sự kết hợp phù hợp nhất.';
    //     } else if (input.includes('kích thước') || input.includes('size')) {
    //         return 'Kích thước sản phẩm nên phù hợp với tầm quan trọng của chúng trong thiết kế. Sản phẩm chính có thể to hơn, sản phẩm phụ nhỏ hơn. Sử dụng slider kích thước trong bảng thuộc tính để điều chỉnh.';
    //     } else if (input.includes('cách sử dụng') || input.includes('hướng dẫn')) {
    //         return 'Để sử dụng ứng dụng: 1) Tải ảnh nền lên, 2) Kéo sản phẩm từ danh sách vào canvas, 3) Click vào sản phẩm để điều chỉnh thuộc tính, 4) Sử dụng các handle để xoay và thay đổi kích thước.';
    //     } else {
    //         return 'Cảm ơn bạn đã hỏi! Tôi có thể giúp bạn về thiết kế, bố trí sản phẩm, phối màu, và cách sử dụng các tính năng của ứng dụng. Bạn có câu hỏi cụ thể nào không?';
    //     }
    // };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-96 bg-gray-50 rounded-lg">
            {/* Messages Container */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3"
            >
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-orange-500 text-white'
                                }`}>
                                {message.sender === 'user' ? (
                                    <User className="w-3 h-3" />
                                ) : (
                                    <Bot className="w-3 h-3" />
                                )}
                            </div>
                            <div className={`px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${message.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-800 border border-gray-200'
                                }`}>
                                {message.content.split('\n').map((line, index) => {
                                    const trimmed = line.trim();

                                    // Nếu là dòng gạch đầu dòng
                                    if (/^[-•]/.test(trimmed)) {
                                        return (
                                            <li key={index} className="ml-5 list-disc text-sm">{trimmed.replace(/^[-•]\s?/, '')}</li>
                                        );
                                    }

                                    // Dòng thường
                                    return (
                                        <p key={index} className="mb-2 text-sm leading-relaxed">{trimmed}</p>
                                    );
                                })}

                            </div>

                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex items-start space-x-2">
                            <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center">
                                <Bot className="w-3 h-3" />
                            </div>
                            <div className="bg-white text-gray-800 border border-gray-200 px-3 py-2 rounded-lg text-sm">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Container */}
            <div className="border-t border-gray-200 p-3">
                <div className="flex space-x-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Hỏi AI về thiết kế, bố trí..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChat;