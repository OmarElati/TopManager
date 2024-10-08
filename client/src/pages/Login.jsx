import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useLoginUserMutation } from "../redux/slices/api/authApiSlice";
import { toast } from "sonner";
import { setCredentials } from "../redux/slices/authSlice";
import Loading from "../components/Loader";

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginUserMutation();

  const submitHandler = async (data) => {
    try {
      const result = await login(data).unwrap();

      dispatch(setCredentials(result));
      navigate("/log-in");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        {/* left side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='inline-block py-2 px-4 border rounded-full text-sm md:text-base border-blue-500 text-gray-700 bg-blue-50'>
              Simplify your workflow with ease
            </span>

            <p className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-center text-blue-600 mt-4'>
              <span className="text-transform: uppercase">Effortless</span> <br className='hidden md:block' />
              <span>Task Management</span>
            </p>
          </div>
        </div>

        {/* right side */}
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
          >
            <div className='pt-5'>
              <p className='text-blue-600 text-3xl font-bold text-center'>
                Great to see you again!
              </p>
              <p className='text-center text-sm text-gray-700 mt-2'>
                Securely manage and access your account with ease.
              </p>
            </div>


            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder='email@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded-full text-sm'
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder='your password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded-full text-sm'
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <span className='text-sm text-gray-500 hover:text-blue-700 cursor-pointer'>
                Forget Password?
              </span>

              { isLoading ? <Loading /> : <Button
                type='submit'
                label='Submit'
                className='w-full h-10 bg-blue-500 text-white rounded-full hover:bg-blue-700'
              />}
            </div>
          </form>

          {/* Button to switch to Register page */}
          <div className="mt-4 text-center">
            <span className="text-gray-700">Don't have an account? </span>
            <Button
              label="Create Account"
              type="button"
              onClick={() => navigate("/register")}
              className="mt-2 text-blue-500 hover:text-blue-700 py-2 px-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
