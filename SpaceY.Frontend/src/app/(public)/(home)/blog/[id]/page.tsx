'use client'
import blogServices from '@/services/BlogServices';
import { BlogDto } from '@/types/blog';
import { useEffect, useState } from 'react';

interface Props {
    params: { id: string };
}

export default function BlogDetailPage({ params }: Props) {
    const id = Number(params.id);
    const [blog, setBlog] = useState<BlogDto | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            const res = await blogServices.getById(id);
            console.log(res);
            setBlog(res);
        }
        fetchBlog();
    }, [id]);

    return (
        <article className="max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 py-12">
            {/* Header Section */}
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
                    {/* <span>{blog?.author?.name ?? 'Tác giả ẩn danh'}</span> */}
                </div>
            </header>

            {/* Featured Image */}
            {/* {blog?.image && (
                <div className="mb-12">
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-96 object-cover rounded-xl shadow-lg"
                    />
                </div>
            )} */}

            {/* Content Section */}
            <div
                className="prose prose-lg prose-gray max-w-none
                    prose-headings:font-semibold prose-headings:text-gray-900
                    prose-p:text-gray-700 prose-a:text-blue-600 prose-a:hover:text-blue-800
                    prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4
                    prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto"
                dangerouslySetInnerHTML={{ __html: blog?.content ?? '' }}
            />

            {/* Footer Section */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Cập nhật lần cuối: {new Date(blog?.createdAt ?? '').toLocaleDateString('vi-VN')}
                    </div>
                </div>
            </footer>
        </article>
    );
}