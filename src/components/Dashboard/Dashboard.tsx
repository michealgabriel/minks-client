
import { useAuth0 } from '@auth0/auth0-react';
import { Wait } from '@rsuite/icons';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { IoCopyOutline, IoLink, IoPencil, IoTrash } from 'react-icons/io5';
import toast from 'react-simple-toasts';
import { apiResource } from '../../config';
import * as Helper from '../../helper';
import './Dashboard.css';
import Navigation from './Navigation/Navigation';

function Dashboard() {

    const { isAuthenticated, loginWithPopup, getIdTokenClaims } = useAuth0();

    const [minkInputValue, setminkInputValue] = useState('minks.com/34ert');
    const [disableField, setDisableField] = useState(true);
    
    const shouldFetchLinks = useRef(true);
    const [isFetchingLinks, setIsFetchingLinks] = useState(false);
    const [allLinksData, setAllLinksData] = useState<any>([]);

    const [currentSelectedTitle, setCurrentSelectedTitle] = useState('');
    const [currentSelectedDate, setCurrentSelectedDate] = useState('');
    const [currentSelectedShortUrl, setCurrentSelectedShortUrl] = useState('');
    const [currentSelectedLongUrl, setCurrentSelectedLongUrl] = useState('');
    const [currentSelectedClicks, setCurrentSelectedClicks] = useState(0);

    const [ownerId, setOwnerId] = useState('');

    const inputFocusRef = useRef<any>();

    const handleLogin = async () => {
        await loginWithPopup();

        const token = await getIdTokenClaims();
        console.log(token?.sub);

        if(token?.sub !== '') {
            setOwnerId(token?.sub);
            return true;
        }

        return false;
    }

    const handleMinkItemClick = (itemPosition: number) => {
        setCurrentSelectedTitle( allLinksData[itemPosition]['title'] );
        setCurrentSelectedDate( allLinksData[itemPosition]['date'] );
        setCurrentSelectedShortUrl( allLinksData[itemPosition]['short_link'] );
        setCurrentSelectedLongUrl( allLinksData[itemPosition]['target_link'] );
        setCurrentSelectedClicks( allLinksData[itemPosition]['clicks'] );
    }

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

    const currentSelectionInit = () => {
        setCurrentSelectedTitle( allLinksData[0]['title'] );
        setCurrentSelectedDate( allLinksData[0]['date'] );
        setCurrentSelectedShortUrl( allLinksData[0]['short_link'] );
        setCurrentSelectedLongUrl( allLinksData[0]['target_link'] );
        setCurrentSelectedClicks( allLinksData[0]['clicks'] );
    }

    useEffect(() => {

        if(shouldFetchLinks.current){
            shouldFetchLinks.current = false;   // Need this because React strict mode mounts components twice on init lifecycle

            setIsFetchingLinks(true);

            fetch(`${apiResource.baseurl}/all`)
            .then((response) => response.json())
            .then((jsonData) => {

                // TODO: Need to fix bug - allLinksData state array variable isn't reflecting whatver's been stored by setAllLinksData 
                // TODO: The issue seems to be from the useEffect
                setAllLinksData([...jsonData]);

                console.log(allLinksData);
                            
                // currentSelectionInit();
            })
            .catch((err) => {
                console.log(err);
                
                console.log('api-error');
            });

            setIsFetchingLinks(false);
        }

    }, [])
    
  
    return (
            <div className='dashboard'>
                <Navigation />

                {
                    !isAuthenticated ?
                        <Fragment>
                            <h1 className='heading-primary margin-top-lg'>Login to access dashboard</h1>
                            <button className='button login' onClick={() => handleLogin()}>LOGIN</button>
                        </Fragment>
                    :
                    <Fragment>
                        <h1 className='heading-primary margin-top-lg' onClick={() => console.log(allLinksData)}>Links</h1>
                        
                        <div className='minks-grid'>
                            {
                                isFetchingLinks ?
                                    <div><Wait spin style={{fontSize: '42px', textAlign: 'center'}} /></div>
                                :
                                <>  
                                    <div className='minks-list'>
                                        <div className='heading'>{allLinksData.length} Results</div>

                                        {
                                            allLinksData.map((data: any, index: number) => {
                                                return (
                                                    <div key={data['_id']} className='mink-item' onClick={() => handleMinkItemClick(index)} onMouseEnter={(event) =>  mouseEnter(event)} onMouseLeave={(event) => mouseLeave(event)}>
                                                        <span className='item-date'>MAY 18, 4:43 PM</span>
                                                        <span className='item-title'>{ data['title'] }</span>
                                                        <div className='item-mink'><p>{ data['short_link'] }</p> <span>{ data['clicks'] } </span></div>
            
                                                        {/* { isShown && ( <IoTrash className='item-delete-icon'/> ) } */}
                                                        <IoTrash className='item-delete-icon'/>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>

                                    <div className='mink-detail'>
                                        <h1 className='heading-primary'>{currentSelectedTitle}</h1>
                                        <span className='item-date'>{currentSelectedDate}</span>

                                        <div className='field-container'>
                                            <IoLink className='input-icon' />
                                            <input type='text' ref={inputFocusRef} className='input' value={currentSelectedShortUrl} onChange={(e) => setCurrentSelectedShortUrl(e.target.value)} disabled={disableField} />
                                            <div className='field-tools'>
                                                <div onClick={() => activateField()}><IoPencil /> <span>Edit</span></div>
                                                <div onClick={() => Helper.copyField(currentSelectedShortUrl)}><IoCopyOutline /> <span>Copy</span></div>
                                            </div>
                                        </div>

                                        <span className='mink-destination'>DESTINATION: &nbsp; {currentSelectedLongUrl}</span>

                                        <div className='mink-detail-footer'>
                                            <div className='clicks'>
                                                <span>{currentSelectedClicks}</span>
                                                <p>TOTAL CLICKS</p>
                                            </div>

                                            <div className='buttons'>
                                                <button className='button'>UPDATE</button>
                                                <button className='button delete'>DELETE</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </Fragment>
                }
            
            </div>
    );
}

export default Dashboard;