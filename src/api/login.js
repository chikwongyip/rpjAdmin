import axios from 'axios'
let base = "http://120.77.25.98:8000/api";
const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};
export const userLogin = (params) =>{
    return axios.post(`${base}/user/login`,params,{
        header:headers
    })
}