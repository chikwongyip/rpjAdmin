let baseURL = ""
const env = process.env.NODE_ENV
if(env === "development"){
    baseURL = "http://localhost:8000/api"
}

module.exports = {
    baseURL
}