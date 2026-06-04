import { useState } from 'react'
import { BottomDrawer } from './BottomDrawer'
import { EditorWorkspace } from './EditorWorkspace'
import { Header } from './Header'
import { RightPanel } from './RightPanel'
import { Sidebar } from './Sidebar'
import type { MenuItem, ToolId } from './types'

export function EditorShell() {
  const [selectedMenu, setSelectedMenu] = useState<MenuItem>('File')
  const [activeTool, setActiveTool] = useState<ToolId>('select')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="flex h-svh min-h-[640px] flex-col overflow-hidden bg-white text-slate-900">
      <Header selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <Sidebar activeTool={activeTool} onSelectTool={setActiveTool} />
        <EditorWorkspace />
        <RightPanel selectedMenu={selectedMenu} activeTool={activeTool} />
        <BottomDrawer isOpen={isDrawerOpen} onToggle={() => setIsDrawerOpen((open) => !open)} />
      </div>
    </div>
  )
}

