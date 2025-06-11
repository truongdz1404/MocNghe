import ViewProductDetail from '@/components/product/ViewProductDetail'
import React from 'react'
interface PageProps {
    params: { id: string }
}
export default function page({params}:PageProps) {
  return (
    <div>
      <ViewProductDetail params={params}/>
    </div>
  )
}
