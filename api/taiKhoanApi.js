import {generateConfigHeaderFormData, generateConfigHeader, generateConfigHeaderApiPubic} from "../utils/HttpConfig";
import axiosClient from "./axiosClient";
import qs from 'qs'


export const updateTKNhanVien = (token, maNV, request, callBackOk, callBackError) => {
    axiosClient.put(`/admin/account/nhan-vien/${maNV}`, request, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const chiTietTKNhanVien = (token, maNV, callBackOk, callBackError) => {
    axiosClient.get(`/admin/account/nhan-vien/${maNV}`, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}