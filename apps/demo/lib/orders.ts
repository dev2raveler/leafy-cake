import { getCakeQuote, type CakeSelection } from "./cakes"
import { getPickupSchedule, type PickupSlot } from "./pickup"

export const orderStatusLabels = {
  pending: "접수 대기",
  confirmed: "주문 확정",
  inProduction: "제작 중",
  ready: "픽업 준비",
  completed: "픽업 완료",
  rejected: "접수 거절",
} as const

export type OrderStatus = keyof typeof orderStatusLabels

export const nextOrderStatus = {
  pending: "confirmed",
  confirmed: "inProduction",
  inProduction: "ready",
  ready: "completed",
  completed: null,
  rejected: null,
} as const satisfies Record<OrderStatus, OrderStatus | null>

export type OrderDraft = {
  selection: CakeSelection
  pickup: PickupSlot
  lettering: string
  additionalRequest: string
  customerName: string
  customerPhone: string
}

export type Order = Omit<OrderDraft, "selection"> &
  NonNullable<ReturnType<typeof getCakeQuote>> & {
    number: string
    paymentConfirmed: boolean
    status: OrderStatus
    rejectionReason: string | null
  }

export type OrderAction =
  | { type: "confirm-payment" }
  | {
      type: "advance"
      status: NonNullable<(typeof nextOrderStatus)[OrderStatus]>
    }
  | { type: "reject"; reason: string }

export function createPendingOrder(
  number: string,
  draft: OrderDraft,
  now = new Date()
): Order {
  const { selection, pickup } = draft
  const quote = getCakeQuote(selection)
  if (!quote) throw new Error("선택한 케이크 옵션을 확인해 주세요.")

  const pickupDay = getPickupSchedule(now).find(
    ({ date }) => date === pickup.date
  )
  if (!pickupDay?.times.includes(pickup.time)) {
    throw new Error("선택한 픽업 일정을 확인해 주세요.")
  }

  const lettering = draft.lettering.trim()
  const customerName = draft.customerName.trim()
  const customerPhone = draft.customerPhone.trim()
  if (!lettering || !customerName || !customerPhone) {
    throw new Error("레터링 문구와 주문자 이름, 연락처를 입력해 주세요.")
  }

  return {
    ...quote,
    number,
    pickup: { ...pickup },
    lettering,
    additionalRequest: draft.additionalRequest.trim(),
    customerName,
    customerPhone,
    paymentConfirmed: false,
    status: "pending",
    rejectionReason: null,
  }
}

export function applyOrderAction(order: Order, action: OrderAction): Order {
  switch (action.type) {
    case "confirm-payment":
      if (order.paymentConfirmed) return order
      if (order.status !== "pending")
        throw new Error("접수 대기 주문만 입금을 확인할 수 있어요.")
      return { ...order, paymentConfirmed: true }
    case "advance":
      if (order.status === action.status) return order
      if (nextOrderStatus[order.status] !== action.status) {
        throw new Error("현재 주문 상태에서 진행할 수 없는 단계예요.")
      }
      if (!order.paymentConfirmed)
        throw new Error("전액 입금을 먼저 확인해 주세요.")
      return { ...order, status: action.status }
    case "reject": {
      const rejectionReason = action.reason.trim()
      if (!rejectionReason) throw new Error("거절 사유를 입력해 주세요.")
      if (
        order.status === "rejected" &&
        order.rejectionReason === rejectionReason
      )
        return order
      if (order.status !== "pending")
        throw new Error("접수 대기 주문만 거절할 수 있어요.")
      return { ...order, status: "rejected", rejectionReason }
    }
  }
}
