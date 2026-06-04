type BottomDrawerProps = {
  isOpen: boolean
  onToggle: () => void
}

export function BottomDrawer({ isOpen, onToggle }: BottomDrawerProps) {
  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white shadow-[0_-16px_40px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-out ${
        isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-28px)]'
      }`}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close bottom drawer' : 'Open bottom drawer'}
        onClick={onToggle}
        className="absolute left-1/2 top-0 h-7 w-24 -translate-x-1/2 -translate-y-full rounded-t-md border border-b-0 border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-950"
      >
        <span className="mx-auto block h-1 w-10 rounded-full bg-current" aria-hidden="true" />
      </button>

      <div className="h-44 p-4">
        <div className="grid h-full grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">Context Controls</p>
            <div className="mt-3 h-16 rounded-md bg-white" />
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">Tool Options</p>
            <div className="mt-3 h-16 rounded-md bg-white" />
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">Saved Items</p>
            <div className="mt-3 h-16 rounded-md bg-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

