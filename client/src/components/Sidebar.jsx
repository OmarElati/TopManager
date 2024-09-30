import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdTaskAlt,
} from "react-icons/md";
import { FaFlipboard } from "react-icons/fa6";
import { BiMenuAltRight, BiMenuAltLeft } from "react-icons/bi";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
// import { setOpenSidebar } from "../redux/slices/authSlice";
import clsx from "clsx";

const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
    {
    label: "Kanban",
    link: "Kanban",
    icon: <FaFlipboard />,
  },
  {
    label: "Tasks",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Completed",
    link: "completed/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "in-progress/in progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "To Do",
    link: "todo/todo",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Team",
    link: "team",
    icon: <FaUsers />,
  },
  {
    label: "Trash",
    link: "trashed",
    icon: <FaTrashAlt />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);
  // collapsed or expanded
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const NavLink = ({ el }) => {
    NavLink.propTypes = {
      el: PropTypes.shape({
        label: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
        icon: PropTypes.element.isRequired,
      }).isRequired,
    };
    return (
      <Link
        to={el.link}
        className={clsx(
          "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-300",
          isExpanded ? "" : "justify-center",
          path === el.link.split("/")[0]
            ? "bg-blue-500 text-white shadow-lg"
            : "text-gray-700 hover:bg-blue-200 hover:text-blue-800"
        )}
      >
        <span className=" flex justify-center items-center">{el.icon}</span>
        {isExpanded && <span>{el.label}</span>}
      </Link>
    );
  };

  return (
    <div
      className={clsx(
        "h-full flex flex-col gap-6 p-5 bg-gradient-to-b from-white rounded-lg to-gray-100 shadow-lg transition-all duration-300",
        isExpanded ? "w-64" : "w-20"
      )}
    >
      {/* Sidebar Header with Toggle Button */}
      <div className="flex items-center justify-between">
        <h1 className="flex gap-2 items-center">
          <div className="bg-blue-500 p-2 rounded-full">
            <MdOutlineAddTask className="text-white text-2xl" />
          </div>
          {isExpanded && <span className="text-2xl font-bold text-gray-800">TopManager</span>}
        </h1>
      </div>

      {/* Sidebar Links */}
      <div className="flex-1 flex flex-col gap-y-4">
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      {/* Settings Button */}
      <div className={clsx(isExpanded ? "" : "flex justify-center")}>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-200 hover:text-blue-800 transition duration-300">
          <span  onClick={toggleSidebar} className="text-gray-700">
            {/* <MdMenu className="text-2xl" /> */}
            {isExpanded ? <BiMenuAltRight className="text-2xl" /> : <BiMenuAltLeft className="text-2xl" />}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
