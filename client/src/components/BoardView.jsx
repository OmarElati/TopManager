import React from "react";
import PropTypes from "prop-types";
import TaskCard from "./TaskCard";


const BoardView = ({ tasks = [] }) => {
  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
      {tasks.length > 0 ? (
        tasks.map((task, index) => (
          <TaskCard task={task} key={index} />
        ))
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
};


BoardView.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired, // tasks should be an array of objects
};

export default BoardView;
