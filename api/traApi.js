import {generateConfigHeaderFormData, generateConfigHeader, generateConfigHeaderApiPubic} from "../utils/HttpConfig";
import axiosClient from "./axiosClient";
import qs from 'qs'

export const kiemTraVaBaoGia = (token, maPM, request, callBackOk, callBackError) => {
    axiosClient.post(`/internal/tra/${maPM}`, request, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const capNhatTra = (token, maPM, request, callBackOk, callBackError) => {
    axiosClient.put(`/internal/tra/${maPM}`, request, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const xacNhanTraPhieu = (token, maPM, callBackOk, callBackError) => {
    axiosClient.patch(`/internal/tra/${maPM}:da-tra`,null, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const apiListAllViPham = (token, callBackOk, callBackError) => {
    axiosClient.get("/internal/vi-pham", generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}