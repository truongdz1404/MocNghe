'use client'
import { useEffect, useState } from 'react';
import blogServices from '@/services/BlogServices';
import { BlogDto } from '@/types/blog';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogList() {
    const [blogs, setBlogs] = useState<BlogDto[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const res = await blogServices.getAll();
            // Assuming res.success contains the array of blogs
            if (res !== null) {
                setBlogs(res.slice(0, 3)); // Limit to 3 blogs
            }
        };
        fetchBlogs();
    }, []);

    return (
        <section className="py-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 uppercase text-center ">Bài viết nổi bật</h2>
            <div className="flex space-x-6 justify-center overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300">
                {blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <Link
                            key={blog.id}
                            href={`/blog/${blog.id}`}
                            className="flex-none w-80 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 snap-start"
                        >
                            <Image
                                src={blog.banner}
                                alt={blog.title}
                                width={500}
                                height={500}
                                className="w-full h-48 object-cover rounded-t-xl"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                                    {blog.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    {new Date(blog.createdAt).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                                <div
                                    className="text-gray-600 mt-3 line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-gray-500">Đang tải bài viết...</p>
                )}
            </div>
        </section>
    );
}