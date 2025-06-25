'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import blogServices from '@/services/BlogServices';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

export default function CreateBlogPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // Hàm upload ảnh base64 lên Cloudinary
    const uploadBase64ToCloudinary = async (base64Image: string) => {
        const formData = new FormData();
        formData.append('file', base64Image);
        formData.append('upload_preset', UPLOAD_PRESET ?? '');

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        return data.secure_url;
    };

    // Tìm và upload tất cả ảnh base64 → thay thế = link Cloudinary
    const processContentWithUploads = async (html: string): Promise<string> => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const images = Array.from(doc.images).filter((img) => img.src.startsWith('data:'));

        for (const img of images) {
            const cloudUrl = await uploadBase64ToCloudinary(img.src);
            img.setAttribute('src', cloudUrl);
        }

        return doc.body.innerHTML;
    };

    const handleCreateBlog = async () => {
        const processedContent = await processContentWithUploads(content);

        const dto = {
            title,
            content: processedContent,
            banner: '',
        };

        const res = await blogServices.create(dto);

        if (res.success) {
            alert('Tạo blog thành công!');
            setTitle('');
            setContent('');
        } else {
            alert('Có lỗi xảy ra.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold">Tạo bài viết Blog</h2>

            <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Tiêu đề bài viết"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <ReactQuill
                value={content}
                onChange={setContent}
                theme="snow"
                placeholder="Soạn nội dung blog... Dán ảnh trực tiếp vào đây"
                modules={{
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ color: [] }, { background: [] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image'],
                        ['clean'],
                    ],
                }}
            />

            <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleCreateBlog}
            >
                Tạo Blog
            </button>
        </div>
    );
}
