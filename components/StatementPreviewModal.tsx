"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Transaction } from "@/types";

interface Props {
  originRect: DOMRect;
  transactions: Transaction[];
  title: string;
  onClose: () => void;
}

const StatementPreviewModal = ({
  originRect,
  transactions,
  title,
  onClose,
}: Props) => {
  const [style, setStyle] = useState<React.CSSProperties>({
    position: "fixed",
    top: originRect.top,
    left: originRect.left,
    width: originRect.width,
    height: originRect.height,
    zIndex: 50,
    borderRadius: "1rem",
    overflow: "hidden",
    background: "white",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    transition: "all 420ms cubic-bezier(0.22, 1, 0.36, 1)",
  });

  /**
   * Expand animation after mount
   */
  useEffect(() => {
    requestAnimationFrame(() => {
      setStyle((prev) => ({
        ...prev,
        top: "5%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "70vw",
        height: "85vh",
        borderRadius: "1.25rem",
        zIndex: 50,
      }));
    });
  }, []);

  /**
   * Close animation (reverse)
   */
  const handleClose = (): void => {
    setStyle((prev) => ({
      ...prev,
      top: originRect.top,
      left: originRect.left,
      width: originRect.width,
      height: originRect.height,
      transform: "translateX(0)",
    }));

    setTimeout(onClose, 350);
  };

  /**
   * Derived totals
   */
  const totals = useMemo(() => {
    const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const count = transactions.length;
    const average = count > 0 ? total / count : 0;

    return { total, count, average };
  }, [transactions]);

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={handleClose}
      />

      {/* Expanding panel */}
      <div style={style}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                MPESA Statement Parsing
              </h2>
              <p className="text-sm text-gray-500">{title}</p>
            </div>

            <button
              onClick={handleClose}
              className="rounded-lg px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
            >
              Close
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 border-b bg-gray-50 px-6 py-4 text-sm">
            <div>
              <p className="text-gray-400">Transactions</p>
              <p className="font-medium text-gray-800">{totals.count}</p>
            </div>

            <div>
              <p className="text-gray-400">Total Amount</p>
              <p className="font-medium text-gray-800">
                KES {totals.total.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Average</p>
              <p className="font-medium text-gray-800">
                KES {totals.average.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white border-b">
                <tr className="text-left text-gray-500">
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((tx, index) => (
                  <tr
                    key={`${tx.date}-${index}`}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3 text-gray-600">{tx.date}</td>
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {tx.name}
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {tx.description}
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-gray-800">
                      KES {tx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-3 text-xs text-gray-400">
            Generated from parsed MPESA statement
          </div>
        </div>
      </div>
    </>
  );
};

export default StatementPreviewModal;
