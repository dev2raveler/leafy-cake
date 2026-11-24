"use client"

import Link from "next/link"

import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"

import { formatPickup } from "@/lib/order-format"
import { useOrders } from "@/lib/order-store"
import { orderStatusLabels } from "@/lib/orders"

export function CustomerOrderStatus({ orderNumber }: { orderNumber: string }) {
  const orders = useOrders()
  const order = orders?.find(({ number }) => number === orderNumber)

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-8 sm:px-8 sm:py-12">
      <h1 className="text-3xl font-semibold tracking-tight">주문 상태</h1>
      <section className="rounded-2xl border bg-card p-5" aria-live="polite">
        {order ? (
          <dl className="grid gap-4">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-sm text-muted-foreground">현재 상태</dt>
              <dd>
                <Badge
                  variant={
                    order.status === "rejected" ? "destructive" : "default"
                  }
                  className="h-auto px-3 py-1 text-sm"
                >
                  {orderStatusLabels[order.status]}
                </Badge>
              </dd>
            </div>
            <div className="border-t pt-4">
              <dt className="text-sm text-muted-foreground">주문번호</dt>
              <dd className="mt-1 font-mono text-base font-semibold wrap-anywhere">
                {order.number}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">케이크</dt>
              <dd className="mt-1">{order.cake.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">픽업 일시</dt>
              <dd className="mt-1">{formatPickup(order.pickup)}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">
            {orders
              ? "이 브라우저에서 주문을 찾을 수 없어요. 주문번호와 주문에 사용한 브라우저를 확인해 주세요."
              : "주문을 불러오는 중이에요."}
          </p>
        )}
      </section>
      <Link
        href="/"
        className={buttonVariants({ variant: "outline", className: "h-11" })}
      >
        케이크 목록으로
      </Link>
    </main>
  )
}
