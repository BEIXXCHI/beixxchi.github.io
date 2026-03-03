import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ── 页面切换动画（fade-in + slide-up）──
export function PageTransition({ children }) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    // 下一帧触发动画，确保浏览器先渲染 opacity:0 状态
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [location.key]);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}
    >
      {children}
    </div>
  );
}
