"use client"
import Image from 'next/image'
import UploadCard from '@/components/UploadCard'
import PreviewCard from '@/components/PreviewCard'
import ProgressArrow from '@/components/ProgressArrow'
import React, { useState } from 'react'

const Upload = () => {
  const [progress, setProgress] = useState<number>(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

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

    setProgress(0)
    let value = 0
    const interval = setInterval(() => {
      value += 10
      setProgress(value)
      if (value >= 100) clearInterval(interval)
    }, 150)
  }

  return (
    <div className="flex w-full max-w-6xl items-center justify-center gap-10">
      
      {/* LEFT: Upload */}
      <UploadCard onChange={handleFileChange} />

      {/* CENTER: Progress */}
      <ProgressArrow progress={progress} />

      {/* RIGHT: Preview */}
      <PreviewCard previewUrl={previewUrl} fileName={fileName} />

    </div>
  )
}

export default Upload
