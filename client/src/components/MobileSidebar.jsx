import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdTaskAlt,
} from "react-icons/md";
import { BiMenuAltRight, BiMenuAltLeft } from "react-icons/bi";
import { FaFlipboard, FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

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
    link: "in-progress/in-progress",
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

const MobileSidebar = () => {
  const { isSidebarOpen, user } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();
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
        <span className="flex justify-center items-center">{el.icon}</span>
        {isExpanded && <span>{el.label}</span>}
      </Link>
    );
  };

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter="transition-opacity duration-700"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-700"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {() => (
          <div
            ref={(node) => (mobileMenuRef.current = node)}
            className={clsx(
              "md: w-full h-full bg-opacity-30 transition-all duration-700 transform",
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
            onClick={closeSidebar}
          >
            <div className="mt-10">
              <div
                className={clsx(
                  "h-full flex flex-col gap-6 p-5 bg-gradient-to-b from-white rounded-lg to-gray-100 shadow-lg transition-all duration-300",
                  isExpanded ? "w-64" : "w-20"
                )}
              >
                {/* Sidebar Header with Toggle Button */}
                <div className="flex items-center justify-between">
                  <h1 className="flex gap-2 items-center">
                    <div className="">
                      <MdOutlineAddTask className="text-white text-2xl" />
                    </div>
                    {isExpanded && (
                      <span className="text-2xl font-bold text-blue-500">
                        Topmanager
                      </span>
                    )}
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
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-200 hover:text-blue-800 transition duration-300">
                    <button onClick={toggleSidebar} className="text-gray-700">
                      {isExpanded ? (
                        <BiMenuAltRight className="text-2xl" />
                      ) : (
                        <BiMenuAltLeft className="text-2xl" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};

export default MobileSidebar;
