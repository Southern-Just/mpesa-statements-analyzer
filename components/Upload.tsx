"use client";

import Image from "next/image";
import React, { useState } from "react";
import SearchFilters from "./SearchFilters";
import ProcessingEngine from "./ProcessingEngine";
import { ProcessedData } from "@/types.d";

const Upload = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [extension, setExtension] = useState<string>("OTHER");
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      e.target.value = "";
      resetState();
      return;
    }

    setFileName(file.name);
    setExtension(file.name.split(".").pop()?.toUpperCase() || "PDF");
    setPreviewUrl(URL.createObjectURL(file));
    setFileType("pdf");
    setError(null);
    setSelectedFile(file);
  };

  const resetState = () => {
    setFileName(null);
    setPreviewUrl(null);
    setFileType(null);
    setExtension("OTHER");
    setProcessedData(null);
    setError(null);
    setSelectedFile(null);
  };

  const resetFileInput = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    resetState();
  };

  const handleProcessed = (data: ProcessedData) => {
    setProcessedData(data);
    console.log("Processed data:", data);
  };

  const handleError = (error: string) => {
    setError(error);
    console.error("Error:", error);
    resetFileInput();
  };

  return (
    <div className="flex w-full max-w-6xl items-center gap-10">
      <div className="w-80 rounded-2xl bg-white p-2 shadow-2xl shadow-gray-50">
        <div className="flex justify-center w-full overflow-hidden">
          {previewUrl ? (
            <div className="w-full h-48 overflow-hidden">
              <iframe
                src={previewUrl}
                className="w-full h-full border-0 m-0 p-0"
                scrolling="no"
                title="PDF Preview"
              />
            </div>
          ) : (
            <Image
              src="/icons/file.svg"
              alt="Upload"
              width={160}
              height={160}
              className="overflow-hidden"
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

        <label className="mt-6 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 p-4 transition hover:border-brand">
          <span className="text-sm font-medium text-gray-700">
            {fileName ? "Change file" : "Choose PDF"}
          </span>
          <input
            type="file"
            name="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {fileName && (
          <p className="mt-3 text-center text-xs text-gray-500">{fileName}</p>
        )}

        {error && (
          <p className="mt-3 text-center text-xs text-red-500">{error}</p>
        )}
      </div>

      <ProcessingEngine file={selectedFile} onProcessed={handleProcessed} onError={handleError} />
      <SearchFilters />
    </div>
  );
};

export default Upload;