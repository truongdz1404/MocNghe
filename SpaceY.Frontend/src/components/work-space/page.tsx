'use client';
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Type, Square, Circle, Star, Move, RotateCcw, Trash2, ImageIcon } from 'lucide-react';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

// Simulate react-draggable và interact.js functionality
// Trong thực tế, bạn cần cài đặt: npm install react-draggable interact.js

interface DroppedItem {
    id: string;
    type: 'text' | 'shape' | 'icon';
    content: string;
    x: number;
    y: number;
    rotation: number;
    color: string;
    size: number;
    scaleX: number;
    scaleY: number;
}

interface DragItem {
    id: string;
    type: 'text' | 'shape' | 'icon';
    content: string;
    icon: React.ReactNode;
}

// Custom Transform Component simulating react-draggable + interact.js
const TransformableItem: React.FC<{
    item: DroppedItem;
    isSelected: boolean;
    onUpdate: (updates: Partial<DroppedItem>) => void;
    onSelect: () => void;
}> = ({ item, isSelected, onUpdate, onSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [startSize, setStartSize] = useState({ scaleX: 1, scaleY: 1 });
    // const [startRotation, setStartRotation] = useState(0);

    const handleMouseDown = (e: React.MouseEvent, action: 'drag' | 'resize' | 'rotate') => {
        e.stopPropagation();
        onSelect();

        // const rect = e.currentTarget.getBoundingClientRect();
        setStartPos({ x: e.clientX, y: e.clientY });

        if (action === 'drag') {
            setIsDragging(true);
        } else if (action === 'resize') {
            setIsResizing(true);
            setStartSize({ scaleX: item.scaleX, scaleY: item.scaleY });
        } else if (action === 'rotate') {
            setIsRotating(true);
            // setStartRotation(item.rotation);
        }
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            const deltaX = e.clientX - startPos.x;
            const deltaY = e.clientY - startPos.y;
            onUpdate({
                x: Math.max(0, item.x + deltaX),
                y: Math.max(0, item.y + deltaY)
            });
            setStartPos({ x: e.clientX, y: e.clientY });
        } else if (isResizing) {
            const deltaX = e.clientX - startPos.x;
            const deltaY = e.clientY - startPos.y;
            const scaleChange = Math.max(0.1, 1 + (deltaX + deltaY) / 200);
            onUpdate({
                scaleX: Math.max(0.1, Math.min(3, startSize.scaleX * scaleChange)),
                scaleY: Math.max(0.1, Math.min(3, startSize.scaleY * scaleChange))
            });
        } else if (isRotating) {
            const centerX = item.x + 35;
            const centerY = item.y + 35;
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
            onUpdate({ rotation: angle });
        }
    }, [isDragging, isResizing, isRotating, startPos, item, startSize, onUpdate]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        setIsRotating(false);
    }, []);

    React.useEffect(() => {
        if (isDragging || isResizing || isRotating) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, isRotating, handleMouseMove, handleMouseUp]);

    return (
        <div
            className="absolute"
            style={{
                left: item.x,
                top: item.y,
                transform: `rotate(${item.rotation}deg) scale(${item.scaleX}, ${item.scaleY})`,
                transformOrigin: 'center center',
                zIndex: isSelected ? 10 : 1,
            }}
        >
            {/* Main Item with Enhanced Styling */}
            <div
                onMouseDown={(e) => handleMouseDown(e, 'drag')}
                onClick={onSelect}
                className={`
                        cursor-move select-none transition-all duration-300 ease-out
                        ${isSelected
                        ? 'ring-2 ring-blue-500 ring-offset-2 shadow-xl transform scale-105'
                        : 'hover:shadow-lg hover:scale-102'
                    }
                        ${isDragging ? 'shadow-2xl scale-110' : ''}
                         rounded-lg px-2 py-1
                    `}
                style={{
                    color: item.color,
                    fontSize: item.type === 'text' ? `${item.size}px` : undefined,
                    filter: isSelected ? 'brightness(1.1) saturate(1.2)' : 'none',
                }}
            >
                {item.type === 'text' ? (
                    <span className="font-bold whitespace-nowrap drop-shadow-sm">
                        {item.content}
                    </span>
                ) : (
                    <span
                        className="drop-shadow-sm"
                        style={{ fontSize: `${item.size}px` }}
                    >
                        {item.content}
                    </span>
                )}
            </div>

            {/* Enhanced Control Handles */}
            {isSelected && (
                <>

                    {/* Rotation Handle */}
                    <div
                        onMouseDown={(e) => handleMouseDown(e, 'rotate')}
                        className="absolute w-5 h-5 bg-purple-500 rounded-full cursor-grab hover:bg-purple-600 
                                    border-2 border-white shadow-lg transition-all duration-200 hover:scale-110
                                    flex items-center justify-center"
                        style={{
                            left: '100%',
                            top: '-10px',
                            zIndex: 20,
                        }}
                        title="Kéo để xoay"
                    >
                        <RotateCcw className="w-2.5 h-2.5 text-white" />
                    </div>

                    {/* Resize Handle */}
                    <div
                        onMouseDown={(e) => handleMouseDown(e, 'resize')}
                        className="absolute w-5 h-5 bg-green-500 rounded-full cursor-nw-resize hover:bg-green-600 
                                    border-2 border-white shadow-lg transition-all duration-200 hover:scale-110
                                    flex items-center justify-center"
                        style={{
                            right: '-10px',
                            bottom: '-10px',
                            zIndex: 20,
                        }}
                        title="Kéo để thay đổi kích thước"
                    >
                        <ArrowsPointingOutIcon className="w-3 h-3 text-white" />
                    </div>

                    {/* Selection Outline with Animation */}
                    <div
                        className="absolute border-2 border-blue-400 border-dashed pointer-events-none
                                    animate-pulse rounded-lg"
                        style={{
                            left: '-8px',
                            top: '-8px',
                            right: '-8px',
                            bottom: '-8px',
                            zIndex: 5,
                        }}
                    />

                    {/* Corner Decorators */}
                    {[
                        { top: '-4px', left: '-4px' },
                        { top: '-4px', right: '-4px' },
                        { bottom: '-4px', left: '-4px' },
                        { bottom: '-4px', right: '-4px' }
                    ].map((pos, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-blue-500 rounded-full pointer-events-none"
                            style={{ ...pos, zIndex: 15 }}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

const EnhancedImageEditor: React.FC = () => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [canvasZoom, setCanvasZoom] = useState(1);
    const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    const availableItems: DragItem[] = [
        { id: 'text-1', type: 'text', content: 'Text', icon: <Type className="w-5 h-5" /> },
        { id: 'shape-square', type: 'shape', content: '■', icon: <Square className="w-5 h-5" /> },
        { id: 'shape-circle', type: 'shape', content: '●', icon: <Circle className="w-5 h-5" /> },
        { id: 'shape-star', type: 'shape', content: '★', icon: <Star className="w-5 h-5" /> },
    ];

    const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff', '#ffffff', '#000000'];

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragStart = (e: React.DragEvent, item: DragItem) => {
        const dragData = {
            id: item.id,
            type: item.type,
            content: item.content
        };
        e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - canvasPan.x) / canvasZoom;
        const y = (e.clientY - rect.top - canvasPan.y) / canvasZoom;

        try {
            const itemData = JSON.parse(e.dataTransfer.getData('application/json'));
            const newItem: DroppedItem = {
                id: `${itemData.id}-${Date.now()}`,
                type: itemData.type,
                content: itemData.content,
                x,
                y,
                rotation: 0,
                color: '#ff4444',
                size: itemData.type === 'text' ? 24 : 32,
                scaleX: 1,
                scaleY: 1,
            };
            setDroppedItems(prev => [...prev, newItem]);
        } catch (error) {
            console.error('Error parsing dropped data:', error);
        }
    };

    const updateItem = (itemId: string, updates: Partial<DroppedItem>) => {
        setDroppedItems(prev =>
            prev.map(item => item.id === itemId ? { ...item, ...updates } : item)
        );
    };

    const updateSelectedItem = (updates: Partial<DroppedItem>) => {
        if (!selectedItem) return;
        updateItem(selectedItem, updates);
    };

    const deleteSelectedItem = () => {
        if (!selectedItem) return;
        setDroppedItems(prev => prev.filter(item => item.id !== selectedItem));
        setSelectedItem(null);
    };

    const handleCanvasWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setCanvasZoom(prev => Math.max(0.1, Math.min(3, prev * delta)));
    };

    const selectedItemData = droppedItems.find(item => item.id === selectedItem);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
                    Enhanced Image Editor
                </h1>
                {selectedItemData && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20">
                        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Move className="w-5 h-5 text-purple-500" />
                            Thuộc tính
                        </h3>

                        <div className="flex flex-wrap gap-4 items-start">
                            {/* Nội dung text */}
                            {selectedItemData.type === 'text' && (
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Nội dung</label>
                                    <input
                                        type="text"
                                        value={selectedItemData.content}
                                        onChange={(e) => updateSelectedItem({ content: e.target.value })}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            )}

                            {/* Size */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Kích thước: {selectedItemData.size}px
                                </label>
                                <input
                                    type="range"
                                    min="12"
                                    max="72"
                                    value={selectedItemData.size}
                                    onChange={(e) => updateSelectedItem({ size: parseInt(e.target.value) })}
                                    className="accent-blue-500"
                                />
                            </div>

                            {/* Rotation */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Xoay: {Math.round(selectedItemData.rotation)}°
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={selectedItemData.rotation}
                                    onChange={(e) => updateSelectedItem({ rotation: parseInt(e.target.value) })}
                                    className="accent-purple-500"
                                />
                            </div>

                            {/* Scale X & Y */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Scale X: {selectedItemData.scaleX.toFixed(1)}
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    value={selectedItemData.scaleX}
                                    onChange={(e) => updateSelectedItem({ scaleX: parseFloat(e.target.value) })}
                                    className="accent-green-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">
                                    Scale Y: {selectedItemData.scaleY.toFixed(1)}
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    value={selectedItemData.scaleY}
                                    onChange={(e) => updateSelectedItem({ scaleY: parseFloat(e.target.value) })}
                                    className="accent-green-500"
                                />
                            </div>

                            {/* Màu sắc */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-2">Màu sắc</label>
                                <div className="flex gap-2 flex-wrap">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => updateSelectedItem({ color })}
                                            className={`w-8 h-8 rounded-full border-3 transition-all duration-200 transform hover:scale-110 ${selectedItemData.color === color
                                                ? 'border-gray-800 shadow-lg scale-110'
                                                : 'border-gray-300 hover:border-gray-500'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Reset & Delete */}
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => updateSelectedItem({ rotation: 0, scaleX: 1, scaleY: 1 })}
                                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 
            text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 
            transition-all duration-300 transform hover:scale-105"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Reset
                                </button>
                                <button
                                    onClick={deleteSelectedItem}
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
            text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 
            transition-all duration-300 transform hover:scale-105"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}



                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Enhanced Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Upload Section */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-blue-500" />
                                Tải ảnh lên
                            </h3>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                ref={fileInputRef}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                                            text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 
                                            flex items-center justify-center gap-2 shadow-lg"
                            >
                                <ImageIcon className="w-4 h-4" />
                                Chọn ảnh
                            </button>
                        </div>

                        {/* Canvas Controls */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                            <h3 className="font-semibold text-gray-700 mb-4">Canvas Controls</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Zoom: {Math.round(canvasZoom * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="3"
                                        step="0.1"
                                        value={canvasZoom}
                                        onChange={(e) => setCanvasZoom(parseFloat(e.target.value))}
                                        className="w-full accent-blue-500"
                                    />
                                </div>
                                <button
                                    onClick={() => { setCanvasZoom(1); setCanvasPan({ x: 0, y: 0 }); }}
                                    className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg transition-all"
                                >
                                    Reset View
                                </button>
                            </div>
                        </div>

                        {/* Draggable Items */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                            <h3 className="font-semibold text-gray-700 mb-4">Kéo thả Items</h3>
                            <div className="space-y-3">
                                {availableItems.map((item) => (
                                    <div
                                        key={item.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, item)}
                                        className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 
                                                    border border-gray-200 rounded-xl p-4 cursor-move transition-all duration-300 
                                                    flex items-center gap-3 transform hover:scale-105 hover:shadow-md"
                                    >
                                        <div className="text-blue-500">{item.icon}</div>
                                        <span className="text-sm font-medium">{item.content}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Enhanced Item Properties */}
                        {/* {selectedItemData && (
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <Move className="w-5 h-5 text-purple-500" />
                                        Thuộc tính
                                    </h3>

                                    <div className="space-y-4">
                                        {selectedItemData.type === 'text' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">Nội dung</label>
                                                <input
                                                    type="text"
                                                    value={selectedItemData.content}
                                                    onChange={(e) => updateSelectedItem({ content: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Kích thước: {selectedItemData.size}px
                                            </label>
                                            <input
                                                type="range"
                                                min="12"
                                                max="72"
                                                value={selectedItemData.size}
                                                onChange={(e) => updateSelectedItem({ size: parseInt(e.target.value) })}
                                                className="w-full accent-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Xoay: {Math.round(selectedItemData.rotation)}°
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="360"
                                                value={selectedItemData.rotation}
                                                onChange={(e) => updateSelectedItem({ rotation: parseInt(e.target.value) })}
                                                className="w-full accent-purple-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                                    Scale X: {selectedItemData.scaleX.toFixed(1)}
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0.1"
                                                    max="3"
                                                    step="0.1"
                                                    value={selectedItemData.scaleX}
                                                    onChange={(e) => updateSelectedItem({ scaleX: parseFloat(e.target.value) })}
                                                    className="w-full accent-green-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                                    Scale Y: {selectedItemData.scaleY.toFixed(1)}
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0.1"
                                                    max="3"
                                                    step="0.1"
                                                    value={selectedItemData.scaleY}
                                                    onChange={(e) => updateSelectedItem({ scaleY: parseFloat(e.target.value) })}
                                                    className="w-full accent-green-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Màu sắc</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {colors.map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => updateSelectedItem({ color })}
                                                        className={`w-8 h-8 rounded-full border-3 transition-all duration-200 transform hover:scale-110 ${selectedItemData.color === color
                                                                ? 'border-gray-800 shadow-lg scale-110'
                                                                : 'border-gray-300 hover:border-gray-500'
                                                            }`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateSelectedItem({ rotation: 0, scaleX: 1, scaleY: 1 })}
                                                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 
                                                        text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 
                                                        transition-all duration-300 transform hover:scale-105"
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                                Reset
                                            </button>
                                            <button
                                                onClick={deleteSelectedItem}
                                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                                                        text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 
                                                        transition-all duration-300 transform hover:scale-105"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )} */}
                    </div>

                    {/* Enhanced Canvas */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                            <h3 className="font-semibold text-gray-700 mb-4">Enhanced Canvas</h3>

                            <div
                                ref={canvasRef}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onWheel={handleCanvasWheel}
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        setSelectedItem(null);
                                    }
                                }}
                                className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden 
                                            bg-gradient-to-br from-gray-50 to-gray-100 min-h-[600px] cursor-crosshair"
                                style={{
                                    backgroundImage: uploadedImage ? `url(${uploadedImage})` : undefined,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    transform: `scale(${canvasZoom}) translate(${canvasPan.x}px, ${canvasPan.y}px)`,
                                    transformOrigin: 'top left',
                                }}
                            >
                                {!uploadedImage && (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <div className="text-center">
                                            <ImageIcon className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                            <p className="text-xl font-medium">Tải ảnh lên và bắt đầu sáng tạo</p>
                                            <p className="text-sm mt-2">Cuộn chuột để zoom, kéo items để tạo</p>
                                        </div>
                                    </div>
                                )}

                                {/* Enhanced Transformable Items */}
                                {droppedItems.map((item) => (
                                    <TransformableItem
                                        key={item.id}
                                        item={item}
                                        isSelected={selectedItem === item.id}
                                        onUpdate={(updates) => updateItem(item.id, updates)}
                                        onSelect={() => setSelectedItem(item.id)}
                                    />
                                ))}
                            </div>

                            <div className="mt-6 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                                <p className="font-semibold mb-2">🎨 Hướng dẫn sử dụng Enhanced Editor:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li><strong>Zoom:</strong> Cuộn chuột trên canvas hoặc dùng slider</li>
                                    <li><strong>Di chuyển:</strong> Kéo handle xanh ở giữa item</li>
                                    <li><strong>Xoay:</strong> Kéo handle tím phía trên</li>
                                    <li><strong>Resize:</strong> Kéo handle xanh lá phía dưới</li>
                                    <li><strong>Scale riêng biệt:</strong> Dùng slider Scale X/Y</li>
                                    <li><strong>Hiệu ứng:</strong> Items có animation và effects khi hover/select</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedImageEditor;