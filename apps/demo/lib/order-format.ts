import { pickupTimeZone, type PickupSlot } from "./pickup"

const won = new Intl.NumberFormat("ko-KR")
const pickupDate = new Intl.DateTimeFormat("ko-KR", {
  timeZone: pickupTimeZone,
  dateStyle: "long",
})

export function formatWon(amount: number) {
  return `${won.format(amount)}원`
}

export function formatPickup({ date, time }: PickupSlot) {
  return `${pickupDate.format(new Date(`${date}T${time}:00+09:00`))} ${time} (한국 시간)`
}
