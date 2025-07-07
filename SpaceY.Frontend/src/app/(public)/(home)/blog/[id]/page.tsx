// src/app/(public)/(home)/blog/[id]/page.tsx

import BlogDetailPage from '@/components/blog/BlogDetailPage';

interface Props {
    params: Promise<{ id: string }>; // Thay đổi ở đây
}

export default async function Page({ params }: Props) {
    const { id } = await params; // Giải nén params từ Promise
    return <BlogDetailPage id={Number(id)} />;
}