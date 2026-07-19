"use client";

import { useEffect, useState } from "react";

export type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const sizeOrder: Record<ScreenSize, number> = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  "2xl": 5,
};

class ComparableScreenSize {
  constructor(private value: ScreenSize) {}

  toString(): ScreenSize {
    return this.value;
  }

  valueOf(): number {
    return sizeOrder[this.value];
  }

  equals(other: ScreenSize): boolean {
    return this.value === other;
  }

  lessThan(other: ScreenSize): boolean {
    return this.valueOf() < sizeOrder[other];
  }

  greaterThan(other: ScreenSize): boolean {
    return this.valueOf() > sizeOrder[other];
  }

  lessThanOrEqual(other: ScreenSize): boolean {
    return this.valueOf() <= sizeOrder[other];
  }

  greaterThanOrEqual(other: ScreenSize): boolean {
    return this.valueOf() >= sizeOrder[other];
  }
}

function getScreenSize(width: number): ScreenSize {
  if (width >= 1536) return "2xl";
  if (width >= 1280) return "xl";
  if (width >= 1024) return "lg";
  if (width >= 768) return "md";
  if (width >= 640) return "sm";
  return "xs";
}

const useScreenSize = (): ComparableScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>("xs");

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return new ComparableScreenSize(screenSize);
};

export { useScreenSize };
