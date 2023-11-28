import {generateConfigHeaderFormData, generateConfigHeader, generateConfigHeaderApiPubic} from "../utils/HttpConfig";
import axiosClient from "./axiosClient";
import qs from 'qs'

export const themTaiLieu = (token ,request, callBackOk, callBackError) => {
    axiosClient.post("/internal/tai-lieu", request, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const suaTaiLieu = (token, id ,request, callBackOk, callBackError) => {
    axiosClient.put(`/internal/tai-lieu/${id}`, request, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const xoaTaiLieu = (token ,id, callBackOk, callBackError) => {
    axiosClient.delete(`/internal/tai-lieu/${id}`, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const timKiemTaiLieu = (token ,params, callBackOk, callBackError) => {
    axiosClient.get("/internal/tai-lieu?" + qs.stringify(params), generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const chiTietTailieu = (token, id, callBackOk, callBackError) => {
    axiosClient.get(`/internal/tai-lieu/${id}`, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)

}