
import toast from 'react-simple-toasts';
import { apiResource } from './config';
import { CreateLinkApiResponse } from './types/CreateLinkApiResponse';

export const isValidUrl = (urlString: string | URL) => {
    try { 
        new URL(urlString);
        return true; 
    }
    catch(e){ 
        return false; 
    }
}

export const generateShortLink = (length: number) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const copyField = (value: string) => {
    navigator.clipboard.writeText(value);
    toast(`copy link`);
}



// ! ----- API REQUEST HELPERS --------------
export const createNewLink = async (longUrl: string, linkgen: string, title: string, oaid: string) => {
    let returnData: string | CreateLinkApiResponse = '';
    
    await fetch(`${apiResource.baseurl}/new`, {
        method: 'POST',
        body: JSON.stringify({
            target_link: longUrl,
            short_link: `minks.com/${linkgen}`,
            title: title === '' ? linkgen : title,
            clicks: 0,
            owner_oaid: oaid,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => response.json())
    .then((jsonData) => {
        // console.log(jsonData);
        
        if(jsonData.owner_oaid === oaid) {
            returnData = jsonData as CreateLinkApiResponse;
        }
    })
    .catch((err) => {
        returnData = 'api-error';
    });

    return returnData;
}

export const updateLink = async (id: string, reqBody: {}) => {
    let returnData: string = '';
    
    await fetch(`${apiResource.baseurl}/update/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(reqBody),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => response.json())
    .then((jsonData) => {
        console.log(jsonData);
        
        returnData = 'api-success';
    })
    .catch((err) => {
        returnData = 'api-error';
        console.log('api-error');
        
    });
    console.log(returnData);
    

    return returnData;
}

export const deleteLink = async (id: string) => {
    let returnData: string = '';
    
    await fetch(`${apiResource.baseurl}/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => response.json())
    .then((jsonData) => {
        console.log(jsonData);
        
        returnData = 'api-success';
    })
    .catch((err) => {
        returnData = 'api-error';
        console.log('api-error');
        
    });
    console.log(returnData);
    

    return returnData;
}