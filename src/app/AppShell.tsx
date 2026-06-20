import { useEffect, useState } from 'react'
import { MoodBoardView } from '../components/board/MoodBoardView'
import { LevelRail } from '../components/layout/LevelRail'
import { MainSidebar } from '../components/layout/MainSidebar'
import { TopNav } from '../components/layout/TopNav'
import { AddLevelModal } from '../components/modals/AddLevelModal'
import { DeleteLevelModal } from '../components/modals/DeleteLevelModal'
import { EditLevelModal } from '../components/modals/EditLevelModal'
import { useAppStore } from '../stores/useAppStore'
import { useBoardStore } from '../stores/useBoardStore'
import type { Level } from '../types/level'

export function AppShell() {
  const {
    initialized,
    initialize,
    levels,
    activeSection,
    activeLevelId,
    isAddLevelOpen,
    setActiveSection,
    setActiveLevel,
    openAddLevelModal,
    closeAddLevelModal,
    createLevel,
    updateLevel,
    reorderLevels,
    deleteLevel,
  } = useAppStore()
  const { loadBoard, flushPendingSave } = useBoardStore()
  const [levelToDelete, setLevelToDelete] = useState<Level>()
  const [levelToEdit, setLevelToEdit] = useState<Level>()

  const activeLevel = levels.find((level) => level.id === activeLevelId)

  useEffect(() => {
    void initialize()
  }, [initialize])

  useEffect(() => {
    if (initialized) {
      void loadBoard(activeLevelId, activeSection)
    }
  }, [activeLevelId, activeSection, initialized, loadBoard])

  useEffect(() => {
    const handleBeforeUnload = () => {
      void flushPendingSave()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [flushPendingSave])

  return (
    <div className="min-h-screen bg-[#111419] text-stone-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(123,181,148,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_35%)]" />
      <div className="relative flex h-screen overflow-hidden">
        <MainSidebar
          activeSection={activeSection}
          onAddLevel={openAddLevelModal}
          onSectionChange={(section) => {
            void flushPendingSave().then(() => setActiveSection(section))
          }}
        />
        <LevelRail
          levels={levels}
          activeLevelId={activeLevelId}
          activeSection={activeSection}
          onLevelChange={(levelId) => {
            void flushPendingSave().then(() => setActiveLevel(levelId))
          }}
          onAddLevel={openAddLevelModal}
          onDeleteLevel={setLevelToDelete}
          onReorderLevels={(orderedLevelIds) => {
            void flushPendingSave().then(() => reorderLevels(orderedLevelIds))
          }}
        />
        <main className="flex min-w-0 flex-1 flex-col">
          <TopNav activeSection={activeSection} activeLevel={activeLevel} />
          <MoodBoardView
            initialized={initialized}
            activeLevel={activeLevel}
            onEditLevel={setLevelToEdit}
          />
        </main>
      </div>
      {isAddLevelOpen ? (
        <AddLevelModal onClose={closeAddLevelModal} onCreate={createLevel} />
      ) : null}
      {levelToDelete ? (
        <DeleteLevelModal
          level={levelToDelete}
          onClose={() => setLevelToDelete(undefined)}
          onDelete={(levelId) => flushPendingSave().then(() => deleteLevel(levelId))}
        />
      ) : null}
      {levelToEdit ? (
        <EditLevelModal
          level={levelToEdit}
          onClose={() => setLevelToEdit(undefined)}
          onUpdate={updateLevel}
        />
      ) : null}
    </div>
  )
}
