import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const OAuthCallBack:React.FC=()=>{
    const location = useLocation();
    useEffect (()=>{
        const params = new URLSearchParams(location.search)
        const access = params.get('access');
        const refresh = params.get('refresh');
        if(access && refresh){
            Cookies.set("access_token", access,{expires:7})
            Cookies.set("refresh_token",refresh,{expires:7})
            console.log("token saved successfully")
            window.location.href = '/';
        }

    })
    return (
        <>
        <div>Handling Oauth CallBack...</div>
        </>
    )
}
export default OAuthCallBack;