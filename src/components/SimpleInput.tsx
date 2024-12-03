import React, { forwardRef } from "react";

interface SimpleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Use forwardRef to forward the ref to the input element
const SimpleInput = forwardRef<HTMLInputElement, SimpleInputProps>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}  // Attach the forwarded ref to the input element
      className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400 ${props.className}`}
    />
  );
});

// Add displayName to help with debugging
SimpleInput.displayName = 'SimpleInput';

export default SimpleInput;
