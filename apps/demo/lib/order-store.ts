"use client"

import { useMemo, useSyncExternalStore } from "react"

import {
  applyOrderAction,
  createPendingOrder,
  type Order,
  type OrderAction,
  type OrderDraft,
} from "./orders"
import { getSampleOrders } from "./sample-orders"

const storageKey = "leafy-cake.demo.orders.v1"
const changeEvent = "leafy-cake.demo.orders.changed"

function readSnapshot() {
  return window.localStorage.getItem(storageKey)
}

function readOrders(snapshot: string | null): readonly Order[] {
  return snapshot === null ? getSampleOrders() : JSON.parse(snapshot)
}

function subscribe(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (
      event.storageArea === window.localStorage &&
      (event.key === storageKey || event.key === null)
    ) {
      onChange()
    }
  }

  window.addEventListener("storage", onStorage)
  window.addEventListener(changeEvent, onChange)
  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener(changeEvent, onChange)
  }
}

export function useOrders() {
  const snapshot = useSyncExternalStore(
    subscribe,
    readSnapshot,
    () => undefined
  )
  return useMemo(
    () => (snapshot === undefined ? undefined : readOrders(snapshot)),
    [snapshot]
  )
}

function writeOrders(orders: readonly Order[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(orders))
  window.dispatchEvent(new Event(changeEvent))
}

async function updateStore(update: () => Order) {
  // 같은 브라우저에서 다른 탭이 동시에 저장하면 각 변경을 순서대로 적용한다.
  return window.navigator.locks
    ? window.navigator.locks.request(storageKey, update)
    : update()
}

// 같은 주문을 다시 제출할 때는 처음 발급한 번호를 재사용한다.
export function createOrderNumber() {
  const bytes = window.crypto.getRandomValues(new Uint8Array(8))
  const suffix = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("")
  return `LC-${suffix.toUpperCase()}`
}

export function submitOrder(number: string, draft: OrderDraft) {
  return updateStore(() => {
    const orders = readOrders(readSnapshot())
    const existingOrder = orders.find((order) => order.number === number)
    if (existingOrder) return existingOrder

    const order = createPendingOrder(number, draft)
    writeOrders([order, ...orders])
    return order
  })
}

export function updateOrder(number: string, action: OrderAction) {
  return updateStore(() => {
    const orders = readOrders(readSnapshot())
    const order = orders.find((order) => order.number === number)
    if (!order) throw new Error("주문을 찾을 수 없어요.")

    const updatedOrder = applyOrderAction(order, action)
    if (updatedOrder !== order) {
      writeOrders(orders.map((item) => (item === order ? updatedOrder : item)))
    }
    return updatedOrder
  })
}
