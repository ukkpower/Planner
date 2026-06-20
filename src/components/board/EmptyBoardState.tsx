export function EmptyBoardState() {
  return (
    <div className="pointer-events-none absolute left-8 top-28 max-w-sm rounded-[8px] border border-dashed border-white/15 bg-[#111419]/80 p-6">
      <p className="text-lg font-semibold text-white">Start collecting references</p>
      <p className="mt-3 text-sm leading-6 text-stone-400">
        Upload images from your computer, then drag and resize them freely around this large
        workspace.
      </p>
    </div>
  )
}
