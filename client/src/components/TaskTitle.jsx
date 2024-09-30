import clsx from "clsx";
import React from "react";
import PropTypes from "prop-types";
// import { IoMdAdd } from "react-icons/io";

const TaskTitle = ({ label, className }) => {
  return (
    <div className='w-full h-12 md:h-14 px-2 md:px-4 rounded-xl bg-white flex items-center justify-between shadow-sm hover:shadow-lg transition-all duration-200'>
      <div className='flex gap-2 items-center'>
        <div className={clsx("w-5 h-5 rounded-full", className)} />
        <p className='text-sm md:text-xs text-gray-600 font-semibold'>{label}</p>
      </div>

      {/* <button className='hidden md:block hover:text-blue-500 transition-all'>
        <IoMdAdd className='text-lg' />
      </button> */}
    </div>
  );
};
TaskTitle.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default TaskTitle;
