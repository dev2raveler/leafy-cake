import { useState, type FormEvent } from "react"

import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"

import { updateOrder } from "@/lib/order-store"
import { nextOrderStatus, type Order, type OrderAction } from "@/lib/orders"

const actionLabels = {
  confirmed: "주문 확정",
  inProduction: "제작 시작",
  ready: "픽업 준비 완료",
  completed: "픽업 완료",
}

export function StoreOrderActions({ order }: { order: Order }) {
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const pending = order.status === "pending"
  const nextStatus = nextOrderStatus[order.status]

  async function applyAction(action: OrderAction) {
    if (saving) return

    setSaving(true)
    setError("")
    try {
      await updateOrder(order.number, action)
    } catch (error) {
      setError(
        error instanceof Error && error.name === "Error"
          ? error.message
          : "주문을 저장하지 못했어요. 다시 시도해 주세요."
      )
    } finally {
      setSaving(false)
    }
  }

  function rejectOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (reason.trim()) void applyAction({ type: "reject", reason })
  }

  return (
    <section className="grid gap-4 rounded-2xl border bg-card p-4 sm:p-5">
      <h2 className="font-semibold">주문 처리</h2>
      <dl
        className="flex items-center justify-between gap-3 text-sm"
        aria-live="polite"
      >
        <dt className="text-muted-foreground">전액 입금</dt>
        <dd className="font-medium">
          {order.paymentConfirmed ? "확인 완료" : "확인 전"}
        </dd>
      </dl>

      {nextStatus && !(pending && rejecting) && (
        <div className="grid gap-2 border-t pt-4">
          {pending && !order.paymentConfirmed && (
            <Button
              type="button"
              variant="outline"
              className="h-11"
              disabled={saving}
              onClick={() => void applyAction({ type: "confirm-payment" })}
            >
              전액 입금 확인
            </Button>
          )}
          <Button
            type="button"
            className="h-11"
            disabled={saving || !order.paymentConfirmed}
            onClick={() =>
              void applyAction({ type: "advance", status: nextStatus })
            }
          >
            {actionLabels[nextStatus]}
          </Button>
          {pending && (
            <Button
              type="button"
              variant="destructive"
              className="mt-2 h-11"
              disabled={saving}
              onClick={() => setRejecting(true)}
            >
              접수 거절
            </Button>
          )}
        </div>
      )}

      {pending && rejecting && (
        <form className="grid gap-3 border-t pt-4" onSubmit={rejectOrder}>
          <Label htmlFor="rejection-reason">거절 사유</Label>
          <Textarea
            id="rejection-reason"
            required
            autoFocus
            value={reason}
            disabled={saving}
            onChange={(event) => setReason(event.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11"
              disabled={saving}
              onClick={() => {
                setRejecting(false)
                setReason("")
                setError("")
              }}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="h-11"
              disabled={saving || !reason.trim()}
            >
              접수 거절
            </Button>
          </div>
        </form>
      )}

      {order.status === "rejected" && (
        <dl className="grid gap-2 border-t pt-4 text-sm">
          <dt className="font-medium">거절 사유</dt>
          <dd className="wrap-anywhere whitespace-pre-wrap">
            {order.rejectionReason}
          </dd>
        </dl>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </section>
  )
}
