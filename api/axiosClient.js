import axios from 'axios';
import queryString from 'query-string'

const axiosClient = axios.create({
    baseURL: 'http://localhost:8481', // Thay thế bằng URL cụ thể của API
    paramsSerializer: params => queryString.stringify(params)
});


// const axiosClientWithoutToken = axios.create({
//     baseURL: 'http://localhost:8481/', // Thay thế bằng URL cụ thể của API
//     paramsSerializer: params => queryString.stringify(params)
// })

export default axiosClient;

