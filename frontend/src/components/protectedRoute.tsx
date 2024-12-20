import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children : JSX.Element;
}
const ProtectedRoute : React.FC<ProtectedRouteProps>=({children})=>{
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(()=>{
    const auth = async()=>{
      const token = Cookies.get('access_token')

      if(!token){
        setIsAuthorized(false);
        return;
      }
      setIsAuthorized(true);
      
    }
    auth();
  },[]);
  if (isAuthorized === null) {
    return <div>Loading...</div>;
}
 
return isAuthorized ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;