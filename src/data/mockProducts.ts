import { Product } from '@/lib/supabase'

// 임시 상품 데이터
export const mockProducts: Product[] = [
  {
    id: '1',
    name: '클래식 화이트 티셔츠',
    description: '부드러운 면 소재의 베이직 티셔츠입니다. 사계절 내내 입기 좋은 필수 아이템입니다.',
    price: 29000,
    image_url: 'https://picsum.photos/seed/tshirt/500/500',
    stock: 50,
    category: '의류',
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '데님 청바지',
    description: '편안한 착용감의 슬림핏 청바지입니다. 다양한 스타일에 매치하기 좋습니다.',
    price: 59000,
    image_url: 'https://picsum.photos/seed/jeans/500/500',
    stock: 30,
    category: '의류',
    created_at: '2025-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: '가죽 크로스백',
    description: '고급 가죽 소재의 실용적인 크로스백입니다. 데일리룩에 완벽한 아이템입니다.',
    price: 89000,
    image_url: 'https://picsum.photos/seed/bag/500/500',
    stock: 20,
    category: '가방',
    created_at: '2025-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: '스니커즈',
    description: '편안한 착화감의 캐주얼 스니커즈입니다. 운동이나 일상에서 모두 활용 가능합니다.',
    price: 79000,
    image_url: 'https://picsum.photos/seed/sneakers/500/500',
    stock: 40,
    category: '신발',
    created_at: '2025-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: '울 니트 스웨터',
    description: '따뜻한 울 소재의 겨울용 니트입니다. 부드럽고 포근한 착용감이 특징입니다.',
    price: 69000,
    image_url: 'https://picsum.photos/seed/sweater/500/500',
    stock: 25,
    category: '의류',
    created_at: '2025-01-05T00:00:00Z'
  },
  {
    id: '6',
    name: '가죽 벨트',
    description: '심플한 디자인의 정장용 가죽 벨트입니다. 비즈니스룩에 적합합니다.',
    price: 39000,
    image_url: 'https://picsum.photos/seed/belt/500/500',
    stock: 35,
    category: '액세서리',
    created_at: '2025-01-06T00:00:00Z'
  },
  {
    id: '7',
    name: '선글라스',
    description: 'UV 차단 기능이 있는 세련된 디자인의 선글라스입니다.',
    price: 49000,
    image_url: 'https://picsum.photos/seed/sunglasses/500/500',
    stock: 45,
    category: '액세서리',
    created_at: '2025-01-07T00:00:00Z'
  },
  {
    id: '8',
    name: '백팩',
    description: '넉넉한 수납공간의 실용적인 백팩입니다. 학생이나 직장인 모두에게 적합합니다.',
    price: 99000,
    image_url: 'https://picsum.photos/seed/backpack/500/500',
    stock: 15,
    category: '가방',
    created_at: '2025-01-08T00:00:00Z'
  },
  {
    id: '9',
    name: '캐시미어 머플러',
    description: '부드러운 캐시미어 소재의 고급 머플러입니다. 목과 얼굴을 따뜻하게 감싸줍니다.',
    price: 79000,
    image_url: 'https://picsum.photos/seed/scarf/500/500',
    stock: 28,
    category: '액세서리',
    created_at: '2025-01-09T00:00:00Z'
  },
  {
    id: '10',
    name: '러닝화',
    description: '쿠셔닝이 뛰어난 전문 러닝화입니다. 장거리 달리기에 최적화되어 있습니다.',
    price: 129000,
    image_url: 'https://picsum.photos/seed/running/500/500',
    stock: 22,
    category: '신발',
    created_at: '2025-01-10T00:00:00Z'
  },
  {
    id: '11',
    name: '후드 집업',
    description: '편안한 착용감의 캐주얼 후드 집업입니다. 활동성이 좋아 운동이나 외출 시 유용합니다.',
    price: 59000,
    image_url: 'https://picsum.photos/seed/hoodie/500/500',
    stock: 38,
    category: '의류',
    created_at: '2025-01-11T00:00:00Z'
  },
  {
    id: '12',
    name: '손목시계',
    description: '미니멀한 디자인의 스테인리스 손목시계입니다. 세련되고 실용적입니다.',
    price: 149000,
    image_url: 'https://picsum.photos/seed/watch/500/500',
    stock: 12,
    category: '액세서리',
    created_at: '2025-01-12T00:00:00Z'
  }
]

// 카테고리 목록
export const categories = ['전체', '의류', '가방', '신발', '액세서리']

// 카테고리별 상품 필터링
export function getProductsByCategory(category: string): Product[] {
  if (category === '전체') {
    return mockProducts
  }
  return mockProducts.filter(product => product.category === category)
}

// 상품 ID로 상품 찾기
export function getProductById(id: string): Product | undefined {
  return mockProducts.find(product => product.id === id)
}


