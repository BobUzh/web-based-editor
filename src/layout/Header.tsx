import type { MenuItem } from './types'

const menuItems: MenuItem[] = ['File', 'Canvas', 'Export']

type HeaderProps = {
  selectedMenu: MenuItem
  onSelectMenu: (item: MenuItem) => void
}

export function Header({ selectedMenu, onSelectMenu }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
      <div className="flex h-9 items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md border border-slate-300 bg-slate-50">
          <span className="h-4 w-4 rounded-sm border-2 border-slate-700" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold tracking-wide text-slate-900">LOGO</span>
      </div>

      <nav className="flex items-center gap-1" aria-label="Editor menu">
        {menuItems.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelectMenu(item)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              selectedMenu === item
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  )
}

