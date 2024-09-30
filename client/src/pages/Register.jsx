import React from "react";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { toast } from "sonner";
import Textbox from "../components/Textbox";
import Button from "../components/Button";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [registerUser] = useRegisterMutation();

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data).unwrap();
      toast.success("Registration successful!");
      console.log("Registration response:", res);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-end mr-2">
      <div className="max-w-lg w-full bg-white/30 backdrop-blur-lg shadow-xl rounded-lg p-8 border border-white/20 mb-4 mt-4">
        <h2 className="text-4xl font-extrabold text-center text-black mb-8">Sign Up</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Name Field */}
          <Textbox
            label="Name"
            placeholder="Enter your name"
            className="w-full rounded-lg"
            type="text"
            register={register("name", { required: "Name is required" })}
            error={errors.name?.message}
          />

          {/* Email Field */}
          <Textbox
            label="Email"
            placeholder="Enter your email"
            type="email"
            className="w-full rounded-lg"
            register={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message}
          />

          {/* Password Field */}
          <Textbox
            label="Password"
            placeholder="Enter your password"
            type="password"
            className="w-full rounded-lg"
            register={register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            error={errors.password?.message}
          />

          {/* Title Field */}
          <Textbox
            label="Title"
            placeholder="Enter your title"
            className="w-full rounded-lg"
            type="text"
            register={register("title", { required: "Title is required" })}
            error={errors.title?.message}
          />

          {/* Role Field */}
          <div>
            <label className="text-white text-sm font-medium mb-2">Role</label>
            <select
              {...register("role", { required: "Role is required" })}
              className="block w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            >
              <option value="" disabled>Select your role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}
          </div>

          {/* Admin Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("isAdmin")}
              className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <label className="text-blue-950 text-sm font-medium">Register as Admin</label>
          </div>

          {/* Submit Button */}
          <Button
            label={isSubmitting ? "Registering..." : "Register"}
            type="submit"
            className={`w-full py-3 text-lg font-bold tracking-wide text-blue-500 bg-white/80 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-blue-500 hover:text-blue-100 ${
              isSubmitting ? "cursor-not-allowed opacity-60" : ""
            }`}
            disabled={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
