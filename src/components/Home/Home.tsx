import { useState } from 'react';
import './Home.css';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';

function Home() {

    const { isAuthenticated, logout, loginWithRedirect } = useAuth0();

    const [showGeneration, setShowGeneration] = useState(true);

    return ( 
        <div className='Home'>

            {/* <div className='home-content'> */}
                    
                <div className='mink-view'>
                    <h1 className='heading-primary'><span>Minks</span> - URL Shortner</h1>
                    <input type='text' className='input' placeholder='Long url here'/>

                    <div className='row'>
                    <div className='disabled-input'>minks.com/</div>
                    <input type='text' className='input' placeholder='e.g myurl24 (optional)' />
                    </div>

                    <button className='button' onClick={() => setShowGeneration(true)}>Mink it up !</button>

                    {
                        isAuthenticated ? 
                        <>
                        <div className='auth-element inverse' onClick={() => logout({ returnTo: window.location.origin })}>❌ LOGOUT</div>
                        <Link to={'/dashboard'}>
                            <div className='auth-element info'>👉 DASHBOARD</div>
                        </Link>
                        </>
                        : 
                        <div className='auth-element base' onClick={() => loginWithRedirect()}>LOGIN</div>
                    }
                    
                </div>

                {
                showGeneration ?
                <div className='mink-gen'>
                    <h3 className='heading-secondary'>Your shortened link</h3>
                    <div className='row'>
                        <input type='text' className='input' value='minks.com/3fajbm' />
                        <button className='button'>Copy URL</button>
                    </div>
                </div>
                :
                null
                }

                <div className='mink-info'>
                    <p>Minks, a free tool to shorten a URL or reduce a link. You can create your custom shortened link or just let minks generate one for you.</p>
                    <p>Minks &copy;2022</p>
                </div>

            {/* </div> */}
        </div>
    );
}

export default Home;