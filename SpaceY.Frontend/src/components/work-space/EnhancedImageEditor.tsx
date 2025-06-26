'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Move, RotateCcw, Trash2, ImageIcon } from 'lucide-react';
import TransformableItem from './TransformableItem';
import { DroppedItem } from '@/types/work-space';
import SidebarPanel from '@/components/work-space/SidebarPanel';
import ProductServices from '@/services/ProductServices';
import { ProductDto } from '@/types/product';

const EnhancedImageEditor: React.FC = () => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [products, setProducts] = useState<ProductDto[]>([]);
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductServices.GetAll();
                const data = await response;
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
        fetchProducts();
    }, []);

    const handleDragStart = (e: React.DragEvent, item: ProductDto) => {
        const dragData = {
            id: item.id,
            type: 'image',
            imageUrl: item.image2DUrl,
        };
        e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        try {
            const itemData = JSON.parse(e.dataTransfer.getData('application/json'));
            const newItem: DroppedItem = {
                id: `${itemData.id}-${Date.now()}`,
                type: itemData.type,
                imageUrl: itemData.imageUrl,
                x,
                y,
                rotation: 0,
                color: '#ff4444',
                size: 50,
                scaleX: 1,
                scaleY: 1,
            };
            setDroppedItems((prev) => [...prev, newItem]);
        } catch (error) {
            console.error('Error parsing dropped data:', error);
        }
    };

    const updateItem = (itemId: string, updates: Partial<DroppedItem>) => {
        setDroppedItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item)));
    };

    const updateSelectedItem = (updates: Partial<DroppedItem>) => {
        if (!selectedItem) return;
        updateItem(selectedItem, updates);
    };

    const deleteSelectedItem = () => {
        if (!selectedItem) return;
        setDroppedItems((prev) => prev.filter((item) => item.id !== selectedItem));
        setSelectedItem(null);
    };

    const resetSelectedItem = () => {
        if (!selectedItem) return;
        updateSelectedItem({ rotation: 0, scaleX: 1, scaleY: 1 });
    };

    const handleRemoveItem = (itemId: string) => {
        setDroppedItems((prev) => prev.filter((item) => item.id !== itemId));
        if (selectedItem === itemId) {
            setSelectedItem(null);
        }
    };

    const PropertyPanel = ({ item, onUpdate }: { item: DroppedItem; onUpdate: (updates: Partial<DroppedItem>) => void }) => (
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-white/40 min-w-64">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-700 text-sm flex items-center gap-1">
                    <Move className="w-4 h-4 text-purple-500" />
                    Thuộc tính
                </h4>
                <div className="flex gap-1">
                    <button
                        onClick={resetSelectedItem}
                        className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800 transition-colors"
                        title="Reset"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={deleteSelectedItem}
                        className="p-1 hover:bg-red-100 rounded text-red-600 hover:text-red-800 transition-colors"
                        title="Xóa"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                    <label className="block text-gray-600 mb-1">Kích thước: {item.size}px</label>
                    <input
                        type="range"
                        min="20"
                        max="200"
                        value={item.size}
                        onChange={(e) => onUpdate({ size: parseInt(e.target.value) })}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-full h-2 accent-blue-500 cursor-pointer"
                        style={{
                            background: 'linear-gradient(to right, #3b82f6 0%, #3b82f6 50%, #e5e7eb 50%, #e5e7eb 100%)',
                            outline: 'none'
                        }}
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-1">Xoay: {Math.round(item.rotation)}°</label>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={item.rotation}
                        onChange={(e) => onUpdate({ rotation: parseInt(e.target.value) })}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-full h-2 accent-purple-500 cursor-pointer"
                        style={{
                            background: 'linear-gradient(to right, #8b5cf6 0%, #8b5cf6 50%, #e5e7eb 50%, #e5e7eb 100%)',
                            outline: 'none'
                        }}
                    />
                </div>

            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="max-w-full mx-auto px-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-2">
                        <SidebarPanel
                            products={products}
                            onDragStart={handleDragStart}
                            onImageUpload={(file) => {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    setUploadedImage(e.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                            }}
                            droppedItems={droppedItems}
                            onRemoveItem={handleRemoveItem}
                        />
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                            <h3 className="font-semibold text-gray-700 mb-4">Canvas</h3>
                            <div
                                ref={canvasRef}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        setSelectedItem(null);
                                    }
                                }}
                                className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 min-h-[600px] cursor-crosshair"
                                style={{
                                    backgroundImage: uploadedImage ? `url(${uploadedImage})` : undefined,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    userSelect: 'none',
                                    WebkitUserSelect: 'none',
                                    msUserSelect: 'none',
                                }}
                            >
                                {!uploadedImage && (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                                        <div className="text-center">
                                            <ImageIcon className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                            <p className="text-xl font-medium">Tải ảnh lên và bắt đầu sáng tạo</p>
                                            <p className="text-sm mt-2">Kéo hình ảnh để tạo</p>
                                        </div>
                                    </div>
                                )}
                                {droppedItems.map((item) => (
                                    <TransformableItem
                                        key={item.id}
                                        item={item}
                                        isSelected={selectedItem === item.id}
                                        onUpdate={(updates) => updateItem(item.id, updates)}
                                        onSelect={() => setSelectedItem(item.id)}
                                        propertyPanel={selectedItem === item.id ? (
                                            <PropertyPanel
                                                item={item}
                                                onUpdate={(updates) => updateItem(item.id, updates)}
                                            />
                                        ) : null}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedImageEditor;