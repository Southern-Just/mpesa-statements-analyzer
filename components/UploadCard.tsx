import Image from "next/image"
type UploadCardProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const UploadCard = ({ onChange }: UploadCardProps) => (
  <div className="w-72 rounded-2xl bg-white p-6 shadow-lg">
    <Image
      src="/icons/file.svg"
      alt="Upload"
      width={90}
      height={90}
      className="mx-auto"
    />

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
        onChange={onChange}
        className="hidden"
      />
    </label>
  </div>
)
export default UploadCard