
import toast from 'react-simple-toasts';
import { apiResource } from './config';

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
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const copyField = (value: string) => {
    navigator.clipboard.writeText(value);
    toast(`copy link`);
}

export const callNewLinkAPI = async (longUrl: string, linkgen: string, title: string, oaid: string) => {
    var returnData: string = '';
    
    await fetch(`${apiResource.baseurl}/new`, {
        method: 'POST',
        body: JSON.stringify({
            target_link: longUrl,
            short_link: `minks.com/${linkgen}`,
            title: title == '' ? linkgen : title,
            clicks: 0,
            owner_oaid: oaid,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => response.json())
    .then((jsonData) => {
        console.log(jsonData);
        
        if(jsonData.owner_oaid === oaid) {
            returnData = 'api-success';
        }
    })
    .catch((err) => {
        returnData = 'api-error';
    });

    return returnData;
}

export const callGetLinksAPI = () => {
    var returnData: string = '';
    
    fetch(`${apiResource.baseurl}/all`)
    .then((response) => response.json())
    .then((jsonData) => {
        console.log(jsonData);
        
        returnData = 'api-success';
    })
    .catch((err) => {
        returnData = 'api-error';
        console.log('api-error');
        
    });

    return returnData;
}