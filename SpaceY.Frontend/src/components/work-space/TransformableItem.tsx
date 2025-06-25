'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { DroppedItem } from '@/types/work-space';
import Image from 'next/image';

interface TransformableItemProps {
    item: DroppedItem;
    isSelected: boolean;
    onUpdate: (updates: Partial<DroppedItem>) => void;
    onSelect: () => void;
    propertyPanel?: React.ReactNode;
}

const TransformableItem: React.FC<TransformableItemProps> = ({
    item,
    isSelected,
    onUpdate,
    onSelect,
    propertyPanel,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [startSize, setStartSize] = useState({ scaleX: 1, scaleY: 1 });

    const handleMouseDown = (e: React.MouseEvent, action: 'drag' | 'resize' | 'rotate') => {
        e.stopPropagation();
        e.preventDefault(); // Ngăn chặn text selection
        onSelect();
        setStartPos({ x: e.clientX, y: e.clientY });

        if (action === 'drag') {
            setIsDragging(true);
        } else if (action === 'resize') {
            setIsResizing(true);
            setStartSize({ scaleX: item.scaleX, scaleY: item.scaleY });
        } else if (action === 'rotate') {
            setIsRotating(true);
        }
    };

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            e.preventDefault(); // Ngăn chặn text selection

            if (isDragging) {
                const deltaX = e.clientX - startPos.x;
                const deltaY = e.clientY - startPos.y;
                onUpdate({
                    x: Math.max(0, item.x + deltaX),
                    y: Math.max(0, item.y + deltaY),
                });
                setStartPos({ x: e.clientX, y: e.clientY });
            } else if (isResizing) {
                const deltaX = e.clientX - startPos.x;
                const deltaY = e.clientY - startPos.y;
                const scaleChange = Math.max(0.1, 1 + (deltaX + deltaY) / 200);
                onUpdate({
                    scaleX: Math.max(0.1, Math.min(3, startSize.scaleX * scaleChange)),
                    scaleY: Math.max(0.1, Math.min(3, startSize.scaleY * scaleChange)),
                });
            } else if (isRotating) {
                const centerX = item.x + 50;
                const centerY = item.y + 50;
                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
                onUpdate({ rotation: angle });
            }
        },
        [isDragging, isResizing, isRotating, startPos, item, startSize, onUpdate]
    );

    const handleMouseUp = useCallback((e: MouseEvent) => {
        e.preventDefault(); // Ngăn chặn text selection
        setIsDragging(false);
        setIsResizing(false);
        setIsRotating(false);
    }, []);

    useEffect(() => {
        if (isDragging || isResizing || isRotating) {
            // Thêm style để ngăn text selection trên toàn trang
            document.body.style.userSelect = 'none';

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                // Khôi phục text selection
                document.body.style.userSelect = '';

                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, isRotating, handleMouseMove, handleMouseUp]);

    // Tính toán vị trí property panel để luôn ở phía trên canvas
    const getPropertyPanelPosition = () => {
        const panelHeight = 140; // Chiều cao ước tính của property panel
        const margin = 10;

        // Nếu item ở quá gần đỉnh canvas, đặt panel bên phải
        if (item.y < panelHeight + margin) {
            return {
                left: item.x + item.size + margin,
                top: item.y + 100,
                zIndex: 1000, // Z-index cao để luôn ở trên
            };
        }

        // Ngược lại, đặt panel phía trên
        return {
            left: item.x,
            top: item.y - panelHeight - margin -30,
            zIndex: 1000, // Z-index cao để luôn ở trên
        };
    };

    return (
        <>
            {/* Property Panel - Luôn ở trên cùng */}
            {isSelected && propertyPanel && (
                <div
                    className="absolute"
                    style={getPropertyPanelPosition()}
                >
                    {propertyPanel}
                </div>
            )}

            {/* Item chính - có xoay, scale */}
            <div
                className="absolute"
                style={{
                    left: item.x,
                    top: item.y,
                    transform: `rotate(${item.rotation}deg) scale(${item.scaleX}, ${item.scaleY})`,
                    transformOrigin: 'center center',
                    zIndex: isSelected ? 10 : 1,
                    userSelect: 'none', // Ngăn text selection
                    WebkitUserSelect: 'none',
                    msUserSelect: 'none',
                }}
            >
                <div
                    onMouseDown={(e) => handleMouseDown(e, 'drag')}
                    onClick={onSelect}
                    className={`
                        cursor-move select-none transition-all duration-300 ease-out
                        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-xl transform scale-105' : 'hover:shadow-lg hover:scale-102'}
                        ${isDragging ? 'shadow-2xl scale-110' : ''}
                        rounded-lg
                    `}
                    style={{
                        filter: isSelected ? 'brightness(1.1) saturate(1.2)' : 'none',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        msUserSelect: 'none',
                    }}
                >
                    <Image
                        width={item.size}
                        height={item.size}
                        src={item.imageUrl}
                        alt="Dropped item"
                        className="drop-shadow-sm select-none"
                        style={{
                            width: `${item.size}px`,
                            height: `${item.size}px`,
                            objectFit: 'contain',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            msUserSelect: 'none',
                        }}
                        draggable={false}
                    />
                </div>

                {isSelected && (
                    <>
                        {/* Nút xoay */}
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'rotate')}
                            className="absolute w-5 h-5 bg-purple-500 rounded-full cursor-grab hover:bg-purple-600 
                                border-2 border-white shadow-lg transition-all duration-200 hover:scale-110
                                flex items-center justify-center select-none"
                            style={{
                                left: '100%',
                                top: '-10px',
                                zIndex: 20,
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                msUserSelect: 'none',
                            }}
                            title="Kéo để xoay"
                        >
                            <RotateCcw className="w-2.5 h-2.5 text-white pointer-events-none" />
                        </div>

                        {/* Nút resize */}
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'resize')}
                            className="absolute w-5 h-5 bg-green-500 rounded-full cursor-nw-resize hover:bg-green-600 
                                border-2 border-white shadow-lg transition-all duration-200 hover:scale-110
                                flex items-center justify-center select-none"
                            style={{
                                right: '-10px',
                                bottom: '-10px',
                                zIndex: 20,
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                msUserSelect: 'none',
                            }}
                            title="Kéo để thay đổi kích thước"
                        >
                            <ArrowsPointingOutIcon className="w-3 h-3 text-white pointer-events-none" />
                        </div>

                        {/* Border selection */}
                        <div
                            className="absolute border-2 border-blue-400 border-dashed pointer-events-none 
                                animate-pulse rounded-lg select-none"
                            style={{
                                left: '-8px',
                                top: '-8px',
                                right: '-8px',
                                bottom: '-8px',
                                zIndex: 5,
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                msUserSelect: 'none',
                            }}
                        />

                        {/* Corner dots */}
                        {[
                            { top: '-4px', left: '-4px' },
                            { top: '-4px', right: '-4px' },
                            { bottom: '-4px', left: '-4px' },
                            { bottom: '-4px', right: '-4px' }
                        ].map((pos, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-blue-500 rounded-full pointer-events-none select-none"
                                style={{
                                    ...pos,
                                    zIndex: 15,
                                    userSelect: 'none',
                                    WebkitUserSelect: 'none',
                                    msUserSelect: 'none',
                                }}
                            />
                        ))}
                    </>
                )}
            </div>
        </>
    );
};

export default TransformableItem;