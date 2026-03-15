import { motion, useScroll, useSpring } from "framer-motion";

const ProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.25,
  });

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[999] h-1.5 bg-transparent">
      <motion.div
        style={{ scaleX }}
        className="h-full origin-left bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 shadow-[0_0_20px_rgba(249,115,22,0.55)]"
      />
    </div>
  );
};

export default ProgressBar;
