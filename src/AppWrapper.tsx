// src/AppWrapper.tsx
import React, { useEffect, useCallback } from 'react';
import App from './App';
import { useGridStore } from './store/GridStore';

const AppWrapper: React.FC = () => {
  const { setIsSharedGrid } = useGridStore();

  useEffect(() => {
    const handlePopState = useCallback(() => {
      const newUrl = new URL(window.location.href);
      setIsSharedGrid(newUrl.searchParams.has("grid"));
    }, [setIsSharedGrid]);

    const url = new URL(window.location.href);
    setIsSharedGrid(url.searchParams.has("grid"));

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setIsSharedGrid]);

  return <App />;
};

export default AppWrapper;
