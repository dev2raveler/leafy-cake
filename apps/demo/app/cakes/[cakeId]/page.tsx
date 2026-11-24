import { notFound } from "next/navigation"

import { cakes } from "@/lib/cakes"

import { CakeOrder } from "./cake-order"

export function generateStaticParams() {
  return cakes.map(({ id }) => ({ cakeId: id }))
}

export default async function CakePage({
  params,
}: {
  params: Promise<{ cakeId: string }>
}) {
  const { cakeId } = await params
  const cake = cakes.find(({ id }) => id === cakeId)
  if (!cake) notFound()

  return <CakeOrder key={cake.id} cake={cake} />
}
