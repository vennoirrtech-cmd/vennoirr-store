import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { getHeroSlides } from "../services/storefrontService";
import fallbackSlides from "../data/slides";
import ShopByGender from "./ShopByGender";
import { optimizeImage } from "../utils/imageOptimization";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroBanner() {
  const container = useRef();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await getHeroSlides();
        if (response.success && response.data.length > 0) {
          setSlides(response.data);
        } else {
          setSlides(fallbackSlides);
        }
      } catch (error) {
        console.error("Failed to load hero slides", error);
        setSlides(fallbackSlides);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  
  useGSAP(() => {
    if (loading || !container.current) return;
    
    // 1. Initial Hero Entrance Animation
    const tl = gsap.timeline();
    tl.fromTo(".swiper-slide-active .slide-title", 
       { y: 40, opacity: 0 }, 
       { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.1 }
    )
    .fromTo(".swiper-slide-active .slide-btn", 
       { y: 20, opacity: 0 }, 
       { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 
       "-=0.7"
    );

    // 2. Scroll Animation for Shop By Gender
    gsap.fromTo(".shop-gender-grid", 
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1, 
        ease: "power2.out", 
        scrollTrigger: {
          trigger: ".shop-gender-grid",
          start: "top 85%",
          toggleActions: "play none none reverse",
        }
      }
    );

  }, { scope: container, dependencies: [loading] });

  const handleSlideChange = () => {
    // Re-trigger animation on slide change
    gsap.fromTo(".swiper-slide-active .slide-title",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(".swiper-slide-active .slide-btn",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
    );
  };

  return (
    <div ref={container}>
      {loading ? (
        <div className="hero-swiper animate-pulse bg-gray-200" style={{ height: '80vh' }}></div>
      ) : (
        <>
          {/* HERO SLIDER */}
      <section className="hero-swiper">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          loop={true}
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          speed={1000}
          onSlideChangeTransitionStart={handleSlideChange}
          style={{ width: "100%", height: "100%" }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide._id || slide.id}>
              <img 
                src={optimizeImage(slide.image?.url || slide.image, 1600)} 
                alt={slide.title} 
                loading={index === 0 ? "eager" : "lazy"}
                decoding={index === 0 ? "sync" : "async"}
              />
              <div className="slide-overlay">
                <h1 className="slide-title">{slide.title}</h1>
                <button className="slide-btn">{slide.button}</button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

          {/* SHOP MEN / WOMEN */}
          <div className="shop-gender-grid">
            <ShopByGender />
          </div>
        </>
      )}
    </div>
  );
}
