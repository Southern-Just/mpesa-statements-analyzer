type ProgressArrowProps = {
  progress: number
}
const ProgressArrow = ({ progress }: ProgressArrowProps) => (
  <div className="flex w-64 flex-col items-center justify-center">
    <div className="relative w-full">
      
      {/* Track */}
      <div className="h-2 w-full rounded-full bg-gray-200" />

      {/* Fill */}
      <div
        className="absolute left-0 top-0 h-2 rounded-full bg-blue-600 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />

      {/* Arrow head */}
      {progress > 0 && (
        <div
          className="absolute top-[-6px] h-0 w-0 border-y-8 border-l-8 border-y-transparent border-l-blue-600"
          style={{ left: `calc(${progress}% - 4px)` }}
        />
      )}
    </div>

    <p className="mt-2 text-xs text-gray-500">
      {progress}%
    </p>
  </div>
)
export default ProgressArrow