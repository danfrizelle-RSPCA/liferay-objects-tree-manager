import { useCallback } from "react";

export const useScrollToTop = (ref, offset = 0) => {
  return useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const topIsVisible =
      rect.top >= 0 &&
      rect.top <= window.innerHeight;

    if (!topIsVisible) {
      window.scrollTo({
        top: rect.top + scrollTop - offset,
        behavior: "smooth",
      });
    }
  }, [ref, offset]);
};
