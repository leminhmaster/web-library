import {generateConfigHeaderFormData, generateConfigHeader, generateConfigHeaderApiPubic} from "../utils/HttpConfig";
import axiosClient from "./axiosClient";
import qs from 'qs'

export const themNhanVien = (token, request, callBackOk, callBackError) => {
    axiosClient.post("/admin/nhan-vien", request, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}
export const suaNhanVien = (token, id, request, callBackOk, callBackError) => {
    axiosClient.put(`/admin/nhan-vien/${id}`, request, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const deleteNhanVien = (token, id, callBackOk, callBackError) => {
    axiosClient.delete(`/admin/nhan-vien/${id}`,generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const chiTietNhanVien = (token, id, callBackOk, callBackError) => {
    axiosClient.get(`/admin/nhan-vien/${id}`,generateConfigHeader(token))
        .then(callBackOk).catch(callBackError)
}

export const timKiemNhanVien = (token, params, callBackOk, callBackError) => {
    axiosClient.get("/admin/nhan-vien?"+qs.stringify(params), generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}