import { useState, useEffect, useRef, useCallback } from 'react';

export interface ScrollProgressOptions {
  containerId?: string;
  threshold?: number;
}

export function useScrollProgress(options: ScrollProgressOptions = {}) {
  const { containerId = 'phone-main-scrollable-content', threshold = 15 } = options;
  const [progress, setProgress] = useState<number>(0);
  const [scale, setScale] = useState<number>(0);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);
  const fillRef = useRef<HTMLDivElement | null>(null);

  const calculateAndApply = useCallback(() => {
    // 1. Check window / document values
    const docEl = document.documentElement;
    const body = document.body;
    const winScrollTop = window.scrollY || window.pageYOffset || docEl.scrollTop || body.scrollTop || 0;
    const winScrollHeight = Math.max(
      docEl.scrollHeight,
      body.scrollHeight,
      docEl.offsetHeight,
      body.offsetHeight
    );
    const winClientHeight = window.innerHeight || docEl.clientHeight || 0;
    const winMaxScroll = winScrollHeight - winClientHeight;

    // 2. Check container values if container exists (e.g. phone-main-scrollable-content)
    const container = containerId ? document.getElementById(containerId) : null;
    let containerScrollTop = 0;
    let containerMaxScroll = 0;

    if (container) {
      containerScrollTop = container.scrollTop;
      containerMaxScroll = container.scrollHeight - container.clientHeight;
    }

    // Determine the active scrolling source
    let activeScrollTop = 0;
    let activeMaxScroll = 0;

    if (containerMaxScroll > threshold) {
      activeScrollTop = containerScrollTop;
      activeMaxScroll = containerMaxScroll;
    } else if (winMaxScroll > threshold) {
      activeScrollTop = winScrollTop;
      activeMaxScroll = winMaxScroll;
    } else if (containerMaxScroll > 0) {
      activeScrollTop = containerScrollTop;
      activeMaxScroll = containerMaxScroll;
    } else {
      activeScrollTop = winScrollTop;
      activeMaxScroll = winMaxScroll;
    }

    // Smart hiding if page/container fits in screen without scroll
    if (activeMaxScroll <= threshold) {
      setIsScrollable(false);
      setScale(0);
      setProgress(0);
      if (fillRef.current) {
        fillRef.current.style.transform = 'scaleX(0)';
      }
      return;
    }

    setIsScrollable(true);

    // Calculate ratio from 0 to 1 for GPU scaleX
    const rawScale = activeScrollTop / activeMaxScroll;
    const clampedScale = Math.min(1, Math.max(0, rawScale));

    // Direct GPU transform update for instant 60/120fps hardware response
    if (fillRef.current) {
      fillRef.current.style.transform = `scaleX(${clampedScale})`;
    }

    setScale(clampedScale);
    setProgress(clampedScale * 100);
  }, [containerId, threshold]);

  useEffect(() => {
    let rafId: number | null = null;

    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        calculateAndApply();
        rafId = null;
      });
    };

    // Initial calculation
    calculateAndApply();

    // Event listeners
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    const container = containerId ? document.getElementById(containerId) : null;
    if (container) {
      container.addEventListener('scroll', onScrollOrResize, { passive: true });
    }

    // Observe DOM mutations to recalculate when content expands/collapses
    const mutationObserver = new MutationObserver(() => {
      onScrollOrResize();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (container) {
        container.removeEventListener('scroll', onScrollOrResize);
      }
      mutationObserver.disconnect();
    };
  }, [calculateAndApply, containerId]);

  return { progress, scale, isScrollable, fillRef };
}

