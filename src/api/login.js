import axios from 'axios'
let base = "http://localhost:8000/api";
const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
};
export const userLogin = (params) =>{
    return axios.post(`${base}/user/login`,params,{
        header:headers
    })
}