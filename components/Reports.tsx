"use client";

import { Transaction } from "@/types";

interface Props {
  onOpenReport: (label: string, transactions: Transaction[]) => void;
}

// Move static data and the impure function outside the component
const badges = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank"];

const generateRandomTransactions = (allBadges: string[]): Transaction[] => {
  const descriptions = [
    "Send Money",
    "Paybill Payment",
    "Till Purchase",
    "Airtime Purchase",
    "Withdrawal",
    "Deposit",
  ];

  const transactions: Transaction[] = [];
  const count = Math.floor(Math.random() * 10) + 5;

  for (let i = 0; i < count; i++) {
    const date = new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    )
      .toISOString()
      .split("T")[0];

    const amount = Math.floor(Math.random() * 25000) + 200;

    transactions.push({
      date,
      name: allBadges[Math.floor(Math.random() * allBadges.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      amount,
    });
  }

  return transactions;
};

export default function Reports({ onOpenReport }: Props) {
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const allBadges = [...badges, currentMonth];

  return (
    <div className="flex gap-4 justify-end mt-4 flex-wrap items-center">
      <div className="flex flex-wrap gap-2">
        <h1 className="text-2xl text-gray-600 font-semibold">Reports</h1>

        {allBadges.map((badge) => (
          <button
            key={badge}
            onClick={() => onOpenReport(badge, generateRandomTransactions(allBadges))} // Now calls the external function
            className="px-4 py-2 rounded-lg bg-gray-500 text-white text-xs font-medium hover:bg-gray-600 transition"
          >
            {badge}
          </button>
        ))}
      </div>
    </div>
  );
}