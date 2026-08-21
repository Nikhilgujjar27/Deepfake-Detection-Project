import { useState, useEffect } from 'react';

export function useAnimatedCount(
  target: number,
  duration = 1000,
  decimals = 0,
  trigger = true
): string {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!trigger) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing: easeOutCubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeOut * target;
      
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration, trigger]);

  return count.toFixed(decimals);
}
