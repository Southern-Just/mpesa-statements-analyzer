"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState, useTransition } from "react";
import SearchFilters from "./SearchFilters";
import ProcessingEngine from "./ProcessingEngine";
import StatementPreviewModal from "./StatementPreviewModal";
import Reports from "./Reports";
import { Transaction } from "@/types";
import { processUpload } from "@/app/upload/actions";
import { generateFakeTransactions } from "@/lib/fakeParser";

export type ProcessedData = {
  jobId: string;
  pageCount: number;
};

const Upload = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extension, setExtension] = useState<string>("OTHER");
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewTransactions, setPreviewTransactions] = useState<Transaction[]>([]);
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [rawFile, setRawFile] = useState<File | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setRawFile(file);
    setError(null);

    startTransition(async () => {
      if (!file) return;
      setIsProcessing(true);
      const formData = new FormData();
      formData.append("file", file);
      const result = await processUpload(formData);
      setIsProcessing(false);

      if (result.requiresPassword) {
        setIsPasswordProtected(true);
        setError(result.error ?? "PDF is password protected");
        setProcessedData(null);
      } else if (result.success && result.data) {
        setProcessedData(result.data);
        setIsPasswordProtected(false);
      } else {
        setError(result.error ?? "Failed to process file");
        setProcessedData(null);
      }
    });
  };

  const submitPassword = async () => {
    if (!rawFile) return;
    const formData = new FormData();
    formData.append("file", rawFile);
    formData.append("password", password);
    setIsProcessing(true);
    const result = await processUpload(formData);
    setIsProcessing(false);

    if (result.requiresPassword) {
      setError(result.error ?? "Incorrect password");
    } else if (result.success && result.data) {
      setProcessedData(result.data);
      setIsPasswordProtected(false);
      setError(null);
    } else {
      setError(result.error ?? "Failed to process file");
      setProcessedData(null);
    }
  };

  useEffect(() => {
    if (isPasswordProtected && passwordInputRef.current) passwordInputRef.current.focus();
  }, [isPasswordProtected]);

  const handlePreviewRequest = (filter: string) => {
    if (!searchRef.current) return;
    const rect = searchRef.current.getBoundingClientRect();
    setOriginRect(rect);
    const generated: Transaction[] = generateFakeTransactions(filter);
    setPreviewTransactions(generated);
    setPreviewTitle(`MPESA Statement • ${filter.toUpperCase()}`);
    setIsPreviewOpen(true);
  };

  const resetState = () => {
    setFileName(null);
    setPreviewUrl(null);
    setExtension("OTHER");
    setProcessedData(null);
    setError(null);
    setIsProcessing(false);
    setIsPasswordProtected(false);
    setPassword("");
    setRawFile(null);
  };

  return (
    <>
      <div className="flex w-full max-w-6xl items-center gap-10">
        <div className="w-80 rounded-2xl bg-white p-2 shadow-2xl shadow-gray-50 relative">
          <div className="flex justify-center w-full overflow-hidden relative">
            {previewUrl ? (
              <div className="w-full h-48 overflow-hidden relative">
                <iframe src={previewUrl} className="w-full h-full border-0" title="PDF Preview" />
                {isPasswordProtected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-20 rounded-2xl">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-72 text-center">
                      <h3 className="mb-4 text-lg font-medium text-gray-800">PDF is Password Protected</h3>
                      <input
                        ref={passwordInputRef}
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitPassword()}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <button
                        onClick={submitPassword}
                        className="mt-3 w-full rounded-md bg-brand text-white py-2 text-sm"
                      >
                        Unlock & Process
                      </button>
                      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Image src="/icons/file.svg" alt="Upload" width={160} height={160} />
            )}
          </div>
          {fileName ? (
            <p className="mt-1 text-center text-sm text-gray-500">{extension} Uploaded</p>
          ) : (
            <>
              <p className="mt-4 text-center font-medium text-gray-800">Upload MPESA Statement</p>
              <p className="mt-1 text-center text-sm text-gray-500">PDF only</p>
            </>
          )}
          <label className="mt-6 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 p-4 hover:border-brand transition">
            <span className="text-sm font-medium text-gray-700">{fileName ? "Change file" : "Choose PDF"}</span>
            <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        <ProcessingEngine isProcessing={isProcessing || isPending} hasFile={Boolean(fileName)} />

        <div ref={searchRef}>
          <SearchFilters onPreviewRequest={handlePreviewRequest} />
        </div>
      </div>

      {isPreviewOpen && originRect && (
        <StatementPreviewModal
          originRect={originRect}
          transactions={previewTransactions}
          title={previewTitle}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      <Reports onOpenReport={handlePreviewRequest} />
    </>
  );
};

export default Upload;
