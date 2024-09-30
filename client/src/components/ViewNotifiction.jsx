import React from 'react';
import PropTypes from 'prop-types';
import ModelWrapper from './ModalWrapper';
import { Dialog } from '@headlessui/react';
import Button from './Button';

const ViewNotifiction = ({ open, setOpen, el}) => {
  return (
    <>
        <ModelWrapper open={open} setOpen={setOpen}>
            <div className='py-4 w-full flex flex-col gap-4 items-center justify-center'>
                <Dialog.Title as='h3' className='font-semibold text-lg'>
                    {el?.task?.title}
                </Dialog.Title>

                <p className='text-start text-gray-500'>{el?.text}</p>

                <Button
                    type='button'
                    className='bg-white px-8 mt-3 text-sm font-semibold text-gray-900 sm:w-auto border border-gray-300'
                    onClick={() => setOpen(false)}
                    label='Ok'
                />
            </div>
        </ModelWrapper>
    </>
  );
};

ViewNotifiction.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  el: PropTypes.shape({
    task: PropTypes.shape({
      title: PropTypes.string
    }),
    text: PropTypes.string
  })
};

export default ViewNotifiction;
