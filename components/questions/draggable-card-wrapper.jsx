// components/questions/draggable-card-wrapper.jsx
import { GripVertical as Grip } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function DraggableCardWrapper({
  isDragging,
  children,
  attributes,
  listeners,
  setNodeRef,
  style,
}) {
  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 ${isDragging ? 'z-50 shadow-lg border-primary' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div {...attributes} {...listeners} className="cursor-grab mt-1">
          <Grip className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-4">{children}</div>
      </div>
    </Card>
  );
}
