import React from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import UserAvatar from "./UserAvatar";
import NotificationPanel from "./NotificationPanel";

const Navbar = () => {
  useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className='flex justify-between items-center bg-white shadow-md px-4 py-3 rounded-lg sticky z-10 top-0 transition-all duration-300'>
      <div className='flex items-center gap-4'>
        <button
          onClick={() => dispatch(setOpenSidebar(true))}
          className='text-2xl text-gray-600 hover:text-blue-500 transition-colors duration-200 block md:hidden'
        >
          ☰
        </button>

        <div className='relative w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-lg bg-gray-100 shadow-inner'>
          <MdOutlineSearch className='text-gray-500 text-xl' />

          <input
            type='text'
            placeholder='Search....'
            className='flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800 transition duration-200'
          />
        </div>
      </div>

      <div className='flex gap-4 items-center'>
        <NotificationPanel />

        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;
