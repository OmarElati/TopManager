import { React, useState, useMemo } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import TrashIcon from '../icons/TrashIcon';
import PlusIcon from '../icons/PlusIcon';
// import { useDispatch } from 'react-redux';
import {
  useDeleteColumnMutation,
  useUpdateColumnMutation,
  useAddTaskMutation,
  // useMoveTaskMutation,
} from '../../redux/slices/api/boardSlice';
import PropTypes from 'prop-types';

function ColumnContainer({ column, tasks }) {
  
  const [editMode, setEditMode] = useState(false);
  // const dispatch = useDispatch();
  const [deleteColumn] = useDeleteColumnMutation();
  const [updateColumn] = useUpdateColumnMutation();
  const [addTask] = useAddTaskMutation();
  const [newTaskContent, setNewTaskContent] = useState('new task');
  const [isDraggingTask, setIsDraggingTask] = useState(false);
  const [tempTitle, setTempTitle] = useState(column.title);

  const columnTasks = useMemo(() => {
    return tasks.filter(task => task.columnId === column._id);
  }, [tasks, column._id]);

  const tasksIds = useMemo(() => columnTasks.map(task => task._id), [columnTasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column._id,
    data: {
      type: 'Column',
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleSaveColumnTitle = () => {
    updateColumn({ id: column._id, title: tempTitle });
    setEditMode(false);
  };

  const handleDeleteColumn = () => {
    deleteColumn(column._id);
  };

  const handleUpdateColumn = (title) => {
    updateColumn({ id: column._id, title });
    setEditMode(false);
  };

  const handleAddTask = () => {
    if (!newTaskContent.trim()) {
      console.error('Task content is required');
      return;
    }

    const newTask = {
      _id: Date.now().toString(),
      columnId: column._id,
      title: newTaskContent,
      stage: column.title || 'to assign tickets',
    };

    addTask(newTask)
      .unwrap()
      .then((response) => {
        setNewTaskContent('');
        console.log('Task added successfully:', response);
      })
      .catch((error) => {
        console.error('Failed to add task: ', error);
      });
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-[350px] h-[500px] max-h-[500px] opacity-40 border-2 border-blue-500 rounded-md flex flex-col"
      >
        <div className="flex flex-col flex-grow gap-4 p-2 overflow-x-hidden overflow-y-auto">
          <SortableContext items={tasksIds} disabled={isDraggingTask}>
            {columnTasks.map((column) => (
              <div key={column.columnId}>
                {column.tasks.length > 0 ? (
                  column.tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onDragStart={() => setIsDraggingTask(true)}
                      onDragEnd={() => setIsDraggingTask(false)}
                    />
                  ))
                ) : (
                  <p>No tasks available</p>
                )}
              </div>
            ))}
          </SortableContext>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 w-[350px] h-[550px] max-h-[600px] rounded-md flex flex-col"
    >
      {/* Column Title */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between p-2 border-b"
      >
        <div className="flex gap-2 text-black"
          onClick={() => setEditMode(true)}
        >
          {editMode ? (
            <input
              className="px-2 bg-white border rounded outline-none focus:border-blue-500"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              autoFocus
              onBlur={handleSaveColumnTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveColumnTitle();
                }
              }}
            />
          ) : (
            <h2>{column.title}</h2>
          )}
        </div>
        <div>
          <button
            className="gap-2 p-4 rounded-md hover:border-blue-500 text-blue-500 hover:text-blue-500 active:text-blue-300"
            onClick={handleAddTask}
          >
            <PlusIcon />
          </button>
          <button
            onClick={handleDeleteColumn}
            className="px-1 py-2 rounded stroke-gray-400 hover:stroke-white hover:text-gray-700"
          >
            <TrashIcon />
          </button>
        </div>
        
      </div>
      {/* Column tasks container */}
      <div className="flex flex-col flex-grow gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds} disabled={isDraggingTask}>
          {columnTasks.map((column) => (
            <div key={column.columnId}>
              {column.tasks.length > 0 ? (
                column.tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDragStart={() => setIsDraggingTask(true)}
                    onDragEnd={() => setIsDraggingTask(false)}
                  />
                ))
              ) : (
                <p>No tasks available</p>
              )}
            </div>
          ))}
        </SortableContext>
      </div>      
    </div>
  );
}

ColumnContainer.propTypes = {
  column: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    columnId: PropTypes.string,
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string,
        columnId: PropTypes.string,
      })
    ),
  }).isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      columnId: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ColumnContainer;
