import EditProduct from '@/views/admin/product/EditProduct'

const EditProductPage = ({ params }: { params: { id: string } }) => {
  return <EditProduct productId={params.id} />
}

export default EditProductPage
