import { useEffect } from 'react';

export const useAutoPlay = (isAutoPlay, nextQuote, currentQuoteIndex, interval = 4000) => {
  useEffect(() => {
    if (isAutoPlay) {
      const autoPlayInterval = setInterval(() => {
        nextQuote();
      }, interval);
      
      return () => clearInterval(autoPlayInterval);
    }
  }, [isAutoPlay, currentQuoteIndex, nextQuote, interval]);
};