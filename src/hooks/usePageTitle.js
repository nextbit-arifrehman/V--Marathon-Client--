import { useEffect } from 'react';

export const usePageTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} - MarathonHub` : 'MarathonHub';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};