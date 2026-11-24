import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { cakes } from "@/lib/cakes"
import { formatWon } from "@/lib/order-format"

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-5 pt-10 pb-16 sm:px-8 sm:pt-16">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          레터링 케이크
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          디자인과 문구를 고르고 원하는 날짜에 매장에서 픽업하세요.
        </p>
      </div>
      <ul className="grid gap-5 sm:grid-cols-3">
        {cakes.map((cake) => (
          <li key={cake.id}>
            <Link
              href={`/cakes/${cake.id}`}
              className="group block overflow-hidden rounded-2xl border bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="overflow-hidden bg-muted">
                <Image
                  {...cake.thumbnail}
                  unoptimized
                  className="aspect-square h-auto w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-4 sm:p-5">
                <div>
                  <h2 className="text-lg font-semibold">{cake.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatWon(cake.basePrice)}부터
                  </p>
                </div>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-5 shrink-0 text-primary"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
