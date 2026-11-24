"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import { formatPickup } from "@/lib/order-format"
import { useOrders } from "@/lib/order-store"

import { OrderStatusBadge } from "./order-status-badge"

export function StoreOrderList() {
  const orders = useOrders()

  if (!orders?.length) {
    return (
      <p
        role="status"
        className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground"
      >
        {orders ? "등록된 주문이 없어요." : "주문을 불러오는 중이에요."}
      </p>
    )
  }

  return (
    <>
      <ul className="grid gap-3 md:hidden" aria-label="주문 목록">
        {orders.map((order) => (
          <li key={order.number}>
            <Link
              href={`/store/orders/${encodeURIComponent(order.number)}`}
              className="group grid gap-3 rounded-2xl border bg-card p-4 outline-none hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-sm font-semibold wrap-anywhere">
                  {order.number}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{order.cake.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatPickup(order.pickup)}
                  </p>
                </div>
                <ChevronRight
                  aria-hidden="true"
                  className="size-5 shrink-0 text-primary"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
        <Table aria-label="주문 목록">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead scope="col" className="h-12 pl-5">
                주문번호
              </TableHead>
              <TableHead scope="col">케이크</TableHead>
              <TableHead scope="col">픽업 일시</TableHead>
              <TableHead scope="col" className="pr-5">
                상태
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.number}>
                <TableCell className="py-2 pl-5">
                  <Link
                    href={`/store/orders/${encodeURIComponent(order.number)}`}
                    className="inline-flex min-h-11 items-center font-mono font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {order.number}
                  </Link>
                </TableCell>
                <TableCell>{order.cake.name}</TableCell>
                <TableCell>{formatPickup(order.pickup)}</TableCell>
                <TableCell className="pr-5">
                  <OrderStatusBadge status={order.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
