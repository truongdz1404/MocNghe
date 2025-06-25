interface DroppedItem {
    id: string;
    type: 'image';
    imageUrl: string;
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
    type: 'image';
    imageUrl: string;
    // icon: React.ReactNode;
}

export type { DroppedItem, DragItem };