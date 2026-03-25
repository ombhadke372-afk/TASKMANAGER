import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { initializeCollaboration } from './store/useStore';
import { ViewSwitcher } from './components/ViewSwitcher';
import { FilterBar } from './components/FilterBar';
import { CollaborationBar } from './components/CollaborationBar';
import { KanbanView } from './components/views/KanbanView';
import { ListView } from './components/views/ListView';
import { TimelineView } from './components/views/TimelineView';

function App() {
  const { view, initializeFromURL } = useStore();

  useEffect(() => {
    initializeFromURL();
    initializeCollaboration(useStore.getState());

    const handlePopState = () => {
      initializeFromURL();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initializeFromURL]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Project Tracker</h1>
          <ViewSwitcher />
        </div>
      </header>

      <CollaborationBar />
      <FilterBar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {view === 'kanban' && <KanbanView />}
        {view === 'list' && <ListView />}
        {view === 'timeline' && <TimelineView />}
      </main>
    </div>
  );
}

export default App;
