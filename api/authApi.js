import {generateConfigHeader} from "../utils/HttpConfig";
import axiosClient from "./axiosClient";

const apiUserInfoByToken = (token,callBackOk, callBackError) => {
    return axiosClient.get('/account/info', generateConfigHeader(token))
        .then(response => callBackOk(response))
        .catch(error => callBackError(error))
}

const apiLogin = async (data, callBackOK, callBackError) => {
    return axiosClient.post('/login', data)
        .then(response => callBackOK(response))
        .catch(error => callBackError(error))
}

module.exports = {
    apiUserInfoByToken: apiUserInfoByToken,
    apiLogin: apiLogin
}