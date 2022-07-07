import {InputHTMLAttributes} from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
}

const TextField = ({id, label, ...props}: Props) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="form-label inline-block mb-2 text-gray-700 text-sm">
          {label}
        </label>
      )}

      <input
        className="
        form-control
        block
        w-full
        p-3
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border-2 border-solid border-hfg-black
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-hfg-green focus:outline-none
      "
        id={id}
        placeholder="Number input"
        {...props}
      />
    </div>
  );
};
export default TextField;
