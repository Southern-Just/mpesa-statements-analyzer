"use client";

import { useMemo } from "react";

export default function Reports() {
  const badges = useMemo(() => {
    const mockNames = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank"];

    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
    return [...mockNames, currentMonth];
  }, []);

  return (
    <div className="flex gap-4 justify-end mt-4">
      
      <h1 className="text-2xl text-gray-600 font-semibold">Reports</h1>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, index) => (
          <span
            key={index}
            className="px-4 py-2 rounded-lg text-center align-middle flex bg-gray-500 text-white text-xs font-medium"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}
