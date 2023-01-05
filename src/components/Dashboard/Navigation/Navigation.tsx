
import './Navigation.css';
import React, { Fragment, useState } from 'react';
import Modal from '../Modal/Modal';
import { IoSearch } from 'react-icons/io5';
import { useAuth0 } from '@auth0/auth0-react';
import toast from 'react-simple-toasts';
import { apiResource } from '../../../config';
import { Wait } from '@rsuite/icons';
import * as Helper from '../../../helper';

function Navigation() {
    
    const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
    
    const [openModal, setOpenModal] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [showGeneration, setShowGeneration] = useState(false);

    const [longUrlField, setLongUrlField] = useState('');
    const [shortUrlField, setShortUrlField] = useState('');
    const [titleField, setTitleField] = useState('');
    const [generatedUrlField, setGeneratedUrlField] = useState('');     

    const [errorText, setErrorText] = useState('');

    const handleValidations = () => {
        if(longUrlField === ''){
            setErrorText('Provide a long url to be shortened');
            return false;
        }
        if(!Helper.isValidUrl(longUrlField)){
            setErrorText('Not a valid url');
            return false;
        }

        return true;
    }

    const handleGeneration = async () => {
        const validateStatus = handleValidations();

        if(validateStatus === true) {
            setErrorText('');

            setIsLoading(true);

            await runGen();
            
            setIsLoading(false);
        }
    }
    
    const runGen = async () => {
        var linkgen = '';

        // --------- linkgen var is assigned either the optional short url field or random string generation
        shortUrlField !== '' ? linkgen = shortUrlField : linkgen = Helper.generateShortLink(5);

        const token = await getIdTokenClaims();

        // ---------    MAKE API CALL ----------------- //
        const apiReturn = await Helper.callNewLinkAPI(longUrlField, linkgen, titleField, token?.sub);
        console.log(apiReturn);
        

        if(apiReturn === 'api-success') {
            setGeneratedUrlField(`minks.com/${linkgen}`);                    
            setShowGeneration(true);
        }else if(apiReturn === 'api-error') {
            setErrorText('network error, try again later');                 
            setShowGeneration(false);
        }else {
            setErrorText('something went wrong on our side, we\'re on it.');                 
            setShowGeneration(false);
        }
    }

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
                                {/* {user?.picture ? <img src={user?.picture} className='user-img' alt='user profile' /> : <p>HO</p>} */}
                                <img src={user?.picture} className='user-img' alt='user profile' />
                                <span>{user?.name}</span>
                            </div>
                        </div>
                    }
            </div>
            
            <Modal open={openModal} onClose={() => { setOpenModal(false); setShowGeneration(false); }}>
                {
                !showGeneration ?
                <div className='modal-mink-create'>
                    <input type='text' className='input' placeholder='Long url here' onChange={(e) => setLongUrlField(e.target.value)} />

                    <input type='text' className='input' placeholder='custom link (optional)' onChange={(e) => setShortUrlField(e.target.value)} />

                    <input type='text' className='input' placeholder='title (optional)' onChange={(e) => setTitleField(e.target.value)}  />

                    {
                        isLoading ? 
                        <div><Wait spin style={{fontSize: '42px', textAlign: 'center'}} /></div> 
                        : 
                        <button className='button' onClick={() => handleGeneration()}>Mink it up !</button>
                    }

                    <p className='error'>{errorText}</p>
                </div>
                :
                <div className='mink-gen'>
                    <h3 className='heading-secondary'>Your shortened link</h3>
                    <div className='row'>
                        <input type='text' className='input' value={generatedUrlField} readOnly />
                        <button className='button' onClick={() => Helper.copyField(generatedUrlField)}>Copy URL</button>
                    </div>
                </div>
                }
            </Modal>
        </Fragment>
    );
}

export default Navigation