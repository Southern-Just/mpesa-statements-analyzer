"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import SearchFilters from "./SearchFilters";
import ProcessingEngine from "./ProcessingEngine";
import StatementPreviewModal from "./StatementPreviewModal";
import { ProcessedData, Transaction } from "@/types";
import { processFile } from "@/lib/file.actions";
import { generateFakeTransactions } from "@/lib/fakeParser";

const Upload = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extension, setExtension] = useState<string>("OTHER");
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 🔥 Modal preview state
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewTransactions, setPreviewTransactions] = useState<Transaction[]>([]);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  // 🔥 Anchor reference for expansion animation
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  /**
   * Handles real file upload (still works normally)
   */
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      resetState();
      return;
    }

    setFileName(file.name);
    setExtension(file.name.split(".").pop()?.toUpperCase() ?? "PDF");
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);

    try {
      setIsProcessing(true);

      const formData = new FormData();
      formData.append("file", file);

      const result = await processFile(formData);

      if (result.success && result.data) {
        setProcessedData(result.data);
      } else {
        setError(result.error ?? "Failed to process file");
      }
    } catch {
      setError("Unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Called when user clicks a FILTER BADGE.
   * This simulates “PDF parsed → show statement”.
   */
  const handlePreviewRequest = (filter: string): void => {
    if (!searchRef.current) return;

    const rect = searchRef.current.getBoundingClientRect();
    setOriginRect(rect);

    // simulate parsed output variability
    const generated: Transaction[] = generateFakeTransactions(filter);

    setPreviewTransactions(generated);
    setPreviewTitle(`MPESA Statement • ${filter.toUpperCase()}`);
    setIsPreviewOpen(true);
  };

  const resetState = (): void => {
    setFileName(null);
    setPreviewUrl(null);
    setExtension("OTHER");
    setProcessedData(null);
    setError(null);
    setIsProcessing(false);
  };

  return (
    <>
      <div className="flex w-full max-w-6xl items-center gap-10">
        {/* Upload Card */}
        <div className="w-80 rounded-2xl bg-white p-2 shadow-2xl shadow-gray-50">
          <div className="flex justify-center w-full overflow-hidden">
            {previewUrl ? (
              <div className="w-full h-48 overflow-hidden">
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                />
              </div>
            ) : (
              <Image
                src="/icons/file.svg"
                alt="Upload"
                width={160}
                height={160}
              />
            )}
          </div>

          {fileName ? (
            <p className="mt-1 text-center text-sm text-gray-500">
              {extension} Uploaded
            </p>
          ) : (
            <>
              <p className="mt-4 text-center font-medium text-gray-800">
                Upload MPESA Statement
              </p>
              <p className="mt-1 text-center text-sm text-gray-500">
                PDF only
              </p>
            </>
          )}

          <label className="mt-6 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 p-4 hover:border-brand transition">
            <span className="text-sm font-medium text-gray-700">
              {fileName ? "Change file" : "Choose PDF"}
            </span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {error && (
            <p className="mt-3 text-center text-xs text-red-500">{error}</p>
          )}
        </div>

        {/* Processing Animation */}
        <ProcessingEngine
          isProcessing={isProcessing}
          hasFile={Boolean(fileName)}
        />

        {/* Search + Filters (ANCHOR POINT) */}
        <div ref={searchRef}>
          <SearchFilters onPreviewRequest={handlePreviewRequest} />
        </div>
      </div>

      {/* Expanding Statement Modal */}
      {isPreviewOpen && originRect && (
        <StatementPreviewModal
          originRect={originRect}
          transactions={previewTransactions}
          title={previewTitle}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </>
  );
};

export default Upload;
