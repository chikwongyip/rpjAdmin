import axios from 'axios'
let base = process.env.VUE_APP_URL
const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};
export const userLogin = (params) =>{
    return axios.post(`${base}/user/login`,params,{
        header:headers
    })
}