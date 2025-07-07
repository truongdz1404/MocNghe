import ViewProductDetail from '@/components/product/ViewProductDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return (
    <div>
      <ViewProductDetail id={id} />
    </div>
  );
}