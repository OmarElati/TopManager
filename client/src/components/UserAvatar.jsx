import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils";
import { toast } from "sonner";
import { useLogoutMutation } from "../redux/slices/api/authApiSlice";
import { logout } from "../redux/slices/authSlice";
import AddUser from "./AddUser";
import ChangePassword from "./ChangePassword";

const UserAvatar = () => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutUser] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate("/log-in");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div>
        <Menu as='div' className='relative inline-block text-left'>
        <div className={`w-3 h-3 rounded-full ${user ? 'bg-green-500' : 'bg-gray-400'} absolute top-0 right-0 transform translate-x-1 translate-y-1`} />
        <div className="flex items-center justify-center w-12 h-12 border-2 border-blue-900 rounded-full 
                sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-14 xl:h-14">
            <Menu.Button className='flex w-10 h-10 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-blue-500'>
              {user?.image ? (
                <img 
                  src={user.image} 
                  alt="User Avatar" 
                  className='w-full h-full rounded-full object-cover' 
                />
              ) : (
                <span className='text-white font-semibold'>
                  {getInitials(user?.name)}
                </span>
              )}
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-gray-100 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none'>
              <div className='p-4'>
                <Menu.Item>
                  {() => (
                    <button
                      onClick={() => setOpen(true)}
                      className='text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base'
                    >
                      <FaUser className='mr-2' aria-hidden='true' />
                      Profile
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {() => (
                    <button
                      onClick={() => setOpenPassword(true)}
                      className={`tetx-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      <FaUserLock className='mr-2' aria-hidden='true' />
                      Change Password
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {() => (
                    <button
                      onClick={logoutHandler}
                      className={`text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      <IoLogOutOutline className='mr-2' aria-hidden='true' />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <AddUser open={open} setOpen={setOpen} userData={user} />
      <ChangePassword open={openPassword} setOpen={setOpenPassword} />
    </>
  );
};

export default UserAvatar;
