import { CustomerOrderStatus } from "./customer-order-status"

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>
}) {
  const { orderNumber } = await params

  return <CustomerOrderStatus orderNumber={orderNumber} />
}
