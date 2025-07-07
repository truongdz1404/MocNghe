import ProductByCategory from '@/components/product/ProductByCategory';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    return <ProductByCategory id={Number(id)} />;
}