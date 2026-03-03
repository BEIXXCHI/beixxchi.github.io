import { useState, useEffect, useRef } from 'react';

/**
 * useIntersection
 * 监听元素进入视口，触发一次后不再变化（用于入场动画）
 *
 * @param {IntersectionObserverInit} options - IntersectionObserver 配置
 * @returns {{ ref, isVisible }}
 */
export function useIntersection(options = { threshold: 0.1 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); // 触发一次即停止观察
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
