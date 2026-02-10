"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import SearchFilters from './SearchFilters'

const Upload = () => {
  const [fileName, setFileName] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  return (
    <div className="flex w-full max-w-6xl items-center gap-10">
      
      <div className="w-80 rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex justify-center">
          {previewUrl ? (
            <Image
              width={200}
              height={200}
              src={previewUrl}
              alt="Uploaded preview"
              className="h-32 rounded-lg object-contain"
            />
          ) : (
            <Image
              src="/icons/file.svg"
              alt="Upload"
              width={120}
              height={120}
            />
          )}
        </div>

        <p className="mt-4 text-center font-medium text-gray-800">
          Upload MPESA Statement
        </p>
        <p className="mt-1 text-center text-sm text-gray-500">
          PDF · DOCX · CSV
        </p>

        <label className="mt-6 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 p-4 transition hover:border-blue-500 hover:bg-blue-50">
          <span className="text-sm font-medium text-gray-700">
            Choose file
          </span>

          <input
            type="file"
            accept=".pdf,.docx,.csv,image/*"
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
      <div className="flex w-64 flex-col items-center  shadow-2xl shadow-gray-50">
        <div className="relative w-full">
          <div className="h-2 w-full rounded-full bg-gray-200" />
          <div
            className="absolute left-0 top-0 h-2 rounded-full bg-black"
            style={{ width: '45%' }}
          />
          <div
            className="absolute -top-1.5 h-0 w-0 border-y-8 border-l-8 border-y-transparent border-l-black"
            style={{ left: '45%' }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Processing statement
        </p>
      </div>
      <SearchFilters />

    </div>
  )
}

export default Upload
