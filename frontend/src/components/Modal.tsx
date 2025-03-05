import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="absolute top-[40%] right-[50%] bg-white p-4 rounded-lg z-10 text-right">
        <button
          className="text-black font-semibold hover:text-gray-700 focus:outline-none mr-2"
          onClick={onClose}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
