import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 200
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      // Small delay to ensure the element is fully rendered
      setTimeout(() => {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          },
          {
            threshold: 0,
            rootMargin: '100px'
          }
        );
        observerRef.current.observe(node);
      }, 100);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return loadMoreRef;
}
