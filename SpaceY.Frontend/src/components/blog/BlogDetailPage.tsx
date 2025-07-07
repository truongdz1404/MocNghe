// src/components/blog/BlogDetailPage.tsx
'use client';

import blogServices from '@/services/BlogServices';
import { BlogDto } from '@/types/blog';
import { useEffect, useState } from 'react';

interface Props {
    id: number;
}

export default function BlogDetailPage({ id }: Props) {
    const [blog, setBlog] = useState<BlogDto | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            const res = await blogServices.getById(id);
            setBlog(res);
        };
        fetchBlog();
    }, [id]);

    return (
        <article className="max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 py-12">
            <header className="mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
                    {blog?.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <time dateTime={blog?.createdAt}>
                        {new Date(blog?.createdAt ?? '').toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>
                    <span>•</span>
                </div>
            </header>
            <div
                className="prose prose-lg prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: blog?.content ?? '' }}
            />
            <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                    Cập nhật lần cuối: {new Date(blog?.createdAt ?? '').toLocaleDateString('vi-VN')}
                </div>
            </footer>
        </article>
    );
}
