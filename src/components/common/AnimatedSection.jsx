import { useIntersection } from '../../hooks/useIntersection';

/**
 * AnimatedSection
 * 滚动进入视口时触发淡入上移动画
 */
export function AnimatedSection({ children, delay = 0, style = {} }) {
  const { ref, isVisible } = useIntersection({ threshold: 0.08 });

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
