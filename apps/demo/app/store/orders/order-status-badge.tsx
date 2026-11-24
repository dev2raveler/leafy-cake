import { Badge } from "@workspace/ui/components/badge"

import { orderStatusLabels, type OrderStatus } from "@/lib/orders"

const variants = {
  pending: "outline",
  confirmed: "secondary",
  inProduction: "secondary",
  ready: "default",
  completed: "outline",
  rejected: "destructive",
} as const satisfies Record<OrderStatus, string>

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={variants[status]} className="h-auto px-2.5 py-1 text-sm">
      {orderStatusLabels[status]}
    </Badge>
  )
}
