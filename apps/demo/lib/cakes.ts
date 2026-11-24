export type CakeOption = {
  id: string
  name: string
  additionalPrice: number
}

type CakeImage = {
  src: string
  alt: string
  width: number
  height: number
}

export type Cake = {
  id: string
  name: string
  description: string
  thumbnail: CakeImage
  detailImage: CakeImage
  basePrice: number
  sizes: readonly CakeOption[]
  flavors: readonly CakeOption[]
}

function cakeImages(id: string, alt: string) {
  return {
    thumbnail: {
      src: `/cakes/${id}-thumbnail.jpg`,
      alt,
      width: 320,
      height: 320,
    },
    detailImage: { src: `/cakes/${id}.jpg`, alt, width: 960, height: 960 },
  }
}

const mini = { id: "mini", name: "미니 (12cm)", additionalPrice: 0 }
const standard = { id: "standard", name: "1호 (15cm)", additionalPrice: 8000 }
const large = { id: "large", name: "2호 (18cm)", additionalPrice: 16000 }
const vanilla = { id: "vanilla", name: "바닐라", additionalPrice: 0 }
const chocolate = { id: "chocolate", name: "초콜릿", additionalPrice: 3000 }
const earlGrey = { id: "earl-grey", name: "얼그레이", additionalPrice: 4000 }

export const cakes: readonly Cake[] = [
  {
    id: "vanilla-lettering",
    name: "바닐라 레터링",
    description: "아이보리 크림과 물결 테두리 사이에 원하는 문구를 올려요.",
    ...cakeImages(
      "vanilla-lettering",
      "초콜릿 레터링과 물결 테두리가 있는 아이보리 케이크"
    ),
    basePrice: 32000,
    sizes: [mini, standard, large],
    flavors: [vanilla, chocolate, earlGrey],
  },
  {
    id: "pink-heart",
    name: "핑크 하트",
    description: "하트 모양의 분홍 크림 케이크에 작은 하트 장식을 더했어요.",
    ...cakeImages("pink-heart", "작은 빨간 하트가 장식된 분홍색 하트 케이크"),
    basePrice: 36000,
    sizes: [mini, standard],
    flavors: [vanilla, earlGrey],
  },
  {
    id: "chocolate-party",
    name: "초콜릿 파티",
    description: "진한 초콜릿 크림 위에 파스텔 별 장식과 레터링을 올려요.",
    ...cakeImages(
      "chocolate-party",
      "파스텔 별과 아이보리 레터링이 있는 초콜릿 케이크"
    ),
    basePrice: 38000,
    sizes: [mini, standard, large],
    flavors: [{ ...chocolate, additionalPrice: 0 }, earlGrey],
  },
]

export type CakeSelection = {
  cakeId: string
  sizeId: string
  flavorId: string
}

export function getCakeQuote({ cakeId, sizeId, flavorId }: CakeSelection) {
  const cake = cakes.find(({ id }) => id === cakeId)
  const size = cake?.sizes.find(({ id }) => id === sizeId)
  const flavor = cake?.flavors.find(({ id }) => id === flavorId)

  if (!cake || !size || !flavor) return undefined

  return {
    cake: {
      id: cake.id,
      name: cake.name,
      detailImage: cake.detailImage,
      basePrice: cake.basePrice,
    },
    size,
    flavor,
    totalPrice: cake.basePrice + size.additionalPrice + flavor.additionalPrice,
  }
}
