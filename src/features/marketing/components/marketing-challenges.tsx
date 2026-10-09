import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { challenges } from "../constants/challenge-content";
import { ChallengeVisual } from "./challenge-visual";

const TILT_SPRING = { stiffness: 170, damping: 24 };
const MAX_TILT = 6;

export function MarketingChallenges() {
  const [selected, setSelected] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(pointerX, TILT_SPRING);
  const rotateX = useSpring(pointerY, TILT_SPRING);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setSelected(Number((entry.target as HTMLElement).dataset.storyIndex));
        }
      }
    }, { rootMargin: "-25% 0px -45% 0px", threshold: 0 });

    const syncObserver = () => {
      observer.disconnect();
      if (desktop.matches) {
        section.querySelectorAll("[data-story-index]").forEach(node => observer.observe(node));
      }
    };
    syncObserver();
    desktop.addEventListener("change", syncObserver);
    return () => {
      desktop.removeEventListener("change", syncObserver);
      observer.disconnect();
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * MAX_TILT);
    pointerY.set(-((event.clientY - bounds.top) / bounds.height - 0.5) * MAX_TILT);
  }

  function resetTilt() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section ref={sectionRef} id="workflow" className="home-section home-challenges scroll-mt-20" aria-labelledby="challenges-title">
      <div className="home-container">
        <div id="challenges" className="home-section-heading scroll-mt-24">
          <h2 id="challenges-title">Từ chứng từ đến hành động.</h2>
          <p>Ba bước để dữ liệu doanh nghiệp trở nên hữu ích hơn.</p>
        </div>
        <div className="challenge-scroll-story">
          <div className="challenge-story-chapters">
            {challenges.map((item, index) => (
              <article key={item.label} id={`story-step-${index}`} data-story-index={index} className="challenge-copy scroll-mt-28">
                <p className="challenge-chapter-label">{index + 1}. {item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="challenge-solution">
                  <Check size={20} aria-hidden="true" />
                  <p>{item.solution}</p>
                </div>
                <div className="challenge-mobile-visual challenge-visual-stage">
                  <ChallengeVisual index={index} />
                </div>
              </article>
            ))}
          </div>
          <div className="challenge-sticky-visual">
            <nav className="challenge-chapter-nav" aria-label="Các bước quy trình">
              {challenges.map((item, index) => (
                <a key={item.label} href={`#story-step-${index}`} aria-label={item.label}
                  aria-current={selected === index ? "step" : undefined}
                  onClick={() => setSelected(index)}>
                  {index + 1}
                </a>
              ))}
            </nav>
            <motion.div className="challenge-visual-stage" data-active-step={selected}
              style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
              onPointerMove={handlePointerMove} onPointerLeave={resetTilt}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={selected}
                  initial={reduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}>
                  <ChallengeVisual index={selected} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
