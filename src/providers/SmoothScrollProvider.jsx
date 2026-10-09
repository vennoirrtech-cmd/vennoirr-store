import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.8, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Classic smooth ease
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8, // Slightly heavier/slower scroll ratio per tick
      touchMultiplier: 1.5,
      smoothTouch: false,
    });
    lenisRef.current = lenis;

    // 2. Sync GSAP ScrollTrigger with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    // 3. Setup GSAP ticker integration
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    // Turn off lag smoothing in GSAP to prevent scroll-jarring
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Cleanup
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
