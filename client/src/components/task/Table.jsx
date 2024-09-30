import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { BiMessageAltDetail } from "react-icons/bi";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../utils";
import clsx from "clsx";
import { FaList } from "react-icons/fa";
import UserInfo from "../UserInfo";
import Button from "../Button";
import ConfirmatioDialog from "../Dialogs";
import { useTrashedTastMutation } from "../../redux/slices/api/taskApiSlice";
import AddTask from "./AddTask";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [trashTask] = useTrashedTastMutation();

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editTaskHandler = (el) => {
    setSelected(el);
    setOpenEdit(true);
  };

  const deleteHandler = async () => {
    try {
      const result = await trashTask({
        id: selected,
        isTrash: "trash",
      }).unwrap();
      toast.success(result?.message);

      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const TableHeader = () => (
    <thead className='w-full border-b border-gray-300'>
      <tr className='text-left text-gray-700 text-sm md:text-base'>
        <th className='py-2 px-2 md:px-4'>Task Title</th>
        <th className='py-2 px-2 md:px-4'>Priority</th>
        <th className='py-2 px-2 md:px-4'>Created At</th>
        <th className='py-2 px-2 md:px-4'>Assets</th>
        <th className='py-2 px-2 md:px-4'>Team</th>
        <th className='py-2 px-2 md:px-4 text-right'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-100 transition'>
      <td className='py-2 px-2 md:px-4'>
        <div className='flex items-center gap-2'>
          <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])} />
          <p className='line-clamp-2 text-sm md:text-base'>{task?.title}</p>
        </div>
      </td>

      <td className='py-2 px-2 md:px-4'>
        <div className='flex items-center gap-1'>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span className='capitalize text-sm md:text-base'>
            {task?.priority} Priority
          </span>
        </div>
      </td>

      <td className='py-2 px-2 md:px-4'>
        <span className='text-xs md:text-sm'>{formatDate(new Date(task?.date))}</span>
      </td>

      <td className='py-2 px-2 md:px-4'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center text-xs md:text-sm gap-1'>
            <BiMessageAltDetail />
            <span>{task?.activities?.length}</span>
          </div>
          <div className='flex items-center text-xs md:text-sm gap-1'>
            <MdAttachFile />
            <span>{task?.assets?.length}</span>
          </div>
          <div className='flex items-center text-xs md:text-sm gap-1'>
            <FaList />
            <span>0/{task?.subTasks?.length}</span>
          </div>
        </div>
      </td>

      <td className='py-2 px-2 md:px-4'>
        <div className='flex'>
          {task?.team?.map((m, index) => (
            <div
              key={m._id}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS?.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>

      <td className='py-2 px-2 md:px-4 flex gap-2 md:gap-4 justify-end'>
        <Button
          className='text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base'
          label='Edit'
          type='button'
          onClick={() => editTaskHandler(task)}
        />

        <Button
          className='text-red-600 hover:text-red-500 sm:px-0 text-sm md:text-base'
          label='Delete'
          type='button'
          onClick={() => deleteClicks(task._id)}
        />
      </td>
    </tr>
  );

  TableRow.propTypes = {
    task: PropTypes.shape({
      title: PropTypes.string.isRequired,
      stage: PropTypes.string,
      priority: PropTypes.string,
      date: PropTypes.string,
      activities: PropTypes.array,
      assets: PropTypes.array,
      subTasks: PropTypes.array,
      team: PropTypes.arrayOf(PropTypes.object),
      _id: PropTypes.string.isRequired,
    }).isRequired,
  };

  return (
    <>
      <div className='bg-white px-4 py-6 shadow-lg rounded-md overflow-x-auto'>
        <table className='w-full table-auto'>
          <TableHeader />
          <tbody>
            {tasks.map((task, index) => (
              <TableRow key={index} task={task} />
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
        key={new Date().getTime()}
      />
    </>
  );
};

Table.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Table;
