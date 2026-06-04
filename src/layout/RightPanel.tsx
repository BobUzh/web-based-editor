import type { MenuItem, ToolId } from './types'

type RightPanelProps = {
  selectedMenu: MenuItem
  activeTool: ToolId
}

export function RightPanel({ selectedMenu, activeTool }: RightPanelProps) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-l border-slate-200 bg-white md:flex">
      <div className="border-b border-slate-200 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Settings</p>
        <h2 className="mt-1 text-base font-semibold text-slate-950">{activeTool} tool</h2>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        <PanelSection title="Tool Context">
          <PlaceholderRow label="Active tool" value={activeTool} />
          <PlaceholderRow label="Mode" value="Manual" />
        </PanelSection>

        <PanelSection title="Menu Context">
          <PlaceholderRow label="Selected menu" value={selectedMenu} />
          <PlaceholderRow label="Panel state" value="Placeholder" />
        </PanelSection>

        <PanelSection title="Future Controls">
          <div className="space-y-2">
            <div className="h-8 rounded-md bg-slate-100" />
            <div className="h-8 rounded-md bg-slate-100" />
            <div className="h-20 rounded-md bg-slate-100" />
          </div>
        </PanelSection>
      </div>
    </aside>
  )
}

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
      {children}
    </section>
  )
}

function PlaceholderRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 py-2 first:border-t-0 first:pt-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-700">{value}</span>
    </div>
  )
}

