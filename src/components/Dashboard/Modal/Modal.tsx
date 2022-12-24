import React from 'react';
import './Modal.css';

import { IoCloseSharp } from 'react-icons/io5';

interface ModalProps {
    open: boolean;
    onClose: any;
    children: any;
}

function Modal({open, onClose, children}: ModalProps) { //destructing the properties sent to this component
    if(!open) return null;

  return (
    <div className='overlay'>
        <div className='modal-container'>
            <IoCloseSharp className='close-btn' onClick={onClose} />
            {children}
        </div>
    </div>
  )
}

export default Modal