import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-gradient-to-r from-blue-500 to-blue-400",
  "in progress": "bg-gradient-to-r from-yellow-500 to-yellow-400",
  completed: "bg-gradient-to-r from-green-500 to-green-400",
};

const Tasks = () => {
  const params = useParams();

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  const status = params?.status || "";

  const { data, isLoading } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: "",
  });

  return isLoading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full p-4 bg-gray-50 rounded-lg shadow-md'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-2 px-4 shadow-md hover:shadow-lg transition duration-200 transform hover:scale-105'
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
            <TaskTitle
              label='To Do'
              className={`${TASK_TYPE.todo} p-3 rounded-md shadow-sm transition duration-200 transform hover:scale-105 hover:shadow-lg`}
            />
            <TaskTitle
              label='In Progress'
              className={`${TASK_TYPE["in progress"]} p-3 rounded-md shadow-sm transition duration-200 transform hover:scale-105 hover:shadow-lg`}
            />
            <TaskTitle
              label='Completed'
              className={`${TASK_TYPE.completed} p-3 rounded-md shadow-sm transition duration-200 transform hover:scale-105 hover:shadow-lg`}
            />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView tasks={data?.tasks} />
        ) : (
          <div className='w-full'>
            <Table tasks={data?.tasks} />
          </div>
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
