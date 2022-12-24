
import { useAuth0 } from '@auth0/auth0-react';
import React, { Fragment, useRef, useState } from 'react';
import { IoCopyOutline, IoLink, IoPencil, IoTrash } from 'react-icons/io5';
import toast from 'react-simple-toasts';
import './Dashboard.css';
import Navigation from './Navigation/Navigation';

function Dashboard() {

    const { isAuthenticated, loginWithPopup } = useAuth0();

    const [minkInputValue, setminkInputValue] = useState('minks.com/34ert');
    const [disableField, setDisableField] = useState(true);
    const inputFocusRef = useRef<any>();

    const mouseEnter = (e: any) => {
        // e.target.style.display = 'block'
        // e.target.querySelector('item-delete-icon').style.display = 'block';

        // e.target.lastChild.style.display = 'block';
    }

    const mouseLeave = (e: any) => {
        // e.target.style.display = 'none'
        // e.target.querySelector('item-delete-icon').style.display = 'none';

        // e.target.lastChild.style.display = 'none';
    }

    const activateField = () => {
        setDisableField(false);

        const interval = setInterval(() => {
            inputFocusRef.current.focus();
            clearInterval(interval);
        }, 200);
    }

    const copyField = () => {
        navigator.clipboard.writeText(minkInputValue);
        toast(`copy link`);
    }
  
    return (
            <div className='dashboard'>
                <Navigation />

                {
                    !isAuthenticated ?
                        <Fragment>
                            <h1 className='heading-primary margin-top-lg'>Login to access dashboard</h1>
                            <button className='button login' onClick={() => loginWithPopup()}>LOGIN</button>
                        </Fragment>
                    :
                    <Fragment>
                        <h1 className='heading-primary margin-top-lg'>Links</h1>
                        
                        <div className='minks-grid'>
                            <div className='minks-list'>
                                <div className='heading'>6 Result</div>

                                <div className='mink-item' onMouseEnter={(event) =>  mouseEnter(event)} onMouseLeave={(event) => mouseLeave(event)}>
                                    <span className='item-date'>MAY 18, 4:43 PM</span>
                                    <span className='item-title'>My Youtube</span>
                                    <div className='item-mink'><p>minks.com/34ert</p> <span>0 </span></div>

                                    {/* { isShown && ( <IoTrash className='item-delete-icon'/> ) } */}
                                    <IoTrash className='item-delete-icon'/>
                                    
                                </div>
                                <div className='mink-item' onMouseEnter={(event) =>  mouseEnter(event)} onMouseLeave={(event) => mouseLeave(event)}>
                                    <span className='item-date'>MAY 18, 4:43 PM</span>
                                    <span className='item-title'>Hoolydays</span>
                                    <div className='item-mink'><p>minks.com/34ert</p> <span>0 </span></div>

                                    {/* { isShown && ( <IoTrash className='item-delete-icon'/> ) } */}
                                    <IoTrash className='item-delete-icon'/>
                                </div>
                            </div>

                            <div className='mink-detail'>
                                <h1 className='heading-primary'>My Youtube</h1>
                                <span className='item-date'>MAY 18, 4:43 PM</span>

                                <div className='field-container'>
                                    <IoLink className='input-icon' />
                                    <input type='text' ref={inputFocusRef} className='input' value={minkInputValue} onChange={(e) => setminkInputValue(e.target.value)} disabled={disableField} />
                                    <div className='field-tools'>
                                        <div onClick={() => activateField()}><IoPencil /> <span>Edit</span></div>
                                        <div onClick={() => copyField()}><IoCopyOutline /> <span>Copy</span></div>
                                    </div>
                                </div>

                                <span className='mink-destination'>DESTINATION: &nbsp; https://www.youtube.com/channel/firstpropsgreat</span>

                                <div className='mink-detail-footer'>
                                    <div className='clicks'>
                                        <span>0</span>
                                        <p>TOTAL CLICKS</p>
                                    </div>

                                    <div className='buttons'>
                                        <button className='button'>UPDATE</button>
                                        <button className='button delete'>DELETE</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Fragment>
                }
            
            </div>
    );
}

export default Dashboard;