"use client";

import React, { useEffect, useState } from "react";

interface ProcessingEngineProps {
  isProcessing: boolean;
  hasFile: boolean;
}

export default function ProcessingEngine({
  isProcessing,
  hasFile,
}: ProcessingEngineProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isProcessing) return;
    const interval = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(interval);
  }, [isProcessing]);

  const renderBars = (active: boolean) => {
    return Array.from({ length: 50 }, (_, i) => {
      const x = (i / 49) * 256;
      const height =
        20 + 30 * Math.sin((i / 49) * Math.PI * 4 + (active ? tick * 0.2 : 0));
      const y = 40 - height / 2;

      return (
        <rect
          key={i}
          x={x}
          y={y}
          width={2}
          height={height}
          fill={active ? "#3B82F6" : "#E5E7EB"}
        />
      );
    });
  };

  return (
    <div className="flex w-64 flex-col items-center">
      <div className="relative w-full h-20 overflow-hidden">
        <svg viewBox="0 0 256 80" className="w-full h-full">
          {renderBars(isProcessing)}
        </svg>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {!hasFile
          ? "Ready to process"
          : isProcessing
          ? "Parsing PDF..."
          : "Processing complete"}
      </p>
    </div>
  );
}
