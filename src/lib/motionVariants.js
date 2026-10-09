export const menuSlide = {
  initial: { x: "-100%" },
  enter: { x: "0%", transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } },
  exit: { x: "-100%", transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } }
};

export const opacityFade = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

export const staggerLinks = {
  initial: { opacity: 0, y: 20 },
  enter: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1],
      delay: 0.1 + i * 0.1
    }
  }),
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
};
