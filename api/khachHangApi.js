import {generateConfigHeaderFormData, generateConfigHeader, generateConfigHeaderApiPubic} from "../utils/HttpConfig";
import axiosClient from "./axiosClient";
import qs from 'qs'

export const themKhachHang = (token ,request, callBackOk, callBackError) => {
    axiosClient.post('/internal/khach-hang', request, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const suaKhachHang = (token, id ,request, callBackOk, callBackError) => {
    axiosClient.put(`/internal/khach-hang/${id}`, request, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const xoaKhachHang = (token, id , callBackOk, callBackError) => {
    axiosClient.delete(`/internal/khach-hang/${id}`, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const chiTietKhachHang = (token, id , callBackOk, callBackError) => {
    axiosClient.get(`/internal/khach-hang/${id}`, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const timKiemKhachHang = (token, params , callBackOk, callBackError) => {
    axiosClient.get('/internal/khach-hang?' + qs.stringify(params), generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}