
import { useAuth0 } from '@auth0/auth0-react';
import { Wait } from '@rsuite/icons';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { IoCopyOutline, IoLink, IoPencil, IoTrash } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-simple-toasts';
import { apiResource } from '../../config';
import * as Helper from '../../helper';
import { deleteMink, initMinksData, updateMink } from '../../redux/reducers/links.reducer';
import { RootState } from '../../redux/RootReducer';
import './Dashboard.css';
import Navigation from './Navigation/Navigation';

function Dashboard() {

    const { isAuthenticated, loginWithPopup, getIdTokenClaims } = useAuth0();

    const [disableField, setDisableField] = useState(true);
    const shouldFetchLinks = useRef(true);
    const [isFetchingLinks, setIsFetchingLinks] = useState(false);
    const [isUpdatingLink, setIsUpdatingLink] = useState(false);
    const [isDeletingLink, setIsDeletingLink] = useState(false);

    // create dispatch to manipulate data to Redux Store
    const dispatch = useDispatch();
    
    // Get data from Redux Store
    const minkItems = useSelector((state: RootState) => state.minks.minksData);

    const [currentMinkSelected, setCurrentMinkSelected] = useState({
        _id: '',
        title: '',
        date: '',
        short_link: '',
        target_link: '',
        clicks: 0
    });
    const [showMinkDetail, setShowMinkDetail] = useState(false);
    const [errorText, setErrorText] = useState('');
    const inputFocusRef = useRef<any>();


    const handleLogin = async () => {
        await loginWithPopup();

        const token = await getIdTokenClaims();
        console.log(token?.sub);

        if(token?.sub !== '') {
            await allLinksApiFetch(token?.sub);

            return true;
        }

        return false;
    }

    const handleMinkItemClick = (itemPosition: number) => {
        if(!showMinkDetail) setShowMinkDetail(true);

        setCurrentMinkSelected(minkItems[itemPosition]);
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

    const updateShortUrlObjState = (value: string) => {
        console.log(value);
        
        setCurrentMinkSelected({
            ...currentMinkSelected,
            short_link: value
        });

        console.log(currentMinkSelected);
    }

    const runUpdateLink = async (id: string) => {
        setIsUpdatingLink(true);

        let shortLinkUpdate = currentMinkSelected.short_link;
        
        if(currentMinkSelected.short_link.indexOf('minks.com/') === -1) {
            shortLinkUpdate = `minks.com/${currentMinkSelected.short_link}`;
        }
        
        updateShortUrlObjState(shortLinkUpdate);

        const reqBody = {
            short_link: shortLinkUpdate
        }

        const apiResult = await Helper.updateLink(id, reqBody);

        if(apiResult === 'api-success') {
            // update redux store
            dispatch(updateMink({id: id, short_link_update: shortLinkUpdate}));

            setErrorText('');
            setIsUpdatingLink(false);
            
            toast(`mink updated`);
        }else if(apiResult === 'api-error') {
            setErrorText('network error, try again later');
            setIsUpdatingLink(false);
        }else {
            setErrorText('something went wrong on our side, we\'re on it.');  
            setIsUpdatingLink(false);
        }
    }

    const runDeleteLink = async (id: string) => {
        setIsDeletingLink(true);

        const apiResult = await Helper.deleteLink(id);

        if(apiResult === 'api-success') {
            // update redux store
            dispatch(deleteMink(id));

            setErrorText('');
            setIsDeletingLink(false);

            setShowMinkDetail(false);
            
            toast(`mink deleted`);
        }else if(apiResult === 'api-error') {
            setErrorText('network error, try again later');
            setIsDeletingLink(false);
        }else {
            setErrorText('something went wrong on our side, we\'re on it.');  
            setIsDeletingLink(false);
        }
    }

    const allLinksApiFetch = async (ownerid: string) => {
        setErrorText('');
        setIsFetchingLinks(true);
        
        fetch(`${apiResource.baseurl}/all`, {
            method: 'POST',
            body: JSON.stringify({
                owner_oaid: ownerid,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((jsonData) => { 
            setErrorText('');
            
            // init redux store
            dispatch(initMinksData(jsonData));
            
            setIsFetchingLinks(false);
        })
        .catch((err) => {
            console.log(err);
            
            console.log('api-error');
            setErrorText('network error, try again later');
            setIsFetchingLinks(false);
        });
    }

    useEffect(() => {
        (async function() {
            if(shouldFetchLinks.current){
                shouldFetchLinks.current = false;   // Need this because React strict mode mounts components twice on init lifecycle

                console.log(isAuthenticated);
                
                if(isAuthenticated) {
                    const token = await getIdTokenClaims();
                    // alert(token);

                    await allLinksApiFetch(token?.sub);
                }
            }
        })();
    }, [])
    
  
    return (
            <div className='dashboard'>
                <Navigation />

                {
                    isAuthenticated === false ?
                        <Fragment>
                            <h1 className='heading-primary margin-top-lg'>Login to access dashboard</h1>
                            <button className='button login' onClick={() => handleLogin()}>LOGIN</button>
                        </Fragment>
                    :
                    <Fragment>
                        <h1 className='heading-primary margin-top-lg'>Links</h1>
                        <p className='error'>{ errorText }</p>
                        
                        {
                            // errorText == '' ?
                            <div className='minks-grid'>
                                {   
                                    isFetchingLinks === true ?
                                        <div><Wait spin style={{fontSize: '42px', textAlign: 'center'}} /></div>
                                    :
                                    <>  
                                        <div className='minks-list'>
                                            <div className='heading'>{minkItems.length} Results</div>

                                            {
                                                minkItems.map((data: any, index: number) => {
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

                                        {
                                            showMinkDetail ?
                                                <div className='mink-detail'>
                                                    <h1 className='heading-primary'>{currentMinkSelected.title}</h1>
                                                    <span className='item-date'>{currentMinkSelected.date}</span>
            
                                                    <div className='field-container'>
                                                        <IoLink className='input-icon' />
                                                        <input type='text' ref={inputFocusRef} className='input' value={currentMinkSelected.short_link} onChange={(e) => updateShortUrlObjState(e.target.value)} disabled={disableField} />
                                                        <div className='field-tools'>
                                                            <div onClick={() => activateField()}><IoPencil /> <span>Edit</span></div>
                                                            <div onClick={() => Helper.copyField(currentMinkSelected.short_link)}><IoCopyOutline /> <span>Copy</span></div>
                                                        </div>
                                                    </div>
            
                                                    <span className='mink-destination'>DESTINATION: &nbsp; {currentMinkSelected.target_link}</span>
            
                                                    <div className='mink-detail-footer'>
                                                        <div className='clicks'>
                                                            <span>{currentMinkSelected.clicks}</span>
                                                            <p>TOTAL VISITS</p>
                                                        </div>
            
                                                        <div className='buttons'>
                                                            {
                                                                isUpdatingLink === true ? <div><Wait spin style={{fontSize: '42px', textAlign: 'center'}} /></div>
                                                                : <button className='button' onClick={() => runUpdateLink(currentMinkSelected._id)}>UPDATE</button>
                                                            }
                                                            {
                                                                isDeletingLink === true ? <div><Wait spin style={{fontSize: '42px', textAlign: 'center'}} /></div>
                                                                : <button className='button delete' onClick={() => runDeleteLink(currentMinkSelected._id)}>DELETE</button>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            :
                                            <p style={{marginLeft: '50px'}}>Click on any link by the left to view detail </p>
                                        }
                                    </>
                                }
                            </div>
                            // :
                            // null
                        }
                    </Fragment>
                }
            
            </div>
    );
}

export default Dashboard;