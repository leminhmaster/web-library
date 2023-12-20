import {generateConfigHeader, generateConfigHeaderApiPubic} from "../utils/HttpConfig";
import axiosClient from "./axiosClient";

const apiUserInfoByToken = (token, callBackOk, callBackError) => {
    return axiosClient.get('/account/info', generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

const apiLogin = async (data, callBackOK, callBackError) => {
    return axiosClient.post('/login', data)
        .then(callBackOK)
        .catch(callBackError)
}
const apiUpdateAccount = async (token, data, callBackOK, callBackError) => {
    return axiosClient.put('/account/info', data, generateConfigHeader(token))
        .then(callBackOK)
        .catch(callBackError)
}
const apiRegister = async (data, callBackOK, callBackError) => {
    return axiosClient.post('/account/register', data, generateConfigHeaderApiPubic())
        .then(callBackOK)
        .catch(callBackError)
}

module.exports = {
    apiUserInfoByToken: apiUserInfoByToken,
    apiLogin: apiLogin,
    apiUpdateAccount: apiUpdateAccount,
    apiRegister: apiRegister
}