// ShakingWrapper.tsx
import React, { useEffect } from "react";

import './GridShake.css';

interface ShakingWrapperProps {
  shaking: boolean;
  children: React.ReactNode;
  duration: number;
}

const ShakingWrapper: React.FC<ShakingWrapperProps> = ({ shaking, children, duration }) => {
  const [isShaking, setIsShaking] = React.useState(false);

  useEffect(() => {
    if (shaking) {
      setIsShaking(true);
      const timeout = setTimeout(() => {
        setIsShaking(false);
      }, duration);
      return () => clearTimeout(timeout);
    } else {
      setIsShaking(false);
    }
  }, [shaking, duration]);

  return <div className={`relative gridTable__shakeWrapper ${isShaking ? "shake" : ""}`}>{children}</div>;
};

export default ShakingWrapper;
