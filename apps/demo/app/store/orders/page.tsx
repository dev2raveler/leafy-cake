import type { Metadata } from "next"

import { StoreOrderList } from "./store-order-list"

export const metadata: Metadata = { title: "매장 주문 관리 | 리피 케이크" }

export default function StoreOrdersPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pt-8 pb-16 sm:px-8 sm:pt-12">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight sm:mb-8 sm:text-4xl">
        매장 주문 관리
      </h1>
      <StoreOrderList />
    </main>
  )
}
