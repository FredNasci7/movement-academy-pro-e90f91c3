import { useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}
export function AnimatedSection({
  children,
  className,
  delay = 0,
  id
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);
        }
      });
    }, {
      threshold: 0.1
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [delay]);
  return <div ref={ref} id={id} className={cn("animate-on-scroll pt-[40px] py-[20px]", className)}>
      {children}
    </div>;
}