"use client"

import {
  useEffect,
  useRef,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react"
import { X } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"

import type { OrderDraft } from "@/lib/orders"
import { formatPickup } from "@/lib/order-format"
import {
  getPickupSchedule,
  pickupTimeZone,
  type PickupSlot,
} from "@/lib/pickup"

export type CustomerDetails = Omit<OrderDraft, "selection" | "pickup">
export type OrderStep = "pickup" | "details"

const dateKey = new Intl.DateTimeFormat("sv-SE", {
  timeZone: pickupTimeZone,
  dateStyle: "short",
})
const monthLabel = new Intl.DateTimeFormat("ko-KR", {
  timeZone: pickupTimeZone,
  year: "numeric",
  month: "long",
})
const weekday = new Intl.DateTimeFormat("ko-KR", {
  timeZone: pickupTimeZone,
  weekday: "short",
})
const dayLabel = new Intl.DateTimeFormat("ko-KR", {
  timeZone: pickupTimeZone,
  dateStyle: "full",
})

function calendarDate(date: string) {
  return new Date(`${date}T12:00:00+09:00`)
}

function FormField({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

export function OrderDrawer({
  step,
  schedule,
  pickup,
  details,
  reviewHeading,
  onPickupChange,
  onDetailsChange,
  onStepChange,
  onComplete,
}: {
  step: OrderStep
  schedule: ReturnType<typeof getPickupSchedule>
  pickup: PickupSlot
  details: CustomerDetails
  reviewHeading: RefObject<HTMLHeadingElement | null>
  onPickupChange: (pickup: PickupSlot) => void
  onDetailsChange: (details: CustomerDetails) => void
  onStepChange: (step: OrderStep) => void
  onComplete: () => void
}) {
  const stepHeading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    stepHeading.current?.focus()
  }, [step])

  const firstDay = schedule[0]
  const lastDay = schedule.at(-1)
  const currentDay = schedule.find(({ date }) => date === pickup.date)
  const pickupValid = currentDay?.times.includes(pickup.time) ?? false
  const phoneValid = /^\+?\d(?:[ -]?\d){7,14}$/.test(
    details.customerPhone.trim()
  )
  const detailsValid = Boolean(
    details.lettering.trim() && details.customerName.trim() && phoneValid
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!pickupValid) return

    if (step === "pickup") {
      onStepChange("details")
    } else if (detailsValid) {
      onComplete()
    }
  }

  return (
    <DrawerContent
      className="mx-auto max-w-lg shadow-xl"
      finalFocus={() => reviewHeading.current ?? true}
    >
      <DrawerHeader className="relative px-5 pt-4 pb-3 text-left group-data-[swipe-axis=y]/drawer-popup:text-left">
        <DrawerTitle
          ref={stepHeading}
          tabIndex={-1}
          className="pr-12 text-xl font-semibold outline-none"
        >
          {step === "pickup" ? "픽업 일정 선택" : "주문 정보 입력"}
        </DrawerTitle>
        <DrawerDescription className="pr-12">
          {step === "pickup"
            ? "예약 가능한 날짜와 시간은 한국 시간 기준입니다."
            : formatPickup(pickup)}
        </DrawerDescription>
        <DrawerClose
          render={
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-4 size-11"
            />
          }
          aria-label="닫기"
        >
          <X />
        </DrawerClose>
      </DrawerHeader>
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div
          key={step}
          className="min-h-0 overflow-y-auto overscroll-contain px-5 py-2"
        >
          {step === "pickup" ? (
            <>
              {firstDay && lastDay && (
                <Calendar
                  aria-label="픽업 날짜"
                  mode="single"
                  required
                  timeZone={pickupTimeZone}
                  showOutsideDays={false}
                  startMonth={calendarDate(firstDay.date)}
                  endMonth={calendarDate(lastDay.date)}
                  defaultMonth={calendarDate(currentDay?.date ?? firstDay.date)}
                  selected={currentDay && calendarDate(currentDay.date)}
                  disabled={(day) =>
                    !schedule.some(({ date }) => date === dateKey.format(day))
                  }
                  onSelect={(day) => {
                    if (!day) return
                    const date = dateKey.format(day)
                    if (date !== pickup.date) onPickupChange({ date, time: "" })
                  }}
                  formatters={{
                    formatCaption: (date) => monthLabel.format(date),
                    formatWeekdayName: (date) => weekday.format(date),
                  }}
                  labels={{
                    labelDayButton: (date) => dayLabel.format(date),
                    labelGrid: (date) => monthLabel.format(date),
                    labelNav: () => "월 이동",
                    labelPrevious: () => "이전 달",
                    labelNext: () => "다음 달",
                    labelWeekday: (date) => weekday.format(date),
                  }}
                  className="mx-auto w-full max-w-80 rounded-xl bg-transparent [--cell-size:--spacing(8)]"
                />
              )}
              <fieldset className="mt-3">
                <legend className="text-sm font-semibold">픽업 시간</legend>
                {currentDay ? (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {currentDay.times.map((time) => (
                      <label key={time} className="cursor-pointer">
                        <input
                          type="radio"
                          name="pickup-time"
                          value={time}
                          checked={time === pickup.time}
                          onChange={() =>
                            onPickupChange({ date: currentDay.date, time })
                          }
                          className="peer sr-only"
                        />
                        <span className="grid min-h-11 place-items-center rounded-lg border font-medium tabular-nums peer-checked:border-primary peer-checked:bg-muted peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                          {time}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    날짜를 선택하면 픽업 가능 시간이 표시됩니다.
                  </p>
                )}
              </fieldset>
            </>
          ) : (
            <div className="grid gap-4">
              <FormField id="lettering" label="레터링 문구">
                <Textarea
                  id="lettering"
                  required
                  value={details.lettering}
                  onChange={(event) =>
                    onDetailsChange({
                      ...details,
                      lettering: event.target.value,
                    })
                  }
                />
              </FormField>
              <FormField id="additional-request" label="추가 요청 사항 (선택)">
                <Textarea
                  id="additional-request"
                  value={details.additionalRequest}
                  onChange={(event) =>
                    onDetailsChange({
                      ...details,
                      additionalRequest: event.target.value,
                    })
                  }
                />
              </FormField>
              <FormField id="customer-name" label="주문자 이름">
                <Input
                  id="customer-name"
                  required
                  autoComplete="name"
                  value={details.customerName}
                  onChange={(event) =>
                    onDetailsChange({
                      ...details,
                      customerName: event.target.value,
                    })
                  }
                  className="h-11"
                />
              </FormField>
              <FormField id="customer-phone" label="연락처">
                <Input
                  id="customer-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="010-1234-5678"
                  value={details.customerPhone}
                  onChange={(event) =>
                    onDetailsChange({
                      ...details,
                      customerPhone: event.target.value,
                    })
                  }
                  aria-invalid={
                    Boolean(details.customerPhone.trim()) && !phoneValid
                  }
                  aria-describedby="customer-phone-hint"
                  className="h-11"
                />
                <p
                  id="customer-phone-hint"
                  className="text-xs text-muted-foreground"
                >
                  숫자 8~15자리를 입력해 주세요. 공백과 하이픈을 사용할 수
                  있어요.
                </p>
              </FormField>
            </div>
          )}
        </div>
        <DrawerFooter className="flex-row border-t bg-popover px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {step === "details" && (
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1"
              onClick={() => onStepChange("pickup")}
            >
              이전
            </Button>
          )}
          <Button
            type="submit"
            className="h-11 flex-1"
            disabled={!pickupValid || (step === "details" && !detailsValid)}
          >
            {step === "pickup" ? "다음" : "완료"}
          </Button>
        </DrawerFooter>
      </form>
    </DrawerContent>
  )
}
