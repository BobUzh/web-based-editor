import type { ToolId } from './types'

const tools: Array<{ id: ToolId; label: string; shape: string }> = [
  { id: 'select', label: 'Select', shape: 'rotate-45 border-l-0 border-t-0' },
  { id: 'brush', label: 'Brush selection', shape: 'rounded-full' },
  { id: 'draw', label: 'Draw', shape: 'skew-x-[-18deg]' },
  { id: 'erase', label: 'Erase', shape: 'rounded-sm rotate-12' },
  { id: 'thickness', label: 'Line thickness', shape: 'rounded-full scale-x-150' },
  { id: 'assets', label: 'Assets', shape: 'rounded-sm' },
]

type SidebarProps = {
  activeTool: ToolId
  onSelectTool: (tool: ToolId) => void
}

export function Sidebar({ activeTool, onSelectTool }: SidebarProps) {
  return (
    <aside className="flex w-16 shrink-0 flex-col items-center border-r border-slate-200 bg-white py-4">
      <div className="flex flex-col gap-2">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id

          return (
            <button
              key={tool.id}
              type="button"
              aria-label={tool.label}
              title={tool.label}
              onClick={() => onSelectTool(tool.id)}
              className={`grid h-11 w-11 place-items-center rounded-md border transition ${
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <span className={`block h-4 w-4 border-2 border-current ${tool.shape}`} aria-hidden="true" />
            </button>
          )
        })}
      </div>
    </aside>
  )
}

