import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PlusIcon from '../components/icons/PlusIcon';
import ColumnContainer from '../components/board/ColumnContainer';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import TaskCard from '../components/board/TaskCard';
import { useGetColumnsQuery, useAddColumnMutation, useMoveTaskMutation, useGetTasksQuery } from '../redux/slices/api/boardSlice';
import ErrorComponent from '../components/ErrorComponent';
import { arrayMove } from '@dnd-kit/sortable';


const AgileBoard = () => {
  const { data: columns = [], isLoading, error } = useGetColumnsQuery();
  const { data: tasks = [] } = useGetTasksQuery();
  const [addColumn] = useAddColumnMutation();
  const [moveTask] = useMoveTaskMutation();
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  
  const taskArray = Object.values(tasks).flat();
  const [taskList, setTasks] = useState(taskArray);
  const [columnOrder, setColumnOrder] = useState(columns.map(column => column._id));

  useEffect(() => {
    setColumnOrder(columns.map(column => column._id));
  }, [columns]);

  useEffect(() => {
    setTasks(taskArray);
  }, [tasks]);

  const columnTasks = columns.map(column => ({
    ...column,
    tasks: taskArray.filter(task => task.columnId === column._id),
  }));

  const generateId = () => Math.floor(Math.random() * 10001);

  const createNewColumn = () => {
    const validTitles = [
      "to assign tickets", 
      "assigned", 
      "stand by", 
      "run", 
      "to validate", 
      "reward", 
      "release"
    ];
    
    const columnToAdd = {
      id: generateId(),
      title: columns.length < validTitles.length
        ? validTitles[columns.length]
        : `Column ${columns.length + 1}`,
    };
    addColumn(columnToAdd);
  };

  const deleteColumn = id => {
    const filteredColumns = columns.filter(col => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter(t => t.columnId !== id);
    setTasks(newTasks);
  };

  const updateColumn = (id, title) => {
    setColumns(columns.map(col => col.id === id ? { ...col, title } : col));
  };

  const createTask = columnId => {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const deleteTask = id => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const updateTask = (id, content) => {
    setTasks(prevTasks => prevTasks.map(task => (task.id === id ? { ...task, content } : task)));
  };

  const handleUpdate = id => {
    const newContent = prompt('Enter new content for the task:');
    if (newContent) {
      updateTask(id, newContent);
    }
  };

  const onDragStart = event => {
    const { active } = event;
    if (active.data.current?.type === 'Column') {
      setActiveColumn(columns.find(col => col._id === active.id));
    } else if (active.data.current?.type === 'Task') {
      setActiveTask(active.data.current.task);
    }
  };

  const onDragEnd = async event => {
    const { active, over } = event;
    setActiveColumn(null);
    setActiveTask(null);

    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === 'Column' && overType === 'Column') {
      const fromIndex = columnOrder.indexOf(active.id);
      const toIndex = columnOrder.indexOf(over.id);
      if (fromIndex !== toIndex) {
        setColumnOrder(prevOrder => arrayMove(prevOrder, fromIndex, toIndex));
      }
    } else if (activeType === 'Task' && overType === 'Column') {
      const fromColumnId = activeTask?.columnId;
      const toColumnId = over.id;

      if (fromColumnId !== toColumnId) {
        setTasks(prevTasks => prevTasks.map(task => task._id === active.id ? { ...task, columnId: toColumnId } : task));
        try {
          await moveTask({ taskId: active.id, fromColumnId, toColumnId }).unwrap();
        } catch (error) {
          console.error("Failed to move task: ", error);
        }
      }
    } else if (activeType === 'Task' && overType === 'Task') {
      const activeIndex = taskList.findIndex(task => task._id === active.id);
      const overIndex = taskList.findIndex(task => task._id === over.id);
      if (activeIndex !== overIndex) {
        setTasks(prevTasks => arrayMove(prevTasks, activeIndex, overIndex));
      }
    }
  };

  const onDragOver = event => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === 'Task' && overType === 'Column') {
      setTasks(prevTasks => {
        const activeTask = prevTasks.find(task => task.id === active.id);
        if (activeTask) {
          return prevTasks.map(task => (task.id === active.id ? { ...task, columnId: over.id } : task));
        }
        return prevTasks;
      });
    }
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 3 } }));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <ErrorComponent message={error.message} />;

  const orderedColumns = columnOrder.map(orderId => columns.find(col => col._id === orderId));

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-10">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <div className="flex gap-4 m-auto">
          <div className="flex gap-4">
            <SortableContext items={orderedColumns.map(col => col._id)}>
              {orderedColumns.map(column => {
                const tasksForColumn = taskArray.filter(task => task.columnId === column._id);
                return (
                  <ColumnContainer
                    key={column._id}
                    column={column}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    updateTask={handleUpdate}
                    tasks={tasksForColumn}
                  />
                );
              })}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumn}
            className="h-[50px] w-[50px] cursor-pointer border-2 p-4 ring-blue-500 hover:ring-2 flex gap-2 rounded-full items-center justify-center"
          >
            <PlusIcon />
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={handleUpdate}
                tasks={taskList.filter(task => task.columnId === activeColumn._id)}
              />
            )}
            {activeTask && (
              <TaskCard key={activeTask._id} task={activeTask} style={{ opacity: 0.6 }} />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default AgileBoard;

