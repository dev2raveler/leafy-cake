export const pickupTimeZone = "Asia/Seoul"

export type PickupSlot = {
  date: string
  time: string
}

const seoulDate = new Intl.DateTimeFormat("sv-SE", {
  timeZone: pickupTimeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

const timesByDay = [
  ["11:00", "13:00", "15:00", "17:00"], // 일요일
  [], // 월요일 휴무
  ["12:00", "14:00", "16:00", "18:00"],
  ["12:00", "14:00", "16:00", "18:00"],
  ["12:00", "14:00", "16:00", "18:00"],
  ["12:00", "14:00", "16:00", "18:00"],
  ["11:00", "13:00", "15:00", "17:00"],
] as const

export function getPickupSchedule(now = new Date()) {
  const date = new Date(`${seoulDate.format(now)}T00:00:00Z`)
  const schedule: { date: string; times: readonly string[] }[] = []

  // 서울의 달력 날짜를 UTC 자정으로 옮겨 브라우저 시간대와 무관하게 날짜만 더한다.
  date.setUTCDate(date.getUTCDate() + 2)
  for (let daysAhead = 2; daysAhead <= 21; daysAhead++) {
    const times = timesByDay[date.getUTCDay()]
    if (times?.length)
      schedule.push({ date: date.toISOString().slice(0, 10), times })
    date.setUTCDate(date.getUTCDate() + 1)
  }

  return schedule
}
