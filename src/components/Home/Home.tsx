import { useState } from 'react';
import './Home.css';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';

import { Wait } from '@rsuite/icons';
import { apiResource } from '../../config';
import * as Helper from '../../helper';


function Home() {

    const { isAuthenticated, logout, loginWithPopup, getIdTokenClaims } = useAuth0();

    const [isLoading, setIsLoading] = useState(false);
    const [showGeneration, setShowGeneration] = useState(false);

    const [longUrlField, setLongUrlField] = useState('');
    const [shortUrlField, setShortUrlField] = useState('');
    const [generatedUrlField, setGeneratedUrlField] = useState('');

    const [errorText, setErrorText] = useState('');
    const [ownerId, setOwnerId] = useState('');

    const handleLogin = async () => {
        await loginWithPopup();

        const token = await getIdTokenClaims();
        console.log(token?.sub);

        if(token?.sub !== '' && token?.sub !== undefined && token?.sub !== null) {
            setOwnerId(token?.sub);
            return true;
        }

        return false;
    }

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

            if(!isAuthenticated) {
                const authReturn = await handleLogin();
                // console.log(authReturn);

                if(authReturn) {
                    await runGen();
                }
            }

            if(isAuthenticated) {
                await runGen();
            }

            setIsLoading(false);
        }
    }

    // TODO: Might wanna make api calls to check if long url already exists on system   (---- to avoid multiple short urls linking to existing long url)
    // TODO: Also an api call to check if short url already exists on system            (---- to avoid duplicate short urls)
    const runGen = async () => {
        var linkgen = '';

        // --------- linkgen var is assigned either the optional short url field or random string generation
        shortUrlField !== '' ? linkgen = shortUrlField : linkgen = Helper.generateShortLink(5);

        // ---------    MAKE API CALL ----------------- //
        const apiReturn = await Helper.callNewLinkAPI(longUrlField, linkgen, '', ownerId);
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
        <div className='Home'>

            <div className='mink-view'>
                <h1 className='heading-primary'><span>Minks</span> - URL Shortner</h1>
                <input type='text' className='input' placeholder='Long url here' onChange={(e) => setLongUrlField(e.target.value)} />

                <div className='row'>
                    <div className='disabled-input'>minks.com/</div>
                    <input type='text' className='input' placeholder='e.g myurl24 (optional)' onChange={(e) => setShortUrlField(e.target.value)} />
                </div>

                {
                    isLoading ? 
                    <div><Wait spin style={{fontSize: '42px', textAlign: 'center'}} /></div> 
                    : 
                    <button className='button' onClick={() => handleGeneration()}>Mink it up !</button>
                }
                
                {
                    isAuthenticated ? 
                    <>
                    <div className='auth-element inverse' onClick={() => logout({ returnTo: window.location.origin })}>❌ LOGOUT</div>
                    <Link to={'/dashboard'}>
                        <div className='auth-element info'>👉 DASHBOARD</div>
                    </Link>
                    </>
                    : 
                    <div className='auth-element base' onClick={() => handleLogin()}>LOGIN</div>
                }

                <p className='error'>{errorText}</p>
            </div>

            {
                showGeneration === true && isLoading === false ?
                <div className='mink-gen'>
                    <h3 className='heading-secondary'>Your shortened link</h3>
                    <div className='row'>
                        <input type='text' className='input' value={generatedUrlField} readOnly />
                        <button className='button' onClick={() => Helper.copyField(generatedUrlField)}>Copy URL</button>
                    </div>
                </div>
                :
                null
            }

            <div className='mink-info'>
                <p>Minks, a free tool to shorten a URL or reduce a link. You can create your custom shortened link or just let minks generate one for you.</p>
                <p>Minks &copy;2022</p>
            </div>

        </div>
    );
}

export default Home;