import axios, { AxiosInstance } from "axios"
import Cookies from 'js-cookie'

const api : AxiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/",
});
api.interceptors.request.use(
    config => {
        config.headers['Authorization'] = `Bearer ${Cookies.get('access_token')}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
api.interceptors.response.use((response)=>{
    return response;
},
async(error)=>{
    const originalrequest = error.config;
    if(error.response.status===401 && !originalrequest._retry){
        originalrequest._retry = true;
        console.log("getting refresh token")
        const refreshToken = Cookies.get('refresh_token');
        console.log(refreshToken)
        if(refreshToken){
            try{
                const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {refresh : refreshToken});
                const newAccessToken = response.data.access;
                Cookies.set('access_token',newAccessToken,{expires:7});
                console.log("new",newAccessToken)
                originalrequest.headers.Authorization = `Bearer ${newAccessToken}`
                return axios(originalrequest);

            }catch(error){
                console.log(error)
                return error;
            }
        }
    }
}
)
export default api
