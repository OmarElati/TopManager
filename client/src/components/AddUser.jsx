import React, { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { toast } from "sonner";
import { useUpdateUserMutation } from "../redux/slices/api/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../utils/firebase";

const AddUser = ({ open, setOpen, userData }) => {
  let defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [addNewUser, { isLoading }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const storage = getStorage(app);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleOnSubmit = async (data) => {
    try {
      if (selectedImage) {
        const imageFile = document.querySelector('input[type="file"]').files[0];
        const storageRef = ref(storage, `profilePictures/${imageFile.name}`);
  
        await uploadBytes(storageRef, imageFile);
        
        const imageUrl = await getDownloadURL(storageRef);
        console.log("Image URL:", imageUrl);
        
        data.image = imageUrl;
      }
  
      if (userData) {
        const result = await updateUser({ ...data, _id: userData._id }).unwrap();
  
        toast.success("Profile updated successfully");
        
        if (userData?._id === user._id) {
          dispatch(setCredentials({ ...result.user }));
        }
      } else {
        await addNewUser({
          ...data,
          password: data.email,
        }).unwrap();
        
        toast.success("User added successfully");
      }
  
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Full name"
              type="text"
              name="name"
              label="Full Name"
              className="w-full rounded"
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder="Title"
              type="text"
              name="title"
              label="Title"
              className="w-full rounded"
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <Textbox
              placeholder="Email Address"
              type="email"
              name="email"
              label="Email Address"
              className="w-full rounded"
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />

            <Textbox
              placeholder="Role"
              type="text"
              name="role"
              label="Role"
              className="w-full rounded"
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />

            {/* File Upload for Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                onChange={handleImageChange}
              />

              {/* Image Preview */}
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Profile Preview"
                  className="mt-4 h-32 w-32 rounded-full object-cover"
                />
              )}
            </div>
          </div>

          {isLoading || isUpdating ? (
            <div className="py-5">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                className="bg-blue-500 px-8 text-sm font-semibold text-white hover:bg-blue-600  sm:w-auto"
                label="Submit"
              />

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};
AddUser.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  userData: PropTypes.object,
};

export default AddUser;
