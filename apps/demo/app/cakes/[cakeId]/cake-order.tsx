"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Drawer, DrawerTrigger } from "@workspace/ui/components/drawer"

import { getCakeQuote, type Cake, type CakeOption } from "@/lib/cakes"
import { formatWon } from "@/lib/order-format"
import { createOrderNumber, submitOrder } from "@/lib/order-store"
import type { OrderDraft } from "@/lib/orders"
import { getPickupSchedule, type PickupSlot } from "@/lib/pickup"

import {
  OrderDrawer,
  type CustomerDetails,
  type OrderStep,
} from "./order-drawer"
import { OrderReview } from "./order-review"

function CakeOptions({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string
  name: string
  options: readonly CakeOption[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.id} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="peer sr-only"
            />
            <span className="flex min-h-12 items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm font-medium peer-checked:border-primary peer-checked:bg-muted peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
              {option.name}
              {option.additionalPrice > 0 && (
                <span className="text-xs text-muted-foreground">
                  +{formatWon(option.additionalPrice)}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function CakeOrder({ cake }: { cake: Cake }) {
  const router = useRouter()
  const [sizeId, setSizeId] = useState(cake.sizes[0]?.id ?? "")
  const [flavorId, setFlavorId] = useState(cake.flavors[0]?.id ?? "")
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<OrderStep>("pickup")
  const [schedule, setSchedule] = useState<
    ReturnType<typeof getPickupSchedule>
  >([])
  const [pickup, setPickup] = useState<PickupSlot>({ date: "", time: "" })
  const [details, setDetails] = useState<CustomerDetails>({
    lettering: "",
    additionalRequest: "",
    customerName: "",
    customerPhone: "",
  })
  const [reviewDraft, setReviewDraft] = useState<OrderDraft>()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const reviewHeading = useRef<HTMLHeadingElement>(null)
  const submission = useRef({ inFlight: false, number: "" })

  const selection = { cakeId: cake.id, sizeId, flavorId }
  const quote = getCakeQuote(reviewDraft?.selection ?? selection)
  if (!quote) return <p role="alert">케이크 옵션을 불러올 수 없어요.</p>

  function changeDrawerOpen(nextOpen: boolean) {
    if (nextOpen) {
      setSchedule(getPickupSchedule())
      setStep("pickup")
    }
    setOpen(nextOpen)
  }

  function reviewOrder() {
    setReviewDraft({ selection, pickup, ...details })
    setError("")
    setOpen(false)
    window.scrollTo(0, 0)
  }

  async function sendOrder() {
    if (!reviewDraft || submission.current.inFlight) return

    submission.current.inFlight = true
    setSubmitting(true)
    setError("")
    try {
      submission.current.number ||= createOrderNumber()
      const order = await submitOrder(submission.current.number, reviewDraft)
      router.replace(`/orders/${encodeURIComponent(order.number)}`)
    } catch (error) {
      submission.current.inFlight = false
      setSubmitting(false)
      setError(
        error instanceof Error && error.name === "Error"
          ? error.message
          : "주문을 저장하지 못했어요. 다시 시도해 주세요."
      )
    }
  }

  return (
    <Drawer open={open} onOpenChange={changeDrawerOpen} showSwipeHandle>
      <main className="mx-auto max-w-5xl px-5 pt-5 pb-10 sm:px-8 sm:pt-8">
        {reviewDraft ? (
          <OrderReview
            quote={quote}
            draft={reviewDraft}
            headingRef={reviewHeading}
            submitting={submitting}
            error={error}
            onEditOptions={() => {
              setReviewDraft(undefined)
              window.scrollTo(0, 0)
            }}
            onSubmit={sendOrder}
          />
        ) : (
          <>
            <Link
              href="/"
              className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              케이크 목록
            </Link>
            <div className="grid items-start gap-6 md:grid-cols-2 md:gap-10">
              <Image
                {...cake.detailImage}
                unoptimized
                loading="eager"
                className="aspect-square h-auto w-full rounded-2xl bg-muted object-cover"
              />
              <div className="grid content-start gap-7 md:py-3">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    {cake.name}
                  </h1>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {cake.description}
                  </p>
                </div>
                <CakeOptions
                  label="크기"
                  name="size"
                  options={cake.sizes}
                  value={sizeId}
                  onChange={setSizeId}
                />
                <CakeOptions
                  label="맛"
                  name="flavor"
                  options={cake.flavors}
                  value={flavorId}
                  onChange={setFlavorId}
                />
                <div className="grid gap-4 border-t pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium">총액</span>
                    <output
                      aria-live="polite"
                      className="text-2xl font-semibold text-primary tabular-nums"
                    >
                      {formatWon(quote.totalPrice)}
                    </output>
                  </div>
                  <DrawerTrigger render={<Button className="h-12 w-full" />}>
                    주문하기
                  </DrawerTrigger>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <OrderDrawer
        step={step}
        schedule={schedule}
        pickup={pickup}
        details={details}
        reviewHeading={reviewHeading}
        onPickupChange={setPickup}
        onDetailsChange={setDetails}
        onStepChange={setStep}
        onComplete={reviewOrder}
      />
    </Drawer>
  )
}
