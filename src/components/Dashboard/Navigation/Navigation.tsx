
import './Navigation.css';
import React, { Fragment, useState } from 'react';
import Modal from '../Modal/Modal';
import { IoSearch } from 'react-icons/io5';
import { useAuth0 } from '@auth0/auth0-react';

function Navigation() {
    
    const { user, isAuthenticated } = useAuth0();
    
    const [openModal, setOpenModal] = useState(false);
    const [showGeneration, setShowGeneration] = useState(true);


    return (
        <Fragment>
            <div className='navigation'>
                
                <h1 className='heading-primary'><span>Minks</span></h1>

                    {
                        isAuthenticated && 
                        <div className='nav-components'>
                            <div className='field-container'>
                                <IoSearch className='input-icon'/>
                                <input type='text' className='input' placeholder='Search Links'/>
                            </div>
        
                            <button className='button' onClick={() => setOpenModal(true)}>CREATE NEW</button>
                            <div className='user'>
                                <img src={user?.picture} className='user-img' alt='user profile' />
                                <span>{user?.name}</span>
                            </div>
                        </div>
                    }
            </div>
            
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                {
                !showGeneration ?
                <div className='modal-mink-create'>
                    <input type='text' className='input' placeholder='Long url here'/>

                    <input type='text' className='input' placeholder='custom link (optional)' />

                    <button className='button' onClick={() => setShowGeneration(true)}>Mink it up !</button>
                </div>
                :
                <div className='mink-gen'>
                    <h3 className='heading-secondary'>Your shortened link</h3>
                    <div className='row'>
                        <input type='text' className='input' value='minks.com/3fajbm' />
                        <button className='button'>Copy URL</button>
                    </div>
                </div>
                }
            </Modal>
        </Fragment>
    );
}

export default Navigation