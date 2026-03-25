import { useState, useEffect, useRef } from 'react';

interface VirtualScrollOptions {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualScrollResult {
  virtualItems: Array<{
    index: number;
    offsetTop: number;
  }>;
  totalHeight: number;
  scrollToIndex: (index: number) => void;
}

export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5,
}: VirtualScrollOptions): VirtualScrollResult {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalHeight = itemCount * itemHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const virtualItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      offsetTop: i * itemHeight,
    });
  }

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const offsetTop = index * itemHeight;
      scrollRef.current.scrollTop = offsetTop;
    }
  };

  return {
    virtualItems,
    totalHeight,
    scrollToIndex,
  };
}

export function useScrollHandler(onScroll: (scrollTop: number) => void) {
  return (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    onScroll(target.scrollTop);
  };
}
