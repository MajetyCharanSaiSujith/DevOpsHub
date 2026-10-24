'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import KanbanColumn from '@/components/kanban/KanbanColumn';
import KanbanItem from '@/components/kanban/KanbanItem';

const COLUMNS = [
  { id: 'Todo', title: 'Todo' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'In Review', title: 'In Review' },
  { id: 'Done', title: 'Done' },
];

export default function KanbanBoard({
  tasks = [],
  projects = [],
  members = [],
  onMoveTask,
  onAddTask,
  onTaskClick,
}) {
  const [activeTask, setActiveTask] = useState(null);

  // Require pointer movement of 4px before initiating drag, preserving normal clicks
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Is dropped directly on a column?
    const isColumn = COLUMNS.some((col) => col.id === overId);
    if (isColumn) {
      const currentTask = tasks.find((t) => t.id === activeId);
      if (currentTask && currentTask.status !== overId) {
        onMoveTask(activeId, overId);
      }
      return;
    }

    // Is dropped over another task?
    const overTask = tasks.find((t) => t.id === overId);
    const activeTask = tasks.find((t) => t.id === activeId);

    if (overTask && activeTask && overTask.status !== activeTask.status) {
      onMoveTask(activeId, overTask.status);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={colTasks}
              projects={projects}
              members={members}
              onAddTask={onAddTask}
              onTaskClick={onTaskClick}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <KanbanItem
            task={activeTask}
            projectName={projects.find((p) => p.id === activeTask.projectId)?.name}
            assignee={members.find((m) => m.id === activeTask.assignee)}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
