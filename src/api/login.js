import axios from "axios";
let base = process.env.VUE_APP_URL;
const headers = {
  'Content-Type': 'multipart/form-data'
};
export const userLogin = (params) => {
  return axios.post(`${base}/user/login`, params, {
    header: headers
  });
};
