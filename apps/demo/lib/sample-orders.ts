import { createPendingOrder, type Order, type OrderStatus } from "./orders"
import { getPickupSchedule } from "./pickup"

const examples = [
  {
    status: "pending",
    cakeId: "pink-heart",
    sizeId: "mini",
    flavorId: "earl-grey",
    lettering: "우리 100일",
    customerName: "김하늘",
  },
  {
    status: "confirmed",
    cakeId: "vanilla-lettering",
    sizeId: "standard",
    flavorId: "vanilla",
    lettering: "생일 축하해, 수아!",
    customerName: "이수아",
  },
  {
    status: "inProduction",
    cakeId: "chocolate-party",
    sizeId: "large",
    flavorId: "chocolate",
    lettering: "오늘의 주인공",
    customerName: "박서준",
  },
  {
    status: "ready",
    cakeId: "pink-heart",
    sizeId: "standard",
    flavorId: "vanilla",
    lettering: "늘 사랑해",
    customerName: "윤다은",
  },
  {
    status: "completed",
    cakeId: "vanilla-lettering",
    sizeId: "mini",
    flavorId: "chocolate",
    lettering: "축 졸업!",
    customerName: "최지우",
  },
  {
    status: "rejected",
    cakeId: "chocolate-party",
    sizeId: "standard",
    flavorId: "earl-grey",
    lettering: "행복한 하루",
    customerName: "정유진",
  },
] satisfies Array<{
  status: OrderStatus
  cakeId: string
  sizeId: string
  flavorId: string
  lettering: string
  customerName: string
}>

export function getSampleOrders(now = new Date()): Order[] {
  const upcoming = getPickupSchedule(now)
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const previous = getPickupSchedule(lastWeek)

  return examples.map(
    ({ status, lettering, customerName, ...selection }, index) => {
      const completed = status === "completed"
      const rejected = status === "rejected"
      const pickupDay = completed ? previous[0] : upcoming[index]
      const pickupTime = pickupDay?.times[0]
      if (!pickupDay || !pickupTime) {
        throw new Error("예시 주문에 필요한 픽업 일정이 부족해요.")
      }
      const example = createPendingOrder(
        `DEMO-${String(index + 1).padStart(3, "0")}`,
        {
          selection,
          pickup: { date: pickupDay.date, time: pickupTime },
          lettering,
          additionalRequest: index === 0 ? "초는 하나만 넣어 주세요." : "",
          customerName,
          customerPhone: `010-0000-${String(index + 1).padStart(4, "0")}`,
        },
        completed ? lastWeek : now
      )

      return {
        ...example,
        status,
        paymentConfirmed: status !== "pending" && !rejected,
        rejectionReason: rejected ? "요청하신 장식 재료가 품절되었어요." : null,
      }
    }
  )
}
