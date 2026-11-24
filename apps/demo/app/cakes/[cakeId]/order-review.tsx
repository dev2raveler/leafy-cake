import type { RefObject } from "react"
import Image from "next/image"

import { Button } from "@workspace/ui/components/button"
import { DrawerTrigger } from "@workspace/ui/components/drawer"

import type { getCakeQuote } from "@/lib/cakes"
import { formatPickup, formatWon } from "@/lib/order-format"
import type { OrderDraft } from "@/lib/orders"

export function OrderReview({
  quote,
  draft,
  headingRef,
  submitting,
  error,
  onEditOptions,
  onSubmit,
}: {
  quote: NonNullable<ReturnType<typeof getCakeQuote>>
  draft: OrderDraft
  headingRef: RefObject<HTMLHeadingElement | null>
  submitting: boolean
  error: string
  onEditOptions: () => void
  onSubmit: () => void
}) {
  const information = [
    ["픽업 일시", formatPickup(draft.pickup)],
    ["레터링 문구", draft.lettering.trim()],
    ["추가 요청 사항", draft.additionalRequest.trim() || "없음"],
    ["주문자 이름", draft.customerName.trim()],
    ["연락처", draft.customerPhone.trim()],
  ]

  return (
    <section className="mx-auto grid max-w-lg gap-5">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-3xl font-semibold tracking-tight outline-none"
      >
        주문 확인
      </h1>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="flex items-center gap-3 p-4">
          <Image
            {...quote.cake.detailImage}
            unoptimized
            className="size-16 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold">{quote.cake.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {quote.size.name} · {quote.flavor.name}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="h-11"
            disabled={submitting}
            onClick={onEditOptions}
          >
            옵션 수정
          </Button>
        </div>
        <div className="flex items-center justify-between gap-4 border-t bg-muted px-4 py-3">
          <p className="text-sm font-medium">총액</p>
          <p className="text-xl font-semibold text-primary tabular-nums">
            {formatWon(quote.totalPrice)}
          </p>
        </div>
      </div>
      <div className="rounded-2xl border bg-card p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="font-semibold">픽업 및 주문 정보</h2>
          <DrawerTrigger
            render={<Button variant="ghost" className="h-11" />}
            disabled={submitting}
          >
            정보 수정
          </DrawerTrigger>
        </div>
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 text-sm">
          {information.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="wrap-anywhere whitespace-pre-wrap">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button
        type="button"
        className="h-12"
        disabled={submitting}
        onClick={onSubmit}
      >
        {submitting ? "주문 요청 중…" : "주문 요청 보내기"}
      </Button>
    </section>
  )
}
