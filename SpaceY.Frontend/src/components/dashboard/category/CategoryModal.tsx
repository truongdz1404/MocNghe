import React, { useState } from "react";
import ImageUploader from "@/components/image/ImageUploader";
import Image from "next/image";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
    Button,
    Input,
} from "@/components/ui/MaterialTailwind";
import { UpdateCategoryDto } from "@/types/category";

interface CategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: UpdateCategoryDto, imageFile?: File) => void;
    loading: boolean;
    initialData?: UpdateCategoryDto;
    isEdit?: boolean;
    imagePreview?: string;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    open,
    onClose,
    onSubmit,
    loading,
    initialData = { name: "", url: "", visible: true },
    isEdit = false,
    imagePreview = "",
}) => {
    const [formData, setFormData] = useState<UpdateCategoryDto>(initialData);
    const [imageUrl, setImageUrl] = useState<string>(imagePreview);

    React.useEffect(() => {
        setFormData(initialData);
        setImageUrl(imagePreview);
    }, [initialData, imagePreview, open]);


    const handleImageUrlsChange = (urls: string[]) => {
        setImageUrl(urls[0] || "");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            alert("Vui lòng nhập tên danh mục");
            return;
        }
        onSubmit({ ...formData, url: imageUrl });
    };

    return (
        <Dialog open={open} handler={onClose} size="md">
            <DialogHeader>
                <Typography variant="h4" color="blue-gray">
                    {isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
                </Typography>
            </DialogHeader>
            <DialogBody className="max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                    <Input
                        label="Tên danh mục *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        crossOrigin={undefined}
                    />
                    <div>
                        <Typography variant="small" color="blue-gray">
                            Hình ảnh
                        </Typography>
                        <ImageUploader onImageUrlsChange={handleImageUrlsChange} />
                        {(imageUrl || (isEdit && initialData?.url)) && (
                            <Image
                                src={imageUrl || initialData?.url || "/placeholder-image.jpg"}
                                alt="Preview"
                                width={128}
                                height={128}
                                className="mt-2 w-32 h-32 object-cover rounded border"
                            />
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="visible"
                            checked={formData.visible}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <Typography variant="small" color="blue-gray">
                            Hiển thị
                        </Typography>
                    </div>
                </div>
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    onClick={onClose}
                    className="mr-1"
                >
                    Hủy
                </Button>
                <Button
                    color="blue"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (isEdit ? "Đang cập nhật..." : "Đang thêm...") : isEdit ? "Cập nhật" : "Thêm"}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default CategoryModal;
