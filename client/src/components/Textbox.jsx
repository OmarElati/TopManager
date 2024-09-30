import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const Textbox = React.forwardRef(
  ({ type, placeholder, label, className, register, name, error }, ref) => {
    return (
      <div className='w-full flex flex-col gap-1'>
        {label && (
          <label htmlFor={name} className='text-slate-800 text-sm'>
            {label}
          </label>
        )}

        <div>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            ref={ref}
            {...register}
            aria-invalid={error ? "true" : "false"}
            className={clsx(
              "bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-200",
              className
            )}
          />
        </div>
        {error && (
          <span className='text-xs text-[#6949f6fe] mt-0.5 '>{error}</span>
        )}
      </div>
    );
  }
);

Textbox.displayName = "Textbox";

Textbox.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  register: PropTypes.object,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
};

export default Textbox;
