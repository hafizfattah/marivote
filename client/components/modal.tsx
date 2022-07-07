import {ReactNode} from 'react';
import {X} from 'react-feather';
import Button from './button';

interface Props {
  title: string;
  footer?: ReactNode;
  children: ReactNode;
  isDismissible?: boolean;
  // eslint-disable-next-line no-unused-vars
  isActive: (active: boolean) => void;
}

const ModalFooter = ({children}: {children: ReactNode}) => <div>{children}</div>;

const Modal = ({title, footer, children, isDismissible = true, isActive}: Props) => {
  const handleClose = () => {
    if (!isDismissible) return;
    isActive(false);
  };

  return (
    <div>
      <div>
        <div
          className="
          modal
          border-4
          border-hfg-black
          flex
          flex-col
          justify-between
          fixed
          top-[50%]
          left-[50%]
          translate-x-[-50%]
          translate-y-[-50%]
          bg-white
          rounded-lg
          shadow-md
          min-w-[600px]
          z-40"
        >
          <div className="modal-header flex flex-row justify-between items-center p-4 border-b-2 border-hfg-black">
            <h3 className="text-xl font-bold">{title}</h3>
            {isDismissible && (
              <Button
                className="
              w-[40px]
              h-[40px]
              !p-0
              text-center
              !border-none
              rounded-[50%]
              !shadow-none"
                variant="black"
                size="small"
                onClick={() => handleClose()}
              >
                <X className="mx-auto" />
              </Button>
            )}
          </div>
          <div className="modal-body px-4 py-8 flex flex-col justify-between h-full">{children}</div>

          {footer && (
            <div className="modal-footer p-4 bg-hfg-black">
              {' '}
              <ModalFooter>{footer}</ModalFooter>
            </div>
          )}
        </div>
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)]" onClick={() => handleClose()}></div>
      </div>
    </div>
  );
};

export default Modal;
