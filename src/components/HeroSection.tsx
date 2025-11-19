import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules'
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Swiper 스타일 import
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

// 슬라이드 데이터
const slides = [
  {
    id: 1,
    title: '겨울 신상 최대 80% 할인',
    description: '따뜻한 겨울을 위한 특별한 혜택',
    buttonText: '쇼핑하기',
    buttonAction: '/products',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop',
    gradient: 'from-blue-600/80 to-purple-600/80'
  },
  {
    id: 2,
    title: '무료 배송 이벤트',
    description: '5만원 이상 구매 시 전국 무료 배송',
    buttonText: '자세히 보기',
    buttonAction: '/event',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop',
    gradient: 'from-emerald-600/80 to-teal-600/80'
  },
  {
    id: 3,
    title: '회원가입 시 10% 쿠폰',
    description: '지금 가입하고 특별 혜택을 받으세요',
    buttonText: '가입하기',
    buttonAction: '/signup',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=600&fit=crop',
    gradient: 'from-rose-600/80 to-pink-600/80'
  }
]

export function HeroSection() {
  const navigate = useNavigate()
  const swiperRef = useRef<SwiperType | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  const handlePlayPause = () => {
    if (!swiperRef.current) return

    if (isPlaying) {
      swiperRef.current.autoplay.stop()
    } else {
      swiperRef.current.autoplay.start()
    }
    setIsPlaying(!isPlaying)
  }

  const handlePrevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev()
    }
  }

  const handleNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext()
    }
  }

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
              {/* 배경 이미지 */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              
              {/* 그라데이션 오버레이 */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
              
              {/* 콘텐츠 */}
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-4xl mx-auto">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-2xl mb-8 text-white/90">
                    {slide.description}
                  </p>
                  <Button 
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-6 text-lg"
                    onClick={() => navigate(slide.buttonAction)}
                  >
                    {slide.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 커스텀 네비게이션 버튼 */}
      <button
        onClick={handlePrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
        aria-label="이전 슬라이드"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={handleNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
        aria-label="다음 슬라이드"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 일시정지/재생 버튼 */}
      <button
        onClick={handlePlayPause}
        className="absolute bottom-6 right-6 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
        aria-label={isPlaying ? '일시정지' : '재생'}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5 ml-0.5" />
        )}
      </button>

      {/* 커스텀 스타일 */}
      <style>{`
        .hero-swiper {
          width: 100%;
          height: auto;
        }

        .hero-swiper .swiper-pagination {
          bottom: 24px !important;
          left: 50%;
          transform: translateX(-50%);
          width: auto !important;
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .hero-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .hero-swiper .swiper-pagination-bullet-active {
          width: 32px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.95);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}

