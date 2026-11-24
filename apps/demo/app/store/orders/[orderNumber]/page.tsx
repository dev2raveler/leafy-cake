import type { Metadata } from "next"

import { StoreOrderDetail } from "./store-order-detail"

export const metadata: Metadata = { title: "매장 주문 상세 | 리피 케이크" }

export default async function StoreOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>
}) {
  const { orderNumber } = await params

  return <StoreOrderDetail key={orderNumber} orderNumber={orderNumber} />
}
