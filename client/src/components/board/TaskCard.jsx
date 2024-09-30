import clsx from "clsx";
import React, { useState } from "react";
import PropTypes from 'prop-types';
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, PRIOTITYSTYELS, formatDate } from "../../utils";
import TaskDialog from "./TaskDialog";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "../UserInfo";
import { IoMdAdd } from "react-icons/io";
import AddSubTask from "../task/AddSubTask";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// import { useDispatch } from 'react-redux';
import { useDeleteTaskMutation } from '../../redux/slices/api/boardSlice';
//  useUpdateTaskMutation

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [mouseIsOver, setMouseIsOver] = useState(false);
  // const dispatch = useDispatch();
  const [deleteTask] = useDeleteTaskMutation();
  // const [updateTask] = useUpdateTaskMutation();
  const { _id, title = 'No Title' } = task || {};

  const TASK_TYPE = {
    "to assign tickets": "bg-gradient-to-r from-blue-500 to-blue-400",
    "assigned": "bg-gradient-to-r from-yellow-500 to-yellow-400",
    "stand by": "bg-gradient-to-r from-green-500 to-green-400",
    run: "bg-gradient-to-r from-purple-500 to-purple-400",
    "to validate": "bg-gradient-to-r from-red-500 to-red-400",
    reward: "bg-gradient-to-r from-indigo-500 to-indigo-400",
    release: "bg-gradient-to-r from-pink-500 to-pink-400",
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: _id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    cursor: isDragging ? 'grabbing' : 'grab',
    backgroundColor: task.backgroundColor || '#fff',
    boxShadow: transform ? '0 5px 15px rgba(0, 0, 0, 0.1)' : 'none',
  };

  const handleDelete = () => {
    deleteTask(_id);
  };
  // console.log(task.stage);

  if (isDragging) {
        return (
          <div
            ref={setNodeRef}
            style={style}
            className="w-full h-fit border-2 border-blue-500 opacity-50 rounded-md flex flex-row"
          ></div>
        );
      }
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="w-full h-fit bg-white shadow-md p-6 rounded-xl border border-gray-200 relative task mb-4"
      >
        {/* Task Header */}
        <div className="w-full flex justify-between items-center mb-3">
          <div className={clsx("flex gap-2 items-center text-xs font-semibold", PRIOTITYSTYELS[task?.priority])}>
            <span className="text-xl">{ICONS[task?.priority]}</span>
            <span className="uppercase text-gray-700">{task?.priority} Priority</span>
          </div>
          {user?.isAdmin && <TaskDialog task={task} />}
        </div>

        {/* Task Title */}
        <div className="mb-4 p-4 border rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
          <div className="flex items-center gap-2">
            <div className={clsx("w-2 h-2 rounded-full", TASK_TYPE[task.stage] || "bg-gray-400")} />
            <h4 className="text-lg font-semibold text-gray-900 truncate">{title}</h4>
          </div>
          <span className="text-xs text-gray-500">{formatDate(new Date(task?.date))}</span>
        </div>

        {/* Task Assets */}
        <div className="flex justify-between mb-4">
          <div className="flex gap-3 items-center">
            <div className="flex gap-1 items-center text-xs text-gray-600">
              <BiMessageAltDetail />
              <span>{task?.activities?.length}</span>
            </div>
            <div className="flex gap-1 items-center text-xs text-gray-600">
              <MdAttachFile />
              <span>{task?.assets?.length}</span>
            </div>
            <div className="flex gap-1 items-center text-xs text-gray-600">
              <FaList />
              <span>0/{task?.subTasks?.length}</span>
            </div>
          </div>

          {/* Team Members */}
          <div className="flex -space-x-2">
            {task?.team?.map((m, index) => (
              <div
                key={index}
                className={clsx("w-8 h-8 text-sm rounded-full text-white flex items-center justify-center border border-white", BGS[index % BGS?.length])}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </div>

        {/* Subtasks */}
        {task?.subTasks?.length > 0 ? (
          <div className="py-4 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-800 truncate">{task?.subTasks[0].title}</h5>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-gray-500">{formatDate(new Date(task?.subTasks[0]?.date))}</span>
              <span className="bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">{task?.subTasks[0].tag}</span>
            </div>
          </div>
        ) : (
          <div className="py-2 border-t border-gray-200 text-gray-500 text-xs">
            <p className="bg-slate-300 text-white rounded-sm inline-block px-[2px] py-[1px]">No Sub Task</p>
          </div>
        )}

        {/* Delete Task Button */}
        {mouseIsOver && (
          <button
            onClick={handleDelete}
            className="absolute p-2 -translate-y-1/2 rounded stroke-white right-4 top-1/2 bg-columnBgColor opacity-60 hover:opacity-100"
          >
            
          </button>
        )}

        {/* Add Subtask Button */}
        <div className="mt-2">
          <button
            onClick={() => setOpen(true)}
            disabled={!user.isAdmin}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <IoMdAdd className="text-lg" />
            <span>ADD SUBTASK</span>
          </button>
        </div>
      </div>

      {task && _id && <AddSubTask open={open} setOpen={setOpen} id={_id} />}
    </>
  );
};
TaskCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    backgroundColor: PropTypes.string,
    priority: PropTypes.string,
    date: PropTypes.string,
    activities: PropTypes.arrayOf(PropTypes.object),
    assets: PropTypes.arrayOf(PropTypes.object),
    subTasks: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        date: PropTypes.string,
        tag: PropTypes.string,
      })
    ),
    team: PropTypes.arrayOf(PropTypes.object),
    stage: PropTypes.string,
  }).isRequired,
};

export default TaskCard;
