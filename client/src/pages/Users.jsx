import React, { useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials } from "../utils";
import clsx from "clsx";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import AddUser from "../components/AddUser";
import { useDeleteUserMutation, useGetTeamListQuery, useUserActionMutation } from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const { data, isLoading, refetch } = useGetTeamListQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const userActionHandler = async () => {
    try {
      const result = await userAction({
        isActive: !selected?.isActive,
        id: selected?._id,
      });

      refetch();
      toast.success(result.data.message);
      setSelected(null);
      setOpenAction(false);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const deleteHandler = async () => {
    try {
      await deleteUser(selected);
      refetch();
      toast.success("Deleted successfully");
      setSelected(null);
      setOpenDialog(false);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  const userStatusClick = (el) => {
    setSelected(el);
    setOpenAction(true);
  };

  const TableHeader = () => (
    <thead className='bg-gray-100'>
      <tr className='text-black text-left'>
        <th className='py-2 px-4'>Full Name</th>
        <th className='py-2 px-4'>Title</th>
        <th className='py-2 px-4'>Email</th>
        <th className='py-2 px-4'>Role</th>
        <th className='py-2 px-4'>Active</th>
        <th className='py-2 px-4'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-50'>
      <td className='p-2 px-4 flex items-center gap-3'>
        <div className="w-10 h-10 border-2 border-gray-500 rounded-full flex justify-center items-center">
          {user.image ? (
            <img
              src={user.image} // Ensure the image URL is accessible
              alt={user.name}
              className='w-9 h-9 rounded-full object-cover'
            />
          ) : (
            <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-500'>
              <span className='text-xs md:text-sm text-center'>
                {getInitials(user.name)}
              </span>
            </div>
          )}
        </div>
        <p className="text-sm">{user.name}</p>
      </td>
      <td className='p-2 px-4 text-sm'>{user.title}</td>
      <td className='p-2 px-4 text-sm'>{user.email || "user.email.com"}</td>
      <td className='p-2 px-4 text-sm'>{user.role}</td>
      <td className='p-2 px-4 text-sm'>
        <button
          onClick={() => userStatusClick(user)}
          className={clsx(
            "w-fit px-4 py-1 rounded-full transition duration-200",
            user?.isActive ? "bg-blue-200 hover:bg-blue-300" : "bg-yellow-100 hover:bg-yellow-200"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </button>
      </td>
      <td className='p-2 px-4 flex gap-4 justify-end'>
        <Button
          className='text-blue-600 hover:text-blue-500 font-semibold'
          label='Edit'
          type='button'
          onClick={() => editClick(user)}
        />
        <Button
          className='text-red-700 hover:text-red-500 font-semibold'
          label='Delete'
          type='button'
          onClick={() => deleteClick(user?._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className='w-full md:px-4 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Team Members' />
          <Button
            label='Add New User'
            icon={<IoMdAdd className='text-lg' />}
            className='flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-md py-2 px-4 shadow-md hover:shadow-lg transition duration-200'
            onClick={() => setOpen(true)}
          />
        </div>

        <div className='bg-white px-4 py-4 shadow-md rounded-lg'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {data?.map((user, index) => (
                  <TableRow key={index} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
};

export default Users;
