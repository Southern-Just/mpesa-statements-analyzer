"use client";

import React, { useEffect, useState } from "react";
import { processFile } from "@/lib/file.actions";
import { ProcessedData } from "@/types.d";

interface ProcessingEngineProps {
  file: File | null;
  onProcessed: (data: ProcessedData) => void;
  onError: (error: string) => void;
}

export default function ProcessingEngine({ file, onProcessed, onError }: ProcessingEngineProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (file) {
      processUploadedFile(file);
    }
  }, [file]);

  useEffect(() => {
    if (!isProcessing) return;
    const interval = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(interval);
  }, [isProcessing]);

  const processUploadedFile = async (fileToProcess: File) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", fileToProcess);
      const result = await processFile(formData);
      if (result.success && result.data) {
        onProcessed(result.data);
      } else {
        onError(result.error || "Failed to process file");
      }
    } catch {
      onError("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

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
          className={active ? "animate-pulse" : ""}
          style={{
            animationDelay: `${i * 0.02}s`,
            transition: "all 0.1s ease-in-out",
          }}
        />
      );
    });
  };

  return (
    <div className="flex w-64 flex-col items-center">
      <div className="relative w-full h-20 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 256 80" xmlns="http://www.w3.org/2000/svg">
          {renderBars(isProcessing || file !== null)}
        </svg>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {!isProcessing && !file ? "Ready to process" : isProcessing ? "Parsing PDF..." : "Processing complete"}
      </p>
    </div>
  );
}
