import axios from 'axios'
let base = "http://120.77.25.98:8000/api";

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if(token){
            config.headers.authorization = "Bearer" + token;
        }
        return config;
    },
    error => Promise.reject(error)
)
//TODO:change interface sending format to formData
//product
export const getProductList = (params) => {
    return axios.get(`${base}/admin/productList`,{
        params:params
    })
}
export const addProductList = (params) => {
    return axios.post(`${base}/admin/productAdd`,params,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })
}
export const deleteProduct = params => {
    return axios.post(`${base}/admin/productDel`,params,{
        headers:{"Content-Type":"multipart/form-data"}
    })
}
export const editProduct = params => {
    return axios.post(`${base}/admin/productEdit`,params,{
        headers:{"Content-Type":"multipart/form-data"}
    })
}
//company
export const getCompany = () => {
    return axios.get(`${base}/admin/company`)
}
export const editCompany = (params) =>{
    return axios.post(`${base}/admin/companyUpdate`,params,{
        header:{"Content-Type":"multipart/form-data"}
    })
}
// brand
export const getBrandList = params => {
    return axios.get(`${base}/admin/brandList`, { params: params })
}
export const updateBrand = (params) => {
    return axios.post(`${base}/admin/brandUpdate`,params,{
        "Content-Type":"multipart/form-data"
    })
}
export const addBrand = ( params ) => {
    return axios.post(`${base}/admin/brandAdd`,params,{
        headers:{"Content-Type":"multipart/form-data"}
    })
}
export const deleteBrand = params => {
    return axios.post(`${base}/admin/brandDelete`,params,{
        "Content-Type":"multipart/form-data"
    })
}
//category list
export const getCategoryList = params => {
    return axios.get(`${base}/admin/categoryList`,{params:params})
}
export const updateCategory = (params) => {
    return axios.post(`${base}/admin/categoryUpdate`,params,{
        headers:{"Content-Type":"multipart/form-data"}
    })
}
export const addCategory = (params) => {
    return axios.post(`${base}/admin/categoryAdd`,params,{
        headers:{"Content-Type":"multipart/form-data"}
    })
}
export const deleteCategory = (params) =>{
    return axios.post(`${base}/admin/categoryDel`,params,{
        headers:{"Content-Type":"multipart/form-data"}
    })
}
