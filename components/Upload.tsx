"use client";
import Image from "next/image";
import React, { useState } from "react";
import SearchFilters from "./SearchFilters";

const Upload = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [extension, setExtension] = useState<string>("OTHER");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    setExtension(ext.toUpperCase());

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    if (file.type.startsWith("image/")) {
      setFileType("image");
    } else if (file.type === "application/pdf") {
      setFileType("pdf");
    } else if (file.type.includes("csv") || file.type.includes("text")) {
      setFileType("text");
    } else if (ext === "docx") {
      setFileType("docx");
    } else {
      setFileType("other");
    }
  };

  return (
    <div className="flex w-full max-w-6xl items-center gap-10">
      <div className="w-80 rounded-2xl bg-white p-2  shadow-2xl shadow-gray-50">
        <div className="flex justify-center w-full overflow-hidden overflow-x-hidden">
          {previewUrl ? (
            <>
              {fileType === "image" && (
                <Image
                  width={120}
                  height={120}
                  src={previewUrl}
                  alt="Preview"
                  className="h-48 w-full object-contain rounded-lg overflow-x-hidden "
                />
              )}

              {fileType === "pdf" && (
                <div className="w-full h-48 overflow-hidden overflow-x-hidden">
                  <iframe
                    src={previewUrl}
                    className="w-full h-full border-0 m-0 p-0 overflow-x-hidden"
                    scrolling="no"
                  />
                </div>
              )}

              {fileType === "text" && (
                <iframe
                  src={previewUrl}
                  className="h-48 w-full rounded-lg bg-white overflow-hidden"
                  scrolling="no"
                />
              )}

              {fileType === "docx" && (
                <div className="flex h-32 w-full items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500 overflow-hidden">
                  DOCX preview requires uploaded public URL
                </div>
              )}

              {fileType === "other" && (
                <Image
                  src="/icons/file.svg"
                  alt="file"
                  width={120}
                  height={120}
                  className="overflow-hidden"
                />
              )}
            </>
          ) : (
            <Image
              src="/icons/file.svg"
              alt="Upload"
              width={120}
              height={120}
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
              PDF · DOCX · CSV
            </p>
          </>
        )}

        <label className="mt-6 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 p-4 transition hover:border-brand">
          <span className="text-sm font-medium text-gray-700">
            {fileName ? "Change file" : "Choose file"}
          </span>

          <input
            type="file"
            accept=".pdf,.docx,.csv,image/*,text/plain"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {fileName && (
          <p className="mt-3 text-center text-xs text-gray-500">
            {fileName}
          </p>
        )}
      </div>

      <div className="flex w-64 flex-col items-center ">
        <div className="relative w-full">
          <div className="h-2 w-full rounded-full bg-gray-200" />
          <div
            className="absolute left-0 top-0 h-2 rounded-full bg-gray-500"
            style={{ width: "45%" }}
          />
          <div
            className="absolute -top-1.25 h-0 w-0 border-y-8 border-l-8 border-y-transparent border-l-gray-600"
            style={{ left: "45%" }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">Processing statement</p>
      </div>

      <SearchFilters />
    </div>
  );
};

export default Upload;
