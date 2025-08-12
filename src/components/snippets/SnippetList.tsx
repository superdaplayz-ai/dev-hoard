import { useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Snippet } from '@/data/db';
import { SnippetCard } from './SnippetCard';
import { useSnippetsStore } from '@/store/snippetsStore';
import { useToast } from '@/hooks/use-toast';

export function SnippetList({
  snippets,
  onEdit,
  onDelete,
  onHistory,
}: {
  snippets: Snippet[];
  onEdit: (s: Snippet) => void;
  onDelete: (s: Snippet) => void;
  onHistory: (s: Snippet) => void;
}) {
  const { reorder, toggleFavorite } = useSnippetsStore();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = snippets.map(s => s.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={async (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = ids.indexOf(String(active.id));
        const newIndex = ids.indexOf(String(over.id));
        const newIds = arrayMove(ids, oldIndex, newIndex);
        await reorder(newIds);
        toast({ title: 'Rekkefølge oppdatert' });
      }}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="grid gap-4">
          {snippets.map((s) => (
            <div key={s.id} id={s.id}>
              <SnippetCard
                snippet={s}
                onEdit={() => onEdit(s)}
                onDelete={() => onDelete(s)}
                onHistory={() => onHistory(s)}
                onToggleFavorite={() => toggleFavorite(s.id)}
              />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
