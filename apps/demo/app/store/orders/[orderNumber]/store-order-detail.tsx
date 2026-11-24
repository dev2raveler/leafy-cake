"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { formatPickup, formatWon } from "@/lib/order-format"
import { useOrders } from "@/lib/order-store"

import { OrderStatusBadge } from "../order-status-badge"
import { StoreOrderActions } from "./store-order-actions"

export function StoreOrderDetail({ orderNumber }: { orderNumber: string }) {
  const orders = useOrders()
  const order = orders?.find(({ number }) => number === orderNumber)
  const details = order && [
    ["픽업 일시", formatPickup(order.pickup)],
    ["레터링 문구", order.lettering],
    ["추가 요청 사항", order.additionalRequest || "없음"],
    ["주문자 이름", order.customerName],
    ["연락처", order.customerPhone],
  ]

  return (
    <main className="mx-auto max-w-5xl px-5 pt-5 pb-16 sm:px-8 sm:pt-8">
      <Link
        href="/store/orders"
        className="mb-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        주문 목록
      </Link>
      <header className="mb-6 grid gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          주문 상세
        </h1>
        {order && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="font-mono text-sm font-medium wrap-anywhere text-muted-foreground">
              {order.number}
            </p>
            <span aria-live="polite">
              <OrderStatusBadge status={order.status} />
            </span>
          </div>
        )}
      </header>

      {order && details ? (
        <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="grid gap-4">
            <section className="overflow-hidden rounded-2xl border bg-card">
              <div className="flex items-start gap-4 p-4 sm:items-center sm:p-5">
                <Image
                  {...order.cake.detailImage}
                  unoptimized
                  className="size-24 shrink-0 rounded-xl bg-muted object-cover sm:size-36"
                />
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">{order.cake.name}</h2>
                  <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
                    <dt className="text-muted-foreground">크기</dt>
                    <dd>{order.size.name}</dd>
                    <dt className="text-muted-foreground">맛</dt>
                    <dd>{order.flavor.name}</dd>
                  </dl>
                </div>
              </div>
              <dl className="flex items-center justify-between gap-4 border-t bg-muted px-4 py-3 sm:px-5">
                <dt className="text-sm font-medium">총액</dt>
                <dd className="text-xl font-semibold text-primary tabular-nums">
                  {formatWon(order.totalPrice)}
                </dd>
              </dl>
            </section>

            <section className="rounded-2xl border bg-card p-4 sm:p-5">
              <h2 className="mb-4 font-semibold">픽업 및 주문 정보</h2>
              <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 text-sm">
                {details.map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="wrap-anywhere whitespace-pre-wrap">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
          <StoreOrderActions order={order} />
        </div>
      ) : (
        <p
          role="status"
          className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground"
        >
          {orders
            ? "이 브라우저에서 주문을 찾을 수 없어요."
            : "주문을 불러오는 중이에요."}
        </p>
      )}
    </main>
  )
}
