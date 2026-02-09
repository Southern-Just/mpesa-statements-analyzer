import Image from "next/image"
type PreviewCardProps = {
  previewUrl: string | null
  fileName: string | null
}

const PreviewCard = ({ previewUrl, fileName }: PreviewCardProps) => (
  <div className="w-72 rounded-2xl bg-white p-6 shadow-lg">
    <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
      Preview
    </p>

    {previewUrl ? (
      <img
        src={previewUrl}
        alt="Preview"
        className="mx-auto max-h-40 rounded-lg object-contain"
      />
    ) : (
      <div className="flex flex-col items-center text-gray-400">
        <Image
          src="/icons/file.svg"
          alt="Example"
          width={70}
          height={70}
        />
        <p className="mt-3 text-sm text-center">
          Statement example preview
        </p>
      </div>
    )}

    {fileName && (
      <p className="mt-4 text-center text-xs text-gray-500">
        {fileName}
      </p>
    )}
  </div>
)
export default PreviewCard