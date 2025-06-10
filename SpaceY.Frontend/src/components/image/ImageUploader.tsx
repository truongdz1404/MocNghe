"use client";

import React, { useState, useRef, forwardRef, useEffect, useMemo } from "react";
import { Trash2, Upload } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

interface FileWithProgress {
    file: File;
    preview: string;
    name: string;
    size: number;
    progress: number;
    url?: string;
    publicId?: string;
    uploading: boolean;
    error?: string;
}

interface ImageUploadRowProps {
    fileData: FileWithProgress;
    onRemove: () => void;
}

interface CloudinaryImageUploaderProps {
    onImageUrlsChange: (urls: string[]) => void;
}

const ImageUploadRow = forwardRef<HTMLTableRowElement, ImageUploadRowProps>(
    ({ fileData, onRemove }, ref) => {
        const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            onRemove();
        };

        const isCompleted = fileData.progress === 100 && fileData.url;
        const hasError = !!fileData.error;

        return (
            <tr ref={ref} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className={`relative flex h-12 w-20 justify-center overflow-hidden rounded-sm ${!isCompleted ? "opacity-60" : ""}`}>
                        <Image
                            src={fileData.preview}
                            className="scale-125 absolute top-1/2 left-0 object-cover opacity-30 -translate-y-1/2 blur-xl w-full"
                            alt={fileData.name}
                            width={80}
                            height={48}
                            loading="lazy"
                        />
                        <Image
                            className="object-contain relative z-10"
                            src={fileData.preview}
                            alt={fileData.name}
                            width={80}
                            height={48}
                        />
                        {fileData.uploading && fileData.progress < 100 && (
                            <div className="absolute flex w-full h-full justify-center items-center bg-black bg-opacity-20 z-20">
                                <CircularProgressbar
                                    value={fileData.progress}
                                    strokeWidth={50}
                                    className="w-6 h-6"
                                    styles={buildStyles({
                                        strokeLinecap: "butt",
                                        pathColor: hasError ? "#ef4444" : "#6b7280",
                                        textColor: hasError ? "#ef4444" : "#6b7280"
                                    })}
                                />
                            </div>
                        )}
                        {isCompleted && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center z-20">
                                <span className="text-white text-xs">✓</span>
                            </div>
                        )}
                        {hasError && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center z-20">
                                <span className="text-white text-xs">!</span>
                            </div>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4 truncate whitespace-normal text-sm font-medium dark:text-slate-400">
                    <div>
                        <p className="w-[10rem] text-ellipsis whitespace-nowrap overflow-hidden">
                            {fileData.name}
                        </p>
                        {hasError && (
                            <p className="text-red-500 text-xs mt-1 truncate" title={fileData.error}>
                                {fileData.error}
                            </p>
                        )}
                        {isCompleted && fileData.publicId && (
                            <p className="text-green-600 text-xs mt-1">
                                ID: {fileData.publicId}
                            </p>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-slate-400">
                    {(fileData.size / 1000).toFixed(0)} KB
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                        {fileData.uploading ? (
                            <span className="text-blue-600 text-xs">Đang tải...</span>
                        ) : isCompleted ? (
                            <span className="text-green-600 text-xs">Hoàn thành</span>
                        ) : hasError ? (
                            <span className="text-red-500 text-xs">Lỗi</span>
                        ) : (
                            <span className="text-gray-500 text-xs">Chờ</span>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4 h-full whitespace-nowrap text-sm">
                    <button
                        type="button"
                        className="flex p-2 items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 rounded"
                        disabled={fileData.uploading}
                        onClick={handleRemove}
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                </td>
            </tr>
        );
    }
);

ImageUploadRow.displayName = "ImageUploadRow";

export default function CloudinaryImageUploader({ onImageUrlsChange }: CloudinaryImageUploaderProps) {
    const [files, setFiles] = useState<FileWithProgress[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const urls = useMemo(() => files.filter(f => f.url).map(f => f.url!), [files]);

    useEffect(() => {
        onImageUrlsChange(urls);
    }, [urls, onImageUrlsChange]);
    const createFileData = (file: File): FileWithProgress => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        progress: 0,
        uploading: false
    });

    const uploadToCloudinary = async (fileData: FileWithProgress, index: number) => {
        if (!CLOUD_NAME || !UPLOAD_PRESET) {
            setFiles(prev => prev.map((f, i) =>
                i === index
                    ? { ...f, error: "Thiếu cấu hình CLOUD_NAME hoặc UPLOAD_PRESET", uploading: false }
                    : f
            ));
            return;
        }

        setFiles(prev => prev.map((f, i) =>
            i === index ? { ...f, uploading: true, progress: 10, error: undefined } : f
        ));

        try {
            const formData = new FormData();
            formData.append("file", fileData.file);
            formData.append("upload_preset", UPLOAD_PRESET);

            const progressInterval = setInterval(() => {
                setFiles(prev => prev.map((f, i) =>
                    i === index && f.progress < 90
                        ? { ...f, progress: Math.min(90, f.progress + 10) }
                        : f
                ));
            }, 200);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            clearInterval(progressInterval);

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();

            setFiles(prev => prev.map((f, i) =>
                i === index
                    ? {
                        ...f,
                        progress: 100,
                        uploading: false,
                        url: data.secure_url,
                        publicId: data.public_id,
                        error: undefined
                    }
                    : f
            ));

        } catch (error) {
            setFiles(prev => prev.map((f, i) =>
                i === index
                    ? {
                        ...f,
                        uploading: false,
                        error: error instanceof Error ? error.message : "Upload failed",
                        progress: 0
                    }
                    : f
            ));
        }
    };

    const handleFiles = async (selectedFiles: FileList) => {
        const validFiles = Array.from(selectedFiles).filter(file =>
            file.type.startsWith('image/')
        );

        if (validFiles.length === 0) return;

        const newFiles = validFiles.map(createFileData);
        const currentLength = files.length;

        setFiles(prev => [...prev, ...newFiles]);

        newFiles.forEach((fileData, i) => {
            uploadToCloudinary(fileData, currentLength + i);
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
            e.target.value = '';
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const clearAllFiles = () => {
        files.forEach(file => URL.revokeObjectURL(file.preview));
        setFiles([]);
    };

    const completedUploads = files.filter(f => f.url).length;
    const failedUploads = files.filter(f => f.error).length;
    const inProgress = files.filter(f => f.uploading).length;

    return (
        <div className="space-y-6 p-6 max-w-6xl mx-auto">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Upload Ảnh lên Cloudinary</h2>

                <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-4">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div>
                            <p className="text-lg font-medium text-gray-700">
                                Kéo thả ảnh vào đây hoặc click để chọn
                            </p>
                            <p className="text-sm text-gray-500">
                                Hỗ trợ nhiều ảnh cùng lúc (PNG, JPG, GIF, WebP)
                            </p>
                        </div>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex space-x-6 text-sm">
                            <span className="text-gray-600">
                                Tổng: <span className="font-semibold">{files.length}</span>
                            </span>
                            <span className="text-blue-600">
                                Đang tải: <span className="font-semibold">{inProgress}</span>
                            </span>
                            <span className="text-green-600">
                                Thành công: <span className="font-semibold">{completedUploads}</span>
                            </span>
                            <span className="text-red-600">
                                Lỗi: <span className="font-semibold">{failedUploads}</span>
                            </span>
                        </div>
                        <button
                            onClick={clearAllFiles}
                            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            Xóa tất cả
                        </button>
                    </div>
                )}
            </div>

            {files.length > 0 && (
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Preview
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên file
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kích thước
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {files.map((fileData, index) => (
                                <ImageUploadRow
                                    key={`${fileData.name}-${index}`}
                                    fileData={fileData}
                                    onRemove={() => removeFile(index)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {completedUploads > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                        URLs ảnh đã upload ({completedUploads})
                    </h3>
                    <div className="bg-gray-100 p-4 rounded-lg max-h-48 overflow-y-auto space-y-2">
                        {files
                            .filter(f => f.url)
                            .map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                                    <div className="flex-1 mr-4">
                                        <p className="font-medium text-gray-700">{file.name}</p>
                                        <p className="text-gray-500 break-all">{file.url}</p>
                                    </div>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(file.url!)}
                                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}