"use client";

import { useEffect, useState } from "react";

const ElfsightWidget = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getPadding = () => {
    if (windowWidth < 480) return '0 5px';
    if (windowWidth < 768) return '0 10px';
    return '0';
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      padding: getPadding()
    }}>
     <div class="elfsight-app-59b839eb-98db-4511-bb90-f9e43fb5d8c9" data-elfsight-app-lazy></div>
      
    </div>
  );
};

export default ElfsightWidget;