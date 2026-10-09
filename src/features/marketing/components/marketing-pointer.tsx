import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const POINTER_SPRING = { stiffness: 350, damping: 35 };
const INTERACTIVE_SELECTOR = "a, button, input, select, textarea, [role='button']";

/** Decorative pointer feedback; native cursor and all hit targets stay intact. */
export function MarketingPointer() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, POINTER_SPRING);
  const springY = useSpring(y, POINTER_SPRING);

  useEffect(() => {
    if (reduced) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const element = ref.current;
    if (!element) return;
    const hide = () => { element.dataset.visible = "false"; };
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== "mouse") { hide(); return; }
      x.set(event.clientX);
      y.set(event.clientY);
      if (element.dataset.visible !== "true") element.dataset.visible = "true";
      const interactive = String(event.target instanceof Element && !!event.target.closest(INTERACTIVE_SELECTOR));
      if (element.dataset.interactive !== interactive) element.dataset.interactive = interactive;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", hide, { passive: true });
    media.addEventListener("change", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("scroll", hide);
      media.removeEventListener("change", hide);
    };
  }, [reduced, x, y]);

  if (reduced) return null;
  return <motion.div ref={ref} className="home-pointer" aria-hidden="true" style={{ x: springX, y: springY }}><span /></motion.div>;
}
