"use client";

import { memo, useCallback, useEffect, useId, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { useDimensions } from "@/hooks/use-debounced-dimensions";

type PixelTrailProps = {
  pixelSize: number;
  fadeDuration?: number;
  delay?: number;
  className?: string;
  pixelClassName?: string;
};

type PixelDotProps = {
  id: string;
  size: number;
  fadeDuration: number;
  delay: number;
  className?: string;
};

type HeroPointerEvent = CustomEvent<{
  clientX: number;
  clientY: number;
}>;

const PixelDot = memo(function PixelDot({
  id,
  size,
  fadeDuration,
  delay,
  className,
}: PixelDotProps) {
  const pixelRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animatePixel = useCallback(() => {
    const pixel = pixelRef.current;
    if (!pixel) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    pixel.style.transition = "none";
    pixel.style.opacity = "1";
    void pixel.offsetWidth;

    timeoutRef.current = setTimeout(() => {
      pixel.style.transition = `opacity ${fadeDuration}ms var(--ease-out-soft)`;
      pixel.style.opacity = "0";
    }, delay);
  }, [delay, fadeDuration]);

  useEffect(() => {
    const pixel = pixelRef.current;
    if (!pixel) return;

    pixel.addEventListener("pixeltrail:activate", animatePixel);

    return () => {
      pixel.removeEventListener("pixeltrail:activate", animatePixel);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [animatePixel]);

  return (
    <div
      id={id}
      ref={pixelRef}
      className={cn("opacity-0", className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
});

function PixelTrail({
  pixelSize = 20,
  fadeDuration = 500,
  delay = 0,
  className,
  pixelClassName,
}: PixelTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);
  const trailId = useId().replaceAll(":", "");

  const columns = useMemo(
    () => Math.max(1, Math.ceil(dimensions.width / pixelSize)),
    [dimensions.width, pixelSize],
  );
  const rows = useMemo(
    () => Math.max(1, Math.ceil(dimensions.height / pixelSize)),
    [dimensions.height, pixelSize],
  );

  const activatePixelAt = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return;
      }

      const x = Math.floor((clientX - rect.left) / pixelSize);
      const y = Math.floor((clientY - rect.top) / pixelSize);
      const pixelElement = document.getElementById(
        `${trailId}-pixel-${x}-${y}`,
      );

      pixelElement?.dispatchEvent(new CustomEvent("pixeltrail:activate"));
    },
    [pixelSize, trailId],
  );

  useEffect(() => {
    function handleHeroPointer(event: Event) {
      const { clientX, clientY } = (event as HeroPointerEvent).detail;
      activatePixelAt(clientX, clientY);
    }

    window.addEventListener("sujood_gang_hero_pointer", handleHeroPointer);

    return () => {
      window.removeEventListener("sujood_gang_hero_pointer", handleHeroPointer);
    };
  }, [activatePixelAt]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <PixelDot
              key={`${colIndex}-${rowIndex}`}
              id={`${trailId}-pixel-${colIndex}-${rowIndex}`}
              size={pixelSize}
              fadeDuration={fadeDuration}
              delay={delay}
              className={pixelClassName}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export { PixelTrail };
