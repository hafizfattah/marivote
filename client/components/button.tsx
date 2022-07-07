import classNames from 'classnames';
import {ButtonHTMLAttributes, ReactNode} from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  size?: string;
  isLoading?: boolean;
  className?: string;
  children: ReactNode;
}

const Button = ({variant = 'default', size = 'default', isLoading = false, className, children, ...props}: Props) => {
  const btnClass = classNames({
    'hfg-button__secondary': variant === 'secondary',
    'hfg-button__black': variant === 'black',
    'md:px-8 md:py-4 px-4 py-2 md:text-lg md:sm': size === 'large',
    'md:px-[12px] md:py-[0.5rem] px-1 py-1 md:text-xs rounded': size === 'small',
    'cursor-not-allowed': isLoading,
  });

  return (
    <button
      type="button"
      className={`
        hfg-button
        box-shadowed
        relative
        inline-block
        md:px-6
        md:py-2.5
        px-2
        py-1
        font-bold
        bg-white
        ${btnClass}
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      <svg className={`spinner ${isLoading ? 'visible' : 'invisible'}`} viewBox="0 0 50 50">
        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
      </svg>
      <span className={`flex items-center justify-center ${isLoading ? 'invisible' : 'visible'}`}>{children}</span>
    </button>
  );
};
export default Button;
